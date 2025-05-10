import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

interface ErrorBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  autoClose?: number; // Time in milliseconds for auto-close (optional)
  onClose?: () => void; // Callback to handle manual or auto-close
}

const ErrorBadge: React.FC<ErrorBadgeProps> = ({ className, children, autoClose = 5000, onClose, ...props }) => {
  const [visible, setVisible] = useState(true);

  // Auto-close functionality
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose(); // Call onClose when auto-closing
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose(); // Call onClose when manually closing
  };

  if (!visible) return null;

  return (
    <div
      className={cn(
        "relative inline-flex items-center rounded-full border border-transparent bg-red-600 text-white px-4 py-2 text-sm font-semibold transition-colors hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2",
        className
      )}
      {...props}
    >
      {children}
      <button
        onClick={handleClose}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200 focus:outline-none"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default ErrorBadge;