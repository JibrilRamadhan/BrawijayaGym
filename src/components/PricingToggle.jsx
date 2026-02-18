import { motion } from "framer-motion";

const PricingToggle = ({ isYearly, onToggle }) => {
    return (
        <div className="flex items-center gap-4 bg-zinc-900 p-2 rounded-full border border-white/10">
            <button
                onClick={() => onToggle(false)}
                className={`relative px-6 py-2 rounded-full text-sm font-bold uppercase transition-all duration-300 z-10 ${!isYearly ? 'text-black' : 'text-gray-400 hover:text-white'}`}
            >
                {!isYearly && (
                    <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 bg-white rounded-full -z-10 shadow-lg"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                )}
                Monthly
            </button>
            <button
                onClick={() => onToggle(true)}
                className={`relative px-6 py-2 rounded-full text-sm font-bold uppercase transition-all duration-300 z-10 flex items-center gap-2 ${isYearly ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            >
                {isYearly && (
                    <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 bg-orange-600 rounded-full -z-10 shadow-lg"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                )}
                Yearly
                <span className={`text-[10px] px-1.5 rounded-sm transition-colors ${isYearly ? 'bg-white text-orange-600' : 'bg-orange-600 text-white'}`}>-20%</span>
            </button>
        </div>
    );
};

export default PricingToggle;