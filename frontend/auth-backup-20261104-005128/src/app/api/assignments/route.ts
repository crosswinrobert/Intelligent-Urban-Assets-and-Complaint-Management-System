
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const staffId = searchParams.get("staffId");

    const [rows] = await pool.query(
      `SELECT
        ca.assignment_id,
        ca.complaint_id,
        ca.staff_id,
        ca.AssignedAt,
        ca.CompletedAt,
        c.Category,
        c.RawDescription,
        c.Lat,
        c.\`Long\`,
        c.UrgencyScore,
        c.SubmittedAt,
        cs.Status current_status,
        s.Position,
        u.Fname StaffFirstName,
        u.Lname StaffLastName,
        u.Email StaffEmail
      FROM complaint_assignments ca
      JOIN complaint c ON c.complaint_id = ca.complaint_id
      JOIN complaint_status cs ON cs.status_id = c.status_id
      JOIN staff s ON s.staff_id = ca.staff_id
      JOIN user u ON u.user_id = s.user_id
      ${staffId ? "WHERE ca.staff_id = ?" : ""}
      ORDER BY ca.AssignedAt DESC`,
      staffId ? [Number(staffId)] : []
    );

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("Assignments GET:", error);
    return NextResponse.json(
      { success: false, error: "Unable to retrieve assignments." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const complaintId = Number(body.complaint_id);
    const staffId = Number(body.staff_id);

    if (
      !Number.isInteger(complaintId) ||
      complaintId <= 0 ||
      !Number.isInteger(staffId) ||
      staffId <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Valid complaint_id and staff_id are required.",
        },
        { status: 400 }
      );
    }

    const [existing]: any = await pool.execute(
      `SELECT assignment_id
       FROM complaint_assignments
       WHERE complaint_id = ?
         AND staff_id = ?
         AND CompletedAt IS NULL`,
      [complaintId, staffId]
    );

    if (existing.length) {
      return NextResponse.json(
        {
          success: false,
          error: "This worker already has an active assignment for the complaint.",
        },
        { status: 409 }
      );
    }

    await pool.query("CALL sp_assign_worker(?, ?)", [
      complaintId,
      staffId,
    ]);

    return NextResponse.json(
      { success: true, message: "Worker assigned successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Assignments POST:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to assign worker. Verify that the complaint and staff records exist.",
      },
      { status: 500 }
    );
  }
}

// Remove an active worker assignment.
export async function DELETE(request: Request) {
  let connection;

  try {
    const body = await request.json();
    const assignmentId = Number(body.assignment_id);

    if (!Number.isInteger(assignmentId) || assignmentId <= 0) {
      return NextResponse.json(
        { success: false, error: "A valid assignment_id is required." },
        { status: 400 }
      );
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Lock the assignment and its complaint while changing assignment state.
    const [assignments]: any = await connection.execute(
      `SELECT assignment_id, complaint_id, CompletedAt
       FROM complaint_assignments
       WHERE assignment_id = ?
       FOR UPDATE`,
      [assignmentId]
    );

    if (!assignments.length) {
      await connection.rollback();
      return NextResponse.json(
        { success: false, error: "Assignment not found." },
        { status: 404 }
      );
    }

    const assignment = assignments[0];

    if (assignment.CompletedAt !== null) {
      await connection.rollback();
      return NextResponse.json(
        {
          success: false,
          error: "Completed assignments cannot be removed.",
        },
        { status: 409 }
      );
    }

    await connection.execute(
      `DELETE FROM complaint_assignments
       WHERE assignment_id = ? AND CompletedAt IS NULL`,
      [assignmentId]
    );

    // Check whether another active assignment remains for this complaint.
    const [remaining]: any = await connection.execute(
      `SELECT COUNT(*) AS active_count
       FROM complaint_assignments
       WHERE complaint_id = ?
         AND CompletedAt IS NULL`,
      [assignment.complaint_id]
    );

    // Reopen only when no active assignments remain and the complaint
    // is currently In Progress. Resolved and Rejected complaints stay unchanged.
    if (Number(remaining[0].active_count) === 0) {
      await connection.execute(
        `UPDATE complaint
         SET status_id = (
           SELECT status_id
           FROM complaint_status
           WHERE Status = 'Open'
           LIMIT 1
         )
         WHERE complaint_id = ?
           AND status_id = (
             SELECT status_id
             FROM complaint_status
             WHERE Status = 'In Progress'
             LIMIT 1
           )`,
        [assignment.complaint_id]
      );
    }

    await connection.commit();

    return NextResponse.json({
      success: true,
      message: "Worker assignment removed successfully.",
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    console.error("Assignments DELETE:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to remove the worker assignment.",
      },
      { status: 500 }
    );
  } finally {
    connection?.release();
  }
}
