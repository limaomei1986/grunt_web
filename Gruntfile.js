module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	var serveStatic = require('serve-static'),
		API_NAME = 'api',
		proxyRewrite = {
			'^/provider/': '/provider/'
		},
		getReplaceOptions = function() {
			var DEVELOP_MODE = true,
				CONTEXT_PATH = '';
			return {
				patterns: [{
					match: 'DEVELOP_MODE',
					replacement: DEVELOP_MODE
				}, {
					match: 'CONTEXT_PATH',
					replacement: CONTEXT_PATH
				}, {
					match: 'API_NAME',
					replacement: API_NAME
				}]
			}

		};

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		copy: {
			js: {
				expand: true,
				cwd: 'client',
				src: ['app/**/*'],
				dest: '.tmp'
			}
		},
		watch: {
			options: {
				livereload: true
			},
			js: {
				files: 'app/**/*.js',
				tasks: ['copy:js', 'replace:js']
			}
		},
		connect: {
			options: {
				port: '9001',
				hostname: 'localhost',
				protocol: 'http',
				open: true,
				base: ['.tmp','client'],
				livereload: true
			},
			proxies: [{
				context: '/' + API_NAME,
				host: 'localhost',
				port: '9002',
				https: false,
				changeOrigin: true,
				rewrite: proxyRewrite
			}],
			default: {},
			proxy: {
				options: {
					middleware: function(connect, options) {
						if (!Array.isArray(options.base)) {
							options.base = [options.base];
						}

						// Setup the proxy
						var middlewares = [require('grunt-connect-proxy/lib/utils').proxyRequest];

						// Serve static files.
						options.base.forEach(function(base) {
							middlewares.push(serveStatic(base.path, base.options));
						});

						// Make directory browse-able.
						/*var directory = options.directory || options.base[options.base.length - 1];
						 middlewares.push(connect.directory(directory));
						 */
						return middlewares;
					}
				}
			}
		},
		replace: {
			options: getReplaceOptions(),
			js: {
				expand: true,
				cwd: '.tmp',
				src: ['**/*.js'],
				dest: '.tmp'
			}
		}
	});

	grunt.registerTask('staticServer', '启动静态服务......', function() {
		grunt.task.run([
			'copy',
			'replace',
			'connect:default',
			'watch'
		]);
	});

	grunt.registerTask('proxyServer', '启动代理服务......', function() {
		grunt.task.run([
			'copy',
			'replace',
			'configureProxies:proxy',
			'connect:proxy',
			'watch'
		]);
	});
}