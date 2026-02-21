import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Link } from "react-router-dom";

const PricingCard = ({ tier, price, desc, features, notIncluded = [], isPopular = false, isYearly = false }) => {

    // Calculate price based on billing cycle (Monthly vs Yearly)
    const basePrice = parseInt(price);
    const displayedPrice = isYearly ? Math.round(basePrice * 0.8) : basePrice;

    return (
        <div
            className={`relative p-8 flex flex-col h-full ${isPopular ? 'bg-zinc-900 border-orange-500 shadow-[0_0_40px_rgba(249,115,22,0.15)] scale-105 z-10' : 'bg-black border-white/10 hover:border-white/30'} border transition-all duration-300 group`}
        >
            {isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-orange-600 text-white text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-sm shadow-lg">
                    Most Popular
                </div>
            )}

            <div className="mb-8">
                <h3 className={`text-sm font-bold tracking-widest uppercase mb-4 ${isPopular ? 'text-orange-400' : 'text-gray-400'}`}>
                    {tier}
                </h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-gray-400">Rp</span>
                    <motion.span
                        key={displayedPrice} // Animate when price changes
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-black text-white tracking-tighter"
                    >
                        {displayedPrice}K
                    </motion.span>
                    <span className="text-gray-500 font-medium">/{isYearly ? 'mo*' : 'mo'}</span>
                </div>
                {isYearly && <p className="text-xs text-orange-400 mt-1 font-bold">Billed Yearly (Save 20%)</p>}

                <p className="text-gray-400 text-sm mt-4 leading-relaxed border-b border-white/10 pb-6">
                    {desc}
                </p>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
                {features.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                        <div className={`mt-0.5 p-0.5 rounded-full ${isPopular ? 'bg-orange-600 text-white' : 'bg-zinc-800 text-gray-400 group-hover:bg-white group-hover:text-black'} transition-colors`}>
                            <Check className="w-3 h-3" />
                        </div>
                        {item}
                    </li>
                ))}
                {notIncluded.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600 line-through decoration-gray-700">
                        <div className="mt-0.5 p-0.5">
                            <X className="w-3 h-3" />
                        </div>
                        {item}
                    </li>
                ))}
            </ul>

            <Link to="/register" className={`w-full py-4 font-bold uppercase tracking-wider text-sm transition-all duration-300 border text-center block ${isPopular ? 'bg-orange-600 border-orange-600 text-white hover:bg-orange-700' : 'bg-transparent border-white text-white hover:bg-white hover:text-black'}`}>
                Choose {tier}
            </Link>
        </div>
    );
};

export default PricingCard;