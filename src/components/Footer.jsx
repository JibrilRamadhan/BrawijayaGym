import React from 'react';
import { Dumbbell, Facebook, Twitter, Instagram, Mail, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-50 border-t border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center space-x-2 mb-4">
                            <img src="/img/Logo.png" alt="logo" className='w-14 h-auto' />
                            <span className="font-bold text-xl text-gray-900">Brawijaya Gym</span>
                        </Link>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Platform gym premium untuk gaya hidup sehat Anda. Nikmati fasilitas modern, kelas eksklusif, dan pelatih profesional.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Fasilitas</h3>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li><Link to="/classes" className="hover:text-indigo-600">Jadwal Kelas</Link></li>
                            <li><Link to="/trainers" className="hover:text-indigo-600">Personal Trainer</Link></li>
                            <li><Link to="/membership" className="hover:text-indigo-600">Membership</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Dukungan</h3>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li><Link to="/faq" className="hover:text-indigo-600">FAQ</Link></li>
                            <li><Link to="/contact" className="hover:text-indigo-600">Hubungi Kami</Link></li>
                            <li><Link to="/locations" className="hover:text-indigo-600">Lokasi Gym</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Ikuti Kami</h3>
                        <div className="flex space-x-4 mb-4">
                            <a href="#" className="p-2 bg-white rounded-full border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-colors">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="p-2 bg-white rounded-full border border-slate-200 text-slate-400 hover:text-pink-600 hover:border-pink-600 transition-colors">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="#" className="p-2 bg-white rounded-full border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-colors">
                                <Facebook className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
                    <p>&copy; {currentYear} Brawijaya Gym Platform. All rights reserved.</p>
                    <div className="flex items-center space-x-1 mt-2 md:mt-0">
                        <span>Made with</span>
                        <Heart className="w-4 h-4 text-red-500 fill-current" />
                        <span>for a healthier you</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
