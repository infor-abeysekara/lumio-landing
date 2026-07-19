import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(
      "SELECT id, reviewer_name, shop_name, rating, feedback_text, created_at FROM feedbacks WHERE status = 'APPROVED' ORDER BY created_at DESC"
    );
    return NextResponse.json({ success: true, feedbacks: result.rows });
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { reviewer_name, shop_name, rating, feedback_text } = await request.json();

    if (!reviewer_name || !shop_name || !rating || !feedback_text) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO feedbacks (reviewer_name, shop_name, rating, feedback_text, status) 
       VALUES ($1, $2, $3, $4, 'PENDING') RETURNING id`,
      [reviewer_name, shop_name, rating, feedback_text]
    );

    return NextResponse.json({ success: true, message: 'Feedback submitted successfully', id: result.rows[0].id });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
