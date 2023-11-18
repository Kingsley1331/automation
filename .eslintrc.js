module.exports = {
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".d.ts", ".ts", ".tsx"],
        moduleDirectory: ["node_modules", "src"],
      },
    },
  },
  plugins: ["prettier"],
  extends: ["eslint:recommended", "plugin:prettier/recommended", "prettier"],
  rules: {
    "prettier/prettier": "error",
  },
};
