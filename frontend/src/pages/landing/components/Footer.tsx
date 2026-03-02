import { Github, Twitter, Instagram } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="bg-black py-20 px-6 border-t border-white/10">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <div className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            🎵 MelodyHub
                        </div>
                        <p className="text-zinc-400 mb-6 max-w-sm">
                            Your music, reimagined. Join the next generation of music streaming with AI-powered discovery.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://github.com/aabhiyann" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:bg-white/10 hover:text-white transition-colors">
                                <Github size={20} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:bg-white/10 hover:text-white transition-colors">
                                <Twitter size={20} />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:bg-white/10 hover:text-white transition-colors">
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-6 uppercase text-sm tracking-wider">Product</h4>
                        <ul className="space-y-4">
                            <li><a href="#features" className="text-zinc-400 hover:text-white transition-colors text-sm">Features</a></li>
                            <li><a href="/search" className="text-zinc-400 hover:text-white transition-colors text-sm">Search Music</a></li>
                            <li><a href="/radio" className="text-zinc-400 hover:text-white transition-colors text-sm">Radio</a></li>
                            <li><a href="/browse" className="text-zinc-400 hover:text-white transition-colors text-sm">Browse</a></li>
                        </ul>
                    </div>

                    {/* Account - visible auth entry for returning users */}
                    <div>
                        <h4 className="text-white font-semibold mb-6 uppercase text-sm tracking-wider">Account</h4>
                        <ul className="space-y-4">
                            <li><a href="/sign-in" className="text-zinc-400 hover:text-white transition-colors text-sm">Sign in</a></li>
                            <li><a href="/sign-up" className="text-zinc-400 hover:text-white transition-colors text-sm">Sign up</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-zinc-500 text-sm">© 2026 MelodyHub. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};
