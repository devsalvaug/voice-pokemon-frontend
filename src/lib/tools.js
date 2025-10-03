// src/lib/tools.js

// --- PokeAPI ---
export async function getPokemon(name) {
  const r = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(
      name.toLowerCase()
    )}`
  );
  if (!r.ok) throw new Error("Pokémon no encontrado");
  const p = await r.json();
  return {
    name: p.name,
    height: p.height,
    weight: p.weight,
    types: p.types.map((t) => t.type.name),
    sprite: p.sprites?.front_default,
  };
}

// --- Favoritos (tu backend Express) ---
const API = "https://voice-pokemon-backend.onrender.com";

export async function listFavorites(userId) {
  const r = await fetch(
    `${API}/api/favorites?userId=${encodeURIComponent(userId)}`
  );
  return (await r.json()).favorites;
}

export async function saveFavorite(userId, name) {
  await fetch(`${API}/api/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, name }),
  });
}

export async function removeFavorite(userId, name) {
  await fetch(`${API}/api/favorites`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, name }),
  });
}
