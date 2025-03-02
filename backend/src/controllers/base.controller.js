import cloudinary from "../lib/cloudinary.js";

export class BaseController {
  handleSuccess(res, data, code = 200) {
    return res.status(code).json(data);
  }

  handleError(next, error) {
    console.error("Controller Error:", error);
    return next(error);
  }

  async uploadToCloudinary(file) {
    try {
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        resource_type: "auto",
      });
      return result.secure_url;
    } catch (error) {
      console.log("Error in uploadToCloudinary", error);
      throw new Error("Error uploading to cloudinary");
    }
  }
}