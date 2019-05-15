// // const gulp = require('gulp');
// // const eslint = require('gulp-eslint');
// // const nodemon = require('gulp-nodemon');
// // const wiredep = require('wiredep').stream;
// // const inject = require('gulp-inject');
//
// import gulp from 'gulp';
// import eslint from 'gulp-eslint';
// import nodemon from 'gulp-nodemon';
// import wd from 'wiredep';
// import inject from 'gulp-inject';
// const wiredep = wd.stream;
//
// // Location of JS files
// const jsFiles = [
// 	'./*.js',
// 	'./controllers/*.js',
// 	'./lib/*.js',
// 	'./models/*.js',
// 	'./public/**/*.js',
// 	'./routes/*.js',
// 	'./test/*.js'
// ];
//
// // function to style/lint JS code
// gulp.task('lint', (next) => {
// 	gulp.src(jsFiles)
// 		.pipe(eslint())
// 		// .pipe(eslint.result(result => {
// 		// 	// Called for each ESLint result.
// 		// 	console.log(`ESLint result: ${result.filePath}`);
// 		// 	console.log(`# Messages: ${result.messages.length}`);
// 		// 	console.log(`# Warnings: ${result.warningCount}`);
// 		// 	console.log(`# Errors: ${result.errorCount}`);
// 		// }))
// 		.pipe(eslint.format())
// 		.pipe(eslint.failAfterError());
// 	next();
// });
//
// // function to inject bootstrap css/javascripts files into html page
// gulp.task('inject', () => {
// 	const injectSrc = gulp.src(['./public/css/*.css', './public/javascripts/*.js']);
//
// 	const injectOptions = {
// 		ignorePath: './public'
// 	};
//
// 	const options = {
// 		bowerJson: require('./bower.json'),
// 		directory: './bower_components',
// 		ignorePath: './bower_components'
// 	};
//
// 	return gulp.src('./views/*.pug')
// 		.pipe(wiredep(options))
// 		.pipe(inject(injectSrc, injectOptions))
// 		.pipe(gulp.dest('./views'));
// });
//
// gulp.task('start', (done) => {
// 	let stream = nodemon({
// 		script: 'app.js',
// 		ext: 'javascripts pug',
// 		env: { 'NODE_ENV': 'development' },
// 		delayTime: 1,
// 		watch: jsFiles,
// 		done: done
// 	});
//
// 	stream
// 		.on('restart',  () => {
// 			console.log('Restarting Server...');
// 		})
// 		.on('crash', function() {
// 			console.error('Application has crashed!\n');
// 			stream.emit('restart', 2);  // restart the server in 2 seconds
// 		});
// });
//
//
// gulp.task('build', (done) => {
// 	let stream =  nodemon({
// 		script: 'app.js',
// 		nodeArgs: ['$NODE_DEBUG_OPTION'],
// 		ext: 'javascripts pug',
// 		env: { 'NODE_ENV': 'development' },
// 		tasks: ['lint'],
// 		delayTime: 1,
// 		watch: jsFiles,
// 		done: done
// 	});
//
// 	stream
// 		.on('restart', () => {
// 			console.log('Restarting Server...');
// 		})
// 		.on('crash', () => {
// 			console.error('Application has crashed!\n');
// 			stream.emit('restart', 2);  // restart the server in 2 seconds
// 		});
// });
