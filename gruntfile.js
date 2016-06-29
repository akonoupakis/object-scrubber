/**
 * @class Gruntfile
 */

module.exports = initSrc;

/**
 * Loads the grunt tasks of src.
 * These contain:
 * - Doc generation
 * - Code tests
 *
 * @memberof Gruntfile
 *
 * @param {Object} grunt The running grunt.
 * @returns {void}
 */
function initSrc( grunt )
{
    'use strict';

    const filePath = [
        '**/*.js',
		'!docs/**',
		'!node_modules/**',
		'!test/**'
    ];
    const jsdocPath = filePath;
    const jscsPath = filePath;
    const eslintPath = filePath;

    grunt.loadNpmTasks( 'grunt-jscs' );
    grunt.loadNpmTasks( 'grunt-eslint' );

    grunt.initConfig( {
        jscs : {
            cmd : {
                src : [jscsPath],
                options : {
                    config : '.jscsrc',
                    //esnext : false,
                    //verbose : true,
                    fix : false,
                    maxErrors : 9999,
                    force : false
                }
            },
            junit : {
                src : [jscsPath],
                options : {
                    config : '.jscsrc',
                    esnext : false,
                    verbose : true,
                    fix : false,
                    maxErrors : 9999,
                    force : true,
                    reporter : 'junit',
                    reporterOutput : 'junit.jscs.xml'
                }
            }
        },
        eslint : {
            cmd : {
                src : [eslintPath]
            },
            junit : {
                src : [eslintPath],
                options : {
                    outputFile : 'junit.eslint.xml',
                    format : 'junit',
                    quiet : true,
                    maxWarnings : 10
                }
            }
        }
    } );

    grunt.registerTask( 'check', ['jscs:cmd', 'eslint:cmd'] );
    grunt.registerTask( 'check_junit', ['jscs:junit', 'eslint:junit'] );

}
