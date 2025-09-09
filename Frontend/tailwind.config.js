/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Define our custom color palette
        primary: {
          DEFAULT: '#2563EB', // blue-600
          hover: '#1D4ED8',   // blue-700
        },
        feedback: {
          success: '#10B981', // green-500
          error: '#EF4444',   // red-500
        },
        text: {
          primary: '#111827',   // gray-900
          secondary: '#4B5563', // gray-600
        },
        background: '#F3F4F6', // gray-100
        surface: '#FFFFFF',    // white
      },
    },
  },
  plugins: [],
}