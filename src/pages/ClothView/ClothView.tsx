import ClothGraphCanvas from "../../components/ClothGraphCanvas/ClothGraphCanvas";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import { useParams } from "react-router-dom";
import useLanguage from "../../hooks/useLanguage/useLanguage";
import { getClothMessages } from "../../i18n/cloth";
import ClothNodeDetailsPanel from "./ClothNodeDetailsPanel/ClothNodeDetailsPanel";
import ClothViewHeader from "./ClothViewHeader/ClothViewHeader";
import ClothViewLegend from "./ClothViewLegend/ClothViewLegend";
import useAuth from "../../hooks/useAuth/useAuth";
import useClothView from "../../hooks/useClothView/useClothView";

const ClothView = () => {
  const { lang } = useLanguage();
  const { common, view } = getClothMessages(lang);
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const {
    cloth,
    selectedNode,
    showLegend,
    descriptionOpen,
    isDeleteDialogOpen,
    setSelectedNode,
    setShowLegend,
    setDescriptionOpen,
    handleSelectNode,
    handleNodeTap,
    closeDeleteDialog,
    handleDelete,
  } = useClothView({
    id,
    deleteSuccessMessage: view.deleteSuccess,
    deleteErrorMessage: view.deleteError,
  });
  const nodeTypes = cloth ? [...new Set(cloth.nodes.map((node) => node.type))] : [];

  return (
    <div className="flex h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      {cloth && (
        <ClothViewHeader
          clothId={cloth.id}
          clothName={cloth.name}
          clothDescription={cloth.description}
          createdAt={cloth.createdAt}
          lang={lang}
          publishedOnLabel={view.publishedOn}
          authorLabel={view.author}
          editClothLabel={view.editCloth}
          deleteClothLabel={view.deleteCloth}
          hideDescriptionLabel={view.hideDescription}
          aboutThisClothLabel={view.aboutThisCloth}
          insightsLabel={view.insights}
          noDescriptionLabel={common.noDescription}
          descriptionOpen={descriptionOpen}
          onToggleDescription={() => setDescriptionOpen((current) => !current)}
          onDelete={handleDelete}
          isAuthenticated={isAuthenticated}
          view={view}
        />
      )}

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        <div className="flex-1 relative overflow-hidden">
          {!cloth && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-zinc-400">
                <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
                <span className="text-sm">
                  {common.loading}
                </span>
              </div>
            </div>
          )}

          {cloth && (
            <ClothViewLegend
              nodeTypes={nodeTypes}
              showLegend={showLegend}
              hideLegendLabel={view.hideLegend}
              legendLabel={view.legend}
              onToggleLegend={() => setShowLegend((current) => !current)}
            />
          )}

          {cloth && (
            <ClothGraphCanvas
              data={cloth}
              lang={lang}
              variant="view"
              selectedNodeId={selectedNode?.id ?? null}
              onSelectNode={handleSelectNode}
              onNodeTap={handleNodeTap}
              className="w-full h-full"
            />
          )}

        </div>

        {cloth && selectedNode && (
          <ClothNodeDetailsPanel
            cloth={cloth}
            selectedNode={selectedNode}
            informationLabel={view.information}
            relationshipsLabel={view.relationships}
            onClose={() => setSelectedNode(null)}
            onSelectNode={handleSelectNode}
          />
        )}
      </div>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title={common.confirmDeletion}
        description={view.deleteConfirm}
        confirmLabel={view.deleteCloth}
        cancelLabel={common.cancel}
        onCancel={closeDeleteDialog}
        onConfirm={() => {
          void handleDelete();
        }}
      />
    </div>
  );
};

export default ClothView;
