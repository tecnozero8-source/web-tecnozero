import { ImageResponse } from "next/og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "linear-gradient(135deg, #0957C3 0%, #1FB3E5 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          fontWeight: 800,
          fontSize: 14,
          color: "#FFFFFF",
          letterSpacing: "-0.5px",
        }}
      >
        TZ
      </div>
    ),
    { ...size }
  )
}
