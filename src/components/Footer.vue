<template>
  <v-footer class="bg-grey-darken-4 text-white pa-1" app>
    <v-container class="text-center">
      <!-- Botones con tooltips -->
      <div class="mb-3 d-flex justify-center">
        <!-- Backend -->
        <v-tooltip text="Repositorio Backend" location="top">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              href="https://github.com/devsalvaug/voice-pokemon-backend"
              target="_blank"
              icon
              class="mx-2"
              color="blue-lighten-2"
            >
              <v-icon>mdi-server</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <!-- Frontend -->
        <v-tooltip text="Repositorio Frontend" location="top">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              href="https://github.com/devsalvaug/voice-pokemon-frontend"
              target="_blank"
              icon
              class="mx-2"
              color="green-lighten-2"
            >
              <v-icon>mdi-vuejs</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </div>

      <!-- Texto -->
      <div class="text-caption text-grey-lighten-1">
        Creación de <strong>Salvador UG</strong> 🚀
      </div>
      <div class="text-caption">
        Repositorios disponibles en
        <a
          href="https://github.com/devsalvaug/voice-pokemon-backend"
          target="_blank"
          class="text-blue-lighten-3"
          >Backend</a
        >
        y
        <a
          href="https://github.com/devsalvaug/voice-pokemon-frontend"
          target="_blank"
          class="text-blue-lighten-3"
          >Frontend</a
        >
      </div>
    </v-container>
  </v-footer>
</template>
