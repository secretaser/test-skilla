/* eslint-disable no-undef */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';
import path from "path";

export default defineConfig({
    plugins: [react(), svgr()],
    server: {
        open: true
    },
    resolve: {
        alias: {
            "~": path.resolve(__dirname, "src"),
        },
    },
})
