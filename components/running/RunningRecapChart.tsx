"use client";

import { useMemo } from "react";
import { PreparedData } from "./RunningChart";
import { IRunning } from "@/types/interfaces/IRunning";
import { Line, LineChart, ResponsiveContainer } from "recharts";

const RunningRecapChart = ({ runnings }: { runnings: IRunning[] }) => {
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

  const totalKm = prepared.reduce((sum, r) => sum + r.kilometers, 0);
  const totalCalories = prepared.reduce((sum, r) => sum + r.calories, 0);
  const totalDuration = prepared.reduce((sum, r) => sum + r.durationMin, 0);

  // Calcul du pace moyen
  const averagePace =
    prepared.reduce((sum, r) => sum + r.pace!, 0) / prepared.length;

  const CustomLegend = () => {
    return (
      <div className="flex gap-5 p-3 text-graphite">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-stormy-teal" />
          <span>
            <b>Kilométrage :</b> {totalKm.toFixed(1)} km
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#ff5e00]" />
          <span>
            <b>Calories :</b> {totalCalories.toFixed(2)} kcal
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#e53935]" />
          <span>
            <b>Durée totale :</b> {formatDuration(totalDuration)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#1976d2]" />
          <span>
            <b>Pace moyen :</b> {formatPace(averagePace)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <>
      <ResponsiveContainer width="100%" height={70}>
        <LineChart data={prepared}>
          <Line
            type="monotone"
            dataKey="pace"
            stroke="#1976d2"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>

      <CustomLegend />
    </>
  );
};

export default RunningRecapChart;

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

const formatPace = (p: number) => {
  const min = Math.floor(p);
  const sec = Math.round((p - min) * 60);
  return `${min}:${sec.toString().padStart(2, "0")} min/km`;
};

const formatDuration = (m: number) => {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${h}h ${min.toFixed(2)}m`;
};
