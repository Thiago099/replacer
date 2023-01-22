import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from "vite"
import  jsxDomBuilderVitePlugin  from "jsx-dom-builder/vite-plugin"
// custom jsx pragma
export default defineConfig({
    plugins:[jsxDomBuilderVitePlugin()],
    resolve: {
        alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        }
    }
})