import { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, CartesianGrid } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const data = [
  { month: "Jan", value: 10 },
  { month: "Feb", value: 18 },
  { month: "Mar", value: 22 },
  { month: "Apr", value: 30 },
  { month: "May", value: 40 },
  { month: "Jun", value: 45 },
  { month: "Jul", value: 38 },
  { month: "Aug", value: 42 },
  { month: "Sep", value: 35 },
  { month: "Oct", value: 40 },
  { month: "Nov", value: 43 },
  { month: "Des", value: 48 },
];

export default function SalesChart() {
  const [selectedPeriod, setSelectedPeriod] = useState("Month");
  const [themeColor, setThemeColor] = useState("#A8734B");
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateThemeColor = () => {
      const root = document.documentElement;
      const computedColor = getComputedStyle(root).getPropertyValue("--theme-primary").trim();
      if (computedColor) {
        setThemeColor(computedColor);
      }
    };

    updateThemeColor();
    // Update on theme changes
    const interval = setInterval(updateThemeColor, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={chartRef} className="bg-white rounded-xl p-6 shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Summary Sales</h3>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Week">Week</SelectItem>
            <SelectItem value="Month">Month</SelectItem>
            <SelectItem value="Year">Year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={themeColor} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={themeColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: "#666", fontSize: 12 }}
              axisLine={{ stroke: "#e0e0e0" }}
            />
            <YAxis 
              tick={{ fill: "#666", fontSize: 12 }}
              axisLine={{ stroke: "#e0e0e0" }}
              domain={[0, 50]}
              ticks={[0, 10, 20, 30, 40, 50]}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "white", 
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                padding: "8px 12px"
              }}
              labelStyle={{ color: "#333", fontWeight: 600 }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={themeColor}
              strokeWidth={3}
              fill="url(#colorValue)"
              dot={{ fill: themeColor, r: 4 }}
              activeDot={{ r: 6, fill: themeColor }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
