/// <reference types="vitest" />

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    test: {
        globals: true,
        environment: 'happy-dom',
        setupFiles: './tests/setup.ts',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'lcov'],
            reportsDirectory: 'coverage',
        },
    },
});
