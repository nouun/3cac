const WARN = 1, ERR = 2;

module.exports = {
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module",
    "ecmaFeatures": { "globalReturn": false },
  },
  "env": {
    "node": true,
    "es6": true,
    "mocha": true,
  },

  "plugins": [ "@typescript-eslint" ],
  "extends": [ "eslint:recommended", "plugin:@typescript-eslint/recommended" ],
  "parser": "@typescript-eslint/parser",


  "rules": {
    // Suggestions
    "no-constructor-return": ERR,
    "default-case": ERR,
    "default-case-last": ERR,
    "guard-for-in": ERR,
    "max-depth": [ ERR, 5 ],
    "max-nested-callbacks": [ ERR, 2 ],
    "no-empty-function": ERR,
    "no-var": ERR,
    "prefer-const": ERR,
    "sort-imports": WARN,
    "yoda": WARN,

    // Formatting
    "@typescript-eslint/indent": [ "error", 2 ],
    "array-bracket-newline": [ ERR, { "multiline": true } ],
    "array-bracket-spacing": [ ERR, "always" ],
    "arrow-parens": ERR,
    "arrow-spacing": ERR,
    "brace-style": [ ERR, "1tbs", { "allowSingleLine": true } ],
    "comma-dangle": [ ERR, "always-multiline" ],
    "eol-last": [ ERR, "always" ],
    "key-spacing": ERR,
    "newline-per-chained-call": ERR,
    "max-len": [ ERR, 90 ],
    "no-multi-spaces": ERR,
    "no-multiple-empty-lines": ERR,
    "no-tabs": ERR,
    "no-trailing-spaces": ERR,
    "object-curly-newline": [ ERR, { "multiline": true } ],
    "object-curly-spacing": [ ERR, "always" ],
    "object-property-newline": ERR,
    "quotes": [ ERR, "double" ],
    "semi": [ ERR, "always" ],
    "semi-spacing": [
      ERR,
      {
        "before": false,
        "after": true,
      },
    ],
    "semi-style": [ ERR, "last" ],
    "space-infix-ops": ERR,
    "space-in-parens": ERR,
  },
};

