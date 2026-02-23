import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '../public');

async function processImage(inputPath, outputPath, isJpeg = false) {
    try {
        const metadata = await sharp(inputPath).metadata();
        const size = Math.min(metadata.width, metadata.height);
        const radius = (size / 2) * 0.95; // 95% to crop slightly inside to remove white anti-aliasing bleed

        const svgMask = Buffer.from(`
            <svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
                <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="white" />
            </svg>
        `);

        const tempPath = outputPath + '.tmp.png';
        let pipeline = sharp(inputPath)
            .resize(size, size)
            .composite([{ input: svgMask, blend: 'dest-in' }])
            .png(); // Output as PNG with transparency

        await pipeline.toFile(tempPath);
        fs.renameSync(tempPath, outputPath);
        console.log(`Processed ${path.basename(outputPath)}`);
    } catch (error) {
        console.error(`Error processing ${inputPath}:`, error);
    }
}

async function run() {
    // Top bar mascot
    await processImage(
        path.join(PUBLIC_DIR, 'mascot/melody-icon.png'),
        path.join(PUBLIC_DIR, 'mascot/melody-icon.png')
    );

    // Favicon and PWA icons
    await processImage(
        path.join(PUBLIC_DIR, 'favicon.png'),
        path.join(PUBLIC_DIR, 'favicon.png')
    );
    await processImage(
        path.join(PUBLIC_DIR, 'icons/icon-192.png'),
        path.join(PUBLIC_DIR, 'icons/icon-192.png')
    );
    await processImage(
        path.join(PUBLIC_DIR, 'icons/icon-512.png'),
        path.join(PUBLIC_DIR, 'icons/icon-512.png')
    );

    // Admin header logo (convert jpg to png)
    await processImage(
        path.join(PUBLIC_DIR, 'melodylogo.jpg'),
        path.join(PUBLIC_DIR, 'melodylogo.png')
    );
}

run();
