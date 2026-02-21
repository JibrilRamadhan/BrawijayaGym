import { useRef, useState } from 'react';
import { ArrowRight, Activity, CalendarCheck, Users, Dumbbell, Award, ChevronRight, Star, Instagram, Quote, Check, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import TestimonialSection from '../components/TestimonialSection';

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
            staggerChildren: 0.2,
            delayChildren: 0.3
        }
    }
};

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

// --- HELPER COMPONENTS ---

const ProgramBackgroundText = () => {
    const textRef = useRef(null);

    useGSAP(() => {
        gsap.to(textRef.current, {
            xPercent: -50,
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
    const cardRef = useRef(null);
    const imgRef = useRef(null);
    const overlayRef = useRef(null);
    const numberRef = useRef(null);
    const revealRef = useRef(null);

    useGSAP(() => {
        const card = cardRef.current;
        const delayStart = idx * 0.15; // Delay agar munculnya bergantian (stagger) antar card

        // 1. Buat SATU timeline khusus untuk card ini
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: card,
                start: 'top 5%',
                end: 'bottom -25%', // Berakhir OUT SAAT Bawah Card MELEWATI Atas Layar (Hilang Sepenuhnya)
                toggleActions: 'play reverse play reverse', // Memastikan animasi masuk & keluar di kedua arah scroll
            }
        });

        // 2. Masukkan semua animasi ke dalam timeline ini
        // Animasi Block Reveal (Hitam memudar)
        tl.fromTo(revealRef.current,
            { scaleY: 1 },
            { scaleY: 0, duration: 1, ease: 'power2.inOut' },
            delayStart // Parameter posisi/delay di dalam timeline
        );

        // Animasi Scale Image
        tl.fromTo(imgRef.current,
            { scale: 1.15 },
            { scale: 1, duration: 1.5, ease: 'power2.out' },
            delayStart // Dimulai bersamaan dengan Block Reveal
        );

        // Animasi Text (Teks muncul satu per satu)
        tl.fromTo(overlayRef.current.children,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power2.out', force3D: true },
            delayStart + 0.3 // Dimulai sesaat setelah cover mulai terbuka
        );

        // 3. Animasi Parallax Nomor (Biarkan terpisah karena dia memakai "scrub" / mengikuti scroll secara presisi)
        gsap.to(numberRef.current, {
            yPercent: -20,
            force3D: true,
            scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.5
            }
        });

    }, { scope: cardRef });

    return (
        <div ref={cardRef} className="relative h-[450px] bg-zinc-900 overflow-hidden border border-white/10 group">
            <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                    ref={imgRef}
                    src={program.img}
                    alt={program.title}
                    className="w-full h-full object-cover grayscale opacity-70 will-change-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90" />

                {/* Reveal Block Panel */}
                <div
                    ref={revealRef}
                    className="absolute inset-0 bg-zinc-950 origin-bottom z-10 will-change-transform"
                />
            </div>

            <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end pointer-events-none">
                <div ref={overlayRef}>
                    <h3 className="text-3xl font-black uppercase text-white mb-1 leading-none will-change-transform">
                        {program.title}
                    </h3>
                    <h4 className="text-xl font-bold uppercase text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-400 mb-4 will-change-transform">
                        {program.subtitle}
                    </h4>
                    <p className="text-gray-400 text-sm mb-6 line-clamp-2 will-change-transform">
                        {program.desc}
                    </p>
                    <div className="flex items-center text-white font-bold uppercase tracking-wider text-xs gap-2 transition-colors group-hover:text-orange-400 pointer-events-auto">
                        Explore Program
                        <ArrowRight className="w-4 h-4 text-orange-400" />
                    </div>
                </div>
            </div>

            <div className="absolute top-0 right-0 p-6 z-10 pointer-events-none">
                <span ref={numberRef} className="text-6xl font-black text-white/5 will-change-transform inline-block">
                    0{idx + 1}
                </span>
            </div>
        </div>
    );
};

const LandingPage = () => {
    const container = useRef(null);
    const bgRef = useRef(null);
    const textRef = useRef(null);
    const descRef = useRef(null);
    const charRef = useRef(null);
    const contentRef = useRef(null);
    const heroSectionRef = useRef(null);

    // About Section Refs
    const aboutSectionRef = useRef(null);
    const aboutImageRef = useRef(null);
    const aboutTextRef = useRef(null);
    const aboutBgTextRef = useRef(null);

    // Programs Refs
    const programsSectionRef = useRef(null);

    // Pricing Section Refs
    const pricingSectionRef = useRef(null);
    const pricingGridRef = useRef(null);
    const pricingHeaderRef = useRef(null);
    const pricingCardsRef = useRef(null);

    // Features Section Refs
    const featuresSectionRef = useRef(null);

    useGSAP(() => {
        // Hero Timeline
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: heroSectionRef.current,
                start: "top top",
                end: "+=100%",
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
            }
        });

        const entranceTl = gsap.timeline({
            onComplete: () => { ScrollTrigger.refresh(); }
        });

        entranceTl.from([textRef.current, descRef.current], {
            y: 100, opacity: 0, duration: 1.2, stagger: 0.1, ease: "power3.out"
        })
            .from(charRef.current, { opacity: 0, duration: 1.2, ease: "power3.out" }, "-=1")
            .from(contentRef.current, { y: 50, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.8");

        tl.to(bgRef.current, { scale: 1.2, ease: "none" }, 0);
        tl.to(textRef.current, { scale: 1.5, yPercent: 30, opacity: 0.2, ease: "none" }, 0.1);
        tl.to(descRef.current, { yPercent: -50, opacity: 0, ease: "none" }, 0.15);
        tl.to(charRef.current, { yPercent: -5, scale: 1.05, ease: "none", immediateRender: false }, 0);
        tl.to(contentRef.current, { yPercent: -50, opacity: 0, ease: "none" }, 0.15);

        // --- ABOUT SECTION ---
        const aboutTl = gsap.timeline({
            scrollTrigger: {
                trigger: aboutSectionRef.current,
                start: "top 80%",
                end: "bottom top",
                toggleActions: "play reverse play reverse"
            }
        });
        aboutTl.fromTo(aboutImageRef.current,
            { clipPath: "inset(0 100% 0 0)", scale: 1.2 },
            { clipPath: "inset(0 0% 0 0)", scale: 1, duration: 1.5, ease: "power4.out" }
        );
        aboutTl.from(aboutTextRef.current.children, {
            y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out"
        }, "-=1");
        gsap.to(aboutBgTextRef.current, {
            xPercent: -20,
            scrollTrigger: { trigger: aboutSectionRef.current, start: "top bottom", end: "bottom top", scrub: 1 }
        });

        // --- PRICING SECTION ---
        if (pricingHeaderRef.current) {
            gsap.fromTo(pricingHeaderRef.current.children,
                { x: -60, opacity: 0 },
                {
                    x: 0, opacity: 1, stagger: 0.15, duration: 1, ease: 'power3.out',
                    scrollTrigger: { trigger: pricingSectionRef.current, start: 'top 80%', toggleActions: 'play none none reverse' }
                }
            );
        }
        if (pricingCardsRef.current) {
            gsap.fromTo(pricingCardsRef.current.querySelectorAll('.pricing-card'),
                { y: 80, opacity: 0 },
                {
                    y: 0, opacity: 1, stagger: 0.12, duration: 0.8, ease: 'power3.out',
                    scrollTrigger: { trigger: pricingSectionRef.current, start: 'top 65%', toggleActions: 'play none none reverse' }
                }
            );
        }
        if (pricingGridRef.current) {
            gsap.to(pricingGridRef.current, {
                yPercent: -15,
                scrollTrigger: { trigger: pricingSectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 0.5 }
            });
        }

        // --- FEATURES SCROLL SECTION ---
        if (featuresSectionRef.current) {
            // Mengambil elemen menggunakan class, jauh lebih aman dari React array ref!
            const images = gsap.utils.toArray('.feature-img-container', featuresSectionRef.current);
            const texts = gsap.utils.toArray('.feature-text-row', featuresSectionRef.current);

            if (images.length > 0 && texts.length > 0) {
                // 1. Kunci (Pin) gambar di kiri agar diam
                ScrollTrigger.create({
                    trigger: featuresSectionRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    pin: ".pinned-image-container",
                    pinSpacing: false
                });

                // Set gambar pertama agar langsung tampil
                gsap.set(images[0], { opacity: 1, zIndex: 10 });
                const firstBadge = images[0].querySelector('.feature-badge');
                if (firstBadge) gsap.set(firstBadge, { opacity: 1, scale: 1 });

                // 2. Atur trigger untuk setiap baris teks
                texts.forEach((textRow, i) => {

                    // Trigger untuk MENGGANTI GAMBAR (Tepat saat teks di tengah layar)
                    ScrollTrigger.create({
                        trigger: textRow,
                        start: "top 50%",
                        end: "bottom 50%",
                        onEnter: () => switchActiveImage(i),
                        onEnterBack: () => switchActiveImage(i),
                    });

                    // Trigger untuk ANIMASI TEKS MASUK
                    gsap.fromTo(textRow.querySelectorAll('.animate-item'),
                        { x: 50, opacity: 0 },
                        {
                            x: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out',
                            scrollTrigger: {
                                trigger: textRow,
                                start: 'top 65%', // Animasi teks mulai saat hampir ke tengah
                                toggleActions: 'play reverse play reverse'
                            }
                        }
                    );

                    // Animasi garis vertikal (dikembalikan karena hilang di snippet user)
                    gsap.fromTo(textRow.querySelector('.animate-line'),
                        { scaleY: 0 },
                        {
                            scaleY: 1, duration: 1, ease: 'power2.out',
                            scrollTrigger: {
                                trigger: textRow,
                                start: 'top 65%',
                                toggleActions: 'play reverse play reverse'
                            }
                        }
                    );
                });

                // Fungsi murni GSAP untuk mengganti gambar tanpa ngelag
                function switchActiveImage(index) {
                    images.forEach((img, i) => {
                        const innerImg = img.querySelector('img');
                        const badge = img.querySelector('.feature-badge');

                        if (i === index) {
                            gsap.to(img, { opacity: 1, zIndex: 10, duration: 0.5, ease: "power2.out", overwrite: "auto" });
                            if (innerImg) gsap.fromTo(innerImg, { scale: 1.1 }, { scale: 1, duration: 1.5, ease: "power2.out", overwrite: "auto" });
                            if (badge) gsap.to(badge, { scale: 1, opacity: 1, duration: 0.4, delay: 0.2, overwrite: "auto" });
                        } else {
                            gsap.to(img, { opacity: 0, zIndex: 0, duration: 0.5, ease: "power2.out", overwrite: "auto" });
                            if (badge) gsap.to(badge, { scale: 0, opacity: 0, duration: 0.2, overwrite: "auto" });
                        }
                    });
                }
            }
        }

    }, { scope: container });

    return (
        <div ref={container} className="bg-black font-sans overflow-x-hidden text-white relative">
            {/* GSAP Hero Section */}
            <section ref={heroSectionRef} className="relative h-[100svh] md:h-screen w-full overflow-hidden flex items-center justify-center bg-black">

                <div ref={bgRef} className="absolute inset-0 z-0 scale-105">
                    <img src="/img/bg_parallax.png" alt="Background" className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                </div>

                <div className="absolute inset-0 z-10 flex flex-col items-center justify-start pt-28 md:pt-0 md:justify-center pointer-events-none pb-20">
                    <div ref={textRef} className="relative z-10">
                        <h1 className="text-[15vw] md:text-[18vw] font-black text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-transparent uppercase leading-none tracking-tighter select-none text-stroke drop-shadow-lg">
                            BRAWIJAYA
                        </h1>
                    </div>

                    <div ref={descRef} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl px-4 mt-32 md:mt-48 hidden md:block">
                        <div className="flex justify-between items-end w-full opacity-20 text-white font-bold tracking-widest uppercase text-xs md:text-sm">
                            <span>Forged in Sweat</span>
                            <span>Defined by Grit</span>
                        </div>
                    </div>
                </div>

                <div
                    ref={charRef}
                    className="absolute bottom-20 md:bottom-0 z-20 h-[70%] md:h-[95%] w-auto flex justify-center pointer-events-none"
                    style={{
                        maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
                    }}
                >
                    <img src="/img/Char parallax depan.png" alt="Character" className="h-full w-auto max-w-none md:max-w-full object-contain drop-shadow-2xl" />
                </div>

                <div ref={contentRef} className="absolute bottom-0 z-30 w-full flex flex-col items-center justify-end pb-8 md:bottom-10 md:pb-10">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent h-[50vh] mt-auto md:hidden -z-10"></div>
                    <div className="text-center space-y-4 md:space-y-6 max-w-2xl px-6">
                        <p className="text-gray-200 text-sm md:text-gray-300 md:text-xl font-light tracking-wide mb-2 md:mb-4 drop-shadow-md">
                            Experience the ultimate fitness revolution.<br className="md:hidden" /> Join the elite community.
                        </p>
                        <h2 className="text-2xl md:text-4xl font-bold text-white uppercase tracking-widest drop-shadow-lg mb-2">
                            Unleash Your Potential
                        </h2>
                        <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center w-full md:w-auto">
                            <Link to="/register" className="inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 bg-white text-black font-black uppercase tracking-wider transition-all text-sm md:text-base skew-x-[-10deg] shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:bg-gray-200">
                                <span className="skew-x-[10deg]">Join Now</span>
                            </Link>
                            <Link to="/classes" className="inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 border-2 border-white text-white font-black uppercase tracking-wider transition-all text-sm md:text-base skew-x-[-10deg] backdrop-blur-sm hover:bg-white/10">
                                <span className="skew-x-[10deg]">Programs</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Us Section */}
            <section ref={aboutSectionRef} className="relative py-24 md:py-32 bg-gradient-to-b from-black via-zinc-900 to-zinc-900 overflow-hidden">
                <div ref={aboutBgTextRef} className="absolute top-20 right-0 opacity-5 select-none pointer-events-none whitespace-nowrap z-0">
                    <h2 className="text-[20vw] font-black text-white leading-none tracking-tighter">WHO WE ARE</h2>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                        <div className="relative">
                            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-orange-500 z-20 hidden md:block"></div>
                            <div ref={aboutImageRef} className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden bg-zinc-800">
                                <img src="/img/photo1.jpg" alt="About Gym" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            </div>
                            <div className="absolute -bottom-10 -right-4 md:-right-10 w-[70%] md:w-auto bg-white p-6 md:p-8 shadow-[0_0_30px_rgba(255,255,255,0.1)] z-30">
                                <div className="flex flex-col space-y-2">
                                    <span className="text-5xl md:text-6xl font-black text-black leading-none">05<span className="text-orange-600 text-4xl">+</span></span>
                                    <span className="text-xs md:text-sm font-bold tracking-[0.2em] text-gray-500 uppercase">Years of Excellence</span>
                                </div>
                            </div>
                        </div>

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

            {/* Programs / Services Section — NO HOVER, GSAP only */}
            <section ref={programsSectionRef} className="relative py-24 md:py-32 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black text-white overflow-hidden">
                <ProgramBackgroundText />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false, amount: 0.2 }}
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
                            viewport={{ once: false, amount: 0.2 }}
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "Strength", subtitle: "Training", desc: "Build raw power with state-of-the-art free weights.", img: "/img/photo2.jpg" },
                            { title: "HIIT", subtitle: "& Cardio", desc: "Burn fat and improve endurance with high-intensity intervals.", img: "/img/cardio.jpg" },
                            { title: "Yoga", subtitle: "& Recovery", desc: "Find balance and flexibility with expert-led mobility classes.", img: "/img/yoga.jpg" }
                        ].map((program, idx) => (
                            <ProgramCard key={idx} program={program} idx={idx} />
                        ))}
                    </div>

                    <div className="mt-16 text-center md:hidden">
                        <Link to="/classes" className="inline-flex items-center text-white font-bold uppercase tracking-wider hover:text-orange-400 transition-colors">
                            See All Programs <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Membership / Pricing Section — HOVER KEPT */}
            <section ref={pricingSectionRef} className="relative py-24 md:py-32 bg-gradient-to-b from-black via-zinc-950 to-black text-white overflow-hidden">
                {/* Smooth transition gradients */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-[1] pointer-events-none"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div ref={pricingGridRef} className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-[1] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div ref={pricingHeaderRef} className="max-w-xl mb-16">
                        <span className="text-orange-500 font-bold tracking-widest uppercase mb-2 block">Join The Elite</span>
                        <h2 className="text-4xl md:text-6xl font-black uppercase text-white leading-none">
                            Choose Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600">Battlefield</span>
                        </h2>
                    </div>

                    <div ref={pricingCardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                        {/* Trial */}
                        <div className="pricing-card relative p-8 flex flex-col bg-black border border-white/10 hover:border-white/30 transition-all duration-300 group">
                            <div className="mb-8">
                                <h3 className="text-sm font-bold tracking-widest uppercase mb-4 text-gray-400">Trial</h3>
                                <span className="text-4xl font-black text-white tracking-tighter">GRATIS</span>
                                <p className="text-gray-400 text-sm mt-4 leading-relaxed border-b border-white/10 pb-6">Coba dulu 24 jam gratis. Tanpa komitmen.</p>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                {["Akses Gym 24 Jam", "Locker Room", "Free WiFi"].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                        <div className="mt-0.5 p-0.5 rounded-full bg-zinc-800 text-gray-400 group-hover:bg-white group-hover:text-black transition-colors"><Check className="w-3 h-3" /></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/register" className="w-full py-4 font-bold uppercase tracking-wider text-sm border border-white text-white text-center block hover:bg-white hover:text-black transition-all duration-300">Mulai Trial</Link>
                        </div>

                        {/* Harian */}
                        <div className="pricing-card relative p-8 flex flex-col bg-black border border-white/10 hover:border-white/30 transition-all duration-300 group">
                            <div className="mb-8">
                                <h3 className="text-sm font-bold tracking-widest uppercase mb-4 text-gray-400">Visit Harian</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-bold text-gray-400">Rp</span>
                                    <span className="text-5xl font-black text-white tracking-tighter">35<span className="text-3xl">K</span></span>
                                    <span className="text-gray-500 font-medium">/hari</span>
                                </div>
                                <p className="text-gray-400 text-sm mt-4 leading-relaxed border-b border-white/10 pb-6">Fleksibel tanpa berlangganan.</p>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                {["Akses Gym Full", "Locker Room", "Free WiFi", "Pilih Jumlah Hari"].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                        <div className="mt-0.5 p-0.5 rounded-full bg-zinc-800 text-gray-400 group-hover:bg-white group-hover:text-black transition-colors"><Check className="w-3 h-3" /></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/register" className="w-full py-4 font-bold uppercase tracking-wider text-sm border border-white text-white text-center block hover:bg-white hover:text-black transition-all duration-300">Beli Day Pass</Link>
                        </div>

                        {/* Member Bulanan (Popular) */}
                        <div className="pricing-card relative p-8 flex flex-col bg-zinc-900 border-orange-500 shadow-[0_0_40px_rgba(249,115,22,0.15)] lg:scale-105 z-10 border group">
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-orange-600 text-white text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-sm shadow-lg">Most Popular</div>
                            <div className="mb-8">
                                <h3 className="text-sm font-bold tracking-widest uppercase mb-4 text-orange-400">Member Bulanan</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-bold text-gray-400">Rp</span>
                                    <span className="text-5xl font-black text-white tracking-tighter">150<span className="text-3xl">K</span></span>
                                    <span className="text-gray-500 font-medium">/bulan</span>
                                </div>
                                <p className="text-gray-400 text-sm mt-4 leading-relaxed border-b border-white/10 pb-6">Paket terbaik. Akses penuh 30 hari.</p>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                {["Akses Full 30 Hari", "Semua Kelas Group", "Locker & Sauna", "Workout Tracking", "1 Sesi PT Gratis"].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                        <div className="mt-0.5 p-0.5 rounded-full bg-orange-600 text-white"><Check className="w-3 h-3" /></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/register" className="w-full py-4 font-bold uppercase tracking-wider text-sm border bg-orange-600 border-orange-600 text-white text-center block hover:bg-orange-700 transition-all duration-300">Gabung Sekarang</Link>
                        </div>

                        {/* Member Tahunan */}
                        <div className="pricing-card relative p-8 flex flex-col bg-black border border-white/10 hover:border-white/30 transition-all duration-300 group">
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-sm shadow-lg">Hemat 17%</div>
                            <div className="mb-8">
                                <h3 className="text-sm font-bold tracking-widest uppercase mb-4 text-gray-400">Member Tahunan</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-bold text-gray-400">Rp</span>
                                    <span className="text-5xl font-black text-white tracking-tighter">1,5<span className="text-3xl">Jt</span></span>
                                    <span className="text-gray-500 font-medium">/tahun</span>
                                </div>
                                <p className="text-xs text-green-400 mt-1 font-bold">= Rp 125K/bulan (hemat Rp 300K)</p>
                                <p className="text-gray-400 text-sm mt-4 leading-relaxed border-b border-white/10 pb-6">VIP treatment 365 hari.</p>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                {["Semua Fitur Bulanan", "365 Hari Non-Stop", "Priority Booking", "Nutrition Consult", "Private Locker", "Laundry Service"].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                        <div className="mt-0.5 p-0.5 rounded-full bg-zinc-800 text-gray-400 group-hover:bg-white group-hover:text-black transition-colors"><Check className="w-3 h-3" /></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/register" className="w-full py-4 font-bold uppercase tracking-wider text-sm border border-white text-white text-center block hover:bg-white hover:text-black transition-all duration-300">Gabung Tahunan</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <TestimonialSection />

            {/* Features/Why Us Section — Sticky GSAP Scroll */}
            <section ref={featuresSectionRef} className="bg-black text-white relative z-0">
                {/* --- MOBILE LAYOUT (No Pinning) --- */}
                <div className="md:hidden py-16 px-6">
                    <div className="mb-12">
                        <span className="text-orange-500 font-bold tracking-widest uppercase mb-2 block">Why Choose Us</span>
                        <h2 className="text-4xl font-black uppercase leading-none">Level Up Your <br /> Game</h2>
                    </div>
                    <div className="space-y-12">
                        {features.map((feature, idx) => (
                            <div key={idx} className="bg-zinc-900 border border-white/10 p-6">
                                <img src={feature.image} alt={feature.title} className="w-full h-48 object-cover mb-6 grayscale" />
                                <div className="mb-4 text-orange-500"><feature.icon size={32} /></div>
                                <h3 className="text-2xl font-bold uppercase mb-2">{feature.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- DESKTOP LAYOUT (Sticky GSAP) --- */}
                <div className="hidden md:flex w-full relative">

                    {/* LEFT: PINNED IMAGE CONTAINER */}
                    <div className="pinned-image-container w-1/2 h-screen border-r border-white/10 overflow-hidden bg-zinc-950 flex-shrink-0">
                        {features.map((feature, i) => (
                            <div
                                key={`img-${i}`}
                                className="feature-img-container absolute inset-0 w-full h-full opacity-0" // Opacity awal 0
                            >
                                <img
                                    src={feature.image}
                                    alt={feature.title}
                                    className="w-full h-full object-cover grayscale opacity-60"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>

                                <div className="absolute bottom-12 left-12 z-10">
                                    <div className="text-[120px] font-black leading-none text-white/10 select-none mb-4">
                                        {feature.id}
                                    </div>
                                    <div className="feature-badge opacity-0 scale-0 inline-block px-4 py-2 border border-orange-500/50 bg-orange-500/10 text-orange-400 text-xs font-bold uppercase tracking-widest backdrop-blur-md transform">
                                        {feature.stats}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT: SCROLLING TEXT LIST */}
                    <div className="w-1/2 ml-auto flex flex-col bg-black">
                        {features.map((feature, i) => (
                            <div
                                key={`text-${i}`}
                                className="feature-text-row h-screen flex flex-col justify-center px-16 lg:px-24 relative"
                            >
                                {/* h-screen di atas memastikan teks SELALU berada pas di tengah tinggi layar */}
                                <div className="animate-line absolute left-0 top-1/4 bottom-1/4 w-[1px] bg-gradient-to-b from-transparent via-orange-500/30 to-transparent"></div>

                                <div>
                                    <div className="animate-item flex items-center gap-4 mb-8">
                                        <div className="w-12 h-[2px] bg-orange-500"></div>
                                        <span className="text-orange-500 font-bold tracking-widest uppercase text-sm">Why Choose Us</span>
                                    </div>

                                    <div className="animate-item w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-8 border border-white/10 text-orange-500 shadow-lg shadow-orange-900/10">
                                        <feature.icon size={32} />
                                    </div>

                                    <h3 className="animate-item text-4xl lg:text-5xl font-black uppercase mb-2 text-white leading-none">
                                        {feature.title}
                                    </h3>
                                    <h4 className="animate-item text-lg lg:text-xl font-bold text-gray-500 uppercase mb-6 tracking-wide">
                                        {feature.subtitle}
                                    </h4>

                                    <p className="animate-item text-lg lg:text-xl text-gray-400 leading-relaxed font-light max-w-lg">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-16 md:py-24 px-4 overflow-hidden border-t border-white/10">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-orange-950 to-orange-950 z-0">
                    <img src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" alt="Background" className="w-full h-full object-cover opacity-10 grayscale" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-orange-950/80 to-red-950/80"></div>
                </div>
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-8 tracking-tight uppercase">Siap untuk perubahan besar?</h2>
                    <p className="text-xl text-orange-200 mb-10 max-w-2xl mx-auto font-light">Bergabunglah hari ini dan dapatkan diskon 50% untuk 3 bulan pertama. Penawaran terbatas!</p>
                    <Link to="/register" className="inline-flex items-center justify-center px-10 py-5 border border-transparent text-lg font-bold uppercase tracking-wider text-black bg-white shadow-2xl skew-x-[-10deg] hover:bg-gray-200 transition-all duration-300">
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
