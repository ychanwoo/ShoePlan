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

export default function StatsPage() {
  const pathname = usePathname();
  const [isRunning, setIsRunning] = useState(true);
  const [loading, setLoading] = useState(false);
  const [, setIsFetching] = useState(true);
  const [open, setOpen] = useState<
    null | "brand" | "model" | "distance" | "type"
  >(null);

  const [value, setValue] = useState({
    brand: "",
    model: "",
    distance: "",
    type: "",
    shoeAge: "",
  });

  //* 기존 저장된 데이터 가져오기
  const fetchUserData = useCallback(async () => {
    setIsFetching(true);
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
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsFetching(false);
    }
  }, []);

  // * 경로가 stats일 경우 리렌더링
  useEffect(() => {
    if (pathname === "/stats") fetchUserData();
  }, [pathname, fetchUserData]);

  //* update 되는 이벤트 핸들러
  const handleSave = async () => {
    if (loading) return;
    setLoading(true);

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
        }),
      });

      if (response.ok) {
        alert("러닝 데이터 저장 성공! 🏃‍♂️");
        fetchUserData();
      } else {
        const errorData = await response.json();
        alert("저장 실패: " + errorData.error);
      }
    } catch (err) {
      console.error(err);
      alert("오류 발생");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderBar title="Stats" />

      {/* Running modify */}
      <div className="space-y-5 pt-10 h-[calc(100vh-11vh)] overflow-y-auto">
        <div className="text-[#CBD5E1] bg-[#242E35] w-75 h-55 mx-auto pt-3 font-light rounded-2xl">
          <h2 className="text-xl ml-5 pb-3">Running</h2>
          {/* distance 선택 */}
          <div className="flex flex-col gap-y-2 w-75 text-[#CBD5E1] ml-5">
            <span>Running distance (Monthly)</span>
            <button
              className="flex items-center gap-2 border-b border-[#CBD5E1] w-30 justify-center"
              onClick={() => setOpen("distance")}
            >
              <span>{value.distance || "Select"}</span>
              <ChevronDown className="text-[#CBD5E1] relative left-5" />
            </button>
          </div>

          {/* type 선택 */}
          <div className="ml-5 pt-6 flex flex-col gap-y-2 w-75 text-[#CBD5E1]">
            <span>Running Type</span>
            <button
              className="flex items-center gap-2 border-b border-[#CBD5E1] w-30 justify-center disabled:text-[#cbd5e149]"
              onClick={() => setOpen("type")}
            >
              <span>{value.type || "Select"}</span>
              <ChevronDown className="text-[#CBD5E1] relative left-5" />
            </button>
          </div>
        </div>

        {/* Running shoe */}
        <div className="text-[#CBD5E1] bg-[#242E35] w-75 h-40 mx-auto pt-3 rounded-2xl font-light">
          <h2 className="text-xl ml-5 pb-3">Running Shoe</h2>
          <div className="text-[#CBD5E1] space-y-8">
            {/* Brand 선택 */}
            <div className="ml-5 flex items-center gap-x-10 w-75 text-[#CBD5E1]">
              <span>Brand</span>
              <button
                className="flex items-center gap-2 border-b border-[#CBD5E1] w-40 justify-center"
                onClick={() => setOpen("brand")}
              >
                <span>{value.brand || "Select"}</span>
                <ChevronDown className="text-[#CBD5E1] relative left-5" />
              </button>
            </div>

            {/* Model 선택 */}
            <div className="ml-5 flex items-center gap-x-10 w-75 text-[#CBD5E1]">
              <span>Model</span>
              <button
                disabled={!value.brand}
                className="flex items-center gap-2 border-b border-[#CBD5E1] w-40 justify-center disabled:text-[#cbd5e149]"
                onClick={() => setOpen("model")}
              >
                <span>{value.model || "Select"}</span>
                <ChevronDown className="text-[#CBD5E1] relative left-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Running status */}
        <div className="text-[#CBD5E1] bg-[#242E35] w-75 h-31.5 mx-auto pt-3 rounded-2xl font-light">
          <div className="flex gap-x-5">
            <h2 className="text-xl ml-5 pb-3">Running Status</h2>
            {/* toggle 구현 */}
            <div
              className={`
                w-14 h-7 flex items-center rounded-full p-2 cursor-pointer
                transition-colors
                ${isRunning ? "bg-[#1E7F4F]" : "bg-[#6B7280]"}
                `}
            >
              <div
                className={`
                w-6 h-6 bg-white rounded-full shadow
                transition-transform
                ${isRunning ? "translate-x-6" : "-translate-x-2"}
                `}
              />
            </div>
          </div>
          <div className="flex gap-x-3 pl-5 pt-3">
            <div className="w-22.5 h-6 bg-[#1E7F4F] rounded-2xl text-sm flex justify-center hover:bg-[#1e7f4ec9]">
              <button onClick={() => setIsRunning(true)}>Running</button>
            </div>
            <div className="w-22.5 h-6 bg-[#6B7280] rounded-2xl text-sm flex justify-center hover:bg-[#6b7280b8]">
              <button onClick={() => setIsRunning(false)}>Breaking</button>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div
          className="w-20 h-8.5 bg-[#1E7F4F] hover:bg-[#1e7f4ece] rounded-2xl text-white
            flex justify-center
            relative left-70 top-3 font-light mb-30"
          onClick={handleSave}
        >
          <button disabled={loading}>{loading ? "Saving..." : "Save"}</button>
        </div>
      </div>

      <TabBar />

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
    </>
  );
}
