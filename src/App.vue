<script setup>
import { ref, onMounted } from "vue";
import { startSTT, speak } from "./lib/speech.js";
import Footer from "./components/Footer.vue";

import { askLLM } from "./lib/llmClient.js";
import {
  getPokemon,
  listFavorites,
  saveFavorite,
  removeFavorite,
} from "./lib/tools.js";

const listening = ref(false);
const transcript = ref("");
const history = ref([]);
const lastPokemon = ref(null);
const favorites = ref([]);
const userId = "demo";
let rec = null;

// 🆕 Control del diálogo
const showDialog = ref(false);

// Mostrar diálogo automáticamente al cargar
onMounted(() => {
  showDialog.value = true;
});

const SYSTEM = `Eres un asistente por voz en español.
Si el usuario pide info de un Pokémon: responde SOLO con {"action":"GET_POKEMON","name":"<nombre>"}.
Si el usuario pide guardar en favoritos: {"action":"SAVE_FAVORITE","name":"<nombre>"}.
Si el usuario pide listar favoritos: {"action":"LIST_FAVORITES"}.
Si el usuario pide eliminar un favorito: {"action":"REMOVE_FAVORITE","name":"<nombre>"}.
Nunca mezcles texto con JSON.`;

async function handleUserText(text) {
  history.value.push({ role: "user", text });

  const llmText = await askLLM([
    { role: "system", content: SYSTEM },
    ...history.value.map((m) => ({ role: m.role, content: m.text })),
  ]);

  let action = null;
  try {
    const cleaned = llmText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();
    action = JSON.parse(cleaned);
  } catch {}

  if (action?.action === "GET_POKEMON") {
    try {
      const info = await getPokemon(action.name || "");
      lastPokemon.value = info;

      // Conversión de unidades (a metros y kilos)
      const heightMeters = info.height / 10;
      const weightKg = info.weight / 10;

      const msg = `Pokémon ${info.name}. 
Tipos: ${info.types.join(", ")}. 
Altura: ${heightMeters.toFixed(1)} m, 
Peso: ${weightKg.toFixed(1)} kg.`;

      history.value.push({ role: "assistant", text: msg });
      speak(msg);
    } catch {
      const msg = "No pude encontrar ese Pokémon.";
      history.value.push({ role: "assistant", text: msg });
      speak(msg);
    }
    return;
  }

  if (action?.action === "SAVE_FAVORITE") {
    await saveFavorite(userId, action.name || "");
    favorites.value = await listFavorites(userId);
    const msg = `Guardé ${action.name} en tus favoritos.`;
    history.value.push({ role: "assistant", text: msg });
    speak(msg);
    return;
  }

  if (action?.action === "LIST_FAVORITES") {
    favorites.value = await listFavorites(userId);
    const msg = favorites.value.length
      ? `Tienes ${favorites.value.length} favoritos: ${favorites.value.join(
          ", "
        )}.`
      : "Aún no tienes favoritos.";
    history.value.push({ role: "assistant", text: msg });
    speak(msg);
    return;
  }

  if (action?.action === "REMOVE_FAVORITE") {
    await removeFavorite(userId, action.name || "");
    favorites.value = await listFavorites(userId);
    const msg = `Eliminé ${action.name} de tus favoritos.`;
    history.value.push({ role: "assistant", text: msg });
    speak(msg);
    return;
  }

  history.value.push({ role: "assistant", text: llmText });
  speak(llmText);
}

function toggleMic() {
  if (!listening.value) {
    rec = startSTT(async (finalText) => {
      transcript.value = finalText;
      if (finalText.length > 0) {
        rec?.stop();
        listening.value = false;
        await handleUserText(finalText);
        transcript.value = "";
      }
    });
    listening.value = true;
  } else {
    rec?.stop();
    listening.value = false;
  }
}
</script>

<template>
  <v-app class="bg-grey-darken-4 text-white">
    <v-container class="fill-height d-flex flex-column">
      <!-- Header con botón de ayuda -->
      <v-app-bar color="blue-darken-4" dark flat>
        <v-toolbar-title>🎙️ Voicebot Pokémon</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon color="white" @click="showDialog = true">
          <v-icon>mdi-help-circle-outline</v-icon>
        </v-btn>
      </v-app-bar>

      <!-- 🎤 Botón moderno centrado -->
      <div class="mic-wrapper">
        <v-btn
          :color="listening ? 'red' : 'pink'"
          size="x-large"
          class="mic-btn"
          @click="toggleMic"
          elevation="12"
        >
          {{ listening ? "Detener 🎤" : "Hablar 🎙️" }}
        </v-btn>
        <!-- Efecto de pulso cuando escucha -->
        <div v-if="listening" class="pulse-ring"></div>
      </div>

      <!-- Último mensaje -->
      <v-card class="ma-4 pa-3" color="grey-darken-3">
        <div v-if="history.length">
          <div class="text-caption grey--text">
            {{
              history[history.length - 1].role === "user" ? "Tú" : "Asistente"
            }}
          </div>
          <div>{{ history[history.length - 1].text }}</div>
        </div>
      </v-card>

      <!-- Último Pokémon consultado -->
      <v-card
        v-if="lastPokemon"
        class="ma-6 pa-6 text-center d-flex flex-column align-center justify-center pokemon-card"
        elevation="12"
      >
        <h2 class="text-h5 font-weight-bold text-capitalize mb-3">
          {{ lastPokemon.name }}
        </h2>
        <v-avatar size="150" class="mb-4" color="grey-darken-3">
          <v-img :src="lastPokemon.sprite" alt="sprite" contain />
        </v-avatar>
        <div class="text-subtitle-1 mb-1">
          <strong>Tipos:</strong> {{ lastPokemon.types.join(", ") }}
        </div>
        <div class="text-subtitle-2 text-grey-lighten-1">
          Altura: {{ (lastPokemon.height / 10).toFixed(1) }} m | Peso:
          {{ (lastPokemon.weight / 10).toFixed(1) }} kg
        </div>
      </v-card>

      <!-- Favoritos -->
      <v-card v-if="favorites.length" class="ma-4 pa-3" color="yellow-darken-2">
        <h3 class="text-h6">⭐ Mis Favoritos</h3>
        <v-chip-group column>
          <v-chip
            v-for="f in favorites"
            :key="f"
            class="ma-1"
            color="yellow-darken-4"
          >
            {{ f }}
          </v-chip>
        </v-chip-group>
      </v-card>

      <!-- Collapse con historial -->
      <v-expansion-panels multiple class="ma-4">
        <v-expansion-panel>
          <v-expansion-panel-title class="bg-grey-darken-3 text-white">
            📜 Ver historial completo
          </v-expansion-panel-title>
          <v-expansion-panel-text class="bg-grey-darken-4 text-grey-lighten-3">
            <v-list bg-color="transparent">
              <v-list-item
                v-for="(m, i) in history.slice(0, history.length - 1)"
                :key="i"
              >
                <v-list-item-content>
                  <v-list-item-title
                    class="text-caption text-blue-grey-lighten-3"
                  >
                    {{ m.role === "user" ? "Tú" : "Asistente" }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-grey-lighten-1">
                    {{ m.text }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <!-- 🆕 Diálogo de bienvenida -->
      <v-dialog v-model="showDialog" max-width="500">
        <v-card>
          <v-card-title class="text-h6 font-weight-bold">
            👋 Bienvenido a Voicebot Pokémon
          </v-card-title>
          <v-card-text>
            <p>Este bot puede ayudarte con estas acciones:</p>
            <ul>
              <li>
                🔍 <strong>Consultar información</strong> de un Pokémon.<br />Ej:
                “Dime información de Pikachu”.
              </li>
              <li>
                ❤️ <strong>Guardar favoritos</strong>.<br />Ej: “Guarda a
                Charmander en favoritos”.
              </li>
              <li>
                📋 <strong>Listar favoritos</strong>.<br />Ej: “Muéstrame mis
                favoritos”.
              </li>
              <li>
                ❌ <strong>Eliminar un favorito</strong>.<br />Ej: “Quita a
                Pikachu de favoritos”.
              </li>
            </ul>
            <p class="mt-3">🎙️ Solo di el comando y el bot hará el resto.</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-3" text @click="showDialog = false">
              ¡Entendido!
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <Footer> </Footer>
    </v-container>
  </v-app>
</template>

<style scoped>
.mic-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10%;
}

.mic-btn {
  border-radius: 10%;
  width: 120px;
  height: 120px;
  font-size: 1rem;
  font-weight: bold;
  text-transform: none;
}

/* Efecto de pulso cuando está escuchando */
.pulse-ring {
  position: absolute;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: rgba(255, 64, 129, 0.3);
  animation: pulse 1.5s infinite;
  z-index: -1;
}

.pokemon-card {
  background: linear-gradient(135deg, #1e293b, #0f172a);
  color: white;
  border-radius: 20px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.pokemon-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.4);
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 0.7;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}
</style>
