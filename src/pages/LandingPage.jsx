import React from 'react';
import { ArrowRight, Activity, CalendarCheck, Users, Dumbbell, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-16 pb-32 space-y-24 lg:space-y-40">
                <div className="relative">
                    <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-24">
                        <div className="px-4 max-w-xl mx-auto sm:px-6 lg:max-w-none lg:mx-0 lg:px-0">
                            <div>
                                <div className="mt-6">
                                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                                        Transformasi Tubuh <span className="text-indigo-600">Mulai Hari Ini</span>
                                    </h1>
                                    <p className="mt-4 text-lg text-gray-500">
                                        Bergabunglah dengan Brawijaya Gym, platform kebugaran terlengkap. Akses peralatan modern, kelas eksklusif, dan pelatih profesional untuk mencapai target kesehatan Anda.
                                    </p>
                                    <div className="mt-6">
                                        <Link
                                            to="/login"
                                            className="inline-flex px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-all"
                                        >
                                            Mulai Trial Gratis <ArrowRight className="ml-2 w-5 h-5" />
                                        </Link>
                                        <Link
                                            to="/classes"
                                            className="ml-4 inline-flex px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-all"
                                        >
                                            Lihat Kelas
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-12 sm:mt-16 lg:mt-0">
                            <div className="pl-4 -mr-48 sm:pl-6 md:-mr-16 lg:px-0 lg:m-0 lg:relative lg:h-full">
                                <img
                                    className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                                    src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                                    alt="Modern gym interior with workout equipment"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-gray-50 py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Kenapa Memilih Kami?</h2>
                        <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                            Fasilitas Terbaik untuk Anda
                        </p>
                        <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
                            Kami menyediakan lingkungan yang mendukung, peralatan canggih, dan komunitas positif.
                        </p>
                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="pt-6">
                            <div className="flow-root bg-white rounded-lg px-6 pb-8 h-full">
                                <div className="-mt-6">
                                    <div>
                                        <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                                            <Dumbbell className="h-6 w-6 text-white" />
                                        </span>
                                    </div>
                                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Peralatan Modern</h3>
                                    <p className="mt-5 text-base text-gray-500">
                                        Latihan dengan mesin dan beban terbaru yang dirancang untuk keamanan dan efektivitas maksimal.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <div className="flow-root bg-white rounded-lg px-6 pb-8 h-full">
                                <div className="-mt-6">
                                    <div>
                                        <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                                            <Users className="h-6 w-6 text-white" />
                                        </span>
                                    </div>
                                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Pelatih Profesional</h3>
                                    <p className="mt-5 text-base text-gray-500">
                                        Dapatkan bimbingan personal dari pelatih bersertifikat untuk menyusun program latihan yang tepat.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <div className="flow-root bg-white rounded-lg px-6 pb-8 h-full">
                                <div className="-mt-6">
                                    <div>
                                        <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                                            <CalendarCheck className="h-6 w-6 text-white" />
                                        </span>
                                    </div>
                                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Kelas Beragam</h3>
                                    <p className="mt-5 text-base text-gray-500">
                                        Mulai dari Yoga, Zumba, hingga HIIT. Pilih kelas yang sesuai dengan minat dan jadwal Anda.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-indigo-900">
                <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                        <span className="block">Siap untuk perubahan?</span>
                        <span className="block">Gabung sekarang dan dapatkan diskon 50%.</span>
                    </h2>
                    <p className="mt-4 text-lg leading-6 text-indigo-200">
                        Penawaran terbatas untuk member baru. Jangan lewatkan kesempatan untuk hidup lebih sehat.
                    </p>
                    <Link
                        to="/login"
                        className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 sm:w-auto"
                    >
                        Daftar Membership
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
