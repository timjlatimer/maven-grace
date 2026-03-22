import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="flex flex-col items-center gap-3"
      >
        <Heart className="w-8 h-8 text-teal-400" />
        <p className="text-sm text-slate-400">Grace is getting ready...</p>
      </motion.div>
    </div>
  );
}
