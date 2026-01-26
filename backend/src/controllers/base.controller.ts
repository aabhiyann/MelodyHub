import { Response, NextFunction } from 'express';
import cloudinary from "../lib/cloudinary.js";
import { UploadedFile } from "express-fileupload";

export class BaseController {
	handleSuccess(res: Response, data: unknown, code: number = 200) {
		return res.status(code).json(data);
	}

	handleError(next: NextFunction, error: unknown) {
		console.error("Controller Error:", error);
		return next(error);
	}

	async uploadToCloudinary(file: UploadedFile): Promise<string> {
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
