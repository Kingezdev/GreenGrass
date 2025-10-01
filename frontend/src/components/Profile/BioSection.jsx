import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BioSection = ({ bio }) => {
  const [expanded, setExpanded] = useState(false);

  const words = bio?.split(" ") || [];
  const isLong = words.length > 50;
  const shortText = words.slice(0, 50).join(" ") + (isLong ? "..." : "");

  return (
    <div className="w-full text-gray-700">
      <AnimatePresence initial={false}>
        <motion.div
          key={expanded ? "expanded" : "collapsed"}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <p>{expanded ? bio : shortText}</p>
        </motion.div>
      </AnimatePresence>

      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-green-600 font-medium"
        >
          {expanded ? "See less" : "See more"}
        </button>
      )}
    </div>
  );
};

export default BioSection;
