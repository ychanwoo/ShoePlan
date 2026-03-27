"use client";
import HeaderBar from "@/components/common/HeaderBar";
import { SelectModal } from "@/components/common/SelectModal";
import TabBar from "@/components/common/TabBar";
import {
  BRANDS,
  DISTANCE_OPTIONS,
  MODELS,
  RUNNING_TYPE_OPTIONS,
} from "@/constants/selectModalOptions";
import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Loading from "@/components/common/Loading";

export default function StatsPage() {
  const pathname = usePathname();
  const [isRunning, setIsRunning] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState<
    null | "brand" | "model" | "distance" | "type"
  >(null);
  // 러닝화 교체 관련 상태
  const [shoeConfirm, setShowConfirm] = useState(false);
  const [pendingOpen, setPendingOpen] = useState<"brand" | "model" | null>(
    null,
  );
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    message: "",
  });

  const [value, setValue] = useState({
    brand: "",
    model: "",
    distance: "",
    type: "",
    shoeAge: "",
  });

  // * 모달 닫기
  const closeModal = () => {
    setModalConfig({ isOpen: false, message: "" });
  };

  //* 기존 저장된 데이터 가져오기
  const fetchUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/updateStats", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        console.warn("데이터를 불러오지 못했습니다. 로그인이 필요합니다.");
        return;
      }

      const { data } = await response.json();

      if (data) {
        setValue({
          brand: data.shoe_brand || "",
          model: data.shoe_model || "",
          distance: data.running_distance || "",
          type: data.running_type || "",
          shoeAge: data.shoe_age || "",
        });
        setIsRunning(data.is_running ?? true);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // * 경로가 stats일 경우 리렌더링
  useEffect(() => {
    if (pathname === "/stats") fetchUserData();
  }, [pathname, fetchUserData]);

  //* save버튼 클릭 시 update 되는 이벤트 핸들러
  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      const response = await fetch("/api/updateStats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          distance: value.distance,
          type: value.type,
          brand: value.brand,
          model: value.model,
          shoeAge: value.shoeAge,
          isRunning: isRunning,
        }),
      });

      if (response.ok) {
        setModalConfig({
          isOpen: true,
          message: "러닝 데이터 저장 성공~! 🏃‍♂️",
        });
        fetchUserData();
      } else {
        const errorData = await response.json();
        setModalConfig({
          isOpen: true,
          message: `저장 실패.. 다시 시도해 주세요.` + errorData.error,
        });
      }
    } catch (err) {
      console.error(err);
      setModalConfig({
        isOpen: true,
        message: "저장 중 오류가 발생했습니다. 다시 시도해 주세요.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  //* 러닝화 변경 시 실행되는 함수
  const handleShoeChangeRequest = (type: "brand" | "model") => {
    // 이미 신발이 등록되어 있는 상태에서 변경하려고 할 때만 모달을 띄움
    if (value.brand || value.model) {
      setPendingOpen(type);
      setShowConfirm(true);
    }
  };

  //* 모달에서 예를 눌렀을 때
  const handleConfirmYes = () => {
    if (pendingOpen) setOpen(pendingOpen);
    setShowConfirm(false);
    setPendingOpen(null);
  };

  //* 모달에서 아니오를 눌렀을 때
  const handleConfirmNo = () => {
    setShowConfirm(false);
    setPendingOpen(null);
  };

  if (isLoading) return <Loading />;

  return (
    <>
      <HeaderBar title="Stats" />

      {/* Running modify */}
      <div className="space-y-5 pt-10 h-[calc(100dvh-11vh)] overflow-y-auto">
        <div className="bg-[#242E35] w-75 mx-auto py-5 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2 px-5 mb-5">
            <div className="w-1.5 h-5 bg-[#1E7F4F] rounded-full"></div>
            <h2 className="text-white text-lg font-semibold tracking-wide">
              Running Profile
            </h2>
          </div>

          <div className="flex flex-col gap-y-5 px-5">
            {/* distance 선택 */}
            <div className="flex flex-col gap-y-2">
              <label className="flex items-baseline gap-1.5 pl-1">
                <span className="text-sm font-medium text-[#CBD5E1]">
                  Running Distance
                </span>
                <span className="text-[11px] font-light text-[#6B7280] uppercase tracking-wider">
                  (Monthly)
                </span>
              </label>
              <button
                className="flex items-center justify-between w-full bg-[#1B242C] px-4 py-3 rounded-xl border border-[#374151] hover:border-[#1E7F4F] transition-colors focus:outline-none"
                onClick={() => setOpen("distance")}
              >
                <span
                  className={`text-sm ${value.distance ? "text-white" : "text-[#6B7280]"}`}
                >
                  {value.distance || "거리를 선택해주세요"}
                </span>
                <ChevronDown className="text-[#94A3B8] w-4 h-4 shrink-0" />
              </button>
            </div>

            {/* type 선택 */}
            <div className="flex flex-col gap-y-2">
              <label className="flex items-baseline gap-1.5 pl-1">
                <span className="text-sm font-medium text-[#CBD5E1]">
                  Running Type
                </span>
              </label>
              <button
                className="flex items-center justify-between w-full bg-[#1B242C] px-4 py-3 rounded-xl border border-[#374151] hover:border-[#1E7F4F] transition-colors focus:outline-none"
                onClick={() => setOpen("type")}
              >
                <span
                  className={`text-sm ${value.type ? "text-white" : "text-[#6B7280]"}`}
                >
                  {value.type || "타입을 선택해주세요"}
                </span>
                <ChevronDown className="text-[#94A3B8] w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>
        </div>

        {/* Running shoe */}
        <div className="bg-[#242E35] w-75 mx-auto py-5 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2 px-5 mb-5">
            <div className="w-1.5 h-5 bg-[#1E7F4F] rounded-full"></div>
            <h2 className="text-white text-lg font-semibold tracking-wide">
              Running Shoe
            </h2>
          </div>

          <div className="flex flex-col gap-y-5 px-5">
            {/* Brand 선택 */}
            <div className="flex flex-col gap-y-2">
              <label className="flex items-baseline gap-1.5 pl-1">
                <span className="text-sm font-medium text-[#CBD5E1]">
                  Brand
                </span>
              </label>
              <button
                className="flex items-center justify-between w-full bg-[#1B242C] px-4 py-3 rounded-xl border border-[#374151] hover:border-[#1E7F4F] transition-colors focus:outline-none"
                onClick={() => handleShoeChangeRequest("brand")}
              >
                <span
                  className={`text-sm ${value.brand ? "text-white" : "text-[#6B7280]"}`}
                >
                  {value.brand || "브랜드를 선택해주세요"}
                </span>
                <ChevronDown className="text-[#94A3B8] w-4 h-4 shrink-0" />
              </button>
            </div>
            {/* Model 선택 */}
            <div className="flex flex-col gap-y-2">
              <label className="flex items-baseline gap-1.5 pl-1">
                <span className="text-sm font-medium text-[#CBD5E1]">
                  Model
                </span>
              </label>
              <button
                disabled={!value.brand}
                className="flex items-center justify-between w-full bg-[#1B242C] px-4 py-3 rounded-xl border border-[#374151] hover:border-[#1E7F4F] transition-colors focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#374151]"
                onClick={() => handleShoeChangeRequest("model")}
              >
                <span
                  className={`text-sm ${value.model ? "text-white" : "text-[#6B7280]"}`}
                >
                  {value.model || "모델을 선택해주세요"}
                </span>
                <ChevronDown className="text-[#94A3B8] w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>
        </div>

        {/* Running status */}
        <div className="text-[#CBD5E1] bg-[#242E35] shadow-lg w-75 mx-auto pt-5 pb-5 rounded-2xl font-light transition-all duration-300">
          <div className="flex items-center justify-between px-5 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-5 bg-[#1E7F4F] rounded-full"></div>
              <h2 className="text-white text-lg font-semibold tracking-wide">
                Running Status
              </h2>
            </div>

            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`
                relative w-14 h-7 rounded-full transition-colors duration-300 ease-in-out focus:outline-none
                ${isRunning ? "bg-[#1E7F4F]" : "bg-[#6B7280]"}
              `}
              aria-label="Toggle Running Status"
            >
              <div
                className={`
                  absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out
                  ${isRunning ? "translate-x-7" : "translate-x-0"}
                `}
              />
            </button>
          </div>

          {/* Running / Breaking 선택 버튼 */}
          <div className="flex gap-x-3 px-5">
            <button
              onClick={() => setIsRunning(true)}
              className={`flex-1 h-8 rounded-xl text-sm font-medium transition-colors duration-200 ${
                isRunning
                  ? "bg-[#1E7F4F] text-white"
                  : "bg-[#374151] text-[#9CA3AF] hover:bg-[#4B5563]"
              }`}
            >
              Running
            </button>
            <button
              onClick={() => setIsRunning(false)}
              className={`flex-1 h-8 rounded-xl text-sm font-medium transition-colors duration-200 ${
                !isRunning
                  ? "bg-[#6B7280] text-white"
                  : "bg-[#374151] text-[#9CA3AF] hover:bg-[#4B5563]"
              }`}
            >
              Breaking
            </button>
          </div>

          <div
            className={`
            overflow-hidden transition-all duration-300 ease-in-out
            ${!isRunning ? "max-h-20 opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"}
          `}
          >
            <div className="mx-5 p-3 bg-black/20 rounded-xl border border-gray-600/50 flex gap-2 items-start">
              <span className="text-amber-400/90 text-sm mt-0.5">⏸️</span>
              <p className="text-xs text-gray-400 leading-relaxed">
                현재 휴식기입니다. <br />
                <span className="text-amber-100 font-medium">
                  러닝화 수명 차감이 일시 정지
                </span>
                됩니다.
              </p>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div
          className="w-20 h-8.5 bg-[#1E7F4F] hover:bg-[#1e7f4ece] rounded-2xl text-white
            flex justify-center
            relative left-70 top-3 font-light mb-30 max-[361px]:left-60"
          onClick={handleSave}
        >
          <button disabled={isSaving}>{isSaving ? "Saving..." : "Save"}</button>
        </div>
      </div>

      <TabBar />

      {shoeConfirm && (
        <div className="fixed inset-0 z-100 flex items-center justify-center">
          <div
            className="absolute inset-0 mx-auto  max-w-110 bg-black/60"
            onClick={handleConfirmNo}
          />
          <div className="relative z-10 bg-[#1B242C] text-white px-6 py-6 rounded-2xl shadow-2xl border border-[#242E35] w-[80%] max-w-sm flex flex-col gap-5">
            <div className="flex flex-col items-center text-center mt-2">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1E7F4F] text-xl font-bold mb-4">
                !
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                신발 변경 알림
              </h3>
              <p className="text-[#CBD5E1] text-sm font-medium leading-relaxed">
                새 러닝화 구매하셨나요? <br />
                새로운 신발로 저장 시
                <span className="text-[#1E7F4F] font-bold">
                  수명이 초기화
                </span>{" "}
                됩니다.
              </p>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                onClick={handleConfirmNo}
                className="flex-1 py-3 rounded-xl bg-[#242E35] text-[#CBD5E1] text-sm font-medium hover:bg-slate-700 transition-colors"
              >
                아니오
              </button>
              <button
                onClick={handleConfirmYes}
                className="flex-1 py-3 rounded-xl bg-[#1E7F4F] text-white text-sm font-medium hover:bg-[#16663f] transition-colors"
              >
                예
              </button>
            </div>
          </div>
        </div>
      )}

      {open === "brand" && (
        <SelectModal
          openKey="brand"
          title="Select Brand"
          options={BRANDS}
          value={value.brand}
          onSelect={(item) => {
            setValue({
              brand: item,
              model: "",
              distance: value.distance,
              type: value.type,
              shoeAge: "0개월",
            });
            setOpen(null);
          }}
          onClose={() => setOpen(null)}
        />
      )}

      {open === "model" && value.brand && (
        <SelectModal
          openKey="model"
          title="Select Model"
          options={MODELS[value.brand] ?? []}
          value={value.model}
          onSelect={(item) => {
            setValue((prev) => ({ ...prev, model: item, shoeAge: "0개월" }));
            setOpen(null);
          }}
          onClose={() => setOpen(null)}
        />
      )}

      {open === "distance" && (
        <SelectModal
          openKey="distance"
          title="Running Distance"
          options={DISTANCE_OPTIONS}
          value={value.distance}
          onSelect={(item) => {
            setValue((prev) => ({ ...prev, distance: item }));
            setOpen(null);
          }}
          onClose={() => setOpen(null)}
        />
      )}

      {open === "type" && (
        <SelectModal
          openKey="type"
          title="Running Type"
          options={RUNNING_TYPE_OPTIONS}
          value={value.type}
          onSelect={(item) => {
            setValue((prev) => ({ ...prev, type: item }));
            setOpen(null);
          }}
          onClose={() => setOpen(null)}
        />
      )}

      {/* 저장 시 뜨는 모달 */}
      {modalConfig.isOpen && (
        <div
          className="fixed inset-0 z-50 max-w-110 mx-auto flex items-center justify-center bg-black/60 transition-opacity"
          onClick={closeModal}
        >
          <div
            className="bg-[#242E35] w-80 rounded-2xl p-6 flex flex-col items-center shadow-xl transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[#CBD5E1] text-center font-medium mb-6 mt-2">
              {modalConfig.message}
            </p>

            <button
              onClick={closeModal}
              className="w-full h-11 bg-[#1E7F4F] hover:bg-[#196e43] text-white font-medium rounded-xl transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
}
