interface NextBtnProps {
  children: React.ReactNode;
  onClick: () => void;
}

export default function NextBtn({ children, onClick }: NextBtnProps) {
  return (
    <button
      className="text-white text-base w-20 h-8.75 rounded-2xl bg-[#1E7F4F] flex items-center justify-center hover:bg-[#196e43]"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
