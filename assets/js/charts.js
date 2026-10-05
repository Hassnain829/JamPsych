/* =========================================================
   Shared dependency-free SVG chart renderers
   Used by both the Admin and Uploader dashboards — no CDN,
   no library, works fully offline.
   ========================================================= */

const JPCharts = (() => {
  const svgNS = 'http://www.w3.org/2000/svg';
  const el = (name, attrs = {}) => {
    const node = document.createElementNS(svgNS, name);
    Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
    return node;
  };

  /**
   * renderLine(host, { labels, values, yStep, color, formatY, gradientId })
   * Smooth area + line chart with gridlines, axis labels and point tooltips.
   */
  function renderLine(host, opts) {
    if (!host) return;
    const {
      labels, values,
      yStep = 10,
      color = '#1f6b4f',
      formatY = v => String(v),
      formatTip = v => String(v),
      gradientId = 'jpLineFill' + Math.random().toString(36).slice(2, 8)
    } = opts;

    const W = Math.max(host.clientWidth || 520, 280);
    const H = Math.max(host.clientHeight || 250, 180);
    const padL = 46, padR = 14, padT = 14, padB = 30;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;

    const rawMax = Math.max(...values, 1);
    const yMax = Math.max(yStep, Math.ceil(rawMax / yStep) * yStep);

    const x = i => padL + (plotW * i) / (values.length - 1);
    const y = v => padT + plotH - (v / yMax) * plotH;

    const svg = el('svg', {
      width: '100%', height: H, viewBox: `0 0 ${W} ${H}`,
      preserveAspectRatio: 'none', role: 'img', 'aria-label': 'Line chart'
    });

    const defs = el('defs');
    const grad = el('linearGradient', { id: gradientId, x1: '0', y1: '0', x2: '0', y2: '1' });
    grad.appendChild(el('stop', { offset: '0%', 'stop-color': color, 'stop-opacity': '.22' }));
    grad.appendChild(el('stop', { offset: '100%', 'stop-color': color, 'stop-opacity': '0' }));
    defs.appendChild(grad);
    svg.appendChild(defs);

    for (let v = 0; v <= yMax; v += yStep) {
      const gy = y(v);
      svg.appendChild(el('line', { x1: padL, y1: gy, x2: W - padR, y2: gy, stroke: '#eef0f2', 'stroke-width': 1 }));
      const label = el('text', {
        x: padL - 10, y: gy + 4, 'text-anchor': 'end',
        'font-size': 11, fill: '#8a94a3', 'font-family': 'Inter, sans-serif'
      });
      label.textContent = formatY(v);
      svg.appendChild(label);
    }

    const coords = values.map((v, i) => [x(i), y(v)]);
    let d = `M ${coords[0][0]} ${coords[0][1]}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const [x0, y0] = coords[i];
      const [x1, y1] = coords[i + 1];
      const cx = (x0 + x1) / 2;
      d += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
    }

    svg.appendChild(el('path', {
      d: `${d} L ${coords[coords.length - 1][0]} ${padT + plotH} L ${coords[0][0]} ${padT + plotH} Z`,
      fill: `url(#${gradientId})`, stroke: 'none'
    }));
    svg.appendChild(el('path', {
      d, fill: 'none', stroke: color, 'stroke-width': 2.5,
      'stroke-linecap': 'round', 'stroke-linejoin': 'round'
    }));

    coords.forEach(([cx, cy], i) => {
      const dot = el('circle', { cx, cy, r: 4, fill: color, stroke: '#ffffff', 'stroke-width': 2 });
      const tip = el('title');
      tip.textContent = formatTip(values[i]);
      dot.appendChild(tip);
      svg.appendChild(dot);
    });

    labels.forEach((text, i) => {
      const pos = padL + (plotW * i) / (labels.length - 1);
      const label = el('text', {
        x: pos, y: H - 8,
        'text-anchor': i === 0 ? 'start' : i === labels.length - 1 ? 'end' : 'middle',
        'font-size': 11, fill: '#8a94a3', 'font-family': 'Inter, sans-serif'
      });
      label.textContent = text;
      svg.appendChild(label);
    });

    host.innerHTML = '';
    host.appendChild(svg);
  }

  /**
   * renderDonut(host, segments) — segments: [{ label, value, color }]
   */
  function renderDonut(host, segments) {
    if (!host) return;
    const size = 170, stroke = 24, r = (size - stroke) / 2 - 2;
    const cx = size / 2, cy = size / 2;
    const circumference = 2 * Math.PI * r;
    const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;

    const svg = el('svg', {
      width: '100%', height: '100%', viewBox: `0 0 ${size} ${size}`,
      role: 'img', 'aria-label': 'Donut chart'
    });

    svg.appendChild(el('circle', { cx, cy, r, fill: 'none', stroke: '#f1f3f5', 'stroke-width': stroke }));

    let offset = 0;
    segments.forEach(s => {
      const fraction = s.value / total;
      const length = fraction * circumference;
      const arc = el('circle', {
        cx, cy, r, fill: 'none', stroke: s.color, 'stroke-width': stroke,
        'stroke-dasharray': `${Math.max(length - 2, 0)} ${circumference - Math.max(length - 2, 0)}`,
        'stroke-dashoffset': -offset,
        transform: `rotate(-90 ${cx} ${cy})`
      });
      const tip = el('title');
      tip.textContent = `${s.label}: ${s.value.toLocaleString()} (${(fraction * 100).toFixed(1)}%)`;
      arc.appendChild(tip);
      svg.appendChild(arc);
      offset += length;
    });

    host.innerHTML = '';
    host.appendChild(svg);
  }

  return { renderLine, renderDonut };
})();
