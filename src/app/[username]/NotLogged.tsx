import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export const NotLoggedInError = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white"
    >
      <motion.div
        className="bg-red-500 text-white p-6 rounded-2xl shadow-lg flex flex-col items-center"
        whileHover={{ x: [-3, 3, -3] }}
        transition={{ duration: 0.3, repeat: Infinity, repeatType: "reverse" }}
      >
        <AlertTriangle size={48} className="text-white mb-4" />
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <Link
          href="/login"
          className="mt-4 px-4 py-2 bg-white text-red-500 font-semibold rounded-md shadow hover:bg-gray-100 transition"
        >
          Go to Login
        </Link>
      </motion.div>
    </motion.div>
  );
}

// export default NotLoggedInError;