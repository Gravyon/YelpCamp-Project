import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

// Keep this if you use it elsewhere
export const UploadButton = generateUploadButton({
  url: "http://localhost:3000/api/uploadthing",
});

// ADD THIS:
export const UploadDropzone = generateUploadDropzone({
  url: "http://localhost:3000/api/uploadthing",
});
