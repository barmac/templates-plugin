const path = require('path');
const pkg = require('./package.json');
const { LicenseWebpackPlugin } = require('license-webpack-plugin');

const production = process.env.NODE_ENV === 'production';

module.exports = {
  mode: production ? 'production' : 'development',
  entry: {
    script: './src/index.js'
  },
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
      }
    ]
  },
  plugins: production ? [
    new LicenseWebpackPlugin({
      outputFilename: 'dependencies.json',
      perChunkOutput: false,
      excludedPackageTest: isDevDependency,
      renderLicenses: (modules) => {
        const dependenciesList = modules.map(module => {
          return {
            name: module.name,
            version: module.packageJson.version,
            licenseType: module.licenseId,
            licenseText: module.licenseText
          };
        });

        return JSON.stringify(dependenciesList, null, 2);
      }
    })
  ] : [],
  output: {
    filename: 'script.bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    alias: {
      react: 'camunda-modeler-plugin-helpers/react'
    }
  },
  devtool: production ? 'source-map' : 'eval-source-map'
};

function isDevDependency(packageName) {
  return Object.keys(pkg.devDependencies).includes(packageName);
}
