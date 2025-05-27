import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DB_URL,
});

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM confessions ORDER BY date DESC');
    return NextResponse.json({ confessions: result.rows });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch confessions.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { name, age, city, confession, image } = await req.json();
    const result = await pool.query(
      'INSERT INTO confessions (name, age, city, confession, image, date, likes) VALUES ($1, $2, $3, $4, $5, NOW(), 0) RETURNING *',
      [name, age, city, confession, image]
    );
    return NextResponse.json({ confession: result.rows[0] });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to submit confession.' }, { status: 500 });
  }
}

export async function PATCH(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  try {
    await pool.query('UPDATE confessions SET likes = likes + 1 WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to like confession.' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  try {
    await pool.query('DELETE FROM confessions WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete confession.' }, { status: 500 });
  }
}
