import { createUploadthing } from "uploadthing/server";
import { CreateUploadOptions, type FileRouter } from "uploadthing/types";

const f = createUploadthing();

export const uploadRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
  }).onUploadComplete((data) => {
    console.log("Upload complete", data);
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
