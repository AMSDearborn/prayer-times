import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  if (mode === "lib") {
    return {
      plugins: [tailwindcss(), react()],
      build: {
        lib: {
          entry: resolve(__dirname, "src/index.js"),
          name: "PrayerTimesWidget",
          fileName: "prayer-times-widget",
        },
        rollupOptions: {
          external: ["react", "react-dom", "react/jsx-runtime"],
          output: {
            globals: {
              react: "React",
              "react-dom": "ReactDOM",
              "react/jsx-runtime": "jsxRuntime",
            },
          },
        },
        cssCodeSplit: false,
      },
    };
  }

  // Default dev/build mode (for local development with the full app)
  return {
    plugins: [tailwindcss(), react()],
    resolve: { tsconfigPaths: true },
  };
});
