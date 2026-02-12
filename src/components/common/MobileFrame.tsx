interface Props {
  children: React.ReactNode;
}

// w: 398px / h: 818px
const MobileFrame = ({ children }: Props) => {
  return (
    <div className="relative mx-auto max-w-110 w-screen min-h-screen bg-[#2F3941]">
      {children}
    </div>
  );
};

export default MobileFrame;
