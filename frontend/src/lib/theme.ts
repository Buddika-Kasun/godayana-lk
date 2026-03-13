// Centralized theme configuration for Godayana.lk
// Change these values to update the entire website theme

export const theme = {
  name: "Godayana.lk - Sri Lankan Theme",
  
  colors: {
    primary: {
      name: "Ocean Blue",
      description: "Represents Sri Lankan ocean waters",
      light: "oklch(0.62 0.19 260.0)",
      dark: "oklch(0.7 0.19 260.0)",
    },
    secondary: {
      name: "Beach Gold",
      description: "Represents Sri Lankan golden beaches",
      light: "oklch(0.83 0.15 85.0)",
      dark: "oklch(0.7 0.12 85.0)",
    },
    accent: {
      name: "Spice Orange",
      description: "Represents Sri Lankan spices",
      light: "oklch(0.75 0.16 45.0)",
      dark: "oklch(0.7 0.14 45.0)",
    },
    success: {
      name: "Jungle Green",
      description: "Represents Sri Lankan greenery",
      light: "oklch(0.65 0.18 145.0)",
      dark: "oklch(0.7 0.15 145.0)",
    },
  },
  
  // Border radius scale
  radius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    "2xl": "1.25rem",
    "3xl": "1.5rem",
    "4xl": "1.75rem",
  },
  
  // Animation durations
  animation: {
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
  },
  
  // Box shadows
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
  },
}

// Helper function to get CSS variable
export const cssVar = (name: string) => `hsl(var(--${name}))`