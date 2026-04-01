import { useEffect, useState } from "react";
import ClothGraphCanvas from "../../../components/ClothGraphCanvas/ClothGraphCanvas";
import { getClothMessages } from "../../../i18n/cloth";
import type { IClothUpdatePayload } from "../../../types/cloth";

const panelClassName =
  "rounded-[28px] border border-stone-200 bg-white/90 shadow-[0_18px_60px_rgba(68,64,60,0.08)] backdrop-blur";

interface Props {
  form: IClothUpdatePayload;
  lang: "fr" | "en";
  saving: boolean;
  error: string | null;
  successMessage: string | null;
  onSubmit: () => void;
}

const ClothPreviewPanel = ({
  form,
  lang,
  saving,
  error,
  successMessage,
  onSubmit,
}: Props) => {
  const { preview } = getClothMessages(lang);
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
          <div className="overflow-hidden rounded-[24px] border border-stone-200 bg-white">
            <div className="flex items-center justify-between gap-4 border-b border-stone-200 px-4 py-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                  {preview.canvas}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:text-stone-900"
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
              className="h-64 w-full bg-stone-50"
            />
          </div>

          {error && (
            <div className="rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="rounded-[20px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {successMessage}
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
