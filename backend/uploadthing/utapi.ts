import { UTApi } from "uploadthing/server";

// Initialize the API using your token from .env
export const utapi = new UTApi({
  token: process.env.UPLOADTHING_TOKEN!,
});
