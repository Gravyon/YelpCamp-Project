import session from "express-session";

export const sessionConfig: session.SessionOptions = {
  name: "userSession",
  secret: process.env.SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
