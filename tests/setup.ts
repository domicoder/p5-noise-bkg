import { vi } from 'vitest';

class P5Mock {
    static lastInstance: P5Mock | null = null;
    setup = vi.fn();
    draw = vi.fn();
    createCanvas = vi.fn();
    background = vi.fn();
    noise = vi.fn(() => 0.5);
    noiseSeed = vi.fn();
    stroke = vi.fn();
    noFill = vi.fn();
    resizeCanvas = vi.fn();
    remove = vi.fn();
    windowResized = vi.fn();
    circle = vi.fn();
    cos = vi.fn((angle) => Math.cos(angle));
    sin = vi.fn((angle) => Math.sin(angle));
    TWO_PI = Math.PI * 2;

    constructor(sketch?: (p: P5Mock) => void, element?: HTMLElement | string) {
        P5Mock.lastInstance = this;
        if (typeof sketch === 'function') {
            sketch(this);
        }
    }
}

vi.mock('p5', () => {
    return {
        __esModule: true,
        default: vi.fn((sketch, element) => new P5Mock(sketch, element)),
    };
});
