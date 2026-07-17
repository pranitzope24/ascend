"use client"

import dynamic from "next/dynamic"

// Next.js dynamic import because react-muscle-highlighter might rely on browser globals like window
const Model = dynamic(() => import("react-muscle-highlighter").then((mod) => mod.default), {
  ssr: false,
  loading: () => <div className="bg-muted h-64 w-full animate-pulse rounded-xl" />,
})

interface BodyHeatmapProps {
  data: { slug: string; intensity: number }[]
}

export function BodyHeatmap({ data }: BodyHeatmapProps) {
  return (
    <div className="mx-auto flex w-full items-center justify-center gap-2 overflow-hidden">
      <div className="w-[120px] flex-shrink-0 [&_svg]:!h-auto [&_svg]:!w-full">
        <Model
          side="front"
          data={data as any}
          colors={["#fecaca", "#f87171", "#ef4444", "#dc2626", "#991b1b"]}
        />
      </div>
      <div className="w-[120px] flex-shrink-0 [&_svg]:!h-auto [&_svg]:!w-full">
        <Model
          side="back"
          data={data as any}
          colors={["#fecaca", "#f87171", "#ef4444", "#dc2626", "#991b1b"]}
        />
      </div>
    </div>
  )
}
