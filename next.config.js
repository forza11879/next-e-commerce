module.exports = {
  env: {
    host: process.env.HOST,
    registerRedirectUrl: process.env.REGISTER_REDIRECT_URL,
    forgotPasswordRedirect: process.env.FORGOT_PASSWORD_REDIRECT,
    api: process.env.API,
  },
  future: {
    webpack5: true,
  },
  images: {
    domains: ['res.cloudinary.com'],
    // deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // loader: 'cloudinary',
    // path: 'https://res.cloudinary.com/dhvi46rif/image/upload/',
  },
};
