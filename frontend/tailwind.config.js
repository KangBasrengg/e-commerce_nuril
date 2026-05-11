/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Primary accent — fresh green tones for grocery e-commerce
                primary: {
                    50:  '#EEFBF3',
                    100: '#D6F5E3',
                    200: '#B0EACC',
                    300: '#7ADAAE',
                    400: '#42C48A',
                    500: '#2DA96F',  // Main primary
                    600: '#1F8A59',
                    700: '#1A6E49',
                    800: '#18583C',
                    900: '#154833',
                },
                // Neutral palette per user recommendation
                neutral: {
                    bg:      '#F4F7F5',    // Light BG — soft green-white
                    surface: '#FFFFFF',    // Card surface
                    border:  '#E2E8E4',    // Soft border
                    'dark-bg':    '#1A231E',  // Dark mode BG
                    'dark-surface': '#243029', // Dark mode card
                    'dark-border':  '#2F3D35', // Dark mode border
                },
                text: {
                    primary:   '#2C3E35',   // Main text — green-grey dark
                    secondary: '#7F8C8D',   // Descriptions — bluish-grey
                    muted:     '#A8B2AD',   // Even lighter text
                    inverse:   '#F4F7F5',   // Text on dark bg
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            borderRadius: {
                'xl': '0.875rem',
                '2xl': '1.125rem',
                '3xl': '1.5rem',
            },
            boxShadow: {
                'card': '0 1px 3px rgba(44, 62, 53, 0.06), 0 1px 2px rgba(44, 62, 53, 0.04)',
                'card-hover': '0 10px 25px rgba(44, 62, 53, 0.08), 0 4px 10px rgba(44, 62, 53, 0.04)',
                'elevated': '0 20px 40px rgba(44, 62, 53, 0.1)',
                'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.06)',
            },
        },
    },
    plugins: [],
}
