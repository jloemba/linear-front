import { Link, useParams } from "react-router-dom";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import useLanguage from "../../hooks/useLanguageHook/useLanguage";
import { getClothMessages } from "../../i18n/cloth";
import ClothIdentitySection from "./ClothIdentitySection/ClothIdentitySection";
import ClothNodesSection from "./ClothNodesSection/ClothNodesSection";
import ClothPreviewPanel from "./ClothPreviewPanel/ClothPreviewPanel";
import ClothQuickNavigation from "./ClothQuickNavigation/ClothQuickNavigation";
import ClothRelationshipsSection from "./ClothRelationshipsSection/ClothRelationshipsSection";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuthHook/useAuth";
import useClothEditor from "../../hooks/useClothEditorHook/useClothEditor";

const ClothEditor = () => {
  const { lang } = useLanguage();
  const { common, editor } = getClothMessages(lang);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    isCreateMode,
    isDeleteDialogOpen,
    form,
    loading,
    saving,
    error,
    nodeOptions,
    collapsedNodeIds,
    isNodesSectionCollapsed,
    isRelationshipsSectionCollapsed,
    setIsNodesSectionCollapsed,
    setIsRelationshipsSectionCollapsed,
    updateClothField,
    updateNode,
    updateProperty,
    updateRelationship,
    handleAddNode,
    handleRemoveNode,
    toggleNodeCollapse,
    handleAddProperty,
    handleRemoveProperty,
    handlePropertyTypeChange,
    handleAddRelationship,
    handleRemoveRelationship,
    scrollToNode,
    handleSubmit,
    openDeleteDialog,
    closeDeleteDialog,
    handleDelete,
  } = useClothEditor({
    id,
    lang,
    common,
    editor,
  });

  useEffect(() => {
    // if (!isAuthenticated) {
    //   navigate('/login');
    // }
  }, [isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] px-6 py-10">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1.65fr_0.95fr]">
            <div className="space-y-6">
              <div className="h-60 rounded-[28px] bg-white dark:bg-zinc-900" />
              <div className="h-96 rounded-[28px] bg-white dark:bg-zinc-900" />
            </div>
            <div className="h-[420px] rounded-[28px] bg-white dark:bg-zinc-900" />
          </div>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="px-6 py-16">
        <div className="mx-auto max-w-xl rounded-[28px] border border-red-200 bg-red-50 px-6 py-8 text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300">
          {error ?? editor.notFound}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] px-4 py-6 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-tight text-stone-900 dark:text-zinc-100">
              {isCreateMode ? editor.createTitle : editor.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={id ? `/cloth/${id}` : "/"}
              className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:text-stone-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:text-zinc-100"
            >
              {isCreateMode ? editor.backToHome : editor.backToCloth}
            </Link>

            {!isCreateMode && isAuthenticated && (
              <button
                type="button"
                onClick={() => {
                  openDeleteDialog();
                }}
                disabled={saving}
                className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/60"
              >
                {editor.deleteGraph}
              </button>
            )}
            {!isCreateMode && !isAuthenticated && (
              <button
                disabled
                className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-500 cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
              >
                {lang === 'fr' ? 'Connectez-vous pour supprimer' : 'Log in to delete'}
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.7fr_1.1fr] lg:items-start">
          <div className="space-y-6">
            <ClothIdentitySection
              form={form}
              editor={editor}
              onUpdateField={updateClothField}
            />

            <ClothNodesSection
              lang={lang}
              nodes={form.nodes}
              nodeOptions={nodeOptions}
              collapsedNodeIds={collapsedNodeIds}
              common={common}
              editor={editor}
              isSectionCollapsed={isNodesSectionCollapsed}
              onToggleSectionCollapse={() =>
                setIsNodesSectionCollapsed((current) => !current)
              }
              onAddNode={handleAddNode}
              onToggleNodeCollapse={toggleNodeCollapse}
              onRemoveNode={handleRemoveNode}
              onUpdateNode={updateNode}
              onAddProperty={handleAddProperty}
              onRemoveProperty={handleRemoveProperty}
              onUpdateProperty={updateProperty}
              onPropertyTypeChange={handlePropertyTypeChange}
            />

            <ClothRelationshipsSection
              relationships={form.relationships}
              nodeOptions={nodeOptions}
              common={common}
              editor={editor}
              isCollapsed={isRelationshipsSectionCollapsed}
              onToggleCollapse={() =>
                setIsRelationshipsSectionCollapsed((current) => !current)
              }
              onAddRelationship={handleAddRelationship}
              onRemoveRelationship={handleRemoveRelationship}
              onUpdateRelationship={updateRelationship}
            />
          </div>

          <aside className="space-y-6 lg:sticky lg:top-20">
            <ClothQuickNavigation
              nodes={form.nodes}
              editor={editor}
              onScrollToNode={scrollToNode}
              getPropertyCountLabel={(count) =>
                `${count} ${
                  lang === "fr"
                    ? "propriete(s)"
                    : `propert${count > 1 ? "ies" : "y"}`
                }`
              }
            />

            <ClothPreviewPanel
              form={form}
              lang={lang}
              isCreateMode={isCreateMode}
              saving={saving}
              error={error}
              onSubmit={() => {
                void handleSubmit();
              }}
            />
          </aside>
        </div>
      </form>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title={common.confirmDeletion}
        description={editor.deleteConfirm}
        confirmLabel={editor.deleteGraph}
        cancelLabel={common.cancel}
        isLoading={saving}
        onCancel={closeDeleteDialog}
        onConfirm={() => {
          void handleDelete();
        }}
      />
    </div>
  );
};

export default ClothEditor;
