var fs = require('fs');
var rollup = require('rollup');
var uglify = require('uglify-js');
var buble = require('rollup-plugin-buble');
var package = require('../package.json');
var banner =
    "/*!\n" +
    " * vue-auths v" + package.version + "\n" +
    " * https://github.com/Chantouch/vue-auths\n" +
    " * Released under the MIT License.\n" +
    " */\n";

rollup.rollup({
  entry: 'src/index.js',
  plugins: [buble()]
})
.then(function (bundle) {
  return write('dist/vue-auths.js', bundle.generate({
    format: 'umd',
    banner: banner,
    moduleName: 'VueAuth'
  }).code, bundle);
})
.then(function (bundle) {
  return write('dist/vue-auths.min.js',
    banner + '\n' + uglify.minify('dist/vue-auths.js').code,
  bundle);
})
.then(function (bundle) {
  return write('dist/vue-auths.es2015.js', bundle.generate({
    format: 'es',
    banner: banner,
    footer: 'export { VueAuth };'
  }).code, bundle);
})
.then(function (bundle) {
  return write('dist/vue-auths.common.js', bundle.generate({
    format: 'cjs',
    banner: banner
  }).code, bundle);
})
.catch(logError);

function write(dest, code, bundle) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(dest, code, function (err) {
      if (err) return reject(err);
      console.log(blue(dest) + ' ' + getSize(code));
      resolve(bundle);
    });
  });
}

function getSize(code) {
  return (code.length / 1024).toFixed(2) + 'kb';
}

function logError(e) {
  console.log(e);
}

function blue(str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m';
}
