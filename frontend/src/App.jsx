import React, { useState } from "react";

function PokemonCard({ p }) {
  if (!p) return null;
  const sprite = p.sprites?.other?.["official-artwork"]?.front_default || p.sprites?.front_default;

  return (
    <div className="card">
      <div className="card-top">
        <img src={sprite} alt={p.name} className="sprite" />
        <div>
          <h1 className="capitalize">{p.name} <span className="muted">#{p.id}</span></h1>
          <div><strong>Types:</strong> {p.types.map(t => t.type.name).join(", ")}</div>
          <div><strong>Abilities:</strong> {p.abilities.map(a => a.ability.name).join(", ")}</div>
          <div><strong>Height:</strong> {p.height} | <strong>Weight:</strong> {p.weight}</div>
        </div>
      </div>

      <div className="stats">
        <h3>Base Stats</h3>
        {p.stats.map(s => (
          <div key={s.stat.name} className="stat-row">
            <div className="stat-name">{s.stat.name}</div>
            <div className="stat-value">{s.base_stat}</div>
            <div className="bar">
              <div className="bar-filled" style={{ width: `${Math.min(100, s.base_stat)}%` }} />
            </div>
          </div>
        ))}
      </div>

      {p.species?.flavor_text && (
        <blockquote className="flavor">{p.species.flavor_text.replace(/\n|\f/g, " ")}</blockquote>
      )}

      <div className="moves">
        <strong>Moves (sample):</strong>
        <div>{p.moves.slice(0, 6).map(m => <span key={m.move.name} className="move">{m.move.name}</span>)}</div>
      </div>
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  async function search(e) {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setErr(null);
    setPokemon(null);
    try {
      const res = await fetch(`http://localhost:3001/api/pokemon/${encodeURIComponent(query)}`);
      if (!res.ok) {
        const body = await res.json().catch(()=>({ error: 'unknown' }));
        throw new Error(body.error || 'Request failed');
      }
      const json = await res.json();
      setPokemon(json.data);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header>
        <h2>Pokedex Search</h2>
        <p>Search for a Pokémon name or id (e.g., <em>pikachu</em>, <em>25</em>).</p>
      </header>

      <form onSubmit={search} className="search-row">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Enter pokemon name or id..."
        />
        <button type="submit">Search</button>
        <button type="button" onClick={() => { setQuery(''); setPokemon(null); setErr(null); }}>
          Clear
        </button>
      </form>

      {loading && <div className="status">Loading…</div>}
      {err && <div className="status error">Error: {err}</div>}
      {pokemon && <PokemonCard p={pokemon} />}
    </div>
  );
}
