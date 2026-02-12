"use client";
import { ChartNoAxesCombined, CircleUserRound, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TabBar() {
  const pathName = usePathname();
  return (
    <div className="w-full max-w-110 h-21.75 bg-[#242E35] flex justify-around fixed bottom-0">
      {/* Home tab */}
      <Link
        href="/home"
        className={` hover:text-[#1E7F4F] pt-3 ${pathName === "/home" ? "text-[#1E7F4F]" : "text-[#CBD5E1]"}`}
      >
        <Home width={20} height={20} className="mx-auto" />
        <span className="text-sm">Home</span>
      </Link>

      {/* Stats Tab */}
      <Link
        href="/stats"
        className={`hover:text-[#1E7F4F] pt-3 ${pathName === "/stats" ? "text-[#1E7F4F]" : "text-[#CBD5E1]"}`}
      >
        <ChartNoAxesCombined width={20} height={20} className="mx-auto" />
        <span className="text-sm">Stats</span>
      </Link>

      {/* Shoe Tab */}
      <Link
        href="/shoe"
        className={`hover:text-[#1E7F4F] pt-3 ${pathName === "/shoe" ? "text-[#1E7F4F]" : "text-[#CBD5E1]"}`}
      >
        <svg
          className="mx-auto"
          width="22"
          height="22"
          viewBox="0 0 30 30"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask
            id="mask0_23_427"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="30"
            height="30"
          >
            <rect width="30" height="30" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask0_23_427)">
            <path d="M6.75003 11.8752C7.56253 11.8752 8.33336 12.021 9.06253 12.3127C9.79169 12.6044 10.4584 13.0315 11.0625 13.594L23 25.0002H23.75C24.1042 25.0002 24.4011 24.8804 24.6407 24.6408C24.8802 24.4013 25 24.1044 25 23.7502C25 23.5836 24.9844 23.4065 24.9532 23.219C24.9219 23.0315 24.8125 22.844 24.625 22.6565L18.9063 16.9377L16.6875 10.2502L14.375 10.8127C13.5834 11.021 12.8646 10.8752 12.2188 10.3752C11.5729 9.87522 11.25 9.21897 11.25 8.40647V5.78147L10.375 5.34397L5.56253 11.7815C5.54169 11.8023 5.53128 11.8179 5.53128 11.8283C5.53128 11.8388 5.52086 11.8544 5.50003 11.8752H6.75003ZM6.75003 14.3752H5.31253C5.37503 14.5211 5.45315 14.6565 5.5469 14.7815C5.64065 14.9065 5.75003 15.0211 5.87503 15.1252L16 24.344C16.2292 24.5731 16.4896 24.7398 16.7813 24.844C17.0729 24.9481 17.375 25.0002 17.6875 25.0002H19.375L9.34378 15.4065C8.98961 15.0523 8.58857 14.7919 8.14065 14.6252C7.69273 14.4585 7.22919 14.3752 6.75003 14.3752ZM17.6875 27.5002C17.0625 27.5002 16.4688 27.3856 15.9063 27.1565C15.3438 26.9273 14.8229 26.6044 14.3438 26.1877L4.18753 16.969C3.22919 16.094 2.69273 15.0211 2.57815 13.7502C2.46357 12.4794 2.79169 11.3231 3.56253 10.2815L8.37503 3.84397C8.72919 3.3648 9.20315 3.04709 9.7969 2.89084C10.3907 2.73459 10.9584 2.8023 11.5 3.09397L12.375 3.53147C12.8125 3.76063 13.1511 4.07313 13.3907 4.46897C13.6302 4.8648 13.75 5.3023 13.75 5.78147V8.40647L16.0625 7.81272C16.6875 7.64605 17.2917 7.72417 17.875 8.04709C18.4584 8.37001 18.8542 8.83355 19.0625 9.43772L21.0938 15.5627L26.4063 20.8752C26.8229 21.2919 27.1094 21.7398 27.2657 22.219C27.4219 22.6981 27.5 23.2086 27.5 23.7502C27.5 24.7919 27.1354 25.6773 26.4063 26.4065C25.6771 27.1356 24.7917 27.5002 23.75 27.5002H17.6875Z" />
          </g>
        </svg>
        <span className="text-sm">Shoe</span>
      </Link>
      {/* Profile Tab */}
      <Link
        href="/profile"
        className={`hover:text-[#1E7F4F] pt-3 ${pathName === "/profile" ? "text-[#1E7F4F]" : "text-[#CBD5E1]"}`}
      >
        <CircleUserRound width={20} height={20} className="mx-auto" />
        <span className="text-sm">Profile</span>
      </Link>
    </div>
  );
}
