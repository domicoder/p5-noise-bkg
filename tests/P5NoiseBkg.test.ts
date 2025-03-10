import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
    getForceOnPoint,
    addPoints,
    createSketch,
    removeP5Instance,
    addResizeListener,
    removeResizeListener,
    handleResize,
} from '../src/utils/P5NoiseBkgUtils';
import P5NoiseBkg from '../src/P5NoiseBkg.vue';
import p5 from 'p5';
import { P5NoiseBkg as P5NoiseBkgTest } from '../src/index';

const p5Mock = {
    setup: vi.fn(),
    draw: vi.fn(),
    createCanvas: vi.fn(),
    background: vi.fn(),
    stroke: vi.fn(),
    noFill: vi.fn(),
    noiseSeed: vi.fn(),
    resizeCanvas: vi.fn(),
    remove: vi.fn(),
    noise: vi.fn(() => 0.5),
    TWO_PI: Math.PI * 2,
    cos: vi.fn((angle) => Math.cos(angle)),
    sin: vi.fn((angle) => Math.sin(angle)),
    circle: vi.fn(),
} as unknown as p5;

describe('P5NoiseBkg Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should export P5NoiseBkg component', () => {
        expect(P5NoiseBkgTest).toBeDefined();
    });

    it('mounts properly', () => {
        const wrapper = mount(P5NoiseBkg);
        expect(wrapper.exists()).toBe(true);
    });

    it('has a fixed positioned div', () => {
        const wrapper = mount(P5NoiseBkg);
        const div = wrapper.find('div');
        expect(div.attributes('class')).toContain('p5-noise-bkg');
    });

    it('getForceOnPoint() returns a valid angle', () => {
        const angle = getForceOnPoint(p5Mock, 100, 100, 1);
        expect(angle).toBeGreaterThanOrEqual(-p5Mock.TWO_PI);
        expect(angle).toBeLessThanOrEqual(p5Mock.TWO_PI);
    });

    it('addPoints() generates a valid point grid', () => {
        const points = addPoints(100, 100, 0);
        expect(points.length).toBeGreaterThan(0);
        expect(points[0]).toHaveProperty('x');
        expect(points[0]).toHaveProperty('y');
        expect(points[0]).toHaveProperty('opacity');
    });

    it('calls p5.setup() on mount', async () => {
        createSketch(p5Mock);
        p5Mock.setup();
        expect(p5Mock.createCanvas).toHaveBeenCalledTimes(1);
        expect(p5Mock.background).toHaveBeenCalledWith('#fefefe');
    });

    it('calls p5.draw() to update the background', async () => {
        createSketch(p5Mock);
        p5Mock.draw();
        expect(p5Mock.background).toHaveBeenCalledWith('#000000');
    });

    it('calls p5.windowResized() on resize event', async () => {
        createSketch(p5Mock);
        p5Mock.windowResized();
        expect(p5Mock.resizeCanvas).toHaveBeenCalledTimes(1);
    });

    it('calls p5.remove() on unmount', async () => {
        createSketch(p5Mock);
        p5Mock.remove();
        expect(p5Mock).toBeDefined();
    });

    it('calls p5.remove() on unmount component', async () => {
        removeP5Instance(p5Mock);
        expect(p5Mock).toBeDefined();
    });

    // Resize
    it('handleResize should not throw if p5 instance is undefined', () => {
        expect(() => handleResize(undefined)).not.toThrow();
    });

    it('handleResize should call resizeCanvas if p5 instance exists', () => {
        const mockP5 = {
            resizeCanvas: vi.fn(),
        } as unknown as p5;

        handleResize(mockP5);
        expect(mockP5.resizeCanvas).toHaveBeenCalledWith(
            window.innerWidth,
            window.innerHeight
        );
    });

    it('addResizeListener should attach an event listener', () => {
        const mockP5 = {
            resizeCanvas: vi.fn(),
        } as unknown as p5;

        const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

        addResizeListener(mockP5);
        expect(addEventListenerSpy).toHaveBeenCalledWith(
            'resize',
            expect.any(Function)
        );

        addEventListenerSpy.mockRestore();
    });

    it('removeResizeListener should detach an event listener', () => {
        const mockP5 = {
            resizeCanvas: vi.fn(),
        } as unknown as p5;

        const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

        removeResizeListener(mockP5);
        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'resize',
            expect.any(Function)
        );

        removeEventListenerSpy.mockRestore();
    });

    it('removeP5Instance should call remove on p5 instance', () => {
        const mockP5 = {
            remove: vi.fn(),
        } as unknown as p5;

        removeP5Instance(mockP5);
        expect(mockP5.remove).toHaveBeenCalled();
    });

    it('removeP5Instance should not throw if p5 instance is undefined', () => {
        expect(() => removeP5Instance(undefined)).not.toThrow();
    });
});
