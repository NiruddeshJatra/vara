
import type { Config } from "tailwindcss";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
                vhara: {
                    50: '#F2FCE2',
                    100: '#E3F7C8',
                    200: '#C4EE91',
                    300: '#A5DE59',
                    400: '#7CC722',
                    500: '#5DAB1F',
                    600: '#4A8A19',
                    700: '#376913',
                    800: '#24480E',
                    900: '#122709',
                },
                earth: {
                    50: '#F9F5EA',
                    100: '#F2EBD6',
                    200: '#E6D6AD',
                    300: '#D9C185',
                    400: '#CCAD5C',
                    500: '#C09834',
                    600: '#9A7A29',
                    700: '#755B1F',
                    800: '#4F3D15',
                    900: '#2A1F0B',
                },
                leaf: {
                    50: '#F2FFED',
                    100: '#E5FFDB',
                    200: '#CBFFB7',
                    300: '#B1FF93',
                    400: '#97FF6F',
                    500: '#7DFF4B',
                    600: '#64CC3C',
                    700: '#4B992D',
                    800: '#32661E',
                    900: '#19330F',
                }
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                },
                'fade-up': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                },
                'slide-in-right': {
                    '0%': { transform: 'translateX(100%)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' }
                },
                'scale-in': {
                    '0%': { transform: 'scale(0.9)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' }
                },
                'leaf-sway': {
                    '0%, 100%': { transform: 'rotate(-2deg)' },
                    '50%': { transform: 'rotate(2deg)' }
                }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
                'fade-in': 'fade-in 0.5s ease-out',
                'fade-up': 'fade-up 0.6s ease-out',
                'slide-in-right': 'slide-in-right 0.5s ease-out',
                'scale-in': 'scale-in 0.3s ease-out',
                'leaf-sway': 'leaf-sway 4s ease-in-out infinite'
			},
            fontFamily: {
                'sans': ['Inter', 'SF Pro Display', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                'heading': ['SF Pro Display', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
            },
            boxShadow: {
                'subtle': '0 2px 10px rgba(0, 0, 0, 0.05)',
                'card': '0 4px 12px rgba(0, 0, 0, 0.05)',
                'hover': '0 10px 25px rgba(93, 171, 31, 0.15)',
                'button': '0 2px 5px rgba(93, 171, 31, 0.25)',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-pattern': 'linear-gradient(to right bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))',
                'nature-pattern': 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657l1.415 1.414L13.857 0H11.03zm32.284 0l6.9 6.9-1.414 1.414-6.9-6.9h1.414zM12.686 0L5.787 6.9l1.415 1.414 6.9-6.9h-1.415zM0 9.543l9.543 9.543-1.415 1.414L0 8.43V5.6zm60 .7L49.7 0h3.8l6.5 6.5v3.743zm0 3.8V36.3l-5.9-5.9v-3.8l5.9 5.9zM49.7 60L0 10.3v-3.8a63.45 63.45 0 0 1 5.9 5.9h3.8L0 0h60l-4.73 4.73 4.73 4.73h-3.8l-3.55-3.55a63.322 63.322 0 0 1 3.55-3.55v3.8a62.918 62.918 0 0 1-5.9 5.9l5.9 5.9v3.8l-5.9-5.9v-3.8l5.9 5.9v3.8l-5.9-5.9v-3.8l5.9 5.9v3.8l-6.5-6.5-9.4 9.4 9.4 9.4v3.8L29.6 29.6l-9.4 9.4 9.4 9.4v3.8l-9.4-9.4-9.4 9.4v-3.8l5.9-5.9h3.8L10.8 42.3a62.358 62.358 0 0 1-5.9-5.9l5.9-5.9h3.8L8.85 36.3a62.358 62.358 0 0 1-5.9 5.9l5.9 5.9v3.8L3.4 46.4 0 49.8V36.3l.9-.9a58.422 58.422 0 0 0 5.9 5.9l5.9-5.9v3.8l-5.9 5.9a58.422 58.422 0 0 0-5.9-5.9v-3.8l4.3 4.3 5.9-5.9 5.9 5.9v3.8l-5.9-5.9v-3.8l5.9 5.9v3.8l-5.9-5.9v-3.8l5.9 5.9v3.8l-5.9-5.9v-3.8l5.9 5.9 4.3-4.3v3.8l-4.3 4.3a58.776 58.776 0 0 0-5.9-5.9L6.7 54.3a58.776 58.776 0 0 0 5.9 5.9c-.64-.64-1.214-1.273-1.824-1.9l-4.076-4.073v-3.8l5.9 5.9v3.8a63.945 63.945 0 0 1-5.9-5.9L1.975 55v3.8L4.28 56.4 0 52.12V49.3l.975.97c.513-.3 1.073-.723 1.825-1.25t1.825-1.25a61.638 61.638 0 0 1-3.65 3.65v3.17L0 53.8v3.878l.97-.97 5.9 5.9v-3.8l-5.9-5.9L0 49.756V60h48.025l-6.175-6.175-9.4 9.4v-3.8l9.4-9.4-6.175-6.175H48.025L60 56.15v3.8L48.025 48.025 60 36.05v3.8L48.025 51.775l9.4 9.4L60 58.25v1.75H27.85l9.4-9.4H41l-9.4 9.4h12.75l-6.175-6.175L60 32l-5.9-5.9v-3.8l5.9 5.9v-3.8l-5.9-5.9 5.9-5.9v-3.8l-7.6 7.6h-3.8l7.6-7.6h-3.8l-7.6 7.6v3.8l7.6-7.6h3.8L42.3 29.6l7.6-7.6v3.8l-7.6 7.6v-3.8l7.6-7.6v3.8L41 34.7l-9.4-9.4v-3.8l9.4 9.4v-3.8l-9.4-9.4 9.4-9.4v-3.8l-12.75 12.75h-3.8l12.75-12.75h3.8L29.6 14.7l9.4-9.4h3.8L29.6 18.5l9.4 9.4v3.8l-9.4-9.4v3.8l9.4 9.4v-3.8l-9.4-9.4h-3.8l9.4 9.4v-3.8l-9.4-9.4-7.6 7.6v-3.8l7.6-7.6h-3.8l-7.6 7.6h3.8l7.6-7.6v3.8l-7.6 7.6v-3.8l7.6-7.6h-3.8l-7.6 7.6v-3.8l7.6-7.6-5.9-5.9h3.8l9.4 9.4-9.4 9.4v-3.8l9.4-9.4-5.9-5.9H18.5L12.53 6.13 12 5.6h3.8l2.25 2.25L24.9 0h3.8L12.1 16.65 0 4.55V0h60L48.35 11.65 60 23.295V27.1L48.35 15.45 60 3.8V0zM0 23.294l3.8-3.8v3.8l-3.8 3.8v-3.8z\' fill=\'%2322c55e\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
                'eco-gradient': 'linear-gradient(90deg, hsla(139, 70%, 75%, 1) 0%, hsla(63, 90%, 76%, 1) 100%)',
            }
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
