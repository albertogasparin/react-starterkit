// Blacklist confusing globals set by ESLint browser: true setting (use them by prepending `window.`)
var restrictedGlobals = ['addEventListener', 'blur', 'close', 'closed', 'confirm', 'defaultStatus', 'defaultstatus', 'event', 'external', 'find', 'focus', 'frameElement', 'frames', 'history', 'innerHeight', 'innerWidth', 'length', 'location', 'locationbar', 'menubar', 'moveBy', 'moveTo', 'name', 'onblur', 'onerror', 'onfocus', 'onload', 'onresize', 'onunload', 'open', 'opener', 'opera', 'outerHeight', 'outerWidth', 'pageXOffset', 'pageYOffset', 'parent', 'print', 'removeEventListener', 'resizeBy', 'resizeTo', 'screen', 'screenLeft', 'screenTop', 'screenX', 'screenY', 'scroll', 'scrollbars', 'scrollBy', 'scrollTo', 'scrollX', 'scrollY', 'self', 'status', 'statusbar', 'stop', 'toolbar', 'top'];

module.exports = {

  /*
   * Environments
   */
  env: {
    es6: true,
    node: true,
    browser: true,
  },

  /*
   * Options
   */
  extends: 'eslint:recommended',

  parserOptions: {
    ecmaVersion: 2015,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      blockBindings: true,
      experimentalObjectRestSpread: true,
    },
  },

  /*
   * Plugins for additional rules
   */
  plugins: [
    'react',
    'import',
    'mocha',
  ],

  settings: {
    'import/resolver': 'webpack',
    'import/ignore': ['\.(scss|less|css)$'],
  },

  /*
   * Project wise globals
   */
  globals: {
    '__CLIENT__': true,
    'CONFIG_CLIENT': true,
  },

  /*
   * Rules
   */
  rules: {

    /* Code checks
    */
    'eqeqeq': ['error', 'smart'],
    'no-func-assign': ['error'],
    'no-inner-declarations': ['error'],
    'no-redeclare': ['error'],
    'no-shadow': ['error'],
    'no-eval': ['error'],
    'no-undef': ['error', { typeof: false }],
    'no-restricted-globals': ['error'].concat(restrictedGlobals),
    'valid-typeof': ['error'],
    'no-use-before-define': ['warn', 'nofunc'],
    'no-unused-vars': ['warn', { vars: 'local', args: 'none' }],
    'no-loop-func': ['warn'],
    'no-console': ['warn'],
    'no-alert': ['warn'],
    'no-debugger': ['warn'],
    'no-undefined': ['warn'],
    'no-process-env': ['warn'],
    'no-var': ['warn'],
    'no-empty': ['warn'],
    'require-yield': ['off'],

    /* Punctation rules
    */
    'semi': ['error', 'always'],
    'linebreak-style': ['error', 'unix'],
    'curly': ['error'],
    'comma-dangle': ['warn', 'always-multiline'],
    'quotes': ['warn', 'single'],

    /* Spacing rules
    */
    'no-spaced-func': ['error'],
    'no-irregular-whitespace': ['error'],
    'indent': ['warn', 2, { SwitchCase: 1, VariableDeclarator: { 'var': 2, 'let': 2, 'const': 3 } }],
    'brace-style': ['warn', '1tbs', { allowSingleLine: true }],
    'no-multi-spaces': ['warn'],
    'key-spacing': ['warn', { beforeColon: false, afterColon: true }],
    'keyword-spacing': ['warn'],
    'arrow-spacing': ['warn', { before: true, after: true }],
    'space-infix-ops': ['warn'],
    'object-curly-spacing': ['warn', 'always', { objectsInObjects: true, arraysInObjects: true }],
    'computed-property-spacing': ['warn', 'never'],
    'space-in-parens': ['warn', 'never'],
    'space-before-function-paren': ['warn', 'always'],
    'space-before-blocks': ['warn', 'always'],
    'eol-last': ['warn'],

    /* Coding helpers rules
    */
    'complexity': ['warn', 5],
    'max-depth': ['warn', 5],
    'max-nested-callbacks': ['warn', 4],
    'max-len': ['warn', 100, 4, { ignoreComments: true }],
    'valid-jsdoc': ['warn', { requireReturn: false, requireParamDescription: false, requireReturnDescription: false }],

    /* ES2015+ rules
    */
    'generator-star-spacing': ['warn'],
    'object-shorthand': ['warn', 'always'],
    'no-this-before-super': ['warn'],
    'no-duplicate-imports': ['warn', { includeExports: true }],

    /* React plugin rules
    */
    'react/no-children-prop': ['error'],
    'react/no-deprecated': ['error'],
    'react/no-direct-mutation-state': ['error'],
    'react/no-is-mounted': ['error'],
    'react/no-string-refs': ['error'],
    'react/no-unknown-property': ['warn'],
    'react/no-unused-prop-types': ['warn'],
    'react/prefer-es6-class': ['warn'],
    'react/prop-types': ['warn', { skipUndeclared: true }],
    'react/react-in-jsx-scope': ['error'],
    'react/require-render-return': ['error'],
    'react/style-prop-object': ['warn'],
    'react/void-dom-elements-no-children': ['error'],
    'react/jsx-closing-bracket-location': ['warn', 'tag-aligned'],
    'react/jsx-key': ['error'],
    'react/jsx-no-duplicate-props': ['error'],
    'react/jsx-no-undef': ['error'],
    'react/jsx-pascal-case': ['warn'],
    'react/jsx-tag-spacing': ['warn'],
    'react/jsx-uses-react': ['error'],
    'react/jsx-uses-vars': ['error'],

    /* Import plugin rules
    */
    'import/no-unresolved': ['error', { commonjs: true }],
    'import/named': ['error'],
    'import/namespace': ['error'],
    'import/no-absolute-path': ['error'],
    'import/export': ['error'],
    // 'import/no-named-as-default': ['error'],
    'import/no-extraneous-dependencies': ['error'],
    'import/first': ['warn'],


    /* Mocha plugin rules
    */
    'mocha/no-exclusive-tests': ['error'],
    'mocha/no-skipped-tests': ['warn'],
    'mocha/handle-done-callback': ['error'],
    'mocha/no-return-and-callback': ['error'],
    'mocha/valid-test-description': ['warn'],
    'mocha/no-sibling-hooks': ['error'],
    'mocha/no-top-level-hooks': ['error'],
  },

};
