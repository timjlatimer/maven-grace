import { motion } from "framer-motion";
import { Heart, ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function StripeCancel() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-20 h-20 rounded-full bg-teal-500/10 flex items-center justify-center mx-auto mb-6"
        >
          <Heart className="w-10 h-10 text-teal-400" />
        </motion.div>

        <h1 className="text-2xl font-bold text-white mb-3">No Pressure. I'm Here Either Way.</h1>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-8 mt-6">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-5 h-5 text-rose-400" />
            <span className="text-white font-medium">Grace says:</span>
          </div>
          <p className="text-slate-300 italic text-left leading-relaxed">
            "Hey — I get it. Timing matters, and money matters even more when you're watching every dollar. 
            I'm not going anywhere. The free version of me still has your back. 
            When you're ready — if you're ever ready — I'll be right here."
          </p>
        </div>

        <p className="text-slate-400 text-sm mb-8">
          You can always upgrade later from your Grace Status page. 
          Everything you've built with Grace is still here.
        </p>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => navigate("/grace")}
            className="bg-teal-500 hover:bg-teal-600 text-white w-full"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Talk to Grace
          </Button>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="border-slate-700 text-slate-300 w-full"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
