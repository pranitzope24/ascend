"use client"

import { cn } from "@/lib/utils"

interface MeasurementFigurineProps {
  measurements: Record<string, string> // key format: "{part}-{side}" or "{part}", value: formatted string like "38 in"
  className?: string
}

export function MeasurementFigurine({ measurements, className }: MeasurementFigurineProps) {
  return (
    <div className={cn("relative mx-auto w-[280px] sm:w-[320px] aspect-[1/2] select-none", className)}>
      {/* Background SVG Figurine */}
      <svg
        viewBox="0 0 200 400"
        className="h-full w-full stroke-muted-foreground/30 fill-muted/20"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Head */}
        <circle cx="100" cy="40" r="25" strokeWidth="2" />
        {/* Neck */}
        <path d="M 85 62 L 85 75 L 115 75 L 115 62" strokeWidth="2" />
        {/* Torso */}
        <path d="M 60 75 Q 100 85 140 75 L 130 190 Q 100 200 70 190 Z" strokeWidth="2" />
        {/* Arms (Resting) */}
        <path d="M 60 75 Q 30 130 40 210 M 140 75 Q 170 130 160 210" strokeWidth="2" fill="none" />
        {/* Legs */}
        <path d="M 70 190 L 70 380 Q 80 390 85 380 L 85 230 L 115 230 L 115 380 Q 120 390 130 380 L 130 190" strokeWidth="2" />
        
        {/* Guidelines / Connectors */}
        {/* Neck */}
        <line x1="100" y1="68" x2="160" y2="40" className="stroke-muted-foreground/40 stroke-1" strokeDasharray="2,2" />
        {/* Chest */}
        <line x1="100" y1="105" x2="30" y2="105" className="stroke-muted-foreground/40 stroke-1" strokeDasharray="2,2" />
        
        {/* Bicep (Right on user screen, Left arm) */}
        <line x1="160" y1="110" x2="190" y2="110" className="stroke-muted-foreground/40 stroke-1" strokeDasharray="2,2" />
        {/* Bicep (Left on user screen, Right arm) */}
        <line x1="40" y1="110" x2="10" y2="110" className="stroke-muted-foreground/40 stroke-1" strokeDasharray="2,2" />
        {/* Waist */}
        <line x1="100" y1="145" x2="170" y2="145" className="stroke-muted-foreground/40 stroke-1" strokeDasharray="2,2" />
        {/* Hips */}
        <line x1="100" y1="180" x2="30" y2="180" className="stroke-muted-foreground/40 stroke-1" strokeDasharray="2,2" />
        
        {/* Forearm (Right on user screen, Left arm) */}
        <line x1="163" y1="160" x2="190" y2="160" className="stroke-muted-foreground/40 stroke-1" strokeDasharray="2,2" />
        {/* Forearm (Left on user screen, Right arm) */}
        <line x1="37" y1="160" x2="10" y2="160" className="stroke-muted-foreground/40 stroke-1" strokeDasharray="2,2" />
        {/* Thigh (Right on user screen, Left leg) */}
        <line x1="122" y1="260" x2="170" y2="260" className="stroke-muted-foreground/40 stroke-1" strokeDasharray="2,2" />
        {/* Thigh (Left on user screen, Right leg) */}
        <line x1="77" y1="260" x2="30" y2="260" className="stroke-muted-foreground/40 stroke-1" strokeDasharray="2,2" />
        {/* Calf (Right on user screen, Left leg) */}
        <line x1="122" y1="330" x2="170" y2="330" className="stroke-muted-foreground/40 stroke-1" strokeDasharray="2,2" />
        {/* Calf (Left on user screen, Right leg) */}
        <line x1="77" y1="330" x2="30" y2="330" className="stroke-muted-foreground/40 stroke-1" strokeDasharray="2,2" />
      </svg>

      {/* HTML Text Labels Overlay (using absolute positioning to match SVG guidelines) */}
      
      {/* Neck */}
      <MeasurementLabel label="Neck" value={measurements["Neck"]} top="8%" left="82%" align="left" />
      
      {/* Chest */}
      <MeasurementLabel label="Chest" value={measurements["Chest"]} top="24%" left="15%" align="right" />
      
      {/* Waist */}
      <MeasurementLabel label="Waist" value={measurements["Waist"]} top="34%" left="87%" align="left" />
      
      {/* Hips */}
      <MeasurementLabel label="Hips" value={measurements["Hips"]} top="43%" left="15%" align="right" />
      
      {/* Biceps */}
      <MeasurementLabel label="L. Bicep" value={measurements["Bicep-left"]} top="27.5%" left="96%" align="left" />
      <MeasurementLabel label="R. Bicep" value={measurements["Bicep-right"]} top="27.5%" left="4%" align="right" />
      
      {/* Forearms */}
      <MeasurementLabel label="L. Forearm" value={measurements["Forearm-left"]} top="40%" left="96%" align="left" />
      <MeasurementLabel label="R. Forearm" value={measurements["Forearm-right"]} top="40%" left="4%" align="right" />
      
      {/* Thighs */}
      <MeasurementLabel label="L. Thigh" value={measurements["Thigh-left"]} top="63%" left="87%" align="left" />
      <MeasurementLabel label="R. Thigh" value={measurements["Thigh-right"]} top="63%" left="15%" align="right" />
      
      {/* Calves */}
      <MeasurementLabel label="L. Calf" value={measurements["Calf-left"]} top="80%" left="87%" align="left" />
      <MeasurementLabel label="R. Calf" value={measurements["Calf-right"]} top="80%" left="15%" align="right" />
    </div>
  )
}

function MeasurementLabel({
  label,
  value,
  top,
  left,
  align,
}: {
  label: string
  value: string | undefined
  top: string
  left: string
  align: "left" | "right"
}) {
  return (
    <div
      className={cn(
        "absolute flex flex-col -translate-y-1/2",
        align === "left" ? "items-start" : "items-end -translate-x-full"
      )}
      style={{ top, left }}
    >
      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
      <span className={cn("text-sm font-bold whitespace-nowrap", value ? "text-primary" : "text-muted-foreground")}>
        {value || "--"}
      </span>
    </div>
  )
}
