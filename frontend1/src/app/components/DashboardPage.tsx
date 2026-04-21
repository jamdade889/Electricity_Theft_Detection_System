import { Users, AlertTriangle, AlertOctagon, Target } from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";

const getDashboardStats = async () => {
  const res = await fetch("http://127.0.0.1:8000/dashboard");
  return res.json();
};

export function DashboardPage() {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error("Dashboard API error:", err);
    }
  };

  if (!stats) return <div className="text-white p-6">Loading...</div>;

  // ✅ PIE DATA (same)
  const riskData = [
    { name: 'Normal', value: stats.normal, color: '#10B981' },
    { name: 'Suspicious', value: stats.suspicious, color: '#F59E0B' },
    { name: 'High Risk', value: stats.high_risk, color: '#EF4444' },
    { name: 'Theft', value: stats.theft, color: '#7F1D1D' },
  ];

  return (
    <div className="p-8 space-y-6">

      <h1 className="text-3xl text-white">
        Welcome {user?.username || "Admin"} 👋
      </h1>

      {/* ✅ CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard title="Total Readings" value={stats.total_readings} icon={Users}/>
        <StatCard title="Normal" value={stats.normal} icon={Target}/>
        <StatCard title="Suspicious" value={stats.suspicious} icon={AlertTriangle}/>
        <StatCard title="High Risk" value={stats.high_risk} icon={AlertOctagon}/>
        <StatCard title="⚡ Theft" value={stats.theft} icon={AlertOctagon}/>
      </div>

      {/* ✅ PIE */}
      <div className="bg-gray-900 p-6 rounded-2xl">
        <h2 className="text-white text-xl mb-4">Risk Distribution</h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={riskData} dataKey="value">
              {riskData.map((entry, i) => (
                <Cell key={i} fill={entry.color}/>
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ✅ FIXED LINE CHART */}
      <div className="bg-gray-900 p-6 rounded-2xl">
        <h2 className="text-white text-xl mb-4">Alert Trend (Real-Time)</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats.trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="time" stroke="#9CA3AF"/>
            <YAxis stroke="#9CA3AF"/>
            <Tooltip />
            <Legend />

            <Line type="monotone" dataKey="alerts" stroke="#FF7A18" strokeWidth={2}/>
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="p-6 bg-gray-900 rounded-xl flex justify-between items-center">
      <div>
        <p className="text-gray-400">{title}</p>
        <p className="text-white text-2xl font-semibold">{value}</p>
      </div>
      <Icon className="text-white w-6 h-6"/>
    </div>
  );
}