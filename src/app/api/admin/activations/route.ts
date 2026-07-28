import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { query } from "@/lib/db";
import { queryMySQL } from "@/lib/db-mysql";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'lumio_super_secret_key_2026_xyz'
);

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let decoded;
    try {
      const verified = await jwtVerify(token, JWT_SECRET);
      decoded = verified.payload as { role: string };
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (decoded.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "PENDING"; // PENDING, APPROVED, REJECTED, ALL

    let dbQuery = "SELECT id, store_name, first_name, last_name, email, phone, bank_slip_url, activation_status, status, has_cloud_access FROM tenants WHERE bank_slip_url IS NOT NULL";
    let params: any[] = [];

    if (filter !== "ALL") {
      dbQuery += " AND activation_status = $1";
      params.push(filter);
    }
    
    dbQuery += " ORDER BY id DESC";

    const result = await query(dbQuery, params);
    return NextResponse.json({ activations: result.rows });
  } catch (error) {
    console.error("Error fetching activations:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let decoded;
    try {
      const verified = await jwtVerify(token, JWT_SECRET);
      decoded = verified.payload as { role: string };
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (decoded.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { tenant_id, action } = await request.json(); // action: 'APPROVE' or 'REJECT'

    if (!tenant_id || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Fetch the tenant to get their license_key
    const tenantResult = await query("SELECT license_key FROM tenants WHERE id = $1", [tenant_id]);
    const license_key = tenantResult.rows[0]?.license_key;

    if (action === "APPROVE") {
      await query(
        "UPDATE tenants SET activation_status = 'APPROVED', has_cloud_access = true, status = 'ACTIVE', next_billing_date = CURRENT_DATE + INTERVAL '1 year' WHERE id = $1",
        [tenant_id]
      );
      
      // Sync to PHP MySQL POS Database
      if (license_key) {
        try {
          await queryMySQL("UPDATE lumnixso_lumiopos_web.licenses SET cloud_access = 'Allowed' WHERE license_key = ?", [license_key]);
        } catch (err) {
          console.error("Failed to sync approval to MySQL:", err);
        }
      }
    } else if (action === "REJECT") {
      await query(
        "UPDATE tenants SET activation_status = 'REJECTED', has_cloud_access = false WHERE id = $1",
        [tenant_id]
      );
      
      // Sync to PHP MySQL POS Database
      if (license_key) {
        try {
          await queryMySQL("UPDATE lumnixso_lumiopos_web.licenses SET cloud_access = 'Denied' WHERE license_key = ?", [license_key]);
        } catch (err) {
          console.error("Failed to sync rejection to MySQL:", err);
        }
      }
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating activation status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
