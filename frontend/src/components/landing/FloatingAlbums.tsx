/**
 * FloatingAlbums Component
 * Animated album covers floating and rotating in the background
 */

import { motion } from 'framer-motion';

const ALBUM_COVERS = [
    '/cover-images/1.jpg',
    '/cover-images/2.jpg',
    '/cover-images/3.jpg',
    '/cover-images/4.jpg',
    '/cover-images/5.jpg',
    '/cover-images/6.jpg',
];

interface FloatingAlbum {
    id: number;
    src: string;
    x: string;
    y: string;
    size: number;
    duration: number;
    delay: number;
    rotation: number;
}

const FLOATING_ALBUMS: FloatingAlbum[] = [
    { id: 1, src: ALBUM_COVERS[0], x: '10%', y: '15%', size: 120, duration: 20, delay: 0, rotation: -15 },
    { id: 2, src: ALBUM_COVERS[1], x: '85%', y: '25%', size: 100, duration: 18, delay: 2, rotation: 12 },
    { id: 3, src: ALBUM_COVERS[2], x: '15%', y: '70%', size: 140, duration: 22, delay: 1, rotation: 8 },
    { id: 4, src: ALBUM_COVERS[3], x: '75%', y: '65%', size: 90, duration: 19, delay: 3, rotation: -20 },
    { id: 5, src: ALBUM_COVERS[4], x: '50%', y: '10%', size: 110, duration: 21, delay: 1.5, rotation: 5 },
    { id: 6, src: ALBUM_COVERS[5], x: '40%', y: '80%', size: 95, duration: 17, delay: 2.5, rotation: -10 },
];

export const FloatingAlbums = () => {
    return (
        <div className="absolute inset-0 pointer-events-none opacity-20">
            {FLOATING_ALBUMS.map((album) => (
                <motion.div
                    key={album.id}
                    className="absolute"
                    style={{
                        left: album.x,
                        top: album.y,
                        width: album.size,
                        height: album.size,
                    }}
                    initial={{ opacity: 0, scale: 0, rotate: 0 }}
                    animate={{
                        opacity: [0, 1, 1, 0],
                        scale: [0.8, 1, 1, 0.8],
                        rotate: [album.rotation, album.rotation + 360],
                        y: [0, -30, 0],
                    }}
                    transition={{
                        duration: album.duration,
                        delay: album.delay,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    <img
                        src={album.src}
                        alt={`Album ${album.id}`}
                        className="w-full h-full object-cover rounded-2xl shadow-2xl"
                        style={{
                            filter: 'blur(2px) brightness(0.7)',
                        }}
                    />
                </motion.div>
            ))}
        </div>
    );
};
