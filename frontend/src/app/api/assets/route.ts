import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [assets] = await pool.query(`SELECT asset_id, AssetType, AssetName, Lat, \`Long\`, InstallationDate, OperationalStatus, HealthScore, LastMaintenanceDate, Description, CreatedAt, UpdatedAt FROM asset ORDER BY asset_id DESC`);
    return NextResponse.json({ success: true, assets });
  } catch (error) {
    console.error("Assets GET:", error);
    return NextResponse.json({ success: false, error: "Unable to retrieve assets." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const type = String(body.AssetType || "").trim();
    const name = String(body.AssetName || "").trim();
    if (!type || !name) return NextResponse.json({ success: false, error: "Asset type and name are required." }, { status: 400 });
    const lat = body.Lat === "" || body.Lat == null ? null : Number(body.Lat);
    const lng = body.Long === "" || body.Long == null ? null : Number(body.Long);
    const health = body.HealthScore === "" || body.HealthScore == null ? null : Number(body.HealthScore);
    if ((lat !== null && !Number.isFinite(lat)) || (lng !== null && !Number.isFinite(lng)) || (health !== null && (!Number.isFinite(health) || health < 0 || health > 100))) return NextResponse.json({ success: false, error: "Invalid coordinates or health score." }, { status: 400 });
    const [result]: any = await pool.execute("INSERT INTO asset (AssetType, AssetName, Lat, `Long`, InstallationDate, OperationalStatus, HealthScore, LastMaintenanceDate, Description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [type, name, lat, lng, body.InstallationDate || null, body.OperationalStatus || "Operational", health, body.LastMaintenanceDate || null, body.Description || null]);
    return NextResponse.json({ success: true, asset_id: result.insertId }, { status: 201 });
  } catch (error) {
    console.error("Assets POST:", error);
    return NextResponse.json({ success: false, error: "Unable to create asset." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const id = Number(body.asset_id);
    if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ success: false, error: "Valid asset_id is required." }, { status: 400 });
    const allowed = ["AssetType", "AssetName", "Lat", "Long", "InstallationDate", "OperationalStatus", "HealthScore", "LastMaintenanceDate", "Description"] as const;
    const fields = allowed.filter((key) => body[key] !== undefined);
    if (!fields.length) return NextResponse.json({ success: false, error: "No fields to update." }, { status: 400 });
    const columns = fields.map((key) => key === "Long" ? "`Long` = ?" : `\`${key}\` = ?`).join(", ");
    await pool.execute(`UPDATE asset SET ${columns} WHERE asset_id = ?`, [...fields.map((key) => body[key] === "" ? null : body[key]), id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Assets PATCH:", error);
    return NextResponse.json({ success: false, error: "Unable to update asset." }, { status: 500 });
  }
}
