/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/app.html', './src/**/*.svelte'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/colors/themes")["[data-theme=light]"],
          'success-content': 'white',
          'accent-content': 'white',
          'info': 'hsl(204, 86%, 53%)',
          'info-content': 'white',
          'primary': '#F35D5D',
          'primary-content': 'white',
          'primary-focus': 'hsl(0, 69%, 60%)',
        },
      },
    ]
  }
}
