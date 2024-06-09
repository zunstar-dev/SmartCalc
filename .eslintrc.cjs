module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended', // Prettier와의 통합
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'jsx-a11y', 'prettier'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'prettier/prettier': 'error', // Prettier 규칙 적용
    '@typescript-eslint/no-unused-vars': ['warn'], // 사용되지 않는 변수 경고
    'jsx-a11y/anchor-is-valid': 'warn', // 접근성 규칙
  },
  settings: {
    react: {
      version: 'detect', // 자동으로 설치된 React 버전을 감지
    },
  },
};
