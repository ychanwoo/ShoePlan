export default function RecentLoginBubble() {
  return (
    <div className="absolute z-10 left-60 -top-5 flex flex-col items-center animate-bounce pointer-events-none">
      {/* 말풍선 몸통 */}
      <div className="bg-[#1B242C] border border-[#242E35] shadow-xl text-white text-xs font-semibold py-2 px-4 rounded-xl whitespace-nowrap">
        최근 로그인
      </div>
      {/* 말풍선 꼬리 */}
      <div className="w-3 h-3 bg-[#1B242C] border-r border-b border-[#242E35] rotate-60 -mt-2 mr-15"></div>
    </div>
  );
}
