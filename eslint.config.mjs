// ESLint flat config for Next.js - avoids @eslint/eslintrc circular ref bug
export default [
  {
    ignores: [".next/**", "node_modules/**", "public/**"],
  },
  {
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "@next/next/no-html-link-for-pages": "off",
    },
  },
];