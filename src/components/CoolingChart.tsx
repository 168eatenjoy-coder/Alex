import { useState, MouseEvent } from "react";

interface DataPoint {
  time: number; // in seconds
  ocOilTemp: number; // O/C付 油温 (blue line)
  noOcOilTemp: number | null; // O/C無 油温 (orange line)
  ocWaterTemp: number; // O/C付 水温 (grey line)
  noOcWaterTemp: number | null; // O/C無 水温 (yellow line)
}

// Replicate the telemetry data points with natural micro-oscillations representing real test conditions
const generateChartData = (): DataPoint[] => {
  const data: DataPoint[] = [];
  
  // Base parameters
  // No O/C Oil rises from ~93 to 130 in 270 seconds
  // O/C Oil rises from ~94 to ~115 in 300 seconds, then oscillates stably between 113 to 117
  // No O/C Water rises from 96 to 108 in 270 seconds
  // O/C Water oscillates between 100 and 105 throughout the 1120 seconds
  
  const totalSeconds = 1120;
  const step = 10; // Generate points every 10 seconds for super smooth curves

  for (let t = 0; t <= totalSeconds; t += step) {
    // Generate micro-noise for analog look (0.4C max fluctuation)
    const noise = (Math.sin(t / 8) * 0.4) + (Math.cos(t / 3) * 0.3) + ((t % 30 === 0) ? 0.3 : -0.2);

    // O/C付 油温 (Stabilizes around 115)
    let ocOil = 94;
    if (t < 300) {
      ocOil = 94 + (114 - 94) * (1 - Math.exp(-t / 110)) + noise;
    } else {
      ocOil = 114.5 + (Math.sin(t / 15) * 1.1) + noise;
    }

    // O/C無 油温 (Reaches 130 at 270 seconds quickly and ends)
    let noOcOil: number | null = null;
    if (t <= 270) {
      noOcOil = 92.5 + (131 - 92.5) * (t / 270) ** 0.65 + noise;
      // Clamp max at exactly 131 at the end
      if (t === 270) noOcOil = 131;
    }

    // O/C付 水温 (Remains safe around 102 - 105)
    let ocWater = 100 + noise;
    if (t < 150) {
      ocWater = 97 + (103 - 97) * (t / 150) + noise;
    } else {
      // Oscillate naturally between 101 and 105
      ocWater = 103.5 + (Math.sin(t / 20) * 1.5) + noise;
    }

    // O/C無 水温 (Rises to 108 and ends)
    let noOcWater: number | null = null;
    if (t <= 270) {
      noOcWater = 96.5 + (108 - 96.5) * (t / 270) ** 0.5 + noise;
    }

    data.push({
      time: t,
      ocOilTemp: Math.round(ocOil * 10) / 10,
      noOcOilTemp: noOcOil !== null ? Math.round(noOcOil * 10) / 10 : null,
      ocWaterTemp: Math.round(ocWater * 10) / 10,
      noOcWaterTemp: noOcWater !== null ? Math.round(noOcWater * 10) / 10 : null,
    });
  }

  return data;
};

const telemetryData = generateChartData();

export default function CoolingChart() {
  const [activeTab, setActiveTab] = useState<"chart" | "uploaded">("chart");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  // SVG Chart Bounds
  const width = 800;
  const height = 400;
  const paddingLeft = 50;
  const paddingRight = 40;
  const paddingTop = 40;
  const paddingBottom = 50;

  // Domain scaling helpers
  const minX = 0;
  const maxX = 1200;
  const minY = 90;
  const maxY = 135;

  const getX = (val: number) => {
    return paddingLeft + ((val - minX) / (maxX - minX)) * (width - paddingLeft - paddingRight);
  };

  const getY = (val: number) => {
    return height - paddingBottom - ((val - minY) / (maxY - minY)) * (height - paddingTop - paddingBottom);
  };

  // Convert points to SVG polyline command
  const getLinePath = (
    key: "ocOilTemp" | "noOcOilTemp" | "ocWaterTemp" | "noOcWaterTemp",
    limitTime?: number
  ) => {
    let path = "";
    telemetryData.forEach((p) => {
      const val = p[key];
      if (val !== null && (limitTime === undefined || p.time <= limitTime)) {
        const x = getX(p.time);
        const y = getY(val);
        if (path === "") {
          path = `M ${x} ${y}`;
        } else {
          path += ` L ${x} ${y}`;
        }
      }
    });
    return path;
  };

  const handleMouseMove = (e: MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    // Convert SVG X coord back to Time value
    const relativeX = clientX - paddingLeft;
    const plotWidth = width - paddingLeft - paddingRight;
    const ratio = relativeX / plotWidth;
    const targetTime = minX + ratio * (maxX - minX);

    // Find closest data point
    let closestIndex = 0;
    let minDifference = Infinity;
    telemetryData.forEach((p, idx) => {
      const diff = Math.abs(p.time - targetTime);
      if (diff < minDifference) {
        minDifference = diff;
        closestIndex = idx;
      }
    });

    if (clientX >= paddingLeft && clientX <= width - paddingRight) {
      setHoverIndex(closestIndex);
      setHoverPos({ x: clientX, y: clientY });
    } else {
      setHoverIndex(null);
      setHoverPos(null);
    }
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
    setHoverPos(null);
  };

  const hoverData = hoverIndex !== null ? telemetryData[hoverIndex] : null;

  // Grid background vertical lines
  const xTicks = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200];
  const yTicks = [90, 95, 100, 105, 110, 115, 120, 125, 130, 135];

  return (
    <div className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-5 shadow-2xl relative overflow-hidden">
      {/* Visual Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-neutral-900 pb-4 mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse" />
            <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest font-mono">
              HKS Racing Laboratory Telemetry
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-black italic text-glow text-white tracking-wide">
            ■ 社內測試數據：油溫 水溫 比較
          </h3>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            2021.5.26 FSW 富士短賽道 // 外氣溫 25°C 晴天 // 機油: HKS SUPER OIL Premium 0W-20
          </p>
        </div>

        {/* Dynamic Display Switch Tab */}
        <div className="flex bg-neutral-900 border border-neutral-800 p-1 rounded gap-1 self-stretch sm:self-auto">
          <button
            onClick={() => setActiveTab("chart")}
            className={`flex-1 sm:flex-none uppercase px-3 py-1.5 rounded text-xs font-bold transition-all ${
              activeTab === "chart"
                ? "bg-red-600 text-white shadow-md shadow-red-600/35"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            互動式圖表 (Recharts-Style)
          </button>
          <button
            onClick={() => setActiveTab("uploaded")}
            className={`flex-1 sm:flex-none uppercase px-3 py-1.5 rounded text-xs font-bold transition-all ${
              activeTab === "uploaded"
                ? "bg-red-600 text-white shadow-md shadow-red-600/35"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            原廠對比原圖 (Uploaded Graph)
          </button>
        </div>
      </div>

      {activeTab === "chart" ? (
        <div className="relative">
          {/* Legend Selector Indicator */}
          <div className="flex flex-wrap gap-4 mb-3 text-xs md:text-sm font-bold bg-neutral-900/50 p-2.5 border border-neutral-900/80 justify-center">
            <div className="flex items-center gap-2">
              <span className="w-4 h-1.5 bg-blue-500 rounded-full" />
              <span className="text-gray-300">O/C付 油溫 (裝冷卻器)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-1.5 bg-[#f97316] rounded-full" />
              <span className="text-gray-300">O/C無 油溫 (原廠基礎)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-1.5 bg-neutral-400 rounded-full" />
              <span className="text-gray-300">O/C付 水溫 (裝冷卻器)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-1.5 bg-[#eab308] rounded-full" />
              <span className="text-gray-300">O/C無 水溫 (原廠基礎)</span>
            </div>
          </div>

          {/* SVG Layout Area */}
          <div className="overflow-x-auto">
            <svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${width} ${height}`}
              className="min-w-[650px] overflow-visible select-none"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Background fill */}
              <rect x={paddingLeft} y={paddingTop} width={width - paddingLeft - paddingRight} height={height - paddingTop - paddingBottom} fill="#020202" />

              {/* Grid Lines */}
              {yTicks.map((yVal) => (
                <g key={yVal}>
                  <line
                    x1={paddingLeft}
                    y1={getY(yVal)}
                    x2={width - paddingRight}
                    y2={getY(yVal)}
                    stroke="#171717"
                    strokeWidth="1.2"
                  />
                  <line
                    x1={paddingLeft}
                    y1={getY(yVal)}
                    x2={width - paddingRight}
                    y2={getY(yVal)}
                    stroke="#262626"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />
                  {/* Left Y Axis Label */}
                  <text
                    x={paddingLeft - 12}
                    y={getY(yVal) + 4}
                    textAnchor="end"
                    fill="#a3a3a3"
                    className="text-[12px] font-mono"
                  >
                    {yVal}
                  </text>
                </g>
              ))}

              {xTicks.map((xVal) => (
                <g key={xVal}>
                  <line
                    x1={getX(xVal)}
                    y1={paddingTop}
                    x2={getX(xVal)}
                    y2={height - paddingBottom}
                    stroke="#171717"
                    strokeWidth="1.2"
                  />
                  <line
                    x1={getX(xVal)}
                    y1={paddingTop}
                    x2={getX(xVal)}
                    y2={height - paddingBottom}
                    stroke="#262626"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />
                  {/* Bottom X Axis Label */}
                  <text
                    x={getX(xVal)}
                    y={height - paddingBottom + 20}
                    textAnchor="middle"
                    fill="#a3a3a3"
                    className="text-[12px] font-mono"
                  >
                    {xVal}
                  </text>
                </g>
              ))}

              {/* Temperature Unit Axis Label */}
              <text
                x={20}
                y={paddingTop - 15}
                fill="#737373"
                className="text-[12px] font-bold tracking-widest font-mono"
              >
                °C
              </text>

              {/* Time Unit Axis Label */}
              <text
                x={width / 2}
                y={height - 10}
                textAnchor="middle"
                fill="#737373"
                className="text-[12px] font-bold tracking-widest font-mono"
              >
                時間 (sec)
              </text>

              {/* Graphs Paths drawing */}
              {/* grey: O/C付 水溫 */}
              <path
                d={getLinePath("ocWaterTemp")}
                fill="none"
                stroke="#8c8c8c"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* yellow: O/C無 水溫 */}
              <path
                d={getLinePath("noOcWaterTemp", 270)}
                fill="none"
                stroke="#eab308"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* blue: O/C付 油溫 */}
              <path
                d={getLinePath("ocOilTemp")}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-[0_0_4px_rgba(59,130,246,0.3)]"
              />
              {/* orange: O/C無 油溫 */}
              <path
                d={getLinePath("noOcOilTemp", 270)}
                fill="none"
                stroke="#f97316"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-[0_0_4px_rgba(249,115,22,0.3)]"
              />

              {/* Annotation notes replica box - Warning No O/C */}
              <g transform={`translate(${getX(270) + 15}, ${getY(130) - 30})`}>
                {/* Pointer Line */}
                <line x1={-15} y1={30} x2={25} y2={5} stroke="#ffffff" strokeWidth="1" />
                <rect x={25} y={-15} width={135} height={42} fill="#0d0d0d" stroke="#f97316" strokeWidth="1.5" />
                <text x={32} y={3} fill="#ffffff" className="text-[11px] font-bold font-sans">
                  油溫130℃超で試驗終了
                </text>
                <text x={32} y={19} fill="#a3a3a3" className="text-[10px] font-mono">
                  走行時間：約5分
                </text>
              </g>

              {/* Annotation notes replica box - Stable O/C */}
              <g transform={`translate(${getX(700) + 20}, ${getY(115) - 35})`}>
                <line x1={320} y1={35} x2={220} y2={5} stroke="#ffffff" strokeWidth="1" />
                <rect x={15} y={-18} width={205} height={45} fill="#0d0d0d" stroke="#3b82f6" strokeWidth="1.5" />
                <text x={22} y={1} fill="#ffffff" className="text-[11px] font-bold font-sans">
                  油溫120℃超えることなく安定。
                </text>
                <text x={22} y={17} fill="#3b82f6" className="text-[10px] font-bold font-sans">
                  約4倍の時間走行しても油溫は安定。
                </text>
              </g>

              {/* Hover vertical bar guides */}
              {hoverIndex !== null && hoverData && (
                <g>
                  <line
                    x1={getX(hoverData.time)}
                    y1={paddingTop}
                    x2={getX(hoverData.time)}
                    y2={height - paddingBottom}
                    stroke="#ef4444"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />
                  
                  {/* Circle indicators on data lines */}
                  <circle cx={getX(hoverData.time)} cy={getY(hoverData.ocOilTemp)} r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx={getX(hoverData.time)} cy={getY(hoverData.ocWaterTemp)} r="4" fill="#8c8c8c" stroke="#ffffff" strokeWidth="1.5" />

                  {hoverData.noOcOilTemp !== null && (
                    <circle cx={getX(hoverData.time)} cy={getY(hoverData.noOcOilTemp)} r="5" fill="#f97316" stroke="#ffffff" strokeWidth="1.5" />
                  )}
                  {hoverData.noOcWaterTemp !== null && (
                    <circle cx={getX(hoverData.time)} cy={getY(hoverData.noOcWaterTemp)} r="4" fill="#eab308" stroke="#ffffff" strokeWidth="1.5" />
                  )}
                </g>
              )}
            </svg>
          </div>

          {/* Interactive Mouse Hover Tooltip Box */}
          {hoverIndex !== null && hoverData && hoverPos && (
            <div
              className="absolute z-50 bg-neutral-950/95 border-2 border-red-600 p-4 shadow-xl text-xs md:text-sm text-left font-mono"
              style={{
                left: `${Math.min(hoverPos.x + 15, width - 210)}px`,
                top: `${hoverPos.y + 15}px`,
                minWidth: "190px",
              }}
            >
              <p className="text-red-500 font-bold border-b border-neutral-900 pb-1 mb-2">
                時間: {hoverData.time} 秒 ({Math.floor(hoverData.time / 60)}分 {hoverData.time % 60}秒)
              </p>
              <div className="space-y-1.5 font-bold">
                <div className="flex justify-between items-center text-blue-400">
                  <span>O/C付 油溫:</span>
                  <span className="text-sm font-number tracking-wider">{hoverData.ocOilTemp} °C</span>
                </div>
                <div className="flex justify-between items-center text-orange-400">
                  <span>O/C無 油溫:</span>
                  <span className="text-sm font-number tracking-wider">
                    {hoverData.noOcOilTemp !== null ? `${hoverData.noOcOilTemp} °C` : "已終止/熱熔"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-400">
                  <span>O/C付 水溫:</span>
                  <span className="text-sm font-number tracking-wider">{hoverData.ocWaterTemp} °C</span>
                </div>
                <div className="flex justify-between items-center text-yellow-400">
                  <span>O/C無 水溫:</span>
                  <span className="text-sm font-number tracking-wider">
                    {hoverData.noOcWaterTemp !== null ? `${hoverData.noOcWaterTemp} °C` : "已終止"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Summary Translation Box */}
          <div className="mt-4 p-4 bg-neutral-900/60 border border-neutral-800 rounded">
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed text-left">
              <strong className="text-red-500">【實測結論】</strong>
              原廠未裝設冷卻器在走行開始後僅約 <span className="text-yellow-400 font-bold">5分鐘 (270秒)</span>，機油溫度即因劇烈高溫狂飆突破 <span className="text-red-500 font-bold">130°C</span> 觸發保護。
              而在加裝了 <span className="text-blue-400 font-bold">HKS 機油冷卻器</span> 之後，油溫完全被穩定壓制在 <span className="text-green-400 font-bold">120°C 以下 (最高 115°C)</span>，即便連續操駕長達原廠 4 倍的時間亦未見任何熱衰竭！
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center py-6 text-center">
          <div className="max-w-2xl border border-neutral-800 bg-neutral-900/40 p-1">
            <img
              src="/data.jpg"
              onError={(e) => {
                const img = e.currentTarget;
                if (!img.dataset.tried) {
                  img.dataset.tried = "true";
                  img.src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80";
                }
              }}
              className="w-full h-auto block"
              alt="HKS official uploaded telemetry chart"
            />
          </div>
          <div className="mt-4 max-w-xl text-left bg-neutral-950 p-4 border border-dashed border-red-500/40">
            <p className="text-xs text-red-400 font-bold mb-1">💡 提示 (How to use custom uploaded graph):</p>
            <p className="text-xs text-gray-400 leading-relaxed">
              如果您想在上方即時看到您上傳的原廠對比例圖，請把剛才的圖片重命名為 <code className="text-white font-mono bg-neutral-900 px-1 py-0.5 border border-neutral-800 rounded">data.jpg</code>，並在專案編輯器的檔案樹中，**直接拖曳或上傳到 <code className="text-white font-bold bg-neutral-900 px-1 py-0.5 border border-neutral-800 rounded">/public/</code> 資料夾內**即可！現在我已經替您配好了動態互動與原圖並存的極致架構！
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
