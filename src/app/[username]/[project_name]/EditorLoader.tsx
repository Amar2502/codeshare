import { motion } from "framer-motion";

const EditorLoader = () => {
  // Array of colors for the particles
  const colors = ["#FF5C8D", "#4AB7FF", "#FFD166", "#06D6A0", "#9B5DE5"];
  
  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
      {/* Background animated particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full"
          style={{
            background: colors[i % colors.length],
            width: Math.random() * 10 + 5,
            height: Math.random() * 10 + 5,
            x: Math.random() * 100 - 50 + "%",
            y: Math.random() * 100 - 50 + "%",
            opacity: 0.6,
          }}
          animate={{
            x: [
              `${Math.random() * 100 - 50}%`,
              `${Math.random() * 100 - 50}%`,
              `${Math.random() * 100 - 50}%`,
            ],
            y: [
              `${Math.random() * 100 - 50}%`,
              `${Math.random() * 100 - 50}%`,
              `${Math.random() * 100 - 50}%`,
            ],
            scale: [0.8, 1.2, 0.8],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 8 + Math.random() * 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Central loading container */}
      <motion.div
        className="z-10 flex flex-col items-center bg-gray-800 bg-opacity-50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Animated logo/icon */}
        <motion.div
          className="w-24 h-24 mb-6 relative"
          initial={{ rotateY: 0 }}
          animate={{ rotateY: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <motion.div
            className="absolute inset-0 rounded-xl"
            style={{ 
              background: "linear-gradient(135deg, #4AB7FF, #9B5DE5)", 
              transformStyle: "preserve-3d"
            }}
            animate={{ 
              boxShadow: [
                "0 0 15px rgba(74, 183, 255, 0.6)",
                "0 0 25px rgba(155, 93, 229, 0.8)",
                "0 0 15px rgba(74, 183, 255, 0.6)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          <motion.div 
            className="absolute inset-0 flex items-center justify-center text-white text-3xl font-bold"
            style={{ transformStyle: "preserve-3d" }}
          >
            <span>CD</span>
          </motion.div>
        </motion.div>

        {/* Main loading text */}
        <motion.h2
          className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
          animate={{ 
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Initializing Editor
        </motion.h2>

        {/* Loading progress circle */}
        <div className="relative w-40 h-4 mb-6">
          <motion.div 
            className="absolute inset-0 rounded-full bg-gray-700"
          />
          <motion.div 
            className="absolute h-4 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          />
        </div>

        {/* Status message */}
        <motion.div
          className="text-sm text-gray-300 font-mono"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Assembling components...
        </motion.div>

        {/* Decorative pulse rings */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`ring-${i}`}
            className="absolute rounded-full border border-purple-500"
            initial={{ width: 100, height: 100, opacity: 0.8 }}
            animate={{ 
              width: [100, 300],
              height: [100, 300],
              opacity: [0.8, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeOut"
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default EditorLoader;