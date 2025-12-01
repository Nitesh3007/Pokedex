const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors()); 
app.use(express.json());

const PORT = process.env.PORT || 3001;
const POKEAPI_BASE = 'https://pokeapi.co/api/v2';

const LRU = require("lru-cache");
const cache = new LRU.LRUCache({
  max: 100,
  ttl: 1000 * 60
});


async function fetchPokemonFromPokeapi(name) {
  const idOrName = encodeURIComponent(name.toLowerCase());
  const url = `${POKEAPI_BASE}/pokemon/${idOrName}`;
  const resp = await axios.get(url, { timeout: 10000 });
  const pokemon = resp.data;

  // try to fetch species for flavor text
  let species = null;
  if (pokemon.species && pokemon.species.url) {
    try {
      const s = await axios.get(pokemon.species.url, { timeout: 10000 });
      species = s.data;
    } catch (e) {
      species = null;
    }
  }

  return { pokemon, species };
}

// Trim and structure data we want to cache/return
function prepareCacheObject(raw) {
  const p = raw.pokemon;
  return {
    id: p.id,
    name: p.name,
    sprites: p.sprites,
    types: p.types,
    abilities: p.abilities,
    stats: p.stats,
    height: p.height,
    weight: p.weight,
    moves: p.moves.slice(0, 8), // small sample
    species: raw.species
      ? {
          flavor_text: (raw.species.flavor_text_entries || []).find(e => e.language.name === 'en')?.flavor_text || null,
          habitat: raw.species.habitat?.name || null,
          is_legendary: raw.species.is_legendary || false,
          evolution_chain_url: raw.species.evolution_chain?.url || null
        }
      : null,
    fetchedAt: new Date().toISOString()
  };
}

// GET /api/pokemon/:name
// query param force=true to bypass cache
app.get('/api/pokemon/:name', async (req, res) => {
  const name = req.params.name;
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: 'pokemon name required' });
  }

  const key = name.toLowerCase();
  const force = req.query.force === 'true';

  try {
    if (!force && cache.has(key)) {
      const data = cache.get(key);
      return res.json({ fromCache: true, data });
    }

    // fetch
    const raw = await fetchPokemonFromPokeapi(name);
    const toCache = prepareCacheObject(raw);
    cache.set(key, toCache);

    return res.json({ fromCache: false, data: toCache });
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ error: 'Pokemon not found' });
    }
    console.error('error fetching pokemon', err.message || err);
    return res.status(500).json({ error: 'internal server error' });
  }
});

// cache stats for debug
app.get('/api/cache/stats', (req, res) => {
  res.json({
    size: cache.size,
    keysPreview: cache.keys().slice(0, 50)
  });
});

app.listen(PORT, () => {
  console.log(`Pokedex backend running at http://localhost:${PORT}`);
});
