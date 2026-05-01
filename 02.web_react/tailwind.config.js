/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "primary":          "#E31E24", // Rojo
        "primary-dark":     "#C01820", // Rojo oscuro (hover)
        "gold":             "#D7B56D", // Dorado
        "gold-dark":        "#B8962A", // Dorado oscuro (hover)
        "background-light": "#f6f6f8",
        "background-dark":  "#1a1a19", // Oscuro cálido (páginas)
        "sidebar-bg":       "#2A2A29", // Negro (sidebar)
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
    },
  },
  plugins: [],
}
