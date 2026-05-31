import { ReactNode } from "react";

interface NutriScoreProps {
  score: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const SCORE_COLORS: Record<string, string> = {
  A: "#1a9c3e",
  B: "#7dc243",
  C: "#f5c400",
  D: "#f39200",
  E: "#e63946",
};

export function NutriScore({ score, size = "md" }: NutriScoreProps) {
  const normalizedScore = score.toUpperCase();
  const color = SCORE_COLORS[normalizedScore] || "#ccc";
  
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-xl",
    lg: "w-16 h-16 text-3xl",
    xl: "w-24 h-24 text-5xl",
  };

  return (
    <div 
      className={`flex items-center justify-center rounded-full font-black text-white shadow-sm border-2 border-white/20 ${sizeClasses[size]}`}
      style={{ backgroundColor: color }}
    >
      {normalizedScore}
    </div>
  );
}