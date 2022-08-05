import resolve from '@rollup/plugin-node-resolve';

export default [{
  input: 'bimviewer.js',
  output: [
    {
      format: 'esm',
      file: 'bundle.js'
    },
  ],
  plugins: [
    resolve(),
  ]
}, 
{
  input: 'index.js',
  output: [
    {
      format: 'esm',
      file: 'bundlemodellist.js'
    },
  ],
  plugins: [
    resolve(),
  ]
}];
