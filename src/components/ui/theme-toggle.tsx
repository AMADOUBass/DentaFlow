"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-2xl h-11 w-11 relative overflow-hidden bg-slate-100/50 hover:bg-slate-200/50 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 transition-colors"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme === "light" ? "sun" : "moon"}
          initial={{ y: 20, opacity: 0, rotate: -45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -20, opacity: 0, rotate: 45 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="flex items-center justify-center"
        >
          {theme === "light" ? (
            <Sun className="h-5 w-5 text-amber-500" />
          ) : (
            <Moon className="h-5 w-5 text-blue-400" />
          )}
        </motion.div>
      </AnimatePresence>
      <span className="sr-only">Changer le thème</span>
    </Button>
  )
}
