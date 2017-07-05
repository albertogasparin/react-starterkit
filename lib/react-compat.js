import fs from 'fs';
import path from 'path';
import requireHacker from 'require-hacker';

import config from './config';

/**
 * Enhance require to better support React env
 */

// expose React required globals
global.__CLIENT__ = false;
global.CONFIG_CLIENT = config.client;

/* istanbul ignore next */
if (!requireHacker.occupied_file_extensions.has('ignore extensions')) {
  const svgMatcher = /^assets\/icons\/(.+).svg$/;
  requireHacker.global_hook('ignore extensions', function(pathName, module) {
    // handle svg files as svg-sprite-loader does
    if (svgMatcher.test(pathName)) {
      let fullPath = path.join(
        config.webpack.resolve.alias.assets,
        pathName.slice(6)
      );
      let contents = fs.readFileSync(fullPath, 'utf8');
      let viewBox = contents.match(/viewBox="([\d\s.-]+)"/) || [];
      // this needs to match symbolId option (eg 'i-[name]')
      let id = 'i-' + pathName.match(svgMatcher)[1];
      return {
        source: `module.exports = { id: '${id}', viewBox: '${viewBox[1]}' }`,
        path: pathName,
      };
    }
    // ignore other non js extensions, so `import 'style.scss'` does not throw
    if (config.server.resolve.ignore.test(pathName)) {
      return { source: '', path: pathName };
    }
  });
}

// Add support Webpack-like require() aliasing
// so we can eventually provide server-specific modules
requireHacker.resolver(function(pathName, module) {
  for (let alias in config.webpack.resolve.alias) {
    if (pathName === alias || pathName.indexOf(alias + '/') === 0) {
      pathName = pathName.substring(alias.length);
      let stdPath = path.join(config.webpack.resolve.alias[alias], pathName);
      return requireHacker.resolve(stdPath, module);
    }
  }
});
