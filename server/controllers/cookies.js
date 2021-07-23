import cookie from 'cookie';

export const removeStripeCookieController = async (req, res) => {
  const { cookieName } = req.body;
  try {
    res.setHeader(
      'Set-Cookie',
      cookie.serialize(cookieName, '', {
        httpOnly: true,
        //   secure: process.env.NODE_ENV !== "development",
        expires: new Date(0),
        //   sameSite: "strict",
        path: '/',
      })
    );

    res.status(201).json({ ok: true });
  } catch (error) {
    console.log('cookies removeStripeCookieController error: ', error);
  }
};
