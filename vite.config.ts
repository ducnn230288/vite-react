import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
// import { VitePWA } from 'vite-plugin-pwa'
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 4000,
    watch: {
      usePolling: true
    }
  },
  plugins: [
    react(),
    tsconfigPaths(),
    svgr({
      exportAsDefault: false,

      // svgr options: https://react-svgr.com/docs/options/
      svgrOptions: {
        // ...
      },

      // esbuild options, to transform jsx to js
      esbuildOptions: {
        // ...
      },

      //  A minimatch pattern, or array of patterns, which specifies the files in the build the plugin should include. By default all svg files will be included.
      include: '**/*.svg',

      //  A minimatch pattern, or array of patterns, which specifies the files in the build the plugin should ignore. By default no files are ignored.
      exclude: '',
    }),
    //   VitePWA({
    //   devOptions: {
    //     enabled: true
    //   },
    //   registerType: 'autoUpdate',
    //   workbox: {
    //     clientsClaim: true,
    //     skipWaiting: true
    //   },
    //   manifest: {
    //     "short_name": "React App",
    //     "name": "Create React App Sample",
    //     "description": 'My Awesome App description',
    //     "icons": [
    //       {
    //         "src": "logo192.png",
    //         "type": "image/png",
    //         "sizes": "192x192"
    //       },
    //       {
    //         "src": "logo512.png",
    //         "type": "image/png",
    //         "sizes": "512x512"
    //       }
    //     ],
    //     "start_url": "/?utm_source=homescreen",
    //     "display": "standalone",
    //     "theme_color": "#000000",
    //     "background_color": "#ffffff",
    //     "orientation": "portrait"
    //   }
    // })
  ],
  build: {
    outDir: './build',
  },
  resolve: {
    alias: [{ find: /^~/, replacement: '' }],
  },
});
