import { Search, Download } from "lucide-react";
import { useState, useEffect } from "react";

// ✅ CLEAN API (ONLY RISK FILTER)
const getReports = async (risk: string) => {
  const url = `http://127.0.0.1:8000/reports?risk=${encodeURIComponent(risk)}`;
  const res = await fetch(url);
  return res.json();
};

export function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [riskFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const data = await getReports(
        riskFilter.toLowerCase().trim()
      );

      const formatted = data.map((item: any) => ({
        id: item.customer,
        riskScore: Math.round(item.probability * 100),
        riskLevel: item.level.toLowerCase(),
        status: item.status,
        anomalyScore: Number(item.probability),
        reason: `Detected ${item.level} risk`,
      }));

      setReports(formatted);
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 SEARCH FILTER
  const filteredReports = reports.filter((report) =>
    report.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 📥 CSV DOWNLOAD
  const downloadCSV = () => {
    const headers = [
      "Customer ID",
      "Risk Score",
      "Risk Level",
      "Status",
      "Anomaly Score",
    ];

    const rows = filteredReports.map((r) => [
      r.id,
      r.riskScore,
      r.riskLevel,
      r.status,
      r.anomalyScore,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "reports.csv";
    link.click();
  };

  return (
    <div className="p-8 space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-white">Reports</h1>
          <p className="text-gray-400">View and export detection results</p>
        </div>

        <button
          onClick={downloadCSV}
          className="px-6 py-3 rounded-xl flex items-center gap-2 hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #FF7A18, #FFB800)",
            color: "#0B0F1A",
          }}
        >
          <Download className="w-4 h-4" />
          Download CSV
        </button>
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* SEARCH */}
        <div className="relative">
          <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search Customer ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 py-3 bg-gray-900 text-white rounded-xl"
          />
        </div>

        {/* RISK FILTER */}
        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="py-3 bg-gray-900 text-white rounded-xl"
        >
          <option value="all">All Risk</option>
          <option value="normal">Normal</option>
          <option value="suspicious">Suspicious</option>
          <option value="high">High</option>
          <option value="theft">Theft</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-gray-900 rounded-2xl overflow-hidden">

        {loading ? (
          <p className="text-center p-6 text-gray-400">Loading...</p>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-orange-500/10">
              <tr>
                <th className="p-4 text-white">Customer ID</th>
                <th className="p-4 text-white">Risk Score</th>
                <th className="p-4 text-white">Risk Level</th>
                <th className="p-4 text-white">Status</th>
                <th className="p-4 text-white">Anomaly Score</th>
                <th className="p-4 text-white">Reason</th>
              </tr>
            </thead>

            <tbody>
              {filteredReports.map((r, i) => (
                <tr key={i} className="border-t border-gray-700">

                  <td className="p-4 text-white">{r.id}</td>
                  <td className="p-4 text-white">{r.riskScore}</td>

                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded ${
                        r.riskLevel === "theft"
                          ? "bg-red-900/40 text-red-500"
                          : r.riskLevel === "high"
                          ? "bg-red-500/20 text-red-400"
                          : r.riskLevel === "suspicious"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {r.riskLevel}
                    </span>
                  </td>

                  <td className="p-4 text-gray-300">{r.status}</td>

                  <td className="p-4 text-white">
                    {r.anomalyScore.toFixed(2)}
                  </td>

                  <td className="p-4 text-gray-400">{r.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-center text-gray-400">
        Showing {filteredReports.length} results
      </p>
    </div>
  );
}