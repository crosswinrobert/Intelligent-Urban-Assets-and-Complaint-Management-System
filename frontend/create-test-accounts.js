const mysql = require("mysql2/promise");
const { randomBytes, scrypt: scryptCallback } = require("node:crypto");
const { promisify } = require("node:util");
const scrypt = promisify(scryptCallback);

async function hashPassword(password) {
    const salt = randomBytes(16).toString("hex");
    const derived = await scrypt(password, salt, 64);
    return `scrypt$${salt}$${derived.toString("hex")}`;
}

const citizens = [
    ["David", "Sharma", "david.sharma@example.com", "+919876500101", "Sector 4, Bengaluru", "1995-04-12"],
    ["Emma", "Joseph", "emma.joseph@example.com", "+919876500102", "Block C, Bengaluru", "1998-09-21"],
    ["Rahul", "Verma", "rahul.verma@example.com", "+919876500103", "Sector 5, Bengaluru", "1993-02-08"],
    ["Priya", "Nair", "priya.nair@example.com", "+919876500104", "Block D, Bengaluru", "1997-11-16"]
];

const workers = [
    ["Arjun", "Rao", "arjun.rao@city.gov", "+919876500201", "Road Maintenance Engineer", 48000, "Public Works"],
    ["Meera", "Das", "meera.das@city.gov", "+919876500202", "Water Supply Technician", 45000, "Water & Sanitation"],
    ["Vikram", "Singh", "vikram.singh@city.gov", "+919876500203", "Sanitation Supervisor", 52000, "Water & Sanitation"]
];

(async () => {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || "complaintmanagementdb"
    });

    const created = [];

    try {
        await db.beginTransaction();

        const [departments] = await db.query(
            "SELECT dept_id, dept_name FROM department"
        );
        const deptMap = new Map(
            departments.map(d => [d.dept_name, d.dept_id])
        );

        for (const p of citizens) {
            const [existing] = await db.execute(
                "SELECT user_id FROM user WHERE Email = ?", [p[2]]
            );
            if (existing.length) {
                console.log("Skipped existing:", p[2]);
                continue;
            }

            const password = randomBytes(18).toString("base64url");
            const hash = await hashPassword(password);

            const [result] = await db.execute(
                `INSERT INTO user
                (Fname,Lname,Email,PasswordHash,Role,Address)
                VALUES (?,?,?,?, 'Citizen',?)`,
                [p[0],p[1],p[2],hash,p[4]]
            );

            await db.execute(
                "INSERT INTO citizen(user_id,DateOfBirth,EmergencyContact) VALUES (?,?,?)",
                [result.insertId,p[5],p[3]]
            );

            await db.execute(
                "INSERT INTO user_phone(user_id,PhoneNumber) VALUES (?,?)",
                [result.insertId,p[3]]
            );

            created.push({
                role: "Citizen",
                email: p[2],
                password,
                user_id: result.insertId
            });
        }

        for (const p of workers) {
            const [existing] = await db.execute(
                "SELECT user_id FROM user WHERE Email = ?", [p[2]]
            );
            if (existing.length) {
                console.log("Skipped existing:", p[2]);
                continue;
            }

            const deptId = deptMap.get(p[6]);
            if (!deptId) throw new Error("Missing department: " + p[6]);

            const password = randomBytes(18).toString("base64url");
            const hash = await hashPassword(password);

            const [result] = await db.execute(
                `INSERT INTO user
                (Fname,Lname,Email,PasswordHash,Role,Address,dept_id)
                VALUES (?,?,?,?, 'Staff',?,?)`,
                [p[0],p[1],p[2],hash,"Municipal Office",deptId]
            );

            await db.execute(
                "INSERT INTO staff(user_id,Position,HireDate,Salary) VALUES (?,?,CURDATE(),?)",
                [result.insertId,p[4],p[5]]
            );

            await db.execute(
                "INSERT INTO user_phone(user_id,PhoneNumber) VALUES (?,?)",
                [result.insertId,p[3]]
            );

            created.push({
                role: "Staff",
                email: p[2],
                password,
                user_id: result.insertId
            });
        }

        await db.commit();

        console.log("\nNEW ACCOUNTS CREATED:");
        console.table(created);

        if (!created.length) console.log("No new accounts were needed.");

    } catch (error) {
        await db.rollback();
        console.error("ERROR — transaction rolled back:", error.message);
        process.exitCode = 1;
    } finally {
        await db.end();
    }
})();
