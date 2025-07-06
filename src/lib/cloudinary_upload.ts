import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFile = async (file: File): Promise<any> => {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadedFileData = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "hirea",
          access_mode: "public",
          resource_type: "auto",
        },
        (err, result) => {
          if (err) return reject(err);
          return resolve(result);
        }
      );
      stream.end(buffer);
    });

    return uploadedFileData;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Failed to upload file to Cloudinary.");
  }
};

export default uploadFile;
