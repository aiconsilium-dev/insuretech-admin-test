import { useEffect } from 'react';

interface ToastProps {
  message: string;
  visible: boolean;
  duration?: number;
  onHide?: () => void;
}

export default function Toast({ message, visible, duration = 2800, onHide }: ToastProps) {
  useEffect(() => {
    if (visible && onHide) {
      const timer = setTimeout(onHide, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onHide]);

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[rgba(15,23,42,0.88)] text-white text-[12px] font-semibold py-[9px] px-[18px] rounded-toast z-[600] pointer-events-none whitespace-nowrap transition-opacity duration-[250ms]"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {message}
    </div>
  );
}
