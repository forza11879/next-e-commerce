module.exports = {
  publicRuntimeConfig: {
    host: process.env.HOST,
    registerRedirectUrl: process.env.REGISTER_REDIRECT_URL,
    forgotPasswordRedirect: process.env.FORGOT_PASSWORD_REDIRECT,
  },
};
