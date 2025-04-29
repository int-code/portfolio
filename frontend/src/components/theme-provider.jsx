"use client"

import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext({
  theme: "dark",
  setTheme: () => null,
})

export function ThemeProvider({ children, defaultTheme = "dark", storageKey = "theme" }) {
  const [theme, setTheme] = useState(() => {
    // Always return the default theme initially
    return defaultTheme
  })

  useEffect(() => {
    const root = window.document.documentElement

    // Remove the old theme class
    root.classList.remove("light", "dark")

    // Add the new theme class
    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (newTheme) => {
      setTheme(newTheme)
      localStorage.setItem(storageKey, newTheme)
    },
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
