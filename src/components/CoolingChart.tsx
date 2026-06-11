import { useState, MouseEvent } from "react";
import { CheckCircle2 } from "lucide-react";

interface DataPoint {
  time: number; // in seconds
  ocOilTemp: number; // AIRTEC fitted Transmission Oil Temp (blue line - keeps it highly cool)
  noOcOilTemp: number | null; // OEM Transmission Oil Temp (orange line - overheats past 120°C fast)
  ocWaterTemp: number; // Engine Water Temp with AIRTEC (grey line)
  noOcWaterTemp: number | null; // OEM Engine Water Temp (yellow line)
}

// Replicate the telemetry data points representing critical gearbox overheating warning
const generateChartData = (): DataPoint[] => {
  const data: DataPoint[] = [];
  
  // Base parameters:
  // OEM Gearbox Oil rises from ~85°C up to 123°C in 270 seconds and triggers Limp Mode.
  // AIRTEC Gearbox Oil rises from ~85°C to ~98°C and remains extremely stable between 96°C and 99°C.
  // OEM Water rises from 92°C to 105°C in 270 seconds.
  // AIRTEC Water remains stabilized at 94°C - 97°C.
  
  const totalSeconds = 1120;
  const step = 10; // Generate state points every 10 seconds for butter smooth SVG paths

  for (let t = 0; t <= totalSeconds; t += step) {
    // Generate micro-oscillations representing real circuit logging noise
    const noise = (Math.sin(t / 8) * 0.3) + (Math.cos(t / 3) * 0.2) + ((t % 30 === 0) ? 0.25 : -0.15);

    // O/C付 變速箱油温 (Stabilizes comfortably below 100°C)
    let ocOil = 85;
    if (t < 300) {
      ocOil = 85 + (98 - 85) * (1 - Math.exp(-t / 120)) + noise;
    } else {
      ocOil = 98.2 + (Math.sin(t / 20) * 0.8) + noise;
    }

    // O/C無 變速箱油温 (Reaches dangerous 122.5°C at 270 seconds and triggers protective lock/termination)
    let noOcOil: number | null = null;
    if (t <= 270) {
      noOcOil = 84.0 + (123.5 - 84.0) * (t / 270) ** 0.6 + noise;
      if (t === 270) noOcOil = 122.8;
    }

    // O/C付 水温 (Engine coolant stays stable around 95°C)
    let ocWater = 90 + noise;
    if (t < 150) {
      ocWater = 88 + (94.5 - 88) * (t / 150) + noise;
    } else {
      ocWater = 94.8 + (Math.sin(t / 25) * 1.0) + noise;
    }

    // O/C無 水温 (Reaches 105.5°C and terminates)
    let noOcWater: number | null = null;
    if (t <= 270) {
      noOcWater = 88.5 + (105.5 - 88.5) * (t / 270) ** 0.5 + noise;
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

export default function CoolingChart({ themeMode = "cyber" }: { themeMode?: "cyber" | "magi" | "initialD" }) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  // SVG Chart Bounds
  const width = 800;
  const height = 400;
  const paddingLeft = 50;
  const paddingRight = 40;
  const paddingTop = 40;
  const paddingBottom = 50;

  // Domain scaling bounds
  const minX = 0;
  const maxX = 1200;
  const minY = 80; // Gearbox warm start temp
  const maxY = 130; // Peak critical overheat temp

  const getX = (val: number) => {
    return paddingLeft + ((val - minX) / (maxX - minX)) * (width - paddingLeft - paddingRight);
  };

  const getY = (val: number) => {
    return height - paddingBottom - ((val - minY) / (maxY - minY)) * (height - paddingTop - paddingBottom);
  };

  // Convert points to SVG polyline path
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

    // Convert SVG X coordinate back to Time scale value
    const relativeX = clientX - paddingLeft;
    const plotWidth = width - paddingLeft - paddingRight;
    const ratio = relativeX / plotWidth;
    const targetTime = minX + ratio * (maxX - minX);

    // Find closest horizontal data point on time series
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

  // Grid tick markers for clean racing look
  const xTicks = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200];
  const yTicks = [80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130];

  const themeColors = {
    ocOil: themeMode === "cyber" ? "#00f0ff" : themeMode === "initialD" ? "#ef4444" : "#3b82f6",
    noOcOil: themeMode === "cyber" ? "#ff007f" : themeMode === "initialD" ? "#facc15" : "#ef4444",
    ocWater: themeMode === "cyber" ? "#a855f7" : themeMode === "initialD" ? "#e5e7eb" : "#6b7280",
    noOcWater: themeMode === "cyber" ? "#eab308" : themeMode === "initialD" ? "#9ca3af" : "#eab308",
  };

  return (
    <div className={`w-full border rounded p-5 md:p-8 shadow-2xl relative overflow-hidden transition-all duration-300 ${
      themeMode === "cyber" 
        ? "bg-[#0b0b12] border-cyan-900/60 shadow-[0_0_30px_rgba(6,182,212,0.15)]" 
        : themeMode === "initialD"
        ? "bg-stone-950/95 border-[#facc15] shadow-[0_0_35px_rgba(250,204,21,0.15)] manga-burst-border" 
        : "bg-[#0d0d0d] border-neutral-800"
    }`}>
      {/* Visual Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-neutral-900 pb-5 mb-6 gap-4 text-left">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
              themeMode === "cyber" ? "bg-cyan-400" : themeMode === "initialD" ? "bg-yellow-400" : "bg-red-650"
            }`} />
            <span className={`text-[10px] font-bold uppercase tracking-widest font-mono ${
              themeMode === "cyber" ? "text-cyan-400" : themeMode === "initialD" ? "text-yellow-400" : "text-red-500"
            }`}>
              {themeMode === "initialD" ? "KTSP 改車找阿咪 // INITIAL-D TOUGE SPECIAL TELEMETRY" : "AIRTEC MOTORSPORT LABORATORY TELEMETRY SYSTEM"}
            </span>
          </div>
          <h3 className="text-xl md:text-3.5xl font-black italic text-white tracking-wide font-display">
            ■ 台灣極限環境實測：熱衰竭，完全消滅。
          </h3>
          <p className="text-xs text-neutral-400 font-mono mt-1 leading-relaxed">
            測試條件：台中賽道 // 氣溫高達 33°C - 34°C 嚴苛極限壓力測試 // 測試車輛 Gr Yaris Gen2 (Auto)
          </p>
        </div>
      </div>

      <div className="relative">
        {/* Legend Selector Indicator */}
        <div className="flex flex-wrap gap-4 mb-4 text-xs md:text-sm font-bold bg-neutral-900/60 p-2.5 border border-neutral-900 justify-center font-mono">
          <div className="flex items-center gap-2">
            <span className="w-4 h-1.5 rounded-full" style={{ backgroundColor: themeColors.ocOil }} />
            <span className="text-gray-200">AIRTEC 變速箱油溫</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-1.5 rounded-full" style={{ backgroundColor: themeColors.noOcOil }} />
            <span className="text-gray-200">原廠基礎 變速箱油溫</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-1.5 rounded-full" style={{ backgroundColor: themeColors.ocWater }} />
            <span className="text-gray-200">AIRTEC 引擎水溫</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-1.5 rounded-full" style={{ backgroundColor: themeColors.noOcWater }} />
            <span className="text-gray-200">原廠基礎 引擎水溫</span>
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
            {/* Background black terminal overlay */}
            <rect x={paddingLeft} y={paddingTop} width={width - paddingLeft - paddingRight} height={height - paddingTop - paddingBottom} fill="#020202" />

            {/* Grid Line Guides */}
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
                  className="text-[12px] font-mono font-semibold"
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
                  className="text-[12px] font-mono font-semibold"
                >
                  {xVal}
                </text>
              </g>
            ))}

            {/* Temperature Unit Axis Label */}
            <text
              x={20}
              y={paddingTop - 15}
              fill="#888888"
              className="text-[12px] font-bold tracking-widest font-mono"
            >
              溫度 (°C)
            </text>

            {/* Time Unit Axis Label */}
            <text
              x={width / 2}
              y={height - 10}
              textAnchor="middle"
              fill="#888888"
              className="text-[12px] font-bold tracking-widest font-mono"
            >
              時間 (sec)
            </text>

            {/* Graphs Paths drawing */}
            {/* grey: AIRTEC fitted Engine Water */}
            <path
              d={getLinePath("ocWaterTemp")}
              fill="none"
              stroke={themeColors.ocWater}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* yellow: OEM Engine Water */}
            <path
              d={getLinePath("noOcWaterTemp", 270)}
              fill="none"
              stroke={themeColors.noOcWater}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* blue: AIRTEC Gearbox Oil Temp - Keeps things incredibly low */}
            <path
              d={getLinePath("ocOilTemp")}
              fill="none"
              stroke={themeColors.ocOil}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-all duration-300 ${
                themeMode === "cyber" ? "drop-shadow-[0_0_8px_rgba(0,240,255,0.7)]" : "drop-shadow-[0_0_6px_rgba(59,130,246,0.5)]"
              }`}
            />
            {/* orange: OEM Gearbox Oil Temp - Overheats very fast */}
            <path
              d={getLinePath("noOcOilTemp", 270)}
              fill="none"
              stroke={themeColors.noOcOil}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-all duration-300 ${
                themeMode === "cyber" ? "drop-shadow-[0_0_8px_rgba(255,0,127,0.7)]" : "drop-shadow-[0_0_6px_rgba(239,68,68,0.5)]"
              }`}
            />

            {/* Annotation notes - Overheat threshold Limp protection marker */}
            <g transform={`translate(${getX(270) + 15}, ${getY(123) - 30})`}>
              <line x1={-15} y1={30} x2={25} y2={5} stroke="#ffffff" strokeWidth="1" />
              <rect x={25} y={-15} width={150} height={42} fill="#0d0d0d" stroke={themeColors.noOcOil} strokeWidth="1.5" />
              <text x={32} y={3} fill="#ffffff" className="text-[10px] font-bold font-sans">
                變速箱熱暴走突破 120°C
              </text>
              <text x={32} y={18} fill={themeColors.noOcOil} className="text-[9px] font-mono font-black animate-pulse">
                STATUS: LIMP MODE ACTIVATED
              </text>
            </g>

            {/* Annotation notes - Stable AIRTEC cooling results */}
            <g transform={`translate(${getX(700) + 20}, ${getY(98) - 40})`}>
              <line x1={80} y1={40} x2={40} y2={5} stroke="#ffffff" strokeWidth="1" />
              <rect x={15} y={-18} width={180} height={45} fill="#0d0d0d" stroke={themeColors.ocOil} strokeWidth="1.5" />
              <text x={22} y={1} fill="#ffffff" className="text-[10px] font-bold font-sans">
                AIRTEC 全程壓制於 115°C 以下
              </text>
              <text x={22} y={17} fill="#10b981" className="text-[9px] font-bold font-sans">
                即使連續全速跑完4倍時間依然極冷靜！
              </text>
            </g>

            {/* Hover vertical bar guides */}
            {hoverIndex !== null && hoverData && (
              <g>
                <line
                  relative-tag="focus-hover-line"
                  x1={getX(hoverData.time)}
                  y1={paddingTop}
                  x2={getX(hoverData.time)}
                  y2={height - paddingBottom}
                  stroke={themeColors.noOcOil}
                  strokeWidth="1.2"
                  strokeDasharray="4,4"
                />
                
                {/* Circle indicators on current index coordinates */}
                <circle cx={getX(hoverData.time)} cy={getY(hoverData.ocOilTemp)} r="5.5" fill={themeColors.ocOil} stroke="#ffffff" strokeWidth="1.5" />
                <circle cx={getX(hoverData.time)} cy={getY(hoverData.ocWaterTemp)} r="4.5" fill={themeColors.ocWater} stroke="#ffffff" strokeWidth="1.5" />

                {hoverData.noOcOilTemp !== null && (
                  <circle cx={getX(hoverData.time)} cy={getY(hoverData.noOcOilTemp)} r="5.5" fill={themeColors.noOcOil} stroke="#ffffff" strokeWidth="1.5" />
                )}
                {hoverData.noOcWaterTemp !== null && (
                  <circle cx={getX(hoverData.time)} cy={getY(hoverData.noOcWaterTemp)} r="4.5" fill={themeColors.noOcWater} stroke="#ffffff" strokeWidth="1.5" />
                )}
              </g>
            )}
          </svg>
        </div>

        {/* Interactive Mouse Hover Tooltip Box */}
        {hoverIndex !== null && hoverData && hoverPos && (
          <div
            className={`absolute z-50 p-4 shadow-2xl text-xs text-left font-mono border-2 bg-neutral-950/95 transition-all ${
              themeMode === "cyber" 
                ? "border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]" 
                : themeMode === "initialD" 
                ? "border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.3)] bg-black"
                : "border-red-600 shadow-xl"
            }`}
            style={{
              left: `${Math.min(hoverPos.x + 15, width - 210)}px`,
              top: `${hoverPos.y + 15}px`,
              minWidth: "210px",
            }}
          >
            <p className={`font-bold border-b border-neutral-900 pb-1 mb-2 ${
              themeMode === "cyber" ? "text-cyan-400" : themeMode === "initialD" ? "text-yellow-400" : "text-red-500"
            }`}>
              {themeMode === "initialD" ? "⏱️ 觀測時間: " : "觀測時間: "}{hoverData.time} 秒 ({Math.floor(hoverData.time / 60)}分 {hoverData.time % 60}秒)
            </p>
            <div className="space-y-1.5 font-bold">
              <div className="flex justify-between items-center" style={{ color: themeColors.ocOil }}>
                <span>AIRTEC 變速油溫:</span>
                <span className="text-sm font-semibold tracking-wider">{hoverData.ocOilTemp} °C</span>
              </div>
              <div className="flex justify-between items-center" style={{ color: themeColors.noOcOil }}>
                <span>原廠基礎 變速油溫:</span>
                <span className="text-sm font-semibold tracking-wider">
                  {hoverData.noOcOilTemp !== null ? `${hoverData.noOcOilTemp} °C` : "觸發Limp關閉/退賽"}
                </span>
              </div>
              <div className="flex justify-between items-center" style={{ color: themeColors.ocWater }}>
                <span>AIRTEC 引擎水溫:</span>
                <span className="text-sm font-semibold tracking-wider">{hoverData.ocWaterTemp} °C</span>
              </div>
              <div className="flex justify-between items-center" style={{ color: themeColors.noOcWater }}>
                <span>原廠基礎 引擎水溫:</span>
                <span className="text-sm font-semibold tracking-wider">
                  {hoverData.noOcWaterTemp !== null ? `${hoverData.noOcWaterTemp} °C` : "異常過高"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
