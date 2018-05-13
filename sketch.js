const cnv = document.getElementById('cnv'),
        c = cnv.getContext('2d');

let     w = cnv.width  = innerWidth,
        h = cnv.height = innerHeight;

let show_control = true;

window.addEventListener('click', e => {
    show_control = !show_control;
});

const sin = Math.sin;

function lerp(a, b, t) {
    return (b - a) * t + a;
}

function lerp2d(point1, point2, t) {
    return new Vector(lerp(point1.x, point2.x, t), lerp(point1.y, point2.y, t));
}

function bezier(t, ...points) {
    if (points.length == 1) {
        return points[0];
    }

    let inter = [];
    for (let i = 0, l = points.length - 1; i < l; ++i) {
        inter.push(lerp2d(points[i], points[i+1], t));
    }

    return bezier(t, ...inter);
}

const speeds = [];
for (let i = 0; i < 10; ++i) {
    speeds[i] = Math.random() + 0.1;
}

let p = [];
for (let i = 0, l = speeds.length; i < l; ++i) {
    p[i] = new Vector();
}

draw();

function draw(frame = 0) {
    w = cnv.width  = innerWidth;
    h = cnv.height = innerHeight;
    c.translate(0, h/2);
    c.fillStyle   = '#FFF';
    c.strokeStyle = '#FFF';
    c.shadowColor = '#FFF6';
    c.shadowBlur  = 30;

    for (let i = 0, l = speeds.length; i < l; ++i) {
        let x = i / (l-1) * (w*0.9) + (w*0.05);
        let y = sin((frame + 10000) * speeds[i] / 60) * h / 2 * 0.8;
        p[i].set(x, y);
    }

    if (show_control) {
        const lines = new Path2D();
        for (let i = 0; i < p.length; ++i) {
            lines.lineTo(...p[i].xy);

            c.beginPath();
            c.arc(...p[i].xy, 10/3, 0, Math.PI * 2);
            c.fill();
        }
        c.globalAlpha = 0.1;
        c.lineWidth = 1;
        c.stroke(lines);
    }

    const steps = w;
    c.globalAlpha = 1;
    c.lineWidth = 2;
    c.beginPath();
    for (let i = 0; i <= steps; ++i) {
        c.lineTo(...bezier(i / steps, ...p).xy);
    }
    c.lineTo(...bezier(1, ...p).xy);
    c.stroke();

    requestAnimationFrame(() => draw(frame + 1));
}
