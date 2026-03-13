"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sun, Moon, Laptop } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Theme = "light" | "dark" | "system"

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>("system")
  const [mounted, setMounted] = useState(false)

  // Define applyTheme before using it
  const applyTheme = (newTheme: Theme | "light" | "dark") => {
    const root = document.documentElement
    
    if (newTheme === "dark") {
      root.classList.add("dark")
    } else if (newTheme === "light") {
      root.classList.remove("dark")
    } else {
      // system
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (systemPrefersDark) {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }
    }
  }

  // Initialize theme
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
    
    const savedTheme = localStorage.getItem("theme") as Theme | null
    if (savedTheme) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme(savedTheme)
      applyTheme(savedTheme)
    } else {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme("system")
      applyTheme(systemPrefersDark ? "dark" : "light")
    }
  }, [])

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    
    if (newTheme === "system") {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      applyTheme(systemPrefersDark ? "dark" : "light")
    } else {
      applyTheme(newTheme)
    }
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 opacity-0">
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  const getIcon = () => {
    if (theme === "light") return <Sun className="h-4 w-4" />
    if (theme === "dark") return <Moon className="h-4 w-4" />
    return <Laptop className="h-4 w-4" />
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full w-9 h-9 relative flex-shrink-0 text-muted-foreground hover:text-primary cursor-pointer"
          aria-label="Toggle theme"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {getIcon()}
            </motion.div>
          </AnimatePresence>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem
          onClick={() => handleThemeChange("light")}
          className="cursor-pointer"
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
          {theme === "light" && (
            <motion.div
              layoutId="theme-indicator"
              className="ml-auto w-1.5 h-1.5 bg-primary rounded-full"
            />
          )}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleThemeChange("dark")}
          className="cursor-pointer"
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
          {theme === "dark" && (
            <motion.div
              layoutId="theme-indicator"
              className="ml-auto w-1.5 h-1.5 bg-primary rounded-full"
            />
          )}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleThemeChange("system")}
          className="cursor-pointer"
        >
          <Laptop className="mr-2 h-4 w-4" />
          <span>System</span>
          {theme === "system" && (
            <motion.div
              layoutId="theme-indicator"
              className="ml-auto w-1.5 h-1.5 bg-primary rounded-full"
            />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}