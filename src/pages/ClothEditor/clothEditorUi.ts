import { getClothMessages } from "../../i18n/cloth";

export const inputClassName =
  "w-full bg-white text-sm text-stone-800 outline-none transition";
export const labelClassName =
  "mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500";
export const panelClassName =
  "rounded-[28px] border border-stone-200 bg-white/90 shadow-[0_18px_60px_rgba(68,64,60,0.08)] backdrop-blur";

export type ClothMessages = ReturnType<typeof getClothMessages>;
export type ClothCommonMessages = ClothMessages["common"];
export type ClothEditorMessages = ClothMessages["editor"];
