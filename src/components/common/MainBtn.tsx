interface MainBtnProps {
  children: React.ReactNode;
}

export default function MainBtn({ children }: MainBtnProps) {
  return (
    <button className="text-white text-base w-75 h-12.5 rounded-2xl bg-[#1E7F4F] flex items-center justify-center hover:bg-[#196e43]">
      {children}
    </button>
  );
}
