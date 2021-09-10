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
  //     // session.id = user.id;
  //     return Promise.resolve(session);
  //   },
  // },
  session: {
    jwt: true,
  },
  jwt: {
    // secret: 'asdcvbtjhm',
    signingKey: process.env.JwtSigningPrivateKey,
    // verificationOptions = {
    // maxTokenAge: `${30 * 24 * 60 * 60}s`, // e.g. maxAge `${30 * 24 * 60 * 60}s` = 30 days
    //   algorithms: ['HS512']
    // },
  },
  // callbacks: {
  //   async jwt(token, user) {
  //     console.log({ token, user });
  //     // if (user) {
  //     //   token.id = user.id;
  //     // }
  //     // return token;
  //   },
  //   async session(session, token) {
  //     console.log({ session, token });
  //     // session.user.id = token.id;
  //     // return session;
  //   },
  // },
});
