module.exports = {

  /*
   * Environments
   */
  "env": {
    "es6": true,
    "node": true,
    "browser": true,
  },

  /*
   * Options
   */
  "extends": "eslint:recommended",

  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true,
      "blockBindings": true,
      "experimentalObjectRestSpread": true,
    },
  },

  /*
   * Plugins for additional rules
   */
  "plugins": [
    "react",
    "mocha",
  ],

  /*
   * Project wise globals
   */
  "globals": {
    "__CLIENT__": true,
    "CONFIG_CLIENT": true,
  },

  /*
   * Rules
   */
  "rules": {

    /* Code checks
    */
    "eqeqeq": ["error", "smart"],
    "no-func-assign": ["error"],
    "no-inner-declarations": ["error"],
    "no-redeclare": ["error"],
    "no-shadow": ["error"],
    "no-eval": ["error"],
    "no-undef": ["error", { "typeof": false }],
    "valid-typeof": ["error"],
    "no-use-before-define": ["warn", "nofunc"],
    "no-unused-vars": ["warn", { "vars": "local", "args": "none" }],
    "no-loop-func": ["warn"],
    "no-console": ["warn"],
    "no-alert": ["warn"],
    "no-debugger": ["warn"],
    "no-undefined": ["warn"],
    "no-process-env": ["warn"],
    "no-var": ["warn"],
    "require-yield": ["off"],

    /* Punctation rules
    */
    "semi": ["error", "always"],
    "linebreak-style": ["error", "unix"],
    "curly": ["error"],
    "comma-dangle": ["warn", "always-multiline"],
    "quotes": ["warn", "single"],

    /* Spacing rules
    */
    "no-spaced-func": ["error"],
    "no-irregular-whitespace": ["error"],
    "indent": ["warn", 2, { "SwitchCase": 1, "VariableDeclarator": { "var": 2, "let": 2, "const": 3 } }],
    "brace-style": ["warn", "1tbs", { "allowSingleLine": true }],
    "no-multi-spaces": ["warn"],
    "key-spacing": ["warn", { "beforeColon": false, "afterColon": true }],
    "keyword-spacing": ["warn"],
    "arrow-spacing": ["warn", { "before": true, "after": true }],
    "space-infix-ops": ["warn"],
    "object-curly-spacing": ["warn", "always", { "objectsInObjects": true, "arraysInObjects": true }],
    "space-in-parens": ["warn", "never"],
    "eol-last": ["warn"],

    /* Coding helpers rules
    */
    "complexity": ["warn", 5],
    "max-depth": ["warn", 5],
    "max-nested-callbacks": ["warn", 4],
    "max-len": ["warn", 100, 4, { "ignoreComments": true }],

    /* ES2015+ rules
    */
    "generator-star-spacing": ["warn"],
    "object-shorthand": ["warn", "always"],
    "no-duplicate-imports": ["warn", { "includeExports": true }],

    /* React plugin rules
    */
    "react/jsx-closing-bracket-location": ["warn", "tag-aligned"],
    "react/jsx-key": ["error"],
    "react/jsx-no-duplicate-props": ["error"],
    "react/jsx-no-undef": ["error"],
    "react/jsx-pascal-case": ["error"],
    "react/jsx-space-before-closing": ["warn"],
    "react/jsx-uses-react": ["error"],
    "react/jsx-uses-vars": ["error"],
    "react/react-in-jsx-scope": ["error"],

    /* Mocha plugin rules
    */
    "mocha/no-exclusive-tests": ["error"],
    "mocha/no-skipped-tests": ["warn"],
    "mocha/handle-done-callback": ["error"],
    "mocha/no-return-and-callback": ["error"],
    "mocha/valid-test-description": ["warn"],
    "mocha/no-sibling-hooks": ["error"],
    "mocha/no-top-level-hooks": ["error"],
  },

};
