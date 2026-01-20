#!/usr/bin/env node

/**
 * Image Optimization Script
 * Optimizes mascot images to reduce file size while maintaining quality
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, '../public/mascot');
const outputDir = path.join(__dirname, '../public/mascot-optimized');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Get all PNG files
const files = fs.readdirSync(inputDir).filter(file => file.endsWith('.png'));

console.log(`🎨 Optimizing ${files.length} mascot images...\n`);

const optimizeImage = async (filename) => {
    const inputPath = path.join(inputDir, filename);
    const outputPath = path.join(outputDir, filename);

    const stats = fs.statSync(inputPath);
    const inputSize = (stats.size / 1024 / 1024).toFixed(2);

    try {
        await sharp(inputPath)
            .resize(512, 512, { // Resize to max 512x512
                fit: 'inside',
                withoutEnlargement: true
            })
            .png({
                quality: 85,
                compressionLevel: 9,
                adaptiveFiltering: true
            })
            .toFile(outputPath);

        const outputStats = fs.statSync(outputPath);
        const outputSize = (outputStats.size / 1024 / 1024).toFixed(2);
        const reduction = ((1 - outputStats.size / stats.size) * 100).toFixed(1);

        console.log(`✅ ${filename}`);
        console.log(`   ${inputSize} MB → ${outputSize} MB (${reduction}% reduction)`);
    } catch (error) {
        console.error(`❌ Error optimizing ${filename}:`, error.message);
    }
};

// Process all images
Promise.all(files.map(optimizeImage))
    .then(() => {
        console.log('\n🎉 Optimization complete!');
        console.log(`\n📁 Optimized images saved to: ${outputDir}`);
        console.log('\n📝 Next steps:');
        console.log('   1. Review optimized images');
        console.log('   2. If satisfied, run: mv public/mascot public/mascot-original && mv public/mascot-optimized public/mascot');
    })
    .catch(error => {
        console.error('❌ Optimization failed:', error);
        process.exit(1);
    });
