import React from 'react';
import { Dumbbell, Facebook, Twitter, Instagram, Mail, Heart, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-black border-t border-white/10 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center space-x-2 mb-6 group">
                            <img src="/img/Logo.png" alt="logo" className='w-12 h-auto transition-transform group-hover:scale-110 brightness-0 invert' />
                            <span className="font-bold text-xl text-white">Brawijaya Gym</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Platform gym premium untuk gaya hidup sehat Anda. Nikmati fasilitas modern, kelas eksklusif, dan pelatih profesional.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-bold text-white mb-6 font-display">Fasilitas</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link to="/classes" className="hover:text-orange-400 transition-colors">Jadwal Kelas</Link></li>
                            <li><Link to="/trainers" className="hover:text-orange-400 transition-colors">Personal Trainer</Link></li>
                            <li><Link to="/membership" className="hover:text-orange-400 transition-colors">Membership</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-white mb-6 font-display">Dukungan</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link to="/faq" className="hover:text-orange-400 transition-colors">FAQ</Link></li>
                            <li><Link to="/contact" className="hover:text-orange-400 transition-colors">Hubungi Kami</Link></li>
                            <li><Link to="/locations" className="hover:text-orange-400 transition-colors">Lokasi Gym</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-bold text-white mb-6 font-display">Ikuti Kami</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="p-3 bg-zinc-900 rounded-full text-gray-400 hover:text-orange-400 hover:bg-zinc-800 transition-all border border-white/10">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-3 bg-zinc-900 rounded-full text-gray-400 hover:text-orange-500 hover:bg-zinc-800 transition-all border border-white/10">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-3 bg-zinc-900 rounded-full text-gray-400 hover:text-orange-500 hover:bg-zinc-800 transition-all border border-white/10">
                                <Facebook className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                    <p>&copy; {currentYear} Jibril As a Developer. All rights reserved.</p>
                    <div className="flex items-center space-x-2 mt-4 md:mt-0">
                        <span>Made with</span>
                        <Bot className="w-4 h-4  fill-current animate-pulse" />
                        <span>for a healthier you</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
