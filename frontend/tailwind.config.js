/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{astro,js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/pages/**/*.{astro,js,jsx,ts,tsx}"
  ],
  darkMode: 'class', // enables .dark variant and toggling
  theme: {
    extend: {
      colors: {
        // Cramtime Brand Palette
        background: {
          light: '#FDFDFE',
          dark: '#0F172A',
        },
        surface: {
          light: '#F3F4F6',
          dark: '#1E293B',
        },
        border: {
          light: '#E5E7EB',
          dark: '#334155',
        },
        text: {
          primary: {
            light: '#1A1A1A',
            dark: '#F8FAFC',
          },
          secondary: {
            light: '#4A4A4A',
            dark: '#94A3B8',
          },
        },
        accent1: {
          light: '#4F46E5',
          dark: '#6366F1',
        },
        accent2: {
          light: '#22D3EE',
          dark: '#67E8F9',
        },
        success: {
          light: '#10B981',
          dark: '#34D399',
        },
        error: {
          light: '#EF4444',
          dark: '#F87171',
        },
        info: {
          light: '#3B82F6',
          dark: '#60A5FA',
        },
        // For easy use in components
        brand: {
          DEFAULT: '#4F46E5', // Indigo 600
          cyan: '#22D3EE',    // Cyan 400
          dark: '#6366F1',    // Indigo 500
        },
      },
      fontFamily: {
        heading: ['Poppins', 'Satoshi', 'ui-sans-serif', 'system-ui'],
        body: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['JetBrains Mono', 'IBM Plex Mono', 'ui-monospace', 'SFMono-Regular'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'md': '0 4px 12px 0 rgba(31, 41, 55, 0.08)',
        'lg': '0 8px 24px 0 rgba(31, 41, 55, 0.12)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ],
}