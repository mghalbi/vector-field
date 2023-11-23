microcan.polute();
vec.polute();
var canvas = document.getElementById("main");
var ctx = canvas.getContext("2d");
const h = 950;
const w = 1800;
const n = 500;

const pn = 10000;
const particles = Array.from({ length: pn }, () => [
  Math.random() * w,
  Math.random() * h,
]);

for (var x = 0; x < canvas.width; x++) {
  for (var y = 0; y < canvas.height; y++) {
    var value = noise.simplex2(x / 100, y / 100);

    //image[x][y].r = Math.abs(value) * 256; // Or whatever. Open demo.html to see it used with canvas.
  }
}
noise.seed(Math.random());
const maxLifeTime = 30 * 10;
const lifetimes = particles.map(() => Math.round(Math.random() * maxLifeTime));

const clamp = (x, min, max) => Math.min(max, Math.max(x, min));

const vClamp = ([x, y], [min, max]) => [clamp(x, min, max), clamp(y, min, max)];

const vWindowToField = ([x, y]) => {
  const fv = [Math.floor(x / fieldSize), Math.floor(y / fieldSize)];
  return vClamp(fv, [0, n - 1]);
};

const fieldSize = w / n;

const computeValueField = ([x, y]) => {
  // const sins = [
  //   Math.sin(x * 0.1 + y * 0.1),
  //   Math.sin(x * 0.08 * y * -0.15),
  //   Math.cos((x & y) * 0.4),
  // ];
  // const averageSin =
  //   (sins.reduce((a, b) => a + b, 0) * Math.random()) / sins.length;
  //return vAngle(((averageSin + 1) / 2) * Math.PI * 2);
  return vAngle(noise.perlin2(x / 100, y / 100) * 256);
  //return vAngle(((averageSin + 1) / 2) * Math.PI * 2);
};

// const vRandom = () => vAngle(Math.random() * Math.PI * 2);

var field = Array.from({ length: n }, (_, y) => {
  return Array.from({ length: n }, (_, x) => {
    return computeValueField([x, y]);
  });
});

canvas.addEventListener("click", function (event) {
  noise.seed(Math.random());
  background(ctx, 0, 0, 0, 1, w, h);
  field = Array.from({ length: n }, (_, y) => {
    return Array.from({ length: n }, (_, x) => {
      return computeValueField([x, y]);
    });
  });
});

setCanvasSize("main", w, h);
background(ctx, 0, 0, 0, 1, w, h);

const draw = () => {
  background(ctx, 0, 0, 0, 0.05, w, h);
  noStroke(ctx);
  fill(ctx, 255, 255, 255, 0.1);
  for (let i = 0; i < pn; i++) {
    const p = particles[i];
    const [fx, fy] = vWindowToField(p);
    const fv = field[fy][fx];
    particles[i] = vAdd(p, fv);
    ellipse(ctx, particles[i], 2);
    if (lifetimes[i]-- <= 0) {
      particles[i] = [Math.random() * w, Math.random() * h];
      lifetimes[i] = Math.round(Math.random() * maxLifeTime);
    }
  }

  //   field.forEach((row, y) =>
  //     row.forEach((fv, x) => {
  //       const sv = vAdd(
  //         [fieldSize / 2, fieldSize / 2],
  //         vScale(fieldSize, [x, y])
  //       );
  //       const upper = vAdd(sv, vScale(fieldSize / 2, fv));
  //       const lower = vAdd(sv, vScale(-fieldSize / 2, fv));
  //       line(ctx, lower, upper);
  //       ellipse(ctx, upper, 2);
  //     })
  //   );

  window.requestAnimationFrame(draw);
};

draw();
