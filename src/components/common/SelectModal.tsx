interface SelectModalProps {
  openKey: string;
  title?: string;
  options: string[];
  value?: string;
  onSelect: (item: string) => void;
  onClose: () => void;
}

export function SelectModal({
  openKey,
  title,
  options,
  value,
  onSelect,
  onClose,
}: SelectModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 text-[#CBD5E1] flex items-end z-50 w-97.5 mx-auto">
      <div className="w-full bg-[#27323A] rounded-t-2xl p-6">
        {/* Title */}
        <h2 className="text-lg font-semibold mb-4 capitalize">
          {title ?? `Select ${openKey}`}
        </h2>

        {/* List */}
        <div className="max-h-80 overflow-y-auto space-y-3">
          {options.map((item) => (
            <button
              key={item}
              onClick={() => onSelect(item)}
              className={`w-full text-left px-4 py-3 rounded-xl transition
                ${
                  value === item
                    ? "bg-white text-black"
                    : "bg-[#1E293B] hover:bg-[#334155]"
                }`}
            >
              {item}
            </button>
          ))}
        </div>

        <button
          className="mt-6 w-full bg-white text-black py-3 rounded-xl hover:bg-[#ffffffcd]"
          onClick={onClose}
        >
          확인
        </button>
      </div>
    </div>
  );
}
