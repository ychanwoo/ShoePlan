interface Props {
  children: React.ReactNode;
}

// w: 398px / h: 818px
const MobileFrame = ({ children }: Props) => {
  return <div className="mx-auto w-99.5 h-204.5 bg-[#2F3941]">{children}</div>;
};

export default MobileFrame;
