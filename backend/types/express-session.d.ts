import "express-session";

declare module "express-session" {
  interface SessionData {
    user_id: string; // or ObjectId if you prefer, but string is safer for session stores
  }
}
