import ClothGraphCanvas from "../../components/ClothGraphCanvas/ClothGraphCanvas";
import { useParams } from "react-router-dom";
import { getClothMessages } from "../../i18n/cloth";
import ClothNodeDetailsPanel from "./ClothNodeDetailsPanel/ClothNodeDetailsPanel";
import ClothViewHeader from "./ClothViewHeader/ClothViewHeader";
import ClothViewLegend from "./ClothViewLegend/ClothViewLegend";
import useClothView from "../../hooks/useClothView/useClothView";

interface Props {
  lang: "fr" | "en";
}

const ClothView = ({ lang }: Props) => {
  const { common, view } = getClothMessages(lang);
  const { id } = useParams<{ id: string }>();
  const {
    cloth,
    selectedNode,
    showLegend,
    descriptionOpen,
    setSelectedNode,
    setShowLegend,
    setDescriptionOpen,
    handleSelectNode,
  } = useClothView({ id });
  const nodeTypes = cloth ? [...new Set(cloth.nodes.map((node) => node.type))] : [];

  return (
    <div className="h-screen flex flex-col bg-zinc-50">
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
          hideDescriptionLabel={view.hideDescription}
          aboutThisClothLabel={view.aboutThisCloth}
          noDescriptionLabel={common.noDescription}
          descriptionOpen={descriptionOpen}
          onToggleDescription={() => setDescriptionOpen((current) => !current)}
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
    </div>
  );
};

export default ClothView;
