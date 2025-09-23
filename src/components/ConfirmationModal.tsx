/**
 * Reusable confirmation modal component
 * Props: isOpen, title, message, onConfirm, onCancel, confirmLabel, cancelLabel
 */

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmButtonColor?: string;
}

export default function ConfirmationModal({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  confirmButtonColor = "bg-red-600"
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h3 className="text-lg font-medium text-white bg-[#AF426B] px-4 py-2 rounded-md mb-4">{title}</h3>
        <p className="text-[--foreground] mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 ${confirmButtonColor} text-white rounded-md hover:opacity-90`}
          >
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:opacity-90"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
