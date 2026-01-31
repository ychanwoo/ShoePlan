import Link from "next/link";
import clsx from "clsx";

interface MainBtnProps {
  children: React.ReactNode;
  href: string;
  className?: string;
}

export default function MainBtn({ children, href, className }: MainBtnProps) {
  return (
    <Link
      href={href}
      className={clsx(
        "text-white text-base w-75 h-12.5 rounded-2xl bg-[#1E7F4F] flex items-center justify-center hover:bg-[#196e43]",
        className,
      )}
    >
      <p>{children}</p>
    </Link>
  );
}
