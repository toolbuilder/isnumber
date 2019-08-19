import { terser } from 'rollup-plugin-terser'

const input = 'src/isnumber.js'
const name = 'IsNumber'

export default [
  {
    input,
    output: {
      file: 'umd/isnumber.js',
      sourcemap: true,
      format: 'umd',
      name
    },
    plugins: []
  },
  {
    input,
    output: {
      file: 'umd/isnumber.min.js',
      sourcemap: true,
      format: 'umd',
      name
    },
    plugins: [terser()]
  }
]
