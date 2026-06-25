'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import styles from './ThemeToggle.module.css'

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className={styles.placeholder} />

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`${styles.themeButton} ${isDark ? styles.dark : styles.light}`}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className={styles.icon} size={18} strokeWidth={2.2} />
      ) : (
        <Moon className={styles.icon} size={18} strokeWidth={2.2} />
      )}
    </button>
  )
}