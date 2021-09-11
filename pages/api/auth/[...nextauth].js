import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

export default NextAuth({
  providers: [
    Providers.Google({
      clientId: process.env.googleId,
      clientSecret: process.env.googleSecret,
      authorizationUrl:
        'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code',
    }),
  ],
  database: process.env.mongoDbUrl,

  // callbacks: {
  //   session: async (session, user) => {
  //     console.log({ session, user });
  //     console.log('user.id: ', user.id);
  //     session.id = user.id;
  //     return Promise.resolve(session);
  //   },
  // },
  session: {
    jwt: true,
    // maxAge: 30 * 24 * 60 * 60, // e.g. maxAge `${30 * 24 * 60 * 60}s` = 30 days
  },
  jwt: {
    secret: 'INp8IvdIyeMcoGAgFGoA61DdBglwwSqnXJZkgz8PSnw',
    signingKey: process.env.JwtSigningPrivateKey,
    // maxAge: 30 * 24 * 60 * 60, // e.g. maxAge `${30 * 24 * 60 * 60}s` = 30 days
    verificationOptions: {
      maxTokenAge: `${30 * 24 * 60 * 60}s`,
      algorithms: ['HS512'],
    },
  },
  callbacks: {
    async jwt(token, user) {
      console.log({ token, user });
      // console.log('user.id before : ', user.id);
      if (user) {
        token.id = user.id;
      }
      // console.log('user.id after : ', user.id);

      return token;
    },
    async session(session, token) {
      console.log({ session, token });
      session.user.id = token.id;
      return session;
    },
  },
  // logger: {
  //   error(code, metadata) {
  //     console.error(code, metadata);
  //   },
  //   warn(code) {
  //     console.warn(code);
  //   },
  //   debug(code, metadata) {
  //     console.debug(code, metadata);
  //   },
  // },
});
