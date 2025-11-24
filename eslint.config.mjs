import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
  },
}).override('nuxt/javascript', {
  rules: {
    'no-console': 'off',
    'quotes': ['error', 'single'],
    'indent': [
      2,
      2,
      {
        SwitchCase: 1,
      },
    ],
    'vue/no-v-html': 'off',
    'no-trailing-spaces': 'error',
    'no-whitespace-before-property': 'error',
    'space-infix-ops': 'error',
    'vue/mustache-interpolation-spacing': ['error', 'always'],
    'vue/singleline-html-element-content-newline': ['error', {
      ignoreWhenNoAttributes: false,
    }],
    'no-multiple-empty-lines':
      ['error', { max: 2 },
      ],
    'vue/no-required-prop-with-default': [
      'error',
      {
        autofix: false,
      },
    ],
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: {
          max: 1,
        },
        multiline: {
          max: 1,
        },
      },
    ],
    'vue/first-attribute-linebreak': [
      'error',
      {
        singleline: 'beside',
        multiline: 'below',
      },
    ],
    'vue/html-closing-bracket-newline': [
      'error',
      {
        singleline: 'never',
        multiline: 'always',
      },
    ],
    'vue/multi-word-component-names': 'off',
    'vue/html-indent': ['error', 2],
    'vue/script-indent': ['error', 2, { baseIndent: 0, switchCase: 1 }],
    'import/prefer-default-export': 'off',
    '@typescript-eslint/no-unused-expressions': [
      'warn',
      {
        allowTernary: true,
        allowShortCircuit: true,
        allowTaggedTemplates: true,
        enforceForJSX: true,
      },
    ],
    'comma-dangle': ['error', 'always-multiline'],
  },
})
