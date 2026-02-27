/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                dark: {
                    base: '#050505',
                    card: '#111111',
                    border: '#222222',
                },
                neon: {
                    indigo: '#6366f1',
                    purple: '#a855f7',
                    emerald: '#10b981',
                }
            },
            animation: {
                'glow': 'glow 3s ease-in-out infinite alternate',
                'float': 'float 6s ease-in-out infinite',
                'slide-up': 'slideUp 0.5s ease-out forwards',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 10px rgba(99, 102, 241, 0.2)' },
                    '100%': { boxShadow: '0 0 20px rgba(168, 85, 247, 0.6)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                slideUp: {
                    '0%': { opacity: 0, transform: 'translateY(20px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [],
}
