module.exports = function (grunt) {
    var path = require('path');
    var config = {};

    // dirs
    var JS = 'src/js';
    var EJS = 'src/ejs';
    var TEST = 'src/test';

    var useEjs = true;

    // js library alias
    var alias = {
        $: 'jquery',
        _: 'underscore'
    };


    // dev config
    var DEV = 'dev';
    var devTasks = [];
    var devSitePath = './';
    var devHttpPath = '/';


    // basic
    {
        config.pkg =  grunt.file.readJSON('package.json');

        grunt.loadNpmTasks('grunt-contrib-copy');
        config.copy = {
            dev: {
                files: [
                    /*
                    { // img
                        expand: true,
                        src: path.join(devSitePath, IMG, '*'),
                        dest: path.join(prodSitePath, IMG)
                    }
                     */
                ]
            }
        };
        devTasks.push('copy:' + DEV);
    }

    // este watch
    {
        grunt.loadNpmTasks('grunt-este-watch');
        grunt.registerTask('watch', 'esteWatch');

        config.esteWatch = {
            options: {
                dirs: [],
                livereload: { enabled: false }
            }
        };
    }

    // release
    {
        grunt.loadNpmTasks('grunt-release');

        config.release = {
            options: {
                file: 'bower.json',
                npm: false
            }
        };
    }

    // auto deps
    {
        grunt.loadNpmTasks('grunt-auto-deps');
        config.auto_deps = {};
    
        // dev
        config.auto_deps[DEV] = {
            dest: devSitePath,
            scripts: ['throttle'],
            loadPath: [JS + '/*.js'],
            ignore: [],
            forced: [],
            wrap: true,
            alias: alias
        };
        devTasks.push('auto_deps:' + DEV);

        // watch
        config.esteWatch.options.dirs.push(JS + '/*.js');
        config.esteWatch['js'] = function () { return 'auto_deps:' + DEV; };
    }
    
    
    // ejs
    if (useEjs) {
        grunt.loadNpmTasks('grunt-simple-ejs');
        config.ejs = {};

        var ejsDefaultConfig = {
            templateRoot: EJS,
            template: ['*.ejs'],
            include: [
                'bower_components/ejs-head-modules/*.ejs',
                'bower_components/ejs-sns-modules/*.ejs',
                EJS + '/layout/*.ejs'
            ],
            silentInclude: true
        };

        // dev
        config.ejs[DEV] = util.clone(ejsDefaultConfig, {
            dest: devSitePath,
            options: [
                'src/options.yaml'
            ]
        });
        devTasks.push('ejs:' + DEV);

        // watch
        config.esteWatch.options.dirs.push(EJS + '/*.ejs');
        config.esteWatch.options.dirs.push(EJS + '/**/*.ejs');
        config.esteWatch['ejs'] = function () { return 'ejs:' + DEV; };
    
    }
    
    // html validation
    {
        grunt.loadNpmTasks('grunt-html-validation');
        config.validation = {
            options: {
            },
            files: {
                src: [ devSitePath + '*.html' ]
            }
        };
    }

    // server
    {
        grunt.loadNpmTasks('grunt-koko');
    
        config.koko = config.koko || {};
        config.koko[DEV] = {
            root: path.resolve(devSitePath, path.relative(devHttpPath, '/')),
            openPath: devHttpPath
        };
    
        grunt.registerTask('server', ['koko:' + DEV]);
    }
    
    // set as task
    grunt.registerTask(DEV, devTasks);

    // init
    grunt.initConfig(config);
    grunt.registerTask('default', [DEV]);
};


var util = {
    clone: function (obj, opts) {
        opts = opts || {};

        var newObj = {};

        var key;
        for (key in obj) {
            if (typeof obj[key] == 'object') {
                if (isNaN(obj[key].length)) {
                    newObj[key] = util.clone(obj[key], opts[key]);
                } else {
                    newObj[key] = opts[key] || obj[key];
                }
            } else {
                newObj[key] = opts[key] || obj[key];
            }
        }
        for (key in opts) {
            if (!obj[key]) {
                newObj[key] = opts[key];
            }
        }

        return newObj;
    }
};

