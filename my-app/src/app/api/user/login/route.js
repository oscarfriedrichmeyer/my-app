import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DB_URL,
});

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    const result = await pool.query(
      'SELECT * FROM "user" WHERE "email" = $1 AND "password" = $2',
      [email, password]
    );

    if (result.rows.length > 0) {
      return NextResponse.json({ success: true, message: "Login successful" });
    } else {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
