module.exports = function(grunt) {
  require('jit-grunt')(grunt);

  grunt.initConfig({
    watch: {
      styles: {
        files: ['app/*.less'], // which files to watch
        tasks: ['less'],
        options: {
          nospawn: true
        }
      },
      files: {
        files: ['./*'],
        tasks: ['copy'],
        options: {
          nospawn: true
        }
      }
    },
    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          "app/index.css": "app/index.less" // destination file and source file
        }
      }
    },
    copy: {
      app: {
        files: [{
          expand: true,
          flatten: true,
          src: ['app/index.css', 'app/index.html', 'app/index.js', 'app/background.js'],
          dest: 'extension/'
        }, {
          expand: true,
          src: ['manifest.json', 'icons/**'],
          dest: 'extension/'
        }],
      },
    },
    browserSync: {
      dev: {
        bsFiles: {
          src: ['app/*.css', 'app/*.hmtl', 'app/*.js', 'manifest.json']
        },
        options: {
          watchTask: true,
          server: './app'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-browser-sync');

  grunt.registerTask('default', ['browserSync', 'less', 'watch', 'copy']);
};