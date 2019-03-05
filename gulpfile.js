var gulp = require('gulp');
var eslint = require('gulp-eslint');
var nodemon = require('gulp-nodemon');

// Location of JS files
var jsFiles = [
	'./*.js',
	'./controllers/*.js',
	'./lib/*.js',
	'./models/*.js',
	'./public/**/*.js',
	'./routes/*.js'
];

// function to style/lint JS code
gulp.task('style', () => {
	return gulp.src(jsFiles)
		.pipe(eslint());
	// .pipe(eslint.result(result => {
	// 	// Called for each ESLint result.
	// 	console.log(`ESLint result: ${result.filePath}`);
	// 	console.log(`# Messages: ${result.messages.length}`);
	// 	console.log(`# Warnings: ${result.warningCount}`);
	// 	console.log(`# Errors: ${result.errorCount}`);
	// }));
	// 	.pipe(eslint.format())
	// 	.pipe(eslint.failAfterError());
});

// function to inject bootstrap css/js files into html page
gulp.task('inject', () => {
	var wiredep = require('wiredep').stream;
	var inject = require('gulp-inject');

	var injectSrc = gulp.src(['./public/css/*.css', './public/img/*/*', './public/js/*.js']);

	var injectOptions = {
		ignorePath: './public'
	};

	var options = {
		bowerJson: require('./bower.json'),
		directory: './bower_components',
		ignorePath: './bower_components'
	};

	return gulp.src('./views/*.pug')
		.pipe(wiredep(options))
		.pipe(inject(injectSrc, injectOptions))
		.pipe(gulp.dest('./views'));
});

gulp.task('start', (done) => {
	var stream = nodemon({
		script: './app.js',
		ext: 'js pug',
		env: { 'NODE_ENV': 'development' },
		delayTime: 1,
		watch: jsFiles,
		done: done
	});

	stream
		.on('restart',  () => {
			console.log('Restarting Server...');
		})
		.on('crash', function() {
			console.error('Application has crashed!\n');
			stream.emit('restart', 2);  // restart the server in 2 seconds
		});
});


gulp.task('serve', (done) => {
	var stream = nodemon({
		script: './app.js',
		ext: 'js pug',
		env: { 'NODE_ENV': 'development' },
		delayTime: 1,
		watch: jsFiles,
		tasks: ['style', 'inject'],
		done: done
	});

	stream
		.on('restart',  () => {
			console.log('Restarting Server...');
		})
		.on('crash', function() {
			console.error('Application has crashed!\n');
			stream.emit('restart', 2);  // restart the server in 2 seconds
		});
});
