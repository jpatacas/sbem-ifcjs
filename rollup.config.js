import resolve from '@rollup/plugin-node-resolve';

export default [{
  input: 'js/bimviewer.js',
  output: [
    {
      format: 'esm',
      file: 'js/bundle.js'
    },
  ],
  plugins: [
    resolve(),
  ]
}, 
{
  input: 'js/index.js',
  output: [
    {
      format: 'esm',
      file: 'js/bundlemodellist.js'
    },
  ],
  plugins: [
    resolve(),
  ]
}];
