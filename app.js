const canvas = document.getElementById("graph");
const ctx = canvas.getContext("2d");

const controls = {
  a: document.getElementById("a"),
  b: document.getElementById("b"),
  c: document.getElementById("c"),
  showDerivative: document.getElementById("show-derivative"),
};

const labels = {
  equation: document.getElementById("equation"),
  aValue: document.getElementById("a-value"),
  bValue: document.getElementById("b-value"),
  cValue: document.getElementById("c-value"),
  vertex: document.getElementById("vertex"),
  axis: document.getElementById("axis"),
  roots: document.getElementById("roots"),
  derivative: document.getElementById("derivative"),
};

const palette = {
  axis: "#2a3b5f",
  grid: "rgba(148, 163, 184, 0.12)",
  parabola: "#6ee7ff",
  derivative: "#ff9f6e",
  highlight: "#fbd46d",
};

const viewport = {
  xMin: -10,
  xMax: 10,
  yMin: -8,
  yMax: 8,
};

const toCanvasX = (x) => {
  const ratio = (x - viewport.xMin) / (viewport.xMax - viewport.xMin);
  return ratio * canvas.width;
};

const toCanvasY = (y) => {
  const ratio = (y - viewport.yMin) / (viewport.yMax - viewport.yMin);
  return canvas.height - ratio * canvas.height;
};

const formatNumber = (value) => {
  const rounded = Math.abs(value) < 0.005 ? 0 : value;
  return rounded.toFixed(2).replace(/\.00$/, "").replace(/\.$/, "");
};

const drawGrid = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0b1324";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = palette.grid;
  ctx.lineWidth = 1;
  for (let x = Math.ceil(viewport.xMin); x <= viewport.xMax; x += 1) {
    const canvasX = toCanvasX(x);
    ctx.beginPath();
    ctx.moveTo(canvasX, 0);
    ctx.lineTo(canvasX, canvas.height);
    ctx.stroke();
  }
  for (let y = Math.ceil(viewport.yMin); y <= viewport.yMax; y += 1) {
    const canvasY = toCanvasY(y);
    ctx.beginPath();
    ctx.moveTo(0, canvasY);
    ctx.lineTo(canvas.width, canvasY);
    ctx.stroke();
  }

  ctx.strokeStyle = palette.axis;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(toCanvasX(0), 0);
  ctx.lineTo(toCanvasX(0), canvas.height);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, toCanvasY(0));
  ctx.lineTo(canvas.width, toCanvasY(0));
  ctx.stroke();
};

const plotFunction = (fn, color, lineWidth = 2) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  let started = false;
  for (let x = viewport.xMin; x <= viewport.xMax; x += 0.05) {
    const y = fn(x);
    if (Number.isNaN(y) || !Number.isFinite(y)) {
      started = false;
      continue;
    }
    const canvasX = toCanvasX(x);
    const canvasY = toCanvasY(y);
    if (!started) {
      ctx.moveTo(canvasX, canvasY);
      started = true;
    } else {
      ctx.lineTo(canvasX, canvasY);
    }
  }
  ctx.stroke();
};

const drawPoint = (x, y, label) => {
  const canvasX = toCanvasX(x);
  const canvasY = toCanvasY(y);
  ctx.fillStyle = palette.highlight;
  ctx.beginPath();
  ctx.arc(canvasX, canvasY, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = palette.highlight;
  ctx.font = "14px Inter, sans-serif";
  ctx.fillText(label, canvasX + 8, canvasY - 8);
};

const update = () => {
  const a = parseFloat(controls.a.value);
  const b = parseFloat(controls.b.value);
  const c = parseFloat(controls.c.value);

  labels.aValue.textContent = formatNumber(a);
  labels.bValue.textContent = formatNumber(b);
  labels.cValue.textContent = formatNumber(c);

  const equationText = `y = ${formatNumber(a)}x² ${b >= 0 ? "+" : "-"} ${formatNumber(Math.abs(b))}x ${c >= 0 ? "+" : "-"} ${formatNumber(Math.abs(c))}`;
  labels.equation.textContent = equationText;

  const derivativeText = `y = ${formatNumber(2 * a)}x ${b >= 0 ? "+" : "-"} ${formatNumber(Math.abs(b))}`;
  labels.derivative.textContent = derivativeText;

  const vertexX = -b / (2 * a || 1);
  const vertexY = a * vertexX * vertexX + b * vertexX + c;
  labels.vertex.textContent = `(${formatNumber(vertexX)}, ${formatNumber(vertexY)})`;
  labels.axis.textContent = `x = ${formatNumber(vertexX)}`;

  const discriminant = b * b - 4 * a * c;
  let rootsText = "No real roots";
  if (Math.abs(a) < 0.0001) {
    if (Math.abs(b) < 0.0001) {
      rootsText = "No roots";
    } else {
      const root = -c / b;
      rootsText = `x = ${formatNumber(root)}`;
    }
  } else if (discriminant >= 0) {
    const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    rootsText = `x = ${formatNumber(root1)}, ${formatNumber(root2)}`;
  }
  labels.roots.textContent = rootsText;

  drawGrid();
  plotFunction((x) => a * x * x + b * x + c, palette.parabola, 3);

  if (controls.showDerivative.checked) {
    plotFunction((x) => 2 * a * x + b, palette.derivative, 2);
  }

  drawPoint(vertexX, vertexY, "Vertex");

  if (discriminant >= 0 && Math.abs(a) >= 0.0001) {
    const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    drawPoint(root1, 0, "Root 1");
    if (Math.abs(root1 - root2) > 0.01) {
      drawPoint(root2, 0, "Root 2");
    }
  }
};

Object.values(controls).forEach((input) => {
  input.addEventListener("input", update);
});

update();
