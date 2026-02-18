import { useState, useRef } from 'react';
import { ArrowRight, Activity, CalendarCheck, Users, Dumbbell, Award, ChevronRight, Star, Instagram, Quote, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import PricingToggle from '../components/PricingToggle';
import PricingCard from '../components/PricingCard';
import TestimonialSection from '../components/TestimonialSection';
import FeaturesSection from '../components/FeaturesSection';

gsap.registerPlugin(ScrollTrigger);

const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
    }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2, // Stagger effect
            delayChildren: 0.3
        }
    }
};

// --- HELPER COMPONENTS ---

const ProgramBackgroundText = () => {
    const textRef = useRef(null);

    useGSAP(() => {
        gsap.to(textRef.current, {
            xPercent: -50, // Move left significantly
            ease: "none",
            scrollTrigger: {
                trigger: textRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.5
            }
        });
    });

    return (
        <div className="absolute top-20 left-0 w-full overflow-hidden pointer-events-none opacity-[0.03] z-0 select-none">
            <div ref={textRef} className="whitespace-nowrap flex gap-8">
                <span className="text-[15vw] font-black uppercase leading-none text-white">
                    Strength • Cardio • Power • Endurance • Flexibility •
                </span>
                <span className="text-[15vw] font-black uppercase leading-none text-white">
                    Strength • Cardio • Power • Endurance • Flexibility •
                </span>
            </div>
        </div>
    );
};

const ProgramCard = ({ program, idx }) => {
    return (
        <motion.div
            variants={fadeInUp}
            className="group relative h-[450px] bg-zinc-800 overflow-hidden border border-white/10 hover:border-orange-500 transition-all duration-500"
        >
            {/* Background Image with Zoom Effect */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                    src={program.img}
                    alt={program.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-3xl font-black uppercase text-white mb-1 leading-none">
                        {program.title}
                    </h3>
                    <h4 className="text-xl font-bold uppercase text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-400 mb-4">
                        {program.subtitle}
                    </h4>

                    <p className="text-gray-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 mb-6 line-clamp-2">
                        {program.desc}
                    </p>

                    <div className="flex items-center text-white font-bold uppercase tracking-wider text-xs gap-2 group-hover:gap-4 transition-all">
                        Explore Program
                        <ArrowRight className="w-4 h-4 text-orange-400" />
                    </div>
                </div>
            </div>

            {/* Number Indicator */}
            <div className="absolute top-0 right-0 p-6 z-20">
                <span className="text-6xl font-black text-white/5 group-hover:text-white/20 transition-colors">
                    0{idx + 1}
                </span>
            </div>
        </motion.div>
    );
};

const LandingPage = () => {
    const container = useRef(null);
    const bgRef = useRef(null);
    const textRef = useRef(null);
    const descRef = useRef(null);    // New ref for description
    const charRef = useRef(null);
    const contentRef = useRef(null);

    // About Section Refs
    const aboutSectionRef = useRef(null);
    const aboutImageRef = useRef(null);
    const aboutTextRef = useRef(null);
    const aboutBgTextRef = useRef(null);

    // Pricing & Programs Refs
    const programsSectionRef = useRef(null);

    // Pricing State
    const [isYearly, setIsYearly] = useState(false);

    useGSAP(() => {
        // Timeline for ScrollTrigger
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container.current,
                start: "top top",
                end: "+=100%", // Reduced scroll distance to keep it tighter
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
            }
        });

        // Entrance Animations (On Load)
        const entranceTl = gsap.timeline({
            onComplete: () => {
                ScrollTrigger.refresh();
            }
        });

        entranceTl.from([textRef.current, descRef.current], {
            y: 100,
            opacity: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: "power3.out"
        })
            .from(charRef.current, {
                opacity: 0,
                duration: 1.2,
                ease: "power3.out"
            }, "-=1")
            .from(contentRef.current, {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            }, "-=0.8");

        // Scroll Animations (Scrollytelling)
        tl.to(bgRef.current, {
            scale: 1.2,
            ease: "none"
        }, 0);

        tl.to(textRef.current, {
            scale: 1.5,
            yPercent: 30,
            opacity: 0.2,
            ease: "none"
        }, 0.1);

        tl.to(descRef.current, {
            yPercent: -50,
            opacity: 0,
            ease: "none"
        }, 0.15);

        tl.to(charRef.current, {
            yPercent: -5,
            scale: 1.05,
            ease: "none",
            immediateRender: false
        }, 0);

        tl.to(contentRef.current, {
            yPercent: -50,
            opacity: 0,
            ease: "none"
        }, 0.15);


        // --- ABOUT SECTION ANIMATIONS ---
        const aboutTl = gsap.timeline({
            scrollTrigger: {
                trigger: aboutSectionRef.current,
                start: "top 80%",
                end: "bottom top",
                toggleActions: "play reverse play reverse"
            }
        });

        // 1. Image Reveal (Unmask)
        aboutTl.fromTo(aboutImageRef.current,
            { clipPath: "inset(0 100% 0 0)", scale: 1.2 },
            { clipPath: "inset(0 0% 0 0)", scale: 1, duration: 1.5, ease: "power4.out" }
        );

        // 2. Text Stagger (Fade Up)
        aboutTl.from(aboutTextRef.current.children, {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
        }, "-=1");

        // 3. Parallax Background Text
        gsap.to(aboutBgTextRef.current, {
            xPercent: -20,
            scrollTrigger: {
                trigger: aboutSectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            }
        });

    }, { scope: container });

    return (
        <div className="bg-black font-sans overflow-x-hidden text-white">
            {/* GSAP Hero Section */}
            <section ref={container} className="relative h-[100svh] md:h-screen w-full overflow-hidden flex items-center justify-center bg-black">

                {/* Layer 1: Background */}
                <div ref={bgRef} className="absolute inset-0 z-0 scale-105">
                    <img
                        src="/img/bg_parallax.png"
                        alt="Background"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                </div>

                {/* Layer 2: Text Elements Behind Character */}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-start pt-28 md:pt-0 md:justify-center pointer-events-none pb-20">

                    {/* Main Title */}
                    <div ref={textRef} className="relative z-10">
                        <h1 className="text-[15vw] md:text-[18vw] font-black text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-transparent uppercase leading-none tracking-tighter select-none text-stroke drop-shadow-lg">
                            BRAWIJAYA
                        </h1>
                    </div>

                    {/* Description Background Text */}
                    <div ref={descRef} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl px-4 mt-32 md:mt-48 hidden md:block">
                        <div className="flex justify-between items-end w-full opacity-20 text-white font-bold tracking-widest uppercase text-xs md:text-sm">
                            <span>Forged in Sweat</span>
                            <span>Defined by Grit</span>
                        </div>
                    </div>
                </div>

                {/* Layer 3: Character (Front) */}
                <div
                    ref={charRef}
                    className="absolute bottom-20 md:bottom-0 z-20 h-[70%] md:h-[95%] w-auto flex justify-center pointer-events-none"
                    style={{
                        maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
                    }}
                >
                    <img
                        src="/img/Char parallax depan.png"
                        alt="Character"
                        className="h-full w-auto max-w-none md:max-w-full object-contain drop-shadow-2xl"
                    />
                </div>

                {/* Layer 4: Content Overlay (CTA) */}
                <div ref={contentRef} className="absolute bottom-0 z-30 w-full flex flex-col items-center justify-end pb-8 md:bottom-10 md:pb-10">

                    {/* Gradient Backround khusus Mobile */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent h-[50vh] mt-auto md:hidden -z-10"></div>

                    <div className="text-center space-y-4 md:space-y-6 max-w-2xl px-6">
                        <p className="text-gray-200 text-sm md:text-gray-300 md:text-xl font-light tracking-wide mb-2 md:mb-4 drop-shadow-md">
                            Experience the ultimate fitness revolution.<br className="md:hidden" /> Join the elite community.
                        </p>
                        <h2 className="text-2xl md:text-4xl font-bold text-white uppercase tracking-widest drop-shadow-lg mb-2">
                            Unleash Your Potential
                        </h2>

                        {/* Tombol CTA */}
                        <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center w-full md:w-auto">
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 bg-white text-black font-black uppercase tracking-wider hover:bg-gray-200 transition-all text-sm md:text-base skew-x-[-10deg] shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transform hover:scale-105"
                            >
                                <span className="skew-x-[10deg]">Join Now</span>
                            </Link>
                            <Link
                                to="/classes"
                                className="inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 border-2 border-white text-white font-black uppercase tracking-wider hover:bg-white hover:text-black transition-all text-sm md:text-base skew-x-[-10deg] backdrop-blur-sm"
                            >
                                <span className="skew-x-[10deg]">Programs</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Us Section - GSAP Refactored */}
            <section ref={aboutSectionRef} className="relative py-24 md:py-32 bg-gradient-to-b from-black via-zinc-900 to-zinc-900 overflow-hidden">
                {/* Background Text Decoration (Parallax) */}
                <div ref={aboutBgTextRef} className="absolute top-20 right-0 opacity-5 select-none pointer-events-none whitespace-nowrap z-0">
                    <h2 className="text-[20vw] font-black text-white leading-none tracking-tighter">
                        WHO WE ARE
                    </h2>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                        {/* Image Side */}
                        <div className="relative group">
                            {/* Decorative Frame */}
                            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-orange-500 z-20 hidden md:block"></div>

                            {/* Mask Container for Reveal Effect */}
                            <div ref={aboutImageRef} className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden bg-zinc-800">
                                <img
                                    src="/img/photo1.jpg"
                                    alt="About Gym"
                                    className="w-full h-full object-cover grayscale-0  transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            </div>

                            {/* Floating Stats Card */}
                            <div className="absolute -bottom-10 -right-4 md:-right-10 w-[70%] md:w-auto bg-white p-6 md:p-8 shadow-[0_0_30px_rgba(255,255,255,0.1)] z-30">
                                <div className="flex flex-col space-y-2">
                                    <span className="text-5xl md:text-6xl font-black text-black leading-none">05<span className="text-orange-600 text-4xl">+</span></span>
                                    <span className="text-xs md:text-sm font-bold tracking-[0.2em] text-gray-500 uppercase">Years of Excellence</span>
                                </div>
                            </div>
                        </div>

                        {/* Content Side */}
                        <div ref={aboutTextRef} className="flex flex-col justify-center">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="h-[2px] w-12 bg-orange-500"></div>
                                <span className="text-orange-400 font-bold tracking-widest uppercase text-sm">About Brawijaya Gym</span>
                            </div>

                            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
                                REDEFINING <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600">FITNESS STANDARDS</span>
                            </h2>

                            <p className="text-gray-400 text-lg leading-relaxed mb-6 font-light">
                                Brawijaya Gym bukan sekadar tempat latihan. Sejak 2024, kami hadir sebagai <strong className="text-white font-bold">laboratorium fisik</strong> untuk membentuk versi terbaik dari diri Anda.
                            </p>

                            <p className="text-gray-400 text-lg leading-relaxed mb-10 font-light">
                                Kami menggabungkan peralatan biomekanik presisi tinggi dengan atmosfer komunitas yang "raw" dan suportif. Tidak ada jalan pintas di sini, hanya keringat dan dedikasi.
                            </p>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
                                <div>
                                    <h3 className="text-3xl font-bold text-white mb-1">1,000+</h3>
                                    <p className="text-gray-500 text-xs uppercase tracking-widest">Active Warriors</p>
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold text-white mb-1">50+</h3>
                                    <p className="text-gray-500 text-xs uppercase tracking-widest">Elite Trainers</p>
                                </div>
                            </div>

                            <div className="mt-10">
                                <Link to="/about" className="group inline-flex items-center text-white font-bold uppercase tracking-wider hover:text-orange-400 transition-colors">
                                    <span>Learn More About Us</span>
                                    <span className="ml-2 bg-orange-600 group-hover:bg-orange-500 p-1 rounded-full transition-colors">
                                        <ChevronRight className="w-4 h-4 text-white" />
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Programs / Services Section - Scrollytelling */}
            <section ref={programsSectionRef} className="relative py-24 md:py-32 bg-gradient-to-b from-zinc-900 to-black text-white overflow-hidden">

                {/* 1. SCROLLYTELLING ELEMENT: Moving Background Text */}
                {/* Teks ini akan bergerak secara horizontal saat user scroll ke bawah */}
                <ProgramBackgroundText />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="max-w-xl"
                        >
                            <span className="flex items-center gap-2 text-orange-400 font-bold tracking-widest uppercase mb-4">
                                <span className="w-8 h-[2px] bg-orange-500 inline-block"></span>
                                Our Expertise
                            </span>
                            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-[0.9]">
                                Train Like <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600">A Pro</span>
                            </h2>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="hidden md:block"
                        >
                            <Link to="/classes" className="group flex items-center gap-4 text-white font-bold uppercase tracking-wider hover:text-orange-400 transition-colors">
                                <span className="text-sm">Explore All Classes</span>
                                <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-orange-600 group-hover:border-orange-600 transition-all duration-300">
                                    <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                </div>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Programs Grid */}
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {[
                            {
                                title: "Strength",
                                subtitle: "Training",
                                desc: "Build raw power with state-of-the-art free weights.",
                                img: "/img/photo2.jpg"
                            },
                            {
                                title: "HIIT",
                                subtitle: "& Cardio",
                                desc: "Burn fat and improve endurance with high-intensity intervals.",
                                img: "/img/cardio.jpg"
                            },
                            {
                                title: "Yoga",
                                subtitle: "& Recovery",
                                desc: "Find balance and flexibility with expert-led mobility classes.",
                                img: "/img/yoga.jpg"
                            }
                        ].map((program, idx) => (
                            <ProgramCard key={idx} program={program} idx={idx} />
                        ))}
                    </motion.div>

                    {/* Mobile CTA */}
                    <div className="mt-16 text-center md:hidden">
                        <Link to="/classes" className="inline-flex items-center text-white font-bold uppercase tracking-wider hover:text-orange-500 transition-colors">
                            See All Programs <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* REPLACEMENT: Membership / Pricing Section */}
            <section className="relative py-24 md:py-32 bg-black text-white border-t border-white/10 overflow-hidden">

                {/* Background Grid Decoration */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">

                    {/* Header & Toggle Switch */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                        <div className="max-w-xl">
                            <span className="text-orange-500 font-bold tracking-widest uppercase mb-2 block">Join The Elite</span>
                            <h2 className="text-4xl md:text-6xl font-black uppercase text-white leading-none">
                                Choose Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600">Battlefield</span>
                            </h2>
                        </div>

                        {/* Toggle Button (Monthly / Yearly) */}
                        <PricingToggle isYearly={isYearly} onToggle={setIsYearly} />
                    </div>

                    {/* Pricing Cards Grid */}
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start"
                    >

                        {/* Card 1: STARTER */}
                        <PricingCard
                            tier="STARTER"
                            price="350"
                            isYearly={isYearly}
                            desc="Perfect for beginners starting their journey."
                            features={["Access to Gym Floor", "Locker Room Access", "1 Free PT Session", "Free WiFi"]}
                            notIncluded={["Group Classes", "Sauna & Spa", "24/7 Access"]}
                        />

                        {/* Card 2: PRO (Highlighted) */}
                        <PricingCard
                            tier="PRO ATHLETE"
                            price="650"
                            isYearly={isYearly}
                            isPopular={true}
                            desc="The best value for serious transformation."
                            features={["All Starter Features", "Unlimited Group Classes", "Smart Workout Tracking App", "Sauna & Recovery Zone", "5 Guest Passes/Month"]}
                            notIncluded={["Private Nutritionist"]}
                        />

                        {/* Card 3: ELITE */}
                        <PricingCard
                            tier="ELITE"
                            price="950"
                            isYearly={isYearly}
                            desc="Full VIP treatment for zero compromise."
                            features={["All Pro Features", "24/7 VIP Access", "Weekly Private PT Session", "Nutrition Plan & Consultation", "Private Locker", "Laundry Service"]}
                        />

                    </motion.div>
                </div>
            </section>

            {/* Testimonials Section */}
            <TestimonialSection />

            {/* Features/Why Us Section (Revamped) */}
            <FeaturesSection />

            {/* CTA Section */}
            <section className="relative py-16 md:py-24 px-4 overflow-hidden border-t border-white/10">
                <div className="absolute inset-0 bg-orange-950 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                        alt="Background"
                        className="w-full h-full object-cover opacity-10 grayscale"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-orange-950/80 to-red-950/80"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-8 tracking-tight uppercase">
                        Siap untuk perubahan besar?
                    </h2>
                    <p className="text-xl text-orange-200 mb-10 max-w-2xl mx-auto font-light">
                        Bergabunglah hari ini dan dapatkan diskon 50% untuk 3 bulan pertama. Penawaran terbatas!
                    </p>
                    <Link
                        to="/login"
                        className="inline-flex items-center justify-center px-10 py-5 border border-transparent text-lg font-bold uppercase tracking-wider text-black bg-white hover:bg-gray-200 transition-all transform hover:scale-105 shadow-2xl skew-x-[-10deg]"
                    >
                        <span className="skew-x-[10deg] flex items-center">
                            Daftar Membership Sekarang
                            <ChevronRight className="ml-2 w-5 h-5" />
                        </span>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
