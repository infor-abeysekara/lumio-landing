import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import fs from 'fs';
import path from 'path';
import { sendAdminNotificationEmail } from '@/lib/email';

const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_MAX = 3; // max 3 feedbacks
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // per hour

export async function GET() {
  try {
    const result = await query(
      "SELECT id, reviewer_name, shop_name, rating, feedback_text, image_url, created_at FROM feedbacks WHERE status = 'APPROVED' ORDER BY created_at DESC"
    );
    return NextResponse.json({ success: true, feedbacks: result.rows });
  } catch (error) {
    // Fallback if image_url column doesn't exist yet
    try {
      const fallbackResult = await query(
        "SELECT id, reviewer_name, shop_name, rating, feedback_text, created_at FROM feedbacks WHERE status = 'APPROVED' ORDER BY created_at DESC"
      );
      return NextResponse.json({ success: true, feedbacks: fallbackResult.rows });
    } catch(e) {
      return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
  }
}

export async function POST(request: Request) {
  try {
    // Rate Limiting
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const now = Date.now();
    const rateData = rateLimitMap.get(ip);
    
    if (rateData) {
      if (now - rateData.timestamp < RATE_LIMIT_WINDOW_MS) {
        if (rateData.count >= RATE_LIMIT_MAX) {
          return NextResponse.json({ success: false, error: 'Too many requests. Please try again later.' }, { status: 429 });
        }
        rateData.count++;
      } else {
        rateLimitMap.set(ip, { count: 1, timestamp: now });
      }
    } else {
      rateLimitMap.set(ip, { count: 1, timestamp: now });
    }

    // Attempt to run migration
    try {
      await query('ALTER TABLE feedbacks ADD COLUMN image_url VARCHAR(255);');
    } catch (e) {
      // Column likely already exists
    }

    const formData = await request.formData();
    
    const reviewer_name = formData.get('reviewer_name') as string;
    const shop_name = formData.get('shop_name') as string;
    const ratingStr = formData.get('rating') as string;
    const feedback_text = formData.get('feedback_text') as string;
    const image = formData.get('image') as File | null;

    if (!reviewer_name || !shop_name || !ratingStr || !feedback_text) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }

    const rating = parseInt(ratingStr);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    let image_url = null;
    
    if (image && image.name) {
      if (image.size > 2 * 1024 * 1024) {
        return NextResponse.json({ success: false, error: 'Image must be less than 2MB' }, { status: 400 });
      }
      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(image.type)) {
        return NextResponse.json({ success: false, error: 'Only JPG, PNG, and WEBP formats are allowed' }, { status: 400 });
      }

      try {
        const buffer = Buffer.from(await image.arrayBuffer());
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'feedbacks');
        
        // Ensure directory exists
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        const fileName = `${Date.now()}_${image.name.replace(/\s+/g, '_')}`;
        const filePath = path.join(uploadDir, fileName);
        
        fs.writeFileSync(filePath, buffer);
        image_url = `/uploads/feedbacks/${fileName}`;
      } catch (err) {
        console.error('Error saving image:', err);
        // Continue without image if saving fails
      }
    }

    const result = await query(
      `INSERT INTO feedbacks (reviewer_name, shop_name, rating, feedback_text, status, image_url) 
       VALUES ($1, $2, $3, $4, 'PENDING', $5) RETURNING id`,
      [reviewer_name, shop_name, rating, feedback_text, image_url]
    );

    // Send email notification to admin
    await sendAdminNotificationEmail(
      `New Feedback Submitted - ${shop_name}`,
      `
      <h3>New Customer Feedback Received</h3>
      <p><strong>Reviewer:</strong> ${reviewer_name}</p>
      <p><strong>Shop:</strong> ${shop_name}</p>
      <p><strong>Rating:</strong> ${rating} / 5</p>
      <p><strong>Feedback:</strong> ${feedback_text}</p>
      <br/>
      <p>Please log in to the admin dashboard to approve this feedback.</p>
      `
    );

    return NextResponse.json({ success: true, message: 'Feedback submitted successfully', id: result.rows[0].id });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
