var shell = require('shelljs');

if(!shell.test('-e', 'dist/vendor/jquery')) {
  shell.mkdir('-p', 'dist/vendor/jquery');
}
shell.cp('node_modules/jquery/dist/jquery.min.js', 'dist/vendor/jquery/');


if(!shell.test('-e', 'dist/vendor/knockout')) {
  shell.mkdir('-p', 'dist/vendor/knockout');
}
shell.cp('node_modules/knockout/build/output/knockout-latest.js', 'dist/vendor/knockout/');

if(!shell.test('-e', 'dist/vendor/font-awesome')) {
  shell.mkdir('-p', 'dist/vendor/font-awesome');
}
shell.cp('-R', 'node_modules/font-awesome/css/', 'dist/vendor/font-awesome/');
shell.cp('-R', 'node_modules/font-awesome/fonts/', 'dist/vendor/font-awesome/');
