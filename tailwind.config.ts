import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'Montserrat': ['Montserrat'],
        'SourceSanPro': ['SourceSanPro']
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'linear-gradient(180deg, #252A48 0%, #0C0F1B 100%);',
        'desktop-bg': 'linear-gradient(114deg, #414670 11.33%, #2B2C60 52.41%, #393F67 91.04%);'
      },
      colors: {
        'primary001': '#F5F6FF',
        'primary002': '#D9DBE8',
        'primary003': '#BFC3D9',
        'primary004': '#8C92BA',
        'primary005': '#737AAB',
        'primary006': '#5C6499',
        'primary007': '#4D5380',
        'primary008': '#383D5D',
        'primary009': '#737AAB',
        'primary010': '#252A48',
        'primary011': '#1C203B',
        'linkColor': '#B7C4FF',
        'white001': '#FFFFFF',
        'white002': 'rgba(255, 255, 255, 0.90)',
        'white003': 'rgba(255, 255, 255, 0.80)',
        'white004': 'rgba(255, 255, 255, 0.70)',
        'white005': 'rgba(255, 255, 255, 0.60)',
        'white006': 'rgba(255, 255, 255, 0.50)',
        'white007': 'rgba(255, 255, 255, 0.40)',
        'white008': 'rgba(255, 255, 255, 0.30)',
        'white009': 'rgba(255, 255, 255, 0.20)',
        'white010': 'rgba(255, 255, 255, 0.10)',
        'btn-default': '#B7C4FF',
        'btn-hover':'#ABB7EF',
        'btn-pressed':'#9EAAE0',
        'warning-bg': 'rgba(255, 236, 168, 0.16)',
        'success-bg': 'rgba(146, 251, 145, 0.08)',
        'hover':'rgba(255, 255, 255, 0.08)',
        'selected': 'rgba(255, 255, 255, 0.12)',
        'pressed': 'rgba(255, 255, 255, 0.16)',
        'success-function': '#1CB562',
        'error-function': '#E11717',
        'warning-function': '#FFECA8',
        'light-error-function': '#FF9696'
      },
      fontSize: {
        'hd1mb': ['32px', {lineHeight: '120%', fontWeight: 800}],
        'hd2mb': ['24px', {lineHeight: '120%', fontWeight: 800}],
        'hd3mb': ['18px', {lineHeight: '120%', fontWeight: 800}],
        'subheadermb': ['18px', {lineHeight: '120%', fontWeight: 700}],
        'body1mb': ['16px', {lineHeight: '160%', fontWeight: 400}],
        'body1bdmb': ['16px', {lineHeight: '160%', fontWeight: 700}],
        'labelmb': ['14px', {lineHeight: '160%', fontWeight: 400}],
        'labelbdmb': ['14px', {lineHeight: '160%', fontWeight: 700}],
        'buttonmb': ['16px', {lineHeight: '100%', fontWeight: 400}],
        'codemb': ['14px', {lineHeight: '160%', fontWeight: 400}],
      },
      animation: {
        'wiggle': 'wiggle 1s linear infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-15deg)' },
          '50%': { transform: 'rotate(15deg)' },
        }
      }
    },
  },
  plugins: [],
}
export default config
