import "express-session";

declare module "express-session" {
  interface SessionData {
    user_id: string; // string is safer for session stores
  }
}
