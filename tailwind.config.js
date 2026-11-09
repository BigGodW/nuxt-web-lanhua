/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app.vue',
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.js',
    './plugins/**/*.js',
    './error.vue'
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', lg: '2rem', xl: '2.5rem' }
    },
    extend: {
      colors: {
        paper: {
          DEFAULT: '#F8F4EA',
          deep: '#EFE6D4',
          light: '#FCFAF4'
        },
        ink: {
          DEFAULT: '#1E2A24',
          soft: '#46544C',
          light: '#7A857E'
        },
        jade: {
          DEFAULT: '#2F4A3F',
          deep: '#1F3329',
          light: '#5C7A6B',
          mist: '#DDE5DE'
        },
        cinnabar: {
          DEFAULT: '#A63F32',
          light: '#C05B4B',
          deep: '#8A2F25'
        },
        gold: {
          DEFAULT: '#B99A5B',
          light: '#D6C097',
          deep: '#8E7238'
        }
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Source Han Serif SC"', '"Songti SC"', 'STSong', 'SimSun', 'serif'],
        sans: ['"PingFang SC"', '"Microsoft YaHei"', '"Hiragino Sans GB"', 'system-ui', 'sans-serif']
      },
      letterSpacing: {
        seal: '0.35em',
        wide2: '0.18em'
      },
      boxShadow: {
        scroll: '0 18px 45px -25px rgba(31, 42, 36, 0.45)',
        card: '0 10px 30px -18px rgba(31, 42, 36, 0.35)'
      },
      backgroundImage: {
        'paper-grain':
          'radial-gradient(circle at 18% 20%, rgba(185,154,91,0.10), transparent 45%), radial-gradient(circle at 82% 8%, rgba(47,74,63,0.08), transparent 40%), radial-gradient(circle at 60% 92%, rgba(166,63,50,0.06), transparent 45%)'
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        inkIn: {
          '0%': { opacity: '0', filter: 'blur(6px)', transform: 'scale(1.02)' },
          '100%': { opacity: '1', filter: 'blur(0)', transform: 'scale(1)' }
        }
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease both',
        'ink-in': 'inkIn 1s ease both'
      }
    }
  },
  plugins: []
}
