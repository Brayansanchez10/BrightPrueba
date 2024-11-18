import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Implementa los listeners de eventos de Node aquí
    },
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },

  video: false,
  screenshotOnRunFailure: true,
  videosFolder: "cypress/videos",
  screenshotsFolder: "cypress/screenshots"
});
