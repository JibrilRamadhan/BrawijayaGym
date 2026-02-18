import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft, CreditCard, CheckCircle, Calendar, Shield, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const RegisterPage = () => {
    const navigate = useNavigate();

    // Steps: 1=Plan, 2=Form, 3=Payment/Processing, 4=Success
    const [step, setStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    // Success Data
    const [successData, setSuccessData] = useState(null);

    const plans = [
        {
            id: 'trial',
            name: 'Daily Trial',
            duration: '1 Hari',
            price: 0,
            features: ['Akses Gym Seharian', 'Gratis Loker', 'Free Wifi'],
            icon: Zap,
            color: 'from-orange-500 to-orange-300'
        },
        {
            id: 'member',
            name: 'Monthly Membership',
            duration: '30 Hari',
            price: 300000,
            features: ['Akses Unlimited 24/7', 'Personal Trainer Sesi Perdana', 'Akses Kelas Gratis', 'Diskon Merchandise'],
            icon: Shield,
            color: 'from-orange-600 to-red-600'
        }
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
        setStep(2);
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Password tidak sama!");
            return;
        }
        setStep(3); // Move to Payment/Processing
    };

    const processPayment = () => {
        setIsLoading(true);

        // Simulasi Backend Delay
        setTimeout(() => {
            if (selectedPlan.price === 0) {
                // FREE TRIAL FLOW
                completeRegistration();
            } else {
                // MIDTRANS FLOW
                if (window.snap) {
                    try {
                        // DUMMY TOKEN
                        window.snap.pay('DUMMY_TOKEN_' + Date.now(), {
                            onSuccess: function (result) { completeRegistration(); },
                            onPending: function (result) { alert("Menunggu Pembayaran!"); setIsLoading(false); },
                            onError: function (result) {
                                alert("Simulasi: Masuk ke Sukses (Mock Payment)");
                                completeRegistration();
                            },
                            onClose: function () {
                                alert("Pembayaran dibatalkan");
                                setIsLoading(false);
                            }
                        });
                    } catch (error) {
                        // Fallback for demo
                        console.log("Mocking Successful Payment");
                        completeRegistration();
                    }
                } else {
                    alert("Midtrans script not loaded");
                    setIsLoading(false);
                }
            }
        }, 1500);
    };

    const completeRegistration = () => {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + (selectedPlan.id === 'trial' ? 1 : 30));

        setSuccessData({
            transactionId: 'TRX-' + Math.floor(Math.random() * 1000000),
            startDate: startDate.toLocaleDateString('id-ID'),
            endDate: endDate.toLocaleDisableString ? endDate.toLocaleDateString('id-ID') : endDate.toDateString(), // Fallback
            userName: formData.name,
            planName: selectedPlan.name
        });

        setIsLoading(false);
        setStep(4);
    };

    return (
        <div className="min-h-screen flex bg-black font-sans text-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[120px]"></div>
            </div>

            <div className="container mx-auto px-4 py-8 relative z-10 flex flex-col items-center justify-center min-h-screen">

                {/* Header Steps */}
                <div className="w-full max-w-3xl mb-12">
                    <Link to="/" className="flex items-center justify-center space-x-3 mb-8">
                        <img src="/img/Logo.png" alt="" className='w-10 h-auto invert brightness-0' />
                        <span className="font-bold text-xl tracking-tight">Brawijaya Gym</span>
                    </Link>

                    {/* Progress Bar */}
                    {step < 4 && (
                        <div className="flex justify-between items-center relative">
                            <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-800 -z-10"></div>
                            {[1, 2, 3].map((s) => (
                                <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all ${step >= s ? 'bg-orange-600 border-orange-600 text-white' : 'bg-black border-gray-600 text-gray-600'}`}>
                                    {s}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="w-full max-w-4xl"
                >
                    {/* STEP 1: PLAN SELECTION */}
                    {step === 1 && (
                        <div className="text-center">
                            <h2 className="text-4xl font-black mb-2 uppercase italic">Pilih Membership</h2>
                            <p className="text-gray-400 mb-10">Sesuaikan dengan kebutuhan latihanmu</p>

                            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                                {plans.map((plan) => (
                                    <div
                                        key={plan.id}
                                        onClick={() => handlePlanSelect(plan)}
                                        className="group relative bg-zinc-900 border border-zinc-800 p-8 cursor-pointer hover:border-orange-500 transition-all hover:-translate-y-2 overflow-hidden"
                                    >
                                        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${plan.color}`}></div>
                                        <plan.icon className="w-12 h-12 text-white mb-6 group-hover:scale-110 transition-transform" />
                                        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                        <div className="text-3xl font-black mb-6">
                                            {plan.price === 0 ? "GRATIS" : `Rp ${plan.price.toLocaleString('id-ID')}`}
                                            <span className="text-sm font-normal text-gray-500 block mt-1">/ {plan.duration}</span>
                                        </div>
                                        <ul className="space-y-3 text-left mb-8">
                                            {plan.features.map((feat, i) => (
                                                <li key={i} className="flex items-center text-gray-300">
                                                    <CheckCircle className="w-5 h-5 mr-3 text-orange-500" />
                                                    {feat}
                                                </li>
                                            ))}
                                        </ul>
                                        <button className="w-full py-3 bg-white text-black font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors">
                                            Pilih Paket
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-8 text-gray-500">
                                Sudah punya akun? <Link to="/login" className="text-white underline">Login disini</Link>
                            </p>
                        </div>
                    )}

                    {/* STEP 2: USER FORM */}
                    {step === 2 && (
                        <div className="max-w-md mx-auto bg-zinc-900 p-8 border border-zinc-800">
                            <button onClick={() => setStep(1)} className="flex items-center text-gray-400 hover:text-white mb-6">
                                <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
                            </button>
                            <h2 className="text-2xl font-bold mb-6 uppercase">Data Diri</h2>
                            <form onSubmit={handleRegisterSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold uppercase text-gray-400 mb-2">Nama Lengkap</label>
                                    <input name="name" type="text" required className="w-full bg-black border border-zinc-700 p-3 text-white focus:border-orange-500 outline-none" placeholder="John Doe" value={formData.name} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold uppercase text-gray-400 mb-2">Email</label>
                                    <input name="email" type="email" required className="w-full bg-black border border-zinc-700 p-3 text-white focus:border-orange-500 outline-none" placeholder="email@example.com" value={formData.email} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold uppercase text-gray-400 mb-2">Password</label>
                                    <input name="password" type="password" required className="w-full bg-black border border-zinc-700 p-3 text-white focus:border-orange-500 outline-none" placeholder="••••••••" value={formData.password} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold uppercase text-gray-400 mb-2">Konfirmasi Password</label>
                                    <input name="confirmPassword" type="password" required className="w-full bg-black border border-zinc-700 p-3 text-white focus:border-orange-500 outline-none" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} />
                                </div>
                                <button type="submit" className="w-full py-4 bg-orange-600 hover:bg-orange-500 font-bold uppercase tracking-widest transition-all mt-4">
                                    Lanjut ke Pembayaran
                                </button>
                            </form>
                        </div>
                    )}

                    {/* STEP 3: CONFIRMATION & PAYMENT */}
                    {step === 3 && (
                        <div className="max-w-md mx-auto bg-zinc-900 p-8 border border-zinc-800 text-center">
                            <button onClick={() => setStep(2)} className="flex items-center text-gray-400 hover:text-white mb-6">
                                <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
                            </button>
                            <h2 className="text-2xl font-bold mb-6 uppercase">Konfirmasi</h2>

                            <div className="bg-black p-6 mb-8 border border-zinc-700 text-left">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-400">Paket</span>
                                    <span className="font-bold text-orange-400">{selectedPlan?.name}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-400">Durasi</span>
                                    <span>{selectedPlan?.duration}</span>
                                </div>
                                <div className="flex justify-between mb-4">
                                    <span className="text-gray-400">Nama</span>
                                    <span>{formData.name}</span>
                                </div>
                                <div className="border-t border-gray-700 pt-4 flex justify-between items-center">
                                    <span className="text-lg">Total</span>
                                    <span className="text-2xl font-bold">
                                        {selectedPlan?.price === 0 ? "GRATIS" : `Rp ${selectedPlan?.price.toLocaleString('id-ID')}`}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={processPayment}
                                disabled={isLoading}
                                className={`w-full py-4 font-bold uppercase tracking-widest transition-all flex justify-center items-center ${isLoading ? 'bg-gray-700 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500'}`}
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : (selectedPlan?.price === 0 ? "Aktifkan Sekarang" : "Bayar Sekarang")}
                            </button>
                            <p className="mt-4 text-xs text-gray-500">
                                {selectedPlan?.price === 0 ? "Akun Anda akan langsung aktif." : "Anda akan diarahkan ke halaman pembayaran aman Midtrans."}
                            </p>
                        </div>
                    )}

                    {/* STEP 4: SUCCESS RECEIPT */}
                    {step === 4 && successData && (
                        <div className="max-w-md mx-auto">
                            <div className="bg-white text-black p-8 relative overflow-hidden shadow-2xl">
                                {/* Ticket Design Elements */}
                                <div className="absolute top-0 left-0 w-full h-2 bg-orange-600"></div>
                                <div className="absolute bottom-0 left-0 w-full h-2 bg-orange-600"></div>

                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h2 className="text-2xl font-black uppercase tracking-tighter">Registrasi Berhasil!</h2>
                                    <p className="text-gray-600">Selamat bergabung di Brawijaya Gym</p>
                                </div>

                                <div className="border-t-2 border-dashed border-gray-300 py-6 space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 text-sm uppercase">ID Transaksi</span>
                                        <span className="font-mono font-bold">{successData.transactionId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 text-sm uppercase">Member</span>
                                        <span className="font-bold">{successData.userName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 text-sm uppercase">Paket</span>
                                        <span className="font-bold text-orange-600">{successData.planName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 text-sm uppercase">Berlaku Hingga</span>
                                        <span className="font-bold">{successData.endDate}</span>
                                    </div>
                                </div>

                                <div className="bg-gray-100 p-4 text-center mt-4 rounded">
                                    <p className="text-xs text-gray-500 mb-2">Tunjukkan token ini ke resepsionis saat kedatangan pertama.</p>
                                    <div className="text-xl font-mono font-black tracking-widest text-orange-800">
                                        {successData.transactionId.split('-')[1]}
                                    </div>
                                </div>

                                <button onClick={() => navigate('/login')} className="w-full mt-8 py-3 bg-black text-white font-bold uppercase hover:bg-gray-800 transition-colors">
                                    Masuk ke Dashboard
                                </button>
                            </div>
                        </div>
                    )}

                </motion.div>
            </div>
        </div>
    );
};

export default RegisterPage;
