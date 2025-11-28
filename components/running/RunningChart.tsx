"use client";

import { IRunning } from "@/types/interfaces/IRunning";
import { format } from "date-fns";
import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Brush,
  Cell,
} from "recharts";

export type PreparedData = {
  dateLabel: string;
  kilometers: number;
  calories: number;
  pace: number | null;
  durationMin: number;
};

export default function RunningChart({ runnings }: { runnings: IRunning[] }) {
  const prepared: PreparedData[] = useMemo(() => {
    return (runnings || []).map((running) => {
      const km = Number(running.kilometers) || 0;
      const durSec = parseDurationToSeconds(running.durations);
      const pace = km > 0 ? durSec / 60 / km : null; // minutes per km
      const dateLabel =
        typeof running.date === "number"
          ? new Date(running.date).toISOString().slice(0, 10)
          : String(running.date);
      return {
        dateLabel,
        kilometers: km,
        calories: Number(running.calories) || 0,
        pace,
        durationMin: durSec / 60,
      };
    });
  }, [runnings]);

  const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;

    const p = payload.find((pl: any) => pl.dataKey === "pace");
    const km = payload.find((pl: any) => pl.dataKey === "kilometers");
    const cal = payload.find((pl: any) => pl.dataKey === "calories");
    const dur = prepared.find((x) => x.dateLabel === label)?.durationMin;
    return (
      <div className="bg-white text-graphite p-3 rounded flex flex-col gap-1 border-3 border-stormy-teal">
        <div>
          <strong>{format(new Date(label), "dd/MM/yyyy")}</strong>
        </div>
        {km && <div>Distance: {km.value} km</div>}
        {dur != null && <div>Durée: {Math.round(dur)} min</div>}
        {p && <div>Pace: {formatMinPerKm(p.value)}</div>}
        {cal && <div>Calories: {cal.value} kcal</div>}
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={380}>
      <ComposedChart data={prepared}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="dateLabel" tickFormatter={formatXAxis} />

        {/* km / kcal & min / km */}
        {/* <YAxis
          yAxisId="left"
          orientation="left"
          label={{ value: "km / kcal", angle: -90, position: "insideLeft" }}
          padding={{
            top: 10,
          }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          label={{
            value: "min / km",
            angle: 90,
            position: "insideRight",
          }}
          tickFormatter={(v) => formatMinPerKm(v as number)}
          padding={{
            top: 10,
          }}
        /> */}

        {/* Km & Cal */}
        <YAxis
          yAxisId="km"
          orientation="left"
          label={{ value: "km", angle: -90, position: "insideLeft" }}
        />
        <YAxis
          yAxisId="cal"
          orientation="right"
          label={{ value: "kcal", angle: 90, position: "insideRight" }}
        />

        {/* Tooltip */}
        <Tooltip content={<CustomTooltip />} />

        {/* Legends */}
        <Legend wrapperStyle={{ color: "#ff9800" }} />

        {/* Kilometers */}
        <Bar
          yAxisId="km"
          dataKey="kilometers"
          name="Distance (km)"
          fill="#1976d2"
          barSize={50}
        />

        <defs>
          <linearGradient id="caloriesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f44336" /> {/* Rouge */}
            <stop offset="50%" stopColor="#ff9800" /> {/* Orange */}
            <stop offset="100%" stopColor="#4caf50" /> {/* Vert */}
          </linearGradient>
        </defs>

        {/* Calories */}
        <Bar
          yAxisId="cal"
          dataKey="calories"
          name="Calories"
          barSize={50}
          fill="url(#caloriesGradient)"
        >
          {runnings.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                entry.calories > 500
                  ? "#f44336" // rouge
                  : entry.calories > 300
                  ? "#ff9800" // orange
                  : "#4caf50" // vert
              }
            />
          ))}
        </Bar>

        <Line
          yAxisId="right"
          type="monotone"
          dataKey="pace"
          name="Pace (min/km)"
          stroke="#e53935"
          dot={true}
        />
        <Brush dataKey="dateLabel" height={30} tickFormatter={formatXAxis} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

// Helpers
const parseDurationToSeconds = (strOrNum?: string | number): number => {
  if (strOrNum == null) return 0;
  if (typeof strOrNum === "number") return Math.max(0, Math.floor(strOrNum));

  const parts = String(strOrNum).split(":").map(Number);
  if (parts.length === 1) return Number(parts[0]) || 0;
  if (parts.length === 2) return parts[0] * 60 + (parts[1] || 0);
  if (parts.length === 3)
    return parts[0] * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
  return 0;
};

const formatMinPerKm = (value?: number | null): string => {
  if (value == null || Number.isNaN(value)) return "-";

  const totalSec = Math.round((value || 0) * 60);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, "0")} min/km`;
};

const formatXAxis = (tickItem: string) => format(new Date(tickItem), "dd/MM");
