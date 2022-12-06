module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: 'standard',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    semi: [2, 'always']
  },
  globals: {
    axios: true,
    baseUrl: true,
    headers: true,
    timer: true,
    clearLogin: true,
    Swal: true,
    adminNav: true,
    c3: true,
    searchContent: true,
    shoppingCarIcon: true,
    validate: true
  }
};
