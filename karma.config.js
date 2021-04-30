const suite = '**/__tests__/*Spec.js';

module.exports = function(karma) {
  karma.set({
    autoWatch: false,
    browsers: [ 'ChromeHeadless' ],
    browserNoActivityTimeout: 30000,
    files: [
      suite
    ],
    frameworks: [
      'mocha',
      'sinon-chai'
    ],
    preprocessors: {
      [ suite ]: [
        'webpack',
        'env'
      ]
    },
    reporters: [ 'spec' ],
    singleRun: true,
    webpack: {
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: 'babel-loader'
          },
          {
            test: /\.less$/,
            use: [
              'style-loader',
              {
                loader: 'css-loader',
                options: {
                  modules: {
                    localIdentName: '[path][name]__[local]',
                  }
                }
              },
              'less-loader'
            ]
          },
          {
            test: /\.(bpmn|dmn)$/,
            use: 'raw-loader'
          }
        ]
      },
      resolve: {
        alias: {
          'camunda-modeler-plugin-helpers/components': 'test/mocks/camunda-modeler-plugin-helpers/components',
          'camunda-modeler-plugin-helpers/react': 'react'
        },
        mainFields: [
          'browser',
          'dev:module',
          'main',
          'module'
        ],
        modules: [
          'node_modules',
          require('path').resolve(__dirname)
        ]
      },
      devtool: 'cheap-source-map'
    }
  });
};
