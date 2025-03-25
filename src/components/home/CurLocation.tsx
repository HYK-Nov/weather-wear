import { TbCurrentLocation } from "react-icons/tb";

export default function CurLocation() {
  return (
    <div className="flex items-center gap-x-2">
      <p className={"text-2xl font-bold text-neutral-700"}>금천구 가산동</p>
      <button>
        <TbCurrentLocation className={"size-6 text-neutral-600"} />
      </button>
    </div>
  );
}
