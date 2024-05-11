import Multer from "multer";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_PI_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
});

const handleUpload = async (file) => {
      const res = await cloudinary.uploader.upload(file, {
            resource_type: "auto",
      });
      return res;
};

export default handleUpload;

const storage = new Multer.memoryStorage();
export const uploadMulter = Multer({
      storage,
});
