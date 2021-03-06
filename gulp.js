var ftp = require('vinyl-ftp');
var gutil = require('gulp-util');
var minimist = require('minimist');
var args = minimist(process.argv.slice(2));
gulp.task('deploy', function() {
  var remotePath = '/int/';
  var conn = ftp.create({
    host: 'int.vibranthealthnow.co.uk',
    user: args.user,
    password: args.password,
    log: gutil.log
  });
  gulp.src(['*'])
    .pipe(conn.newer(remotePath))
    .pipe(conn.dest(remotePath));
});