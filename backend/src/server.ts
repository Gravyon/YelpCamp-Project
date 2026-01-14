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

const allowedOrigins = [
  "http://localhost:5174", // Local Development
  process.env.FRONTEND_URL, // Production URL (from Render/Heroku env vars)
];
// ----------------------
// GLOBAL MIDDLEWARE
// ----------------------
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.maptiler.com"],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.maptiler.com",
          "https://fonts.googleapis.com",
        ],
        workerSrc: ["'self'", "blob:"],
        connectSrc: [
          "'self'",
          "https://api.maptiler.com",
          "https://*.uploadthing.com", // <--- Allow connecting to UT API
          "https://*.utfs.io", // <--- Allow connecting to UT CDN
        ],
        imgSrc: [
          "'self'",
          "blob:",
          "data:",
          "https://*.utfs.io", // <--- ALLOW UPLOADTHING IMAGES
          "https://images.unsplash.com", // Keep for seed data
          "https://api.maptiler.com",
        ],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
); // Security headers
app.use(compression());
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, // Required for cookies
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    // allowedHeaders: "Content-Type,Authorization", // doesn't allow uploads for some reason???
  })
); // Allow cross-origin requests
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
