import type p5Types from 'p5';

export function getForceOnPoint(p: p5Types, x: number, y: number, z: number) {
    return (p.noise(x / 200, y / 200, z) - 0.5) * 2 * p.TWO_PI;
}

export function addPoints(w: number, h: number, offsetY: number) {
    const existingPoints = new Set<string>();
    const points: { x: number; y: number; opacity: number }[] = [];

    for (let x = -15 / 2; x < w + 15; x += 15) {
        for (let y = -15 / 2; y < h + offsetY + 15; y += 15) {
            const id = `${x}-${y}`;
            if (existingPoints.has(id)) continue;
            existingPoints.add(id);
            points.push({ x, y, opacity: Math.random() * 0.5 + 0.5 });
        }
    }
    return points;
}

export function handleResize(myP5: p5Types | undefined) {
    if (myP5) {
        myP5.resizeCanvas(window.innerWidth, window.innerHeight);
    }
}

export function addResizeListener(myP5: p5Types | undefined) {
    window.addEventListener('resize', () => handleResize(myP5));
}

export function removeResizeListener(myP5: p5Types | undefined) {
    window.removeEventListener('resize', () => handleResize(myP5));
}

export function createSketch(p: p5Types) {
    let w = window.innerWidth;
    let h = window.innerHeight;
    let offsetY = window.scrollY;
    let points = addPoints(w, h, offsetY);

    p.setup = () => {
        p.createCanvas(w, h);
        p.background('#fefefe');
        p.stroke('#cccccc');
        p.noFill();
        p.noiseSeed(+new Date());
    };

    p.draw = () => {
        p.background('#000000');
        const t = Date.now() / 10000;

        for (const pt of points) {
            const { x, y, opacity } = pt;
            const rad = getForceOnPoint(p, x, y, t);
            const length = (p.noise(x / 200, y / 200, t * 2) + 0.5) * 10;
            const nx = x + p.cos(rad) * length;
            const ny = y + p.sin(rad) * length;
            const alpha = (Math.abs(p.cos(rad)) * 0.5 + 0.5) * opacity * 255;
            p.stroke(180, 180, 180, alpha);
            p.circle(nx, ny - offsetY, 1);
        }
    };

    p.windowResized = () => {
        w = window.innerWidth;
        h = window.innerHeight;
        p.resizeCanvas(w, h);
        points = addPoints(w, h, offsetY);
    };
}

export function removeP5Instance(p5Instance: p5Types | undefined) {
    if (p5Instance) p5Instance.remove();
}
