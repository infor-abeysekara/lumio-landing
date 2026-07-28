"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Users, ShoppingBag, CreditCard, ArrowUpRight } from "lucide-react";
import { getDashboardStats } from "@/app/actions/dashboardData";

export default function ClientDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const result = await getDashboardStats();
        setData(result);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const icons: any = {
    "Today's Sales": CreditCard,
    "Total Orders": ShoppingBag,
    "Active Customers": Users,
    "Avg. Order Value": Activity
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-brand-light border-t-brand-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const stats = data?.stats || [];
  const recentActivity = data?.recentActivity || [];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark">Dashboard Overview</h1>
          <p className="text-gray-500 mt-2">Welcome to your Lumio Cloud Dashboard.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat: any, i: number) => {
          const Icon = icons[stat.title] || Activity;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${stat.color} text-white`}>
                  <Icon size={24} />
                </div>
                <span className="flex items-center text-sm font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg">
                  <ArrowUpRight size={16} className="mr-1" />
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
              <p className="text-2xl font-black text-brand-dark mt-1">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 min-h-[400px] flex items-center justify-center">
          <p className="text-gray-400 font-medium">Sales Chart Visualization (Coming Soon)</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-brand-dark mb-6">Recent Activity</h3>
          {recentActivity.length > 0 ? (
            <div className="space-y-6">
              {recentActivity.map((activity: any, i: number) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <ShoppingBag size={18} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-dark">Order {activity.invoice_no}</p>
                    <p className="text-xs text-gray-500">{new Date(activity.sale_date).toLocaleDateString()}</p>
                  </div>
                  <div className="ml-auto">
                    <p className="text-sm font-bold text-green-600">{activity.total_amount}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No recent activity found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
