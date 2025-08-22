"use client"

import * as React from "react"

type Theme = "dark" | "light"
type AccentColor = "blue" | "red" | "yellow" | "green"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  defaultAccentColor?: AccentColor
  storageKey?: string
  accentStorageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  accentColor: AccentColor
  setTheme: (theme: Theme) => void
  setAccentColor: (color: AccentColor) => void
}

const initialState: ThemeProviderState = {
  theme: "light",
  accentColor: "blue",
  setTheme: () => null,
  setAccentColor: () => null,
}

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "light",
  defaultAccentColor = "blue",
  storageKey = "book-tracker-theme",
  accentStorageKey = "book-tracker-accent",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(defaultTheme)
  const [accentColor, setAccentColor] = React.useState<AccentColor>(defaultAccentColor)

  React.useEffect(() => {
    const storedTheme = localStorage.getItem(storageKey) as Theme
    const storedAccent = localStorage.getItem(accentStorageKey) as AccentColor

    if (storedTheme) {
      setTheme(storedTheme)
    }

    if (storedAccent) {
      setAccentColor(storedAccent)
    }
  }, [storageKey, accentStorageKey])

  React.useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")
    root.classList.add(theme)

    // Remove existing accent classes
    root.classList.remove("accent-blue", "accent-red", "accent-yellow", "accent-green")
    root.classList.add(`accent-${accentColor}`)
  }, [theme, accentColor])

  const value = {
    theme,
    accentColor,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
    setAccentColor: (color: AccentColor) => {
      localStorage.setItem(accentStorageKey, color)
      setAccentColor(color)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
