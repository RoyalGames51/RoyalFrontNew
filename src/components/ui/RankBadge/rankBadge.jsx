import { getRankMeta } from "../../../utils/rank";

const SIZE_CLASSES = {
  sm: "px-2 py-0.5 text-[11px] gap-1",
  md: "px-3 py-1 text-label-md gap-2",
};

const ICON_SIZE_CLASSES = {
  sm: "text-[13px]",
  md: "text-sm",
};

export default function RankBadge({ tier, size = "md", className = "" }) {
  const meta = getRankMeta(tier);

  return (
    <div
      className={`inline-flex items-center rounded-full bg-gradient-to-r border border-white/10 font-bold shadow-sm ${SIZE_CLASSES[size]} ${meta.className} ${className}`}
    >
      <span
        className={`material-symbols-outlined ${ICON_SIZE_CLASSES[size]}`}
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        {meta.icon}
      </span>
      <span>{meta.label}</span>
    </div>
  );
}
