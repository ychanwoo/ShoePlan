import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface InfoPopoverProps {
  children: React.ReactNode;
}

export function InfoPopover({ children }: InfoPopoverProps) {
  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        {/* 데스크탑에서는 hover, 모바일에서는 터치 시 작동 */}
        <button aria-label="Info" className="cursor-pointer">
          {children}
        </button>
      </HoverCardTrigger>

      <HoverCardContent
        side="bottom"
        align="end"
        sideOffset={8}
        className="w-64 text-sm bg-[#3b4853] text-gray-200 border border-[#242E35] shadow-xl"
      >
        <ul className="space-y-1">
          <li>
            • <span className="font-medium">80% 이상</span>: 아직 여유 있어요
          </li>
          <li>
            • <span className="font-medium">50~80%</span>: 아직 사용하기 좋아요
          </li>
          <li>
            • <span className="font-medium">30~50%</span>: 교체 시기 슬슬
          </li>
          <li>
            • <span className="font-medium">30% 이하</span>: 새 신발 고민해볼 때
          </li>
        </ul>
        <div className="mt-3 pt-2 border-t text-xs text-gray-400">
          * 러닝화는 겉보다 <span className="font-medium">쿠션 수명</span>이 더
          중요해요
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
