import { getClothMessages } from "../../i18n/cloth";

export const inputClassName =
  "w-full bg-white text-sm text-stone-800 outline-none transition dark:bg-zinc-900 dark:text-zinc-100";
export const labelClassName =
  "mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500 dark:text-zinc-400";
export const panelClassName =
  "rounded-[28px] border border-stone-200 bg-white/90 shadow-[0_18px_60px_rgba(68,64,60,0.08)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90 dark:shadow-[0_18px_60px_rgba(0,0,0,0.35)]";

export type ClothMessages = ReturnType<typeof getClothMessages>;
export type ClothCommonMessages = ClothMessages["common"];
export type ClothEditorMessages = ClothMessages["editor"];
