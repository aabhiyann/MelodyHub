import { Github, Twitter, Instagram } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="bg-black py-20 px-6 border-t border-white/10">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <div className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            🎵 MelodyHub
                        </div>
                        <p className="text-zinc-400 mb-6 max-w-sm">
                            Your music, reimagined. Join the next generation of music streaming with AI-powered discovery.
                        </p>
                        <div className="flex gap-4">
                            {[Github, Twitter, Instagram].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:bg-white/10 hover:text-white transition-colors">
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {[
                        { title: "Product", links: ["Features", "Pricing", "API", "Download"] },
                        { title: "Company", links: ["About Us", "Blog", "Careers", "Press"] },
                        { title: "Legal", links: ["Privacy", "Terms", "Cookies", "Licenses"] }
                    ].map((col, i) => (
                        <div key={i}>
                            <h4 className="text-white font-semibold mb-6 uppercase text-sm tracking-wider">{col.title}</h4>
                            <ul className="space-y-4">
                                {col.links.map((link, j) => (
                                    <li key={j}>
                                        <a href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-zinc-500 text-sm">© 2026 MelodyHub. All rights reserved.</p>
                    <div className="flex gap-6 text-sm text-zinc-500">
                        <a href="#" className="hover:text-white">EN</a>
                        <a href="#" className="hover:text-white">ES</a>
                        <a href="#" className="hover:text-white">FR</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
