module.exports = function(grunt) {
  require('jit-grunt')(grunt);

  grunt.initConfig({
    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          "source/app/index.css": "source/app/index.less" // destination file and source file
        }
      }
    },
    copy: {
      app: {
        files: [{
          expand: true,
          flatten: true,
          src: ['source/app/index.css', 
                'source/app/index.html', 
                'source/app/index.js', 
                'source/app/background.js',
                'source/app/drip.mp3',
                'source/manifest.json'
          ],
          dest: 'extension/'
        }, {
          expand: true,
          cwd: 'source/',
          src: ['**/icons/**'],
          dest: 'extension/'
        }],
      }
    },
    watch: {
      styles: {
        files: 'app/*.less', // which files to watch
        tasks: 'less'
      },
      app: {
        files: ['source/**'],
        tasks: 'copy'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['less', 'watch', 'copy']);
};