import { Response, NextFunction } from 'express';
import cloudinary from "../lib/cloudinary.js";
import { UploadedFile } from "express-fileupload";

export class BaseController {
	/**
	 * Send successful response
	 * @param res - Express response object
	 * @param data - Data to send
	 * @param code - HTTP status code (default: 200)
	 * @param useNewFormat - Use new standardized format (default: false for backward compatibility)
	 * 
	 * Old format: res.json(data)
	 * New format: res.json({ success: true, data })
	 */
	handleSuccess(
		res: Response,
		data: unknown,
		code: number = 200,
		useNewFormat: boolean = false
	) {
		if (!useNewFormat) {
			// Legacy format - backward compatible
			return res.status(code).json(data);
		}

		// New standardized format
		return res.status(code).json({
			success: true,
			data
		});
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
