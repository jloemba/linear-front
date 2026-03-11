import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import cytoscape from 'cytoscape';
import { fetchGraphById } from '../../api/graphApi';
import type { IGraphDetail, IGraphNode } from '../../types/graph';

const GraphView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [graph, setGraph] = useState<IGraphDetail | null>(null);
  const [selectedNode, setSelectedNode] = useState<IGraphNode | null>(null);
  const [lang, setLang] = useState<'fr' | 'en'>('fr');

  useEffect(() => {
    if (!id) return;
    fetchGraphById(id).then(setGraph);
  }, [id]);

  useEffect(() => {
    if (!graph || !containerRef.current) return;

    const cy = cytoscape({
      container: containerRef.current,
      elements: [
        ...graph.nodes.map(node => ({
          data: { id: node.id, label: node.label, type: node.type }
        })),
        ...graph.relationships.map(rel => ({
          data: { id: rel.id, source: rel.fromId, target: rel.toId, label: rel.type }
        }))
      ],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#3F3F46',
            'label': 'data(label)',
            'color': '#FFFFFF',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': '11px',
            'font-family': 'Inter, sans-serif',
            'width': '130px',
            'height': '40px',
            'shape': 'roundrectangle',
            'text-wrap': 'wrap',
            'text-max-width': '120px',
            'border-width': 0,
          }
        },
        {
          selector: 'node:selected',
          style: {
            'background-color': '#18181B',
            'border-width': 2,
            'border-color': '#A1A1AA',
          }
        },
        {
          selector: 'node:hover',
          style: {
            'background-color': '#52525B',
            'cursor': 'pointer',
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 1.5,
            'line-color': '#D4D4D8',
            'target-arrow-color': '#D4D4D8',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'font-size': '9px',
            'color': '#A1A1AA',
            'font-family': 'Inter, sans-serif',
            'text-rotation': 'autorotate',
            'text-background-color': '#FAFAFA',
            'text-background-opacity': 1,
            'text-background-padding': '2px',
          }
        },
        {
          selector: 'edge:selected',
          style: {
            'line-color': '#71717A',
            'target-arrow-color': '#71717A',
          }
        }
      ],
      layout: {
        name: 'breadthfirst',
        directed: true,
        padding: 40,
        spacingFactor: 1.8,
      }
    });

    cy.on('tap', 'node', evt => {
      const nodeId = evt.target.data('id');
      const found = graph.nodes.find(n => n.id === nodeId) ?? null;
      setSelectedNode(found);
    });

    cy.on('tap', evt => {
      if (evt.target === cy) setSelectedNode(null);
    });

    return () => cy.destroy();
  }, [graph]);

  return (
    <div className="h-screen flex flex-col bg-zinc-50">

      {/* Header */}
      <header className="shrink-0 bg-white border-b border-gray-200 h-14 flex items-center px-6 gap-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {lang === 'fr' ? 'Retour' : 'Back'}
        </button>

        <div className="h-4 w-px bg-gray-200" />

        <h1 className="text-sm font-semibold text-zinc-900 truncate flex-1">
          {graph?.name ?? '...'}
        </h1>

        <div className="flex items-center gap-3 shrink-0 text-xs text-zinc-400">
          <span>{graph?.nodes.length ?? 0} {lang === 'fr' ? 'nœuds' : 'nodes'}</span>
          <span>·</span>
          <span>{graph?.relationships.length ?? 0} {lang === 'fr' ? 'relations' : 'edges'}</span>
        </div>

        <button
          onClick={() => setLang(l => l === 'fr' ? 'en' : 'fr')}
          className="text-xs font-medium text-zinc-400 hover:text-zinc-900 transition-colors"
        >
          {lang === 'fr' ? 'EN' : 'FR'}
        </button>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Graph */}
        <div className="flex-1 relative">
          {!graph && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-zinc-400">
                <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
                <span className="text-sm">{lang === 'fr' ? 'Chargement...' : 'Loading...'}</span>
              </div>
            </div>
          )}
          <div ref={containerRef} className="w-full h-full" />
        </div>

        {/* Sidebar */}
        {selectedNode && (
          <aside className="w-80 shrink-0 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-6">

              {/* Close */}
              <div className="flex items-start justify-between mb-6">
                <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600">
                  {selectedNode.type}
                </span>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-zinc-400 hover:text-zinc-900 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Label */}
              <h2 className="text-xl font-bold text-zinc-900 mb-6">
                {selectedNode.label}
              </h2>

              {/* Relations */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                  {lang === 'fr' ? 'Relations' : 'Relationships'}
                </h3>
                <div className="flex flex-col gap-2">
                  {graph?.relationships
                    .filter(r => r.fromId === selectedNode.id || r.toId === selectedNode.id)
                    .map(rel => {
                      const isFrom = rel.fromId === selectedNode.id;
                      const otherId = isFrom ? rel.toId : rel.fromId;
                      const otherNode = graph.nodes.find(n => n.id === otherId);
                      return (
                        <div
                          key={rel.id}
                          className="flex items-center gap-2 p-3 bg-zinc-50 rounded-xl text-sm"
                        >
                          <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${isFrom ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600'}`}>
                            {isFrom ? '→' : '←'}
                          </span>
                          <div className="flex flex-col min-w-0">
                            <span className="text-zinc-400 text-xs truncate">{rel.type}</span>
                            <span className="text-zinc-900 font-medium truncate">{otherNode?.label}</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default GraphView;