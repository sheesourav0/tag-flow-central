
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
    }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: [
      "@emotion/react", 
      "@emotion/styled", 
      "@chakra-ui/react",
      "@chakra-ui/styled-system",
      "framer-motion"
    ],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          chakra: ["@chakra-ui/react"],
          emotion: ["@emotion/react", "@emotion/styled"],
        },
      },
    },
  },
}));
