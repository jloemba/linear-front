import { useEffect, useState } from "react";
import ClothGraphCanvas from "../../../components/ClothGraphCanvas/ClothGraphCanvas";
import { getClothMessages } from "../../../i18n/cloth";
import type { IClothUpdatePayload } from "../../../types/cloth";

const panelClassName =
  "rounded-[28px] border border-stone-200 bg-white/90 shadow-[0_18px_60px_rgba(68,64,60,0.08)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90 dark:shadow-[0_18px_60px_rgba(0,0,0,0.35)]";

interface Props {
  form: IClothUpdatePayload;
  lang: "fr" | "en";
  isCreateMode: boolean;
  saving: boolean;
  error: string | null;
  onSubmit: () => void;
}

const ClothPreviewPanel = ({
  form,
  lang,
  isCreateMode,
  saving,
  error,
  onSubmit,
}: Props) => {
  const { editor, preview } = getClothMessages(lang);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const activeSelectedNodeId = form.nodes.some(
    (node) => node.id === selectedNodeId,
  )
    ? selectedNodeId
    : null;

  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  return (
    <>
      <section className={`${panelClassName} overflow-hidden`}>
        <div className="bg-[linear-gradient(135deg,#292524_0%,#0c0a09_100%)] px-6 py-5 text-white">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="mt-2 text-2xl font-semibold">
                {preview.livePreview}
              </h2>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-4">
          <div className="overflow-hidden rounded-[24px] border border-stone-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center justify-between gap-4 border-b border-stone-200 px-4 py-3 dark:border-zinc-800">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500 dark:text-zinc-400">
                  {preview.canvas}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:text-stone-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:text-zinc-100"
              >
                {preview.fullscreenMode}
              </button>
            </div>
            <ClothGraphCanvas
              data={form}
              lang={lang}
              variant="editor"
              selectedNodeId={activeSelectedNodeId}
              onSelectNode={setSelectedNodeId}
              className="h-64 w-full bg-stone-50 dark:bg-zinc-900"
            />
          </div>

          {error && (
            <div className="rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <button
              type="button"
              onClick={onSubmit}
              disabled={saving}
              className="w-full rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300 disabled:text-emerald-50"
            >
              {saving
                ? preview.saveInProgress
                : isCreateMode
                  ? editor.createGraph
                  : preview.saveChanges}
            </button>
          </div>
        </div>
      </section>

      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm mt-12">
          <div className="flex h-full flex-col overflow-hidden rounded-[32px] border border-stone-700 bg-stone-950 text-white">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase">
                  {preview.expandedFullscreenPreview}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
              >
                {preview.close}
              </button>
            </div>

            <ClothGraphCanvas
              data={form}
              lang={lang}
              variant="editor"
              isFullscreen
              selectedNodeId={activeSelectedNodeId}
              onSelectNode={setSelectedNodeId}
              className="flex-1 border border-white/10 bg-stone-900"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ClothPreviewPanel;
