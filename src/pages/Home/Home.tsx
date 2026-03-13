import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import GraphCard from '../../components/GraphCard/GraphCard';
import { fetchAllGraphs } from '../../api/graphApi';
import type { IGraphSummary } from '../../types/graph';

const Home = () => {
  const [graphs, setGraphs] = useState<IGraphSummary[]>([]);
  const [filtered, setFiltered] = useState<IGraphSummary[]>([]);
  const [lang, setLang] = useState<'fr' | 'en'>('fr');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllGraphs()
      .then(data => {
        const list: IGraphSummary[] = data.graphs ?? [];
        setGraphs(list);
        setFiltered(list);
      })
      .catch(err => console.error('Failed to fetch graphs', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (query: string) => {
    const q = query.toLowerCase();
    setFiltered(graphs.filter(g => g.name.toLowerCase().includes(q)));
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <Header
        onSearch={handleSearch}
        lang={lang}
        onToggleLang={() => setLang(l => l === 'fr' ? 'en' : 'fr')}
      />

      {/* Hero */}
      <section className="max-w-12xl mx-auto px-6 pt-16 pb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
          {lang === 'fr' ? 'Explore la connaissance autrement' : 'Explore knowledge differently'}
        </p>
        <h1 className="text-5xl font-bold text-zinc-900 leading-tight max-w-2xl">
          {lang === 'fr'
            ? 'La connaissance est relationnelle.'
            : 'Knowledge is relational.'}
        </h1>
        <p className="mt-4 text-lg text-zinc-500 max-w-xl">
          {lang === 'fr'
            ? "Explore des sujets complexes à travers des graphes interactifs. De l'histoire à la culture, visualise les connexions qui font le monde."
            : 'Explore complex topics through interactive graphs. From history to culture, visualize the connections that shape the world.'}
        </p>
      </section>

      {/* Grid */}
      <section className="max-w-12xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">
            {lang === 'fr'
              ? `${filtered.length} sujets disponibles`
              : `${filtered.length} topics available`}
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-zinc-100 rounded-full w-16 mb-4" />
                <div className="h-5 bg-zinc-100 rounded-full w-3/4 mb-2" />
                <div className="h-4 bg-zinc-100 rounded-full w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.346A3.004 3.004 0 0012 15c-.98 0-1.852-.462-2.414-1.178l-.347-.346z" />
              </svg>
            </div>
            <p className="text-zinc-500 font-medium">
              {lang === 'fr' ? 'Aucun sujet trouvé.' : 'No topics found.'}
            </p>
            <p className="text-zinc-400 text-sm mt-1">
              {lang === 'fr' ? 'Essaie un autre mot clé.' : 'Try another keyword.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(graph => (
              <GraphCard
                key={graph.id}
                graph={graph}
                onClick={id => navigate(`/graph/${id}`)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;