import Image from "next/image";
import LogoImg from "@/assets/logo.svg";
import MainBtn from "@/components/common/MainBtn";

export default function StartPage() {
  return (
    <>
      <div className="pt-30 flex justify-center">
        <Image src={LogoImg} alt="Logo-image" width={300} height={300} />
      </div>

      <div className="text-center">
        <p className="text-[#1E7F4F] font-bold text-[22px]">
          러닝화, 아직 신어도될까요?
        </p>
        <p className="text-white pt-5 text-sm">
          지금 교체 타이밍을 확인해보세요
        </p>
      </div>

      <div className="flex justify-center pt-[25vh]">
        <MainBtn href="/login">교체 타이밍 확인하기 →</MainBtn>
      </div>
    </>
  );
}
