import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DB_URL,
});

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    const result = await pool.query(
      'INSERT INTO "user" ("email", "password") VALUES ($1, $2) RETURNING *',
      [email, password]
    );

    return NextResponse.json({ success: true, message: "Registration successful", user: result.rows[0] });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
