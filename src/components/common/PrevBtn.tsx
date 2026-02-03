interface PrevBtnProps {
  children: React.ReactNode;
  onClick: () => void;
}

export default function PrevBtn({ children, onClick }: PrevBtnProps) {
  return (
    <button
      className="text-white text-base w-20 h-8.75 rounded-2xl bg-[#6B7280] flex items-center justify-center hover:bg-[#6b7280cc]"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
