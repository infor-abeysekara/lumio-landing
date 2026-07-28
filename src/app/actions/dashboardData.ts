'use server';

import { queryMySQL } from '@/lib/db-mysql';
import { getSession } from '@/lib/auth';

export async function getDashboardStats() {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      throw new Error("Unauthorized");
    }

    const license_id = session.id;

    // 1. Today's Sales
    const salesResult: any = await queryMySQL(
      `SELECT COALESCE(SUM(total_amount), 0) as total FROM sales WHERE license_id = ? AND DATE(sale_date) = CURDATE()`,
      [license_id]
    );
    const todaySales = salesResult[0]?.total || 0;

    // 2. Total Orders
    const ordersResult: any = await queryMySQL(
      `SELECT COUNT(*) as total FROM sales WHERE license_id = ?`,
      [license_id]
    );
    const totalOrders = ordersResult[0]?.total || 0;

    // 3. Active Customers
    const customersResult: any = await queryMySQL(
      `SELECT COUNT(*) as total FROM customers WHERE license_id = ?`,
      [license_id]
    );
    const totalCustomers = customersResult[0]?.total || 0;

    // 4. Avg Order Value
    const avgResult: any = await queryMySQL(
      `SELECT COALESCE(AVG(total_amount), 0) as avg FROM sales WHERE license_id = ?`,
      [license_id]
    );
    const avgOrderValue = parseFloat(avgResult[0]?.avg || 0);

    // 5. Recent Activity
    const recentResult: any = await queryMySQL(
      `SELECT invoice_no, total_amount, sale_date FROM sales WHERE license_id = ? ORDER BY sale_date DESC LIMIT 5`,
      [license_id]
    );
    
    // Formatting numbers
    const formatCurrency = (val: number) => new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(val);

    return {
      stats: [
        { title: "Today's Sales", value: formatCurrency(todaySales), change: "+0%", color: "bg-blue-500" },
        { title: "Total Orders", value: totalOrders.toString(), change: "+0%", color: "bg-purple-500" },
        { title: "Active Customers", value: totalCustomers.toString(), change: "+0%", color: "bg-green-500" },
        { title: "Avg. Order Value", value: formatCurrency(avgOrderValue), change: "+0%", color: "bg-orange-500" },
      ],
      recentActivity: recentResult.map((r: any) => ({
        invoice_no: r.invoice_no,
        total_amount: formatCurrency(r.total_amount),
        sale_date: r.sale_date.toISOString() // convert date to string for client
      }))
    };
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    // Return empty fallback
    return {
      stats: [
        { title: "Today's Sales", value: "Rs. 0.00", change: "0%", color: "bg-blue-500" },
        { title: "Total Orders", value: "0", change: "0%", color: "bg-purple-500" },
        { title: "Active Customers", value: "0", change: "0%", color: "bg-green-500" },
        { title: "Avg. Order Value", value: "Rs. 0.00", change: "0%", color: "bg-orange-500" },
      ],
      recentActivity: []
    };
  }
}
