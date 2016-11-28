/**
 * Created by Administrator on 2016/10/31.
 */
module.exports = function(grunt){

    grunt.initConfig({
        watch:{
            jade:{
                files:['views/**'],
                options:{
                    livereload:true
                }
            },
            js:{
                files:['public/js/**','models/**/*.js','schemas/**/*.js'],
                // tacks:['jshint'],
                options:{
                    livereload:true
                }
            }
        },
        nodemon:{
            dev:{
                options:{
                    file:'app.js',
                    args:[],
                    ignoredFiles:['README.md','node_module/**',".DS_Store"],
                    watchedExtensions:['./'],
                    debug:true,
                    delayTime:1,
                    env:{
                        PORT:3000
                    },
                    cwd:__dirname
                }
            }
        },
        concurrent:{
            tacks:['nodemon','watch'],
            options:{
                logConcurrentOutput:true
            }
        }
    })



    // 文件实时监听，入口文件实时监听，慢任务优化
    grunt.loadNpmTasks('grunt-contrib-watch')
    grunt.loadNpmTasks('grunt-nodemon')
    grunt.loadNpmTasks('grunt-concurrent')

    // 遇到错误跳过继续执行，注册默认任务
    grunt.option('force',true)
    grunt.registerTask('default',['concurrent'])
}