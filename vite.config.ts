import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
    plugins: [vue()],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'P5NoiseBkg',
            fileName: (format) => `p5-noise-bkg.${format}.js`,
        },
        rollupOptions: {
            external: ['vue', 'p5'],
            output: {
                globals: {
                    vue: 'Vue',
                    p5: 'p5',
                },
            },
        },
    },
});
