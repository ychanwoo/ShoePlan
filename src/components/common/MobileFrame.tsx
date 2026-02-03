interface Props {
  children: React.ReactNode;
}

// w: 398px / h: 818px
const MobileFrame = ({ children }: Props) => {
  return (
    <div className="relative mx-auto w-97.5 min-h-screen bg-[#2F3941]">
      {children}
    </div>
  );
};

export default MobileFrame;
