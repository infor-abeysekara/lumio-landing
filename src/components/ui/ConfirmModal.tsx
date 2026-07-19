import { ShieldAlert, AlertTriangle, CheckCircle, Info } from "lucide-react";

type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'success' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
};

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = 'danger',
  onConfirm,
  onCancel,
  isLoading = false
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const colors = {
    danger: { bg: 'bg-red-500 hover:bg-red-600', iconBg: 'bg-red-100 text-red-500', icon: ShieldAlert },
    warning: { bg: 'bg-orange-500 hover:bg-orange-600', iconBg: 'bg-orange-100 text-orange-500', icon: AlertTriangle },
    success: { bg: 'bg-green-500 hover:bg-green-600', iconBg: 'bg-green-100 text-green-500', icon: CheckCircle },
    info: { bg: 'bg-blue-500 hover:bg-blue-600', iconBg: 'bg-blue-100 text-blue-500', icon: Info },
  };

  const Icon = colors[variant].icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${colors[variant].iconBg}`}>
          <Icon size={32} />
        </div>
        <h3 className="text-2xl font-serif text-center font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-center text-gray-500 mb-8 leading-relaxed">
          {message}
        </p>
        
        <div className="flex gap-3">
          <button 
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-white transition-colors flex items-center justify-center gap-2 ${colors[variant].bg}`}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
