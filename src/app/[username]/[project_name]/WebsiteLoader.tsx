import { motion } from "framer-motion";

const WebsiteLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-xl font-mono bg-gray-800 px-4 py-2 rounded-lg shadow-lg"
      >
        Loading Website...
      </motion.div>
      
      <div className="flex mt-4 space-x-2">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-4 h-4 bg-blue-500 rounded-full"
            animate={{
              y: [0, -10, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default WebsiteLoader;
