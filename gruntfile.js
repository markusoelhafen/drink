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
    browserSync: {
      dev: {
        bsFiles: {
          src: ['app/*.css', 'app/*hmtl']
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
  grunt.loadNpmTasks('grunt-browser-sync');

  grunt.registerTask('default', ['browserSync', 'less', 'watch']);
};