// import { Upload, Play } from "lucide-react";
// import { useState } from "react";
//
// export function AnalysisPage() {
//   const [usageFile, setUsageFile] = useState<File | null>(null);
//   const [labelsFile, setLabelsFile] = useState<File | null>(null);
//   const [isRunning, setIsRunning] = useState(false);
//
//   // ✅ REAL BACKEND CALL
//   const handleRunDetection = async () => {
//     if (!usageFile) {
//       alert("Please upload Usage CSV first");
//       return;
//     }
//
//     setIsRunning(true);
//
//     try {
//       const formData = new FormData();
//       formData.append("file", usageFile);
//
//       if (labelsFile) {
//         formData.append("labels", labelsFile);
//       }
//
//       const res = await fetch("http://127.0.0.1:8000/upload-csv", {
//         method: "POST",
//         body: formData,
//       });
//
//       const data = await res.json();
//
//       alert(`✅ Detection complete! Processed ${data.records} records`);
//
//     } catch (err) {
//       console.error(err);
//       alert("❌ Error running detection");
//     }
//
//     setIsRunning(false);
//   };
//
//   return (
//     <div className="p-8 space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-3xl text-white">Analysis</h1>
//         <p className="mt-1 text-gray-400">
//           Upload data and run theft detection models
//         </p>
//       </div>
//
//       {/* Upload Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <UploadBox
//           title="Usage Data CSV"
//           required={true}
//           file={usageFile}
//           onFileChange={setUsageFile}
//           description="Upload customer electricity usage data"
//         />
//
//         <UploadBox
//           title="Labels CSV"
//           required={false}
//           file={labelsFile}
//           onFileChange={setLabelsFile}
//           description="Optional: Upload labeled data for training"
//         />
//       </div>
//
//       {/* Model Selection */}
//       <div className="rounded-2xl p-6 bg-gray-900 border border-white/10">
//         <label className="block mb-3 text-white">
//           Select Detection Model
//         </label>
//
//         <select className="w-full px-4 py-3 rounded-xl bg-black text-white border border-white/10">
//           <option>XGBoost (Recommended)</option>
//           <option>Random Forest</option>
//           <option>Isolation Forest</option>
//           <option>Neural Network</option>
//         </select>
//       </div>
//
//       {/* Run Button */}
//       <div className="flex justify-center pt-6">
//         <button
//           onClick={handleRunDetection}
//           disabled={isRunning}
//           className="px-8 py-4 rounded-xl flex items-center gap-3 hover:scale-105 disabled:opacity-50"
//           style={{
//             background: "linear-gradient(135deg, #FF7A18, #FFB800)",
//             color: "#0B0F1A",
//           }}
//         >
//           <Play className="w-5 h-5" />
//           <span>
//             {isRunning ? "Running Detection..." : "Run Detection"}
//           </span>
//         </button>
//       </div>
//     </div>
//   );
// }
//
// // =====================================================
// // 🔥 UPLOAD COMPONENT (FIXED)
// // =====================================================
// function UploadBox({
//   title,
//   required,
//   file,
//   onFileChange,
//   description,
// }: any) {
//   return (
//     <div className="rounded-2xl p-6 bg-gray-900 border border-white/10">
//       <div className="flex justify-between mb-4">
//         <h3 className="text-white">{title}</h3>
//
//         {required && (
//           <span className="text-xs text-red-400 bg-red-500/20 px-2 py-1 rounded">
//             Required
//           </span>
//         )}
//       </div>
//
//       <p className="text-gray-400 text-sm mb-4">{description}</p>
//
//       {/* ✅ FILE INPUT */}
//       <label className="cursor-pointer">
//         <input
//           type="file"
//           accept=".csv"
//           className="hidden"
//           onChange={(e) => {
//             const selected = e.target.files?.[0];
//             if (selected) {
//               onFileChange(selected);
//             }
//           }}
//         />
//
//         <div className="border-2 border-dashed border-orange-400/30 rounded-xl p-8 text-center hover:border-orange-400/60">
//           <Upload className="w-10 h-10 mx-auto mb-3 text-orange-400" />
//
//           <p className="text-white mb-1">
//             {file ? file.name : "Click to upload CSV"}
//           </p>
//
//           <p className="text-sm text-gray-400">
//             CSV files only (Max 10MB)
//           </p>
//         </div>
//       </label>
//     </div>
//   );
// }
import { Upload, Play } from "lucide-react";
import { useState } from "react";

export function AnalysisPage() {
  const [usageFile, setUsageFile] = useState<File | null>(null);
  const [labelsFile, setLabelsFile] = useState<File | null>(null);
  const [modelType, setModelType] = useState("hybrid");
  const [isRunning, setIsRunning] = useState(false);

  const handleRunDetection = async () => {
    if (!usageFile) {
      alert("Upload usage CSV");
      return;
    }

    setIsRunning(true);

    try {
      const formData = new FormData();
      formData.append("usage", usageFile);
      formData.append("model_type", modelType);

      if (labelsFile) {
        formData.append("labels", labelsFile);
      }

      const endpoint = labelsFile
        ? "http://127.0.0.1:8000/train-csv"
        : "http://127.0.0.1:8000/detect-csv";

      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      alert(
        `✅ Done!\nProcessed: ${data.records}\nHigh Risk: ${data.high_risk}`
      );

    } catch (err) {
      console.error(err);
      alert("❌ Error running detection");
    }

    setIsRunning(false);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl text-white">Analysis</h1>
        <p className="text-gray-400">
          Train model or detect electricity theft
        </p>
      </div>

      {/* Upload */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UploadBox
          title="Usage CSV"
          required={true}
          file={usageFile}
          onFileChange={setUsageFile}
          description="Electricity usage data"
        />

        <UploadBox
          title="Labels CSV"
          required={false}
          file={labelsFile}
          onFileChange={setLabelsFile}
          description="Optional (for training)"
        />
      </div>

      {/* Model Selection */}
      <div className="rounded-2xl p-6 bg-gray-900 border border-white/10">
        <label className="text-white">Model Type</label>

        <select
          value={modelType}
          onChange={(e) => setModelType(e.target.value)}
          className="w-full mt-2 px-4 py-3 rounded-xl bg-black text-white border border-white/10"
        >
          <option value="hybrid">Hybrid (Recommended)</option>
          <option value="rf">Random Forest</option>
          <option value="iso">Isolation Forest</option>
        </select>
      </div>

      {/* Run Button */}
      <div className="flex justify-center pt-6">
        <button
          onClick={handleRunDetection}
          disabled={isRunning}
          className="px-8 py-4 rounded-xl flex gap-3 hover:scale-105 disabled:opacity-50"
          style={{
            background: "linear-gradient(135deg, #FF7A18, #FFB800)",
            color: "#0B0F1A",
          }}
        >
          <Play className="w-5 h-5" />
          {isRunning ? "Processing..." : "Run Detection"}
        </button>
      </div>
    </div>
  );
}

//
// =====================================================
// 🔥 UPLOAD COMPONENT (FIXED - INCLUDED)
// =====================================================
//

function UploadBox({
  title,
  required,
  file,
  onFileChange,
  description,
}: any) {
  return (
    <div className="rounded-2xl p-6 bg-gray-900 border border-white/10">
      <div className="flex justify-between mb-4">
        <h3 className="text-white">{title}</h3>

        {required && (
          <span className="text-xs text-red-400 bg-red-500/20 px-2 py-1 rounded">
            Required
          </span>
        )}
      </div>

      <p className="text-gray-400 text-sm mb-4">{description}</p>

      <label className="cursor-pointer">
        <input
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            const selected = e.target.files?.[0];
            if (selected) {
              onFileChange(selected);
            }
          }}
        />

        <div className="border-2 border-dashed border-orange-400/30 rounded-xl p-8 text-center hover:border-orange-400/60">
          <Upload className="w-10 h-10 mx-auto mb-3 text-orange-400" />

          <p className="text-white mb-1">
            {file ? file.name : "Click to upload CSV"}
          </p>

          <p className="text-sm text-gray-400">
            CSV files only (Max 10MB)
          </p>
        </div>
      </label>
    </div>
  );
}