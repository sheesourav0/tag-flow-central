
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

interface ClickableTooltipProps {
  content: React.ReactNode;
  className?: string;
}

const ClickableTooltip: React.FC<ClickableTooltipProps> = ({ content, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setIsVisible(!isVisible)}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
      
      <AnimatePresence>
        {isVisible && (
          <>
            {/* Backdrop to close tooltip */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsVisible(false)} 
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              transition={{ 
                type: "spring",
                stiffness: 500,
                damping: 30,
                duration: 0.2 
              }}
              className="absolute z-50 w-72 p-4 bg-white border border-gray-200 rounded-lg shadow-lg top-full left-0 mt-2"
            >
              <div className="text-sm text-gray-700">
                {content}
              </div>
              
              {/* Arrow pointing up */}
              <div className="absolute -top-1 left-4 w-2 h-2 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClickableTooltip;
