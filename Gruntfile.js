//Gruntgile.js
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // Mocha
        mocha: {
            all: {
                src: ['tests/testrunner.html'],
            },
            options: {
                run: true
            }
        },
        concat: {
            options: {
                // define a string to put between each file in the concatenated output
                separator: ';'
            },
            dist: {
                // the files to concatenate
                src: ['src/**/*.js'],
                // the location of the resulting JS file
                //dest: 'dist/<%= pkg.name %>.js'
                dest: 'dist/script.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    //'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                    'dist/script.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js', 'tests/**/*.js'],
            options: {
                // options here to override JSHint defaults
                globals: {
                    //jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        /*watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint', 'qunit']
        }*/
    });
    //load mocha task
    grunt.loadNpmTasks('grunt-mocha');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    //grunt.loadNpmTasks('grunt-contrib-qunit');
    //grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.registerTask('test', ['jshint','mocha']);
    grunt.registerTask('default', ['jshint','mocha','concat', 'uglify']);

};