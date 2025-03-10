<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import type p5Types from 'p5';
import {
    createSketch,
    removeP5Instance,
    handleResize,
    addResizeListener,
    removeResizeListener,
} from './utils/P5NoiseBkgUtils';

const el = ref<HTMLDivElement | null>(null);
let myP5: p5Types | undefined;

onMounted(async () => {
    const p5Module = await import('p5');
    const p5 = p5Module.default as typeof p5Types;

    if (el.value) {
        myP5 = new p5(createSketch, el.value);
    }

    // native resize event listener
    addResizeListener(myP5);
});

onUnmounted(() => {
    removeResizeListener(myP5);
    removeP5Instance(myP5);
});
</script>

<template>
    <div ref="el" class="p5-noise-bkg" />
</template>

<style lang="css">
.p5-noise-bkg {
    pointer-events: none;
    position: fixed;
    inset: 0;
    z-index: -1;
}
</style>
