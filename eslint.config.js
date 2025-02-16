module.exports = [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
      eqeqeq: 'error',
      curly: 'error',
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'no-multi-spaces': 'error',
      'no-trailing-spaces': 'error',
      semi: ['error', 'always'],
    },
    ignores: ['node_modules/*'],
  },
];
