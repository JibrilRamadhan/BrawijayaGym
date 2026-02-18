import React from 'react';
import { Dumbbell, Users, CalendarCheck, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    {
        id: "01",
        title: "Elite Equipment",
        subtitle: "BIOMECHANICALLY PRECISION",
        description: "Mesin dipilih dari seri tertinggi Technogym & Rogue Fitness. Dirancang presisi untuk mengisolasi otot target tanpa membebani sendi Anda.",
        image: "/img/photo2.jpg",
        icon: Dumbbell,
        stats: "50+ Machines"
    },
    {
        id: "02",
        title: "Expert Coaches",
        subtitle: "CERTIFIED & EXPERIENCED",
        description: "Coach kami bersertifikat internasional (APKI/NASM) dan berdedikasi membedah form latihan Anda rep-demi-rep untuk progres maksimal.",
        image: "/img/photo1.jpg",
        icon: Users,
        stats: "15+ Trainers"
    },
    {
        id: "03",
        title: "Diverse Classes",
        subtitle: "YOGA • HIIT • ZUMBA",
        description: "Dari ketenangan Yoga hingga adrenalin HIIT, semua dipimpin instruktur yang energinya tak pernah habis.",
        image: "/img/yoga.jpg",
        icon: CalendarCheck,
        stats: "30+ Classes/Week"
    },
    {
        id: "04",
        title: "Champion Mindset",
        subtitle: "COMMUNITY OF WINNERS",
        description: "Lingkungan membentuk siapa Anda. Di sini, Anda dikelilingi oleh orang-orang yang lapar akan kemajuan.",
        image: "/img/cardio.jpg",
        icon: Trophy,
        stats: "1k+ Members"
    }
];

const FeaturesSection = () => {
    return (
        <section className="bg-black text-white relative z-0">

            {/* --- MOBILE LAYOUT (Simple Stack) --- */}
            <div className="md:hidden py-16 px-6">
                <div className="mb-12">
                    <span className="text-orange-500 font-bold tracking-widest uppercase mb-2 block">Why Choose Us</span>
                    <h2 className="text-4xl font-black uppercase leading-none">Level Up Your <br /> Game</h2>
                </div>
                <div className="space-y-12">
                    {features.map((feature, idx) => (
                        <div key={idx} className="bg-zinc-900 border border-white/10 p-6">
                            <div className="mb-4 text-orange-500"><feature.icon size={32} /></div>
                            <h3 className="text-2xl font-bold uppercase mb-2">{feature.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- DESKTOP LAYOUT (Vertical Rows - Left Side Scrolls) --- */}
            {/* Each feature is a full-screen row with Left (Image) and Right (Text) */}
            <div className="hidden md:block w-full">
                {features.map((feature, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: "-20%" }}
                        transition={{ duration: 0.8 }}
                        className="flex min-h-screen w-full border-b border-white/5"
                    >
                        {/* LEFT COLUMN: IMAGE (Scrolls with the row) */}
                        <div className="w-1/2 h-screen relative overflow-hidden group border-r border-white/10">
                            <div className="absolute inset-0 bg-zinc-950">
                                <motion.img
                                    src={feature.image}
                                    alt={feature.title}
                                    initial={{ scale: 1.2 }}
                                    whileInView={{ scale: 1 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>

                                {/* Overlay Content on Left Image */}
                                <div className="absolute bottom-12 left-12 z-10">
                                    <div className="text-[120px] font-black leading-none text-white/10 select-none mb-4">
                                        {feature.id}
                                    </div>
                                    <div className="inline-block px-4 py-2 border border-orange-500/50 bg-orange-500/10 text-orange-400 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                                        {feature.stats}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: TEXT (Scrolls with the row) */}
                        <div className="w-1/2 min-h-screen flex flex-col justify-center px-16 lg:px-24 bg-black relative">
                            {/* Decorative Line matches height of content */}
                            <div className="absolute left-0 top-1/4 bottom-1/4 w-[1px] bg-gradient-to-b from-transparent via-orange-500/30 to-transparent"></div>

                            <div className="mb-6">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-[2px] bg-orange-500"></div>
                                    <span className="text-orange-500 font-bold tracking-widest uppercase text-sm">Why Choose Us</span>
                                </div>

                                <motion.div
                                    initial={{ x: 50, opacity: 0 }}
                                    whileInView={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                >
                                    <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-8 border border-white/10 text-orange-500 shadow-lg shadow-orange-900/10">
                                        <feature.icon size={32} />
                                    </div>

                                    <h3 className="text-5xl font-black uppercase mb-2 text-white">
                                        {feature.title}
                                    </h3>
                                    <h4 className="text-xl font-bold text-gray-500 uppercase mb-6 tracking-wide">
                                        {feature.subtitle}
                                    </h4>

                                    <p className="text-xl text-gray-400 leading-relaxed font-light max-w-lg">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

        </section>
    );
};

export default FeaturesSection;