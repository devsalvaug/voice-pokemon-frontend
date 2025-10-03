# 🎙️ Voicebot Pokémon (Frontend)

Aplicación web desarrollada en **Vue 3 + Vite + Vuetify** que permite interactuar por voz con un modelo de lenguaje (LLM) para consultar información de Pokémon y gestionar una lista de favoritos.

El bot escucha tus comandos por micrófono 🎤, interpreta lo que dices usando un **LLM (Gemini de Google AI)** y responde mostrando información desde **PokeAPI**.

---

## ✨ Funcionalidades

- 🎤 **Entrada de voz** en tiempo real (Web Speech API).
- 🤖 **Integración con un LLM (Gemini)** para interpretar comandos y devolver acciones JSON.
- 🔍 **Consulta de Pokémon** (nombre, tipos, altura y peso) desde PokeAPI.
- ❤️ **Gestión de favoritos** (guardar, listar y eliminar Pokémon).
- 🖼️ **Interfaz moderna y responsive** con **Vuetify**.
- 📜 **Historial de conversación** con modo collapse.
- 💡 **Diálogo inicial de ayuda** con ejemplos de uso.

---

## 🚀 Tecnologías utilizadas

- [Vue 3](https://vuejs.org/) + [Vite](https://vitejs.dev/)
- [Vuetify 3](https://vuetifyjs.com/)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [PokeAPI](https://pokeapi.co/)
- [Gemini API](https://ai.google.dev/)

---

## 📦 Instalación y ejecución

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/tuusuario/voicebot-pokemon-frontend.git
cd voicebot-pokemon-frontend
```

### 2️⃣ instalar dependencias

npm install

### 3️⃣ Ejecutar en modo desarrollo

npm run dev

La aplicación quedará corriendo en:
👉 http://localhost:5173

### 4️⃣ Build para producción

npm run build

💡 Ejemplos de uso

Puedes decir frases como:

🔍 Consultar Pokémon → “Dime información de Pikachu”

❤️ Guardar en favoritos → “Guarda a Charmander en favoritos”

📋 Listar favoritos → “Muéstrame mis favoritos”

❌ Eliminar de favoritos → “Quita a Pikachu de favoritos”
