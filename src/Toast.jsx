import { Check, X } from "lucide-react";
import { useEffect } from "react";

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === "success"
          ? "bg-green-500"
          : type === "error"
          ? "bg-red-500"
          : type === "info"
          ? "bg-blue-500"
          : "bg-gray-500"
      } text-white`}
    >
      <div className="flex items-center gap-2">
        {type === "success" && <Check size={20} />}
        <span>{message}</span>
        <button onClick={onClose} className="ml-2">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
