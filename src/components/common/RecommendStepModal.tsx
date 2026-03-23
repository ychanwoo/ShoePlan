// src/components/common/AlertModal.tsx
interface RecommendStepModalodalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export default function RecommendStepModal({
  isOpen,
  message,
  onClose,
}: RecommendStepModalodalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 max-w-110 mx-auto flex items-center justify-center bg-black/60 transition-opacity"
      onClick={onClose}
    >
      <div
        className="bg-[#242E35] w-80 rounded-2xl p-6 flex flex-col items-center shadow-xl transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[#CBD5E1] text-center font-medium mb-6 mt-2 whitespace-pre-wrap">
          {message}
        </p>
        <button
          onClick={onClose}
          className="w-full h-11 bg-[#1E7F4F] hover:bg-[#196e43] text-white font-medium rounded-xl transition-colors"
        >
          확인
        </button>
      </div>
    </div>
  );
}
