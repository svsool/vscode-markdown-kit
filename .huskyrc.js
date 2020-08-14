const disableLinters = Number(process.env.DISABLE_MD_KIT_HOOKS) === 1;

module.exports = {
  hooks: {
    'pre-commit': disableLinters ? undefined : 'lint-staged',
    'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
  },
};
