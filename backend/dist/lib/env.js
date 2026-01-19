import dotenv from "dotenv";
dotenv.config();
export const validateEnv = () => {
    const requiredEnv = [
        "CLERK_PUBLISHABLE_KEY",
        "CLERK_SECRET_KEY",
        "MONGODB_URI",
        "CLOUDINARY_CLOUD_NAME",
        "CLOUDINARY_API_KEY",
        "CLOUDINARY_API_SECRET",
        "GEMINI_API_KEY",
    ];
    const missing = requiredEnv.filter((key) => !process.env[key]);
    if (missing.length > 0) {
        console.error("❌ Critical Error: Missing Environment Variables:");
        missing.forEach((key) => console.error(`   - ${key}`));
        process.exit(1);
    }
    console.log("✅ Environment Configuration Validated");
};
