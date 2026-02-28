"use client"
import { PerspectiveCamera } from "@react-three/drei"
import { useThree } from "@react-three/fiber"

export function ResponsiveCamera() {
  const { viewport } = useThree()

  const isMobile = viewport.width < 6

  return (
    <PerspectiveCamera
      makeDefault
      position={isMobile ? [0, 1, 5.5] : [-0.5, 1, 4]}
      fov={45}
    />
  )
}