
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ExternalLink } from 'lucide-react';

interface AnimatedTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}

const AnimatedTooltip: React.FC<AnimatedTooltipProps> = ({ 
  children, 
  content, 
  actionText, 
  onAction 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      
      <AnimatePresence>
        {isVisible && (
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
            <div className="space-y-3">
              <div className="text-sm text-gray-700">
                {content}
              </div>
              
              {actionText && onAction && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onAction}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  {actionText}
                  <ExternalLink className="w-3 h-3" />
                </motion.button>
              )}
            </div>
            
            {/* Arrow pointing up */}
            <div className="absolute -top-1 left-4 w-2 h-2 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedTooltip;
