const cnv = document.getElementById('cnv'),
        c = cnv.getContext('2d');

let     w = cnv.width  = innerWidth,
        h = cnv.height = innerHeight;

let display = 1;

window.addEventListener('click', e => {
    display = (display + 1) % 3;
});

const sin = Math.sin;

function lerp(a, b, t) {
    return (b - a) * t + a;
}

function lerp2d(point1, point2, t) {
    return new Vector(lerp(point1.x, point2.x, t), lerp(point1.y, point2.y, t));
}

function bezier(t, ...points) {
    let inter = [], i, l;

    while (points.length > 1) {
        l = points.length - 1
        for (i = 0; i < l; ++i) {
            inter.push(lerp2d(points[i], points[i+1], t));
        }
        points = inter;
        inter = [];
    }

    return points[0];
}

const speeds = [];
for (let i = 0; i < Math.max(w / 100, 5); ++i) {
    speeds[i] = Math.random() + 0.1;
    speeds[i] *= Math.sign(Math.random() - 0.5);
}

let p = [];
for (let i = 0, l = speeds.length; i < l; ++i) {
    let x = i / (l-1) * (w*0.9) + (w*0.05);
    p[i] = new Vector(x, 0);
}

draw();

function draw(frame = 0) {
    w = cnv.width  = innerWidth;
    h = cnv.height = innerHeight;
    c.translate(0, h/2);
    c.fillStyle   = '#FFFFF0';
    c.strokeStyle = '#FFFFF0';
    if (display != 0) {
        c.shadowColor = '#FFFFF080';
        c.shadowBlur  = 20;
    }

    for (let i = 0, l = speeds.length; i < l; ++i) {
        let x = i / (l-1) * (w*0.9) + (w*0.05);
        if (i != 0 && i != l - 1) {
            let y = sin((frame) * speeds[i] / 60) * h / 2 * 0.8;
            p[i].set(x, y);
        } else {
            p[i].x = x;
        }
    }

    c.save();
    c.globalAlpha = 0.2;
    c.lineWidth = 1;
    if (display == 1) {
        c.beginPath();
        for (let i = 0; i < p.length; ++i) {
            c.lineTo(...p[i].xy);
        }
        c.stroke();
    } else if (display == 2) {
        for (let i = 1; i < p.length; ++i) {
            c.beginPath();
            c.moveTo(...p[i].xy);
            c.lineTo(...bezier(i / (p.length - 1), ...p).xy);
            c.stroke();
        }
    }
    c.restore();

    if (display != 0) {
        for (let i = 0; i < p.length; ++i) {
            c.beginPath();
            c.arc(...p[i].xy, 10/3, 0, Math.PI * 2);
            c.fill();
        }
    }

    const steps = w;
    c.lineWidth = 2;
    c.beginPath();
    for (let i = 0; i <= steps; ++i) {
        c.lineTo(...bezier(i / steps, ...p).xy);
    }
    c.lineTo(...bezier(1, ...p).xy);
    c.stroke();

    requestAnimationFrame(() => draw(frame + 1));
}
