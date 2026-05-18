import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Build optimizations: disable source maps in production and split large vendor chunks
  build: {
    sourcemap: mode === "development",
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) return 'vendor.react';
            if (id.includes('@tanstack/react-query')) return 'vendor.react-query';
            if (id.includes('recharts')) return 'vendor.recharts';
            if (id.includes('framer-motion')) return 'vendor.framer-motion';
            if (id.includes('@supabase') || id.includes('supabase')) return 'vendor.supabase';
            if (id.includes('@radix-ui') || id.includes('cmdk') || id.includes('lucide-react')) return 'vendor.ui';
            if (id.includes('embla-carousel-react')) return 'vendor.carousel';
            if (id.includes('sonner')) return 'vendor.sonner';
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 700,
  },
}));
