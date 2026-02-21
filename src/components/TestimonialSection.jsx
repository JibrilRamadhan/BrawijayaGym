import React from 'react';
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { Link } from 'react-router-dom';

// 1. Data Dummy Diperbanyak agar Loop terlihat mulus
const testimonials = [
    { name: "Sarah J.", role: "Member since 2024", text: "Turun 10kg dalam 3 bulan! Coach-nya galak tapi hasilnya nyata.", rating: 5 },
    { name: "Budi Santoso", role: "Pro Athlete", text: "Alat biomekaniknya level internasional. Gak main-main.", rating: 5 },
    { name: "Jessica Tan", role: "Yoga Lover", text: "Komunitasnya suportif banget, gak ada yang judging di sini.", rating: 5 },
    { name: "Dimas A.", role: "Bodybuilder", text: "Lighting-nya bagus buat check form (dan selfie). Vibes-nya hardcore!", rating: 4 },
    { name: "Rina W.", role: "Zumba Class", text: "Musik kenceng, AC dingin, instruktur power full. Love it!", rating: 5 },
    { name: "Erik L.", role: "Morning Squad", text: "Buka 24 jam itu penyelamat buat pekerja shift kayak saya.", rating: 5 },
];

// 2. Component Kartu Testimoni Kecil
const TestimonialCard = ({ data }) => (
    <div className="w-[350px] md:w-[450px] bg-zinc-900/50 backdrop-blur-sm border border-white/10 p-6 md:p-8 rounded-none mx-4 hover:bg-zinc-800 hover:border-orange-500 transition-all duration-300 group cursor-default">
        <div className="flex justify-between items-start mb-6">
            <div className="flex gap-1">
                {[...Array(data.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
                ))}
            </div>
            <Quote className="w-8 h-8 text-white/20 group-hover:text-orange-500 transition-colors" />
        </div>

        <p className="text-gray-300 text-lg mb-6 leading-relaxed font-light">
            "{data.text}"
        </p>

        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center font-bold text-white text-sm">
                {data.name.charAt(0)}
            </div>
            <div>
                <h4 className="font-bold text-white text-sm uppercase tracking-wider">{data.name}</h4>
                <p className="text-gray-500 text-xs">{data.role}</p>
            </div>
        </div>
    </div>
);

// 3. Component Marquee Logic
const MarqueeRow = ({ items, direction = "left", speed = 20 }) => {
    return (
        <div className="flex overflow-hidden relative w-full py-4">
            <motion.div
                initial={{ x: direction === "left" ? 0 : "-50%" }}
                animate={{ x: direction === "left" ? "-50%" : 0 }}
                transition={{
                    duration: speed,
                    ease: "linear",
                    repeat: Infinity,
                }}
                className="flex flex-shrink-0"
            >
                {/* Render items 2x untuk efek infinite loop seamless */}
                {[...items, ...items].map((item, idx) => (
                    <TestimonialCard key={idx} data={item} />
                ))}
            </motion.div>
        </div>
    );
};

// 4. MAIN SECTION
const TestimonialSection = () => {
    return (
        <section className="py-24 md:py-32 bg-black overflow-hidden relative">
            {/* Smooth transition gradients */}
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-black to-transparent z-[1] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black to-transparent z-[1] pointer-events-none"></div>

            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-900/20 via-black to-black opacity-40 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center relative z-10">
                <span className="text-orange-500 font-bold tracking-widest uppercase mb-2 block">Community Voices</span>
                <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
                    Forged in <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Sweat</span>
                </h2>
            </div>

            {/* Marquee Container */}
            <div className="relative w-full">
                {/* Gradient Fade di Kiri & Kanan agar kartu tidak putus kasar */}
                <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none"></div>

                <div className="flex flex-col gap-4 md:gap-8">
                    {/* Row 1: Gerak ke Kiri */}
                    <MarqueeRow items={testimonials} direction="left" speed={30} />

                    {/* Row 2: Gerak ke Kanan (Opsional, pakai data sama atau beda) */}
                    <MarqueeRow items={[...testimonials].reverse()} direction="right" speed={35} />
                </div>
            </div>

            <div className="mt-16 text-center relative z-10">
                <p className="text-gray-500 text-sm mb-6">Join 1,000+ members transforming their lives</p>
                <Link to="/about" className="inline-block px-8 py-3 bg-white text-black font-bold uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-colors skew-x-[-10deg]">
                    <span className="skew-x-[10deg] block">Read More Stories</span>
                </Link>
            </div>
        </section>
    );
};

export default TestimonialSection;
