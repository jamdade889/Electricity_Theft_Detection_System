// import { Sliders, Brain, Database, Gauge } from "lucide-react";
// import { useState } from "react";

// export function SettingsPage() {
//   const [lowThreshold, setLowThreshold] = useState(34);
//   const [mediumThreshold, setMediumThreshold] = useState(64);

//   return (
//     <div className="p-8 space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-3xl" style={{ color: '#F9FAFB' }}>Settings</h1>
//         <p className="mt-1" style={{ color: '#9CA3AF' }}>Configure detection parameters and model settings</p>
//       </div>

//       {/* Risk Thresholds */}
//       <div className="rounded-2xl p-6" style={{
//         backgroundColor: '#111827',
//         border: '1px solid rgba(255, 255, 255, 0.1)',
//         boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
//       }}>
//         <div className="flex items-center gap-3 mb-6">
//           <Sliders className="w-6 h-6" style={{ color: '#FF7A18' }} />
//           <h2 className="text-xl" style={{ color: '#F9FAFB' }}>Risk Thresholds</h2>
//         </div>

//         <div className="space-y-6">
//           {/* Low Risk Threshold */}
//           <div>
//             <div className="flex items-center justify-between mb-3">
//               <label style={{ color: '#F9FAFB' }}>Low Risk (0 - {lowThreshold})</label>
//               <span className="px-3 py-1 rounded-full text-sm" style={{
//                 backgroundColor: 'rgba(16, 185, 129, 0.2)',
//                 color: '#10B981'
//               }}>
//                 {lowThreshold}
//               </span>
//             </div>
//             <input
//               type="range"
//               min="0"
//               max="100"
//               value={lowThreshold}
//               onChange={(e) => setLowThreshold(Number(e.target.value))}
//               className="w-full h-2 rounded-full appearance-none cursor-pointer"
//               style={{
//                 background: `linear-gradient(to right, #10B981 0%, #10B981 ${lowThreshold}%, rgba(255, 255, 255, 0.1) ${lowThreshold}%, rgba(255, 255, 255, 0.1) 100%)`
//               }}
//             />
//           </div>

//           {/* Medium Risk Threshold */}
//           <div>
//             <div className="flex items-center justify-between mb-3">
//               <label style={{ color: '#F9FAFB' }}>Medium Risk ({lowThreshold + 1} - {mediumThreshold})</label>
//               <span className="px-3 py-1 rounded-full text-sm" style={{
//                 backgroundColor: 'rgba(245, 158, 11, 0.2)',
//                 color: '#F59E0B'
//               }}>
//                 {mediumThreshold}
//               </span>
//             </div>
//             <input
//               type="range"
//               min="0"
//               max="100"
//               value={mediumThreshold}
//               onChange={(e) => setMediumThreshold(Number(e.target.value))}
//               className="w-full h-2 rounded-full appearance-none cursor-pointer"
//               style={{
//                 background: `linear-gradient(to right, #F59E0B 0%, #F59E0B ${mediumThreshold}%, rgba(255, 255, 255, 0.1) ${mediumThreshold}%, rgba(255, 255, 255, 0.1) 100%)`
//               }}
//             />
//           </div>

//           {/* High Risk Threshold */}
//           <div>
//             <div className="flex items-center justify-between mb-3">
//               <label style={{ color: '#F9FAFB' }}>High Risk ({mediumThreshold + 1} - 100)</label>
//               <span className="px-3 py-1 rounded-full text-sm" style={{
//                 backgroundColor: 'rgba(239, 68, 68, 0.2)',
//                 color: '#EF4444'
//               }}>
//                 100
//               </span>
//             </div>
//             <input
//               type="range"
//               min="0"
//               max="100"
//               value={100}
//               disabled
//               className="w-full h-2 rounded-full appearance-none"
//               style={{
//                 background: 'linear-gradient(to right, #EF4444 0%, #EF4444 100%)',
//                 opacity: 0.7
//               }}
//             />
//           </div>
//         </div>
//       </div>

//       {/* ML Model Information */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Model Configuration */}
//         <div className="rounded-2xl p-6" style={{
//           backgroundColor: '#111827',
//           border: '1px solid rgba(255, 255, 255, 0.1)',
//           boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
//         }}>
//           <div className="flex items-center gap-3 mb-6">
//             <Brain className="w-6 h-6" style={{ color: '#FF7A18' }} />
//             <h2 className="text-xl" style={{ color: '#F9FAFB' }}>Model Configuration</h2>
//           </div>

//           <div className="space-y-4">
//             <InfoRow label="Primary Model" value="Isolation Forest" />
//             <InfoRow label="Secondary Model" value="XGBoost Classifier" />
//             <InfoRow label="Ensemble Method" value="Weighted Average" />
//             <InfoRow label="Last Updated" value="March 15, 2026" />
//           </div>
//         </div>

//         {/* Data Processing */}
//         <div className="rounded-2xl p-6" style={{
//           backgroundColor: '#111827',
//           border: '1px solid rgba(255, 255, 255, 0.1)',
//           boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
//         }}>
//           <div className="flex items-center gap-3 mb-6">
//             <Database className="w-6 h-6" style={{ color: '#FF7A18' }} />
//             <h2 className="text-xl" style={{ color: '#F9FAFB' }}>Data Processing</h2>
//           </div>

//           <div className="space-y-4">
//             <InfoRow label="Train/Test Split" value="70% / 30%" />
//             <InfoRow label="Scaling Method" value="StandardScaler" />
//             <InfoRow label="Feature Selection" value="Recursive Feature Elimination" />
//             <InfoRow label="Cross-Validation" value="5-Fold" />
//           </div>
//         </div>
//       </div>

//       {/* Performance Metrics */}
//       <div className="rounded-2xl p-6" style={{
//         backgroundColor: '#111827',
//         border: '1px solid rgba(255, 255, 255, 0.1)',
//         boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
//       }}>
//         <div className="flex items-center gap-3 mb-6">
//           <Gauge className="w-6 h-6" style={{ color: '#FF7A18' }} />
//           <h2 className="text-xl" style={{ color: '#F9FAFB' }}>Model Performance</h2>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           <MetricCard label="Accuracy" value="94.2%" color="#10B981" />
//           <MetricCard label="Precision" value="91.8%" color="#FF7A18" />
//           <MetricCard label="Recall" value="89.5%" color="#FFB800" />
//           <MetricCard label="F1 Score" value="90.6%" color="#10B981" />
//         </div>
//       </div>

//       {/* Save Button */}
//       <div className="flex justify-center pt-6">
//         <button
//           className="px-8 py-4 rounded-xl transition-all duration-200 hover:scale-105"
//           style={{
//             background: 'linear-gradient(135deg, #FF7A18 0%, #FFB800 100%)',
//             color: '#0B0F1A',
//             boxShadow: '0 0 30px rgba(255, 122, 24, 0.4)',
//           }}
//         >
//           Save Settings
//         </button>
//       </div>
//     </div>
//   );
// }

// function InfoRow({ label, value }: { label: string; value: string }) {
//   return (
//     <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
//       <span style={{ color: '#9CA3AF' }}>{label}</span>
//       <span style={{ color: '#F9FAFB' }}>{value}</span>
//     </div>
//   );
// }

// function MetricCard({ label, value, color }: { label: string; value: string; color: string }) {
//   return (
//     <div className="p-4 rounded-xl text-center" style={{
//       backgroundColor: 'rgba(255, 255, 255, 0.05)',
//       border: '1px solid rgba(255, 255, 255, 0.1)'
//     }}>
//       <p className="text-sm mb-2" style={{ color: '#9CA3AF' }}>{label}</p>
//       <p className="text-2xl" style={{ color }}>{value}</p>
//     </div>
//   );
// }


// import { Sliders, Brain, Database, Gauge } from "lucide-react";
// import { useState, useEffect } from "react";
//
// export function SettingsPage() {
//   const [lowThreshold, setLowThreshold] = useState(34);
//   const [mediumThreshold, setMediumThreshold] = useState(64);
//
//   // ✅ LOAD SETTINGS FROM BACKEND
//   useEffect(() => {
//     fetchSettings();
//   }, []);
//
//   const fetchSettings = async () => {
//     try {
//       const res = await fetch("http://127.0.0.1:8000/settings");
//       const data = await res.json();
//
//       setLowThreshold(data.low);
//       setMediumThreshold(data.medium);
//     } catch (err) {
//       console.error("Error loading settings:", err);
//     }
//   };
//
//   // ✅ SAVE SETTINGS
//   const saveSettings = async () => {
//     try {
//       await fetch("http://127.0.0.1:8000/settings", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           low: lowThreshold,
//           medium: mediumThreshold,
//         }),
//       });
//
//       alert("✅ Settings Saved Successfully");
//     } catch (err) {
//       console.error("Save Error:", err);
//     }
//   };
//
//   return (
//     <div className="p-8 space-y-6">
//
//       {/* Header */}
//       <div>
//         <h1 className="text-3xl text-white">Settings</h1>
//         <p className="text-gray-400">Configure detection parameters</p>
//       </div>
//
//       {/* Threshold Card */}
//       <div className="bg-gray-900 p-6 rounded-2xl space-y-6">
//
//         {/* LOW */}
//         <div>
//           <label className="text-white">
//             Low Risk (0 - {lowThreshold})
//           </label>
//           <input
//             type="range"
//             min="0"
//             max="100"
//             value={lowThreshold}
//             onChange={(e) => setLowThreshold(Number(e.target.value))}
//             className="w-full"
//           />
//         </div>
//
//         {/* MEDIUM */}
//         <div>
//           <label className="text-white">
//             Medium Risk ({lowThreshold + 1} - {mediumThreshold})
//           </label>
//           <input
//             type="range"
//             min="0"
//             max="100"
//             value={mediumThreshold}
//             onChange={(e) => setMediumThreshold(Number(e.target.value))}
//             className="w-full"
//           />
//         </div>
//
//         {/* HIGH */}
//         <div>
//           <label className="text-white">
//             High Risk ({mediumThreshold + 1} - 100)
//           </label>
//         </div>
//       </div>
//
//       {/* SAVE BUTTON */}
//       <div className="text-center">
//         <button
//           onClick={saveSettings}
//           className="px-8 py-4 rounded-xl bg-orange-500 text-black font-semibold"
//         >
//           Save Settings
//         </button>
//       </div>
//
//       {/* EXTRA INFO (UNCHANGED UI) */}
//       <div className="grid grid-cols-2 gap-6">
//
//         <div className="bg-gray-900 p-6 rounded-2xl">
//           <h2 className="text-white mb-4 flex gap-2 items-center">
//             <Brain /> Model Info
//           </h2>
//           <InfoRow label="Model" value="Isolation Forest + XGBoost" />
//           <InfoRow label="Accuracy" value="94%" />
//         </div>
//
//         <div className="bg-gray-900 p-6 rounded-2xl">
//           <h2 className="text-white mb-4 flex gap-2 items-center">
//             <Database /> Data
//           </h2>
//           <InfoRow label="Split" value="70/30" />
//           <InfoRow label="Scaling" value="StandardScaler" />
//         </div>
//
//       </div>
//
//     </div>
//   );
// }
//
//
// // ✅ COMPONENTS
// function InfoRow({ label, value }: any) {
//   return (
//     <div className="flex justify-between text-gray-300">
//       <span>{label}</span>
//       <span className="text-white">{value}</span>
//     </div>
//   );
// }
import { Sliders, Brain, Database } from "lucide-react";
import { useState, useEffect } from "react";

export function SettingsPage() {
  const [lowThreshold, setLowThreshold] = useState(34);
  const [mediumThreshold, setMediumThreshold] = useState(64);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // ==============================
  // LOAD SETTINGS
  // ==============================
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/settings");
      const data = await res.json();

      setLowThreshold(data.low);
      setMediumThreshold(data.medium);
    } catch (err) {
      console.error("Error loading settings:", err);
      setMessage("❌ Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // SAVE SETTINGS
  // ==============================
  const saveSettings = async () => {
    if (lowThreshold >= mediumThreshold) {
      setMessage("⚠️ Low must be less than Medium");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      await fetch("http://127.0.0.1:8000/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          low: lowThreshold,
          medium: mediumThreshold,
        }),
      });

      setMessage("✅ Settings saved successfully");
    } catch (err) {
      console.error("Save Error:", err);
      setMessage("❌ Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-white p-6">Loading settings...</div>;
  }

  return (
    <div className="p-8 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl text-white">Settings</h1>
        <p className="text-gray-400">Configure detection parameters</p>
      </div>

      {/* Threshold Card */}
      <div className="bg-gray-900 p-6 rounded-2xl space-y-6">

        {/* LOW */}
        <div>
          <label className="text-white">
            Low Risk (0 - {lowThreshold})
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={lowThreshold}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val < mediumThreshold) setLowThreshold(val);
            }}
            className="w-full"
          />
        </div>

        {/* MEDIUM */}
        <div>
          <label className="text-white">
            Medium Risk ({lowThreshold + 1} - {mediumThreshold})
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={mediumThreshold}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val > lowThreshold) setMediumThreshold(val);
            }}
            className="w-full"
          />
        </div>

        {/* HIGH */}
        <div>
          <label className="text-white">
            High Risk ({mediumThreshold + 1} - 100)
          </label>
        </div>

      </div>

      {/* MESSAGE */}
      {message && (
        <div className="text-center text-sm text-yellow-400">
          {message}
        </div>
      )}

      {/* SAVE BUTTON */}
      <div className="text-center">
        <button
          onClick={saveSettings}
          disabled={saving}
          className={`px-8 py-4 rounded-xl font-semibold transition ${
            saving
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-orange-500 text-black hover:scale-105"
          }`}
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {/* EXTRA INFO */}
      <div className="grid grid-cols-2 gap-6">

        <div className="bg-gray-900 p-6 rounded-2xl">
          <h2 className="text-white mb-4 flex gap-2 items-center">
            <Brain /> Model Info
          </h2>
          <InfoRow label="Model" value="Isolation Forest + XGBoost" />
          <InfoRow label="Accuracy" value="94%" />
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl">
          <h2 className="text-white mb-4 flex gap-2 items-center">
            <Database /> Data
          </h2>
          <InfoRow label="Split" value="70/30" />
          <InfoRow label="Scaling" value="StandardScaler" />
        </div>

      </div>

    </div>
  );
}


// ==============================
// COMPONENT
// ==============================
function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between text-gray-300">
      <span>{label}</span>
      <span className="text-white">{value}</span>
    </div>
  );
}