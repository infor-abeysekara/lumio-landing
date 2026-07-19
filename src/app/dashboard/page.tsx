"use client";

import { motion } from "framer-motion";
import { Activity, Users, ShoppingBag, CreditCard, ArrowUpRight } from "lucide-react";

export default function ClientDashboard() {
  const stats = [
    { title: "Today's Sales", value: "Rs. 45,200", change: "+12.5%", icon: CreditCard, color: "bg-blue-500" },
    { title: "Total Orders", value: "128", change: "+4.1%", icon: ShoppingBag, color: "bg-purple-500" },
    { title: "Active Customers", value: "1,204", change: "+2.4%", icon: Users, color: "bg-green-500" },
    { title: "Avg. Order Value", value: "Rs. 3,500", change: "+1.2%", icon: Activity, color: "bg-orange-500" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark">Dashboard Overview</h1>
          <p className="text-gray-500 mt-2">Welcome to your Lumio Cloud Dashboard.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.color} text-white`}>
                <stat.icon size={24} />
              </div>
              <span className="flex items-center text-sm font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg">
                <ArrowUpRight size={16} className="mr-1" />
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-black text-brand-dark mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 min-h-[400px] flex items-center justify-center">
          <p className="text-gray-400 font-medium">Sales Chart Visualization (Coming Soon)</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-brand-dark mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <ShoppingBag size={18} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-brand-dark">Order #ORD-{9000 + i}</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
                <div className="ml-auto">
                  <p className="text-sm font-bold text-green-600">Rs. {(i * 1250).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
