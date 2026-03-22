interface Props {
  children: React.ReactNode;
}

// w: 398px / h: 818px
const MobileFrame = ({ children }: Props) => {
  return (
    <div className="relative mx-auto w-full max-w-110 min-h-dvh bg-[#2F3941]">
      {children}
    </div>
  );
};

export default MobileFrame;
