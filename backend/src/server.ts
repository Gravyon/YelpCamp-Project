import express, { Application } from "express";
import { connectDB } from "./config/db";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import session from "express-session";
import campgroundRouter from "./routes/campgrounds.route";
import userRouter from "./routes/user.route";
import { errorHandler } from "./utils/errorHandler";
import cookieParser from "cookie-parser";
import { sessionConfig } from "./config/session";
import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from "./uploadthing/uploadthing";
import { mongoSanitize } from "./utils/mongoSanitize";
import { limiter } from "./utils/rateLimiter";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// ----------------------
// GLOBAL MIDDLEWARE
// ----------------------
app.use(helmet()); // Security headers
app.use(compression());
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Allow cross-origin requests
app.use(morgan("dev")); // Logger
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse form bodies
app.use(cookieParser()); // Allows backend to read cookies sent by browser
app.use(session(sessionConfig));
app.use(mongoSanitize);
// ----------------------
// ROUTES
// ----------------------
app.use("/api", limiter);
app.use(
  "/api/uploadthing",
  createRouteHandler({
    router: uploadRouter,
    config: { token: process.env.UPLOADTHING_TOKEN! },
  })
);
app.use("/api/campgrounds", campgroundRouter);
app.use("/api/users", userRouter);

// ----------------------
// ERROR HANDLER (ALWAYS LAST)
// ----------------------
app.use(errorHandler);

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});
