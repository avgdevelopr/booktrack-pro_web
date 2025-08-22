"use client"

import { useEffect, useState } from "react"
import { useTheme } from "./theme-provider"

interface ConfettiPiece {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  rotation: number
  rotationSpeed: number
}

interface ConfettiProps {
  active: boolean
  onComplete: () => void
}

export function Confetti({ active, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])
  const { accentColor } = useTheme()

  const getConfettiColors = () => {
    switch (accentColor) {
      case "red":
        return ["#ef4444", "#f87171", "#fca5a5", "#fde047", "#facc15"]
      case "yellow":
        return ["#eab308", "#facc15", "#fde047", "#f97316", "#fb923c"]
      case "green":
        return ["#22c55e", "#4ade80", "#86efac", "#10b981", "#34d399"]
      case "blue":
      default:
        return ["#3b82f6", "#60a5fa", "#93c5fd", "#06b6d4", "#67e8f9"]
    }
  }

  useEffect(() => {
    if (!active) {
      setPieces([])
      return
    }

    const colors = getConfettiColors()
    const newPieces: ConfettiPiece[] = []

    // Create confetti pieces
    for (let i = 0; i < 50; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -10,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
      })
    }

    setPieces(newPieces)

    const animationFrame = () => {
      setPieces((currentPieces) => {
        const updatedPieces = currentPieces
          .map((piece) => ({
            ...piece,
            x: piece.x + piece.vx,
            y: piece.y + piece.vy,
            vy: piece.vy + 0.1, // gravity
            rotation: piece.rotation + piece.rotationSpeed,
          }))
          .filter((piece) => piece.y < window.innerHeight + 20)

        if (updatedPieces.length === 0) {
          onComplete()
          return []
        }

        return updatedPieces
      })
    }

    const interval = setInterval(animationFrame, 16) // ~60fps

    return () => clearInterval(interval)
  }, [active, accentColor, onComplete])

  if (!active || pieces.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute rounded-sm"
          style={{
            left: piece.x,
            top: piece.y,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
          }}
        />
      ))}
    </div>
  )
}
