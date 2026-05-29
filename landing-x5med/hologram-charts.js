/* =====================================================
   X5 Med — Hologram Charts v1.0
   Three.js holographic bar chart + growth curve
   Canvas2D holographic mini-charts
   ===================================================== */

(function () {
  'use strict';

  if (typeof THREE === 'undefined') return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const GOLD = new THREE.Color(0xff9f1c);
  const BLUE = new THREE.Color(0xff6a13);

  /* ─── Holographic shader (mesh-based geometry) ───────────────────────────── */
  const HOLO_VERT = /* glsl */`
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      vUv = uv;
      vNormal  = normalize(normalMatrix * normal);
      vec4 mv  = modelViewMatrix * vec4(position, 1.0);
      vViewDir = normalize(-mv.xyz);
      gl_Position = projectionMatrix * mv;
    }
  `;

  const HOLO_FRAG = /* glsl */`
    uniform float uTime;
    uniform vec3  uColor;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      float fresnel = 1.0 - clamp(dot(vNormal, vViewDir), 0.0, 1.0);
      fresnel = pow(fresnel, 1.3);
      float lines  = smoothstep(0.87, 1.0, sin(vUv.y * 54.0) * 0.5 + 0.5) * 0.21;
      float scan   = smoothstep(0.026, 0.0, abs(fract(vUv.y - uTime * 0.24) - 0.5) - 0.474);
      float flicker = 0.91 + 0.09 * sin(uTime * 11.8 + vUv.x * 17.3);
      float a = clamp(0.13 + fresnel * 0.60 + lines + scan * 0.58, 0.0, 0.94) * flicker;
      gl_FragColor = vec4(uColor + vec3(scan * 0.20), a);
    }
  `;

  function holoMat(color) {
    return new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uColor: { value: color.clone() } },
      vertexShader: HOLO_VERT, fragmentShader: HOLO_FRAG,
      transparent: true, depthWrite: false, side: THREE.FrontSide,
    });
  }

  function easeOut3(t) { return 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3); }

  function onLive(el, cb) {
    if (!el) return;
    if (el.classList.contains('is-live')) { cb(); return; }
    new MutationObserver((_, obs) => {
      if (el.classList.contains('is-live')) { obs.disconnect(); cb(); }
    }).observe(el, { attributes: true, attributeFilter: ['class'] });
  }

  /* ─── Shared particles helper ────────────────────────────────────────────── */
  function makeParticles(scene, count, W, H, color, size, opacity, velScale) {
    const geo  = new THREE.BufferGeometry();
    const pos  = new Float32Array(count * 3);
    const vel  = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i*3]   = (Math.random() - 0.5) * W;
      pos[i*3+1] = (Math.random() - 0.5) * H;
      pos[i*3+2] = 3;
      vel[i]     = (0.06 + Math.random() * 0.10) * velScale;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(geo,
      new THREE.PointsMaterial({ color, size, transparent: true, opacity })));
    return { geo, vel, count };
  }

  function tickParticles({ geo, vel, count }, limit) {
    const pa = geo.attributes.position;
    for (let i = 0; i < count; i++) {
      pa.array[i*3+1] += vel[i];
      if (pa.array[i*3+1] > limit) pa.array[i*3+1] = -limit;
    }
    pa.needsUpdate = true;
  }

  /* ==========================================================================
     1. HERO BAR CHART
     ========================================================================== */
  function initBarChart(el, heights) {
    const groupEl = el.closest('.growth-animate');

    Object.assign(el.style, { position: 'relative', overflow: 'hidden' });
    const canvas = document.createElement('canvas');
    Object.assign(canvas.style, { position:'absolute', inset:'0', width:'100%', height:'100%' });
    el.appendChild(canvas);

    const W = el.clientWidth  || 400;
    const H = el.clientHeight || 100;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0, 0);

    const camera = new THREE.OrthographicCamera(-W/2, W/2, H/2, -H/2, 0.1, 100);
    camera.position.z = 10;
    const scene = new THREE.Scene();

    /* Bars */
    const n      = heights.length;
    const padX   = W * 0.03;
    const slot   = (W - 2 * padX) / n;
    const barW   = slot * 0.55;
    const startX = -W / 2 + padX + slot / 2;
    const baseY  = -H / 2;

    const holoMats = [];
    const barItems = [];

    heights.forEach((h, i) => {
      const barH  = Math.max(H * h, 6);
      const color = (i === n - 1) ? GOLD : BLUE;
      const mat   = holoMat(color);
      holoMats.push(mat);

      const geo   = new THREE.BoxGeometry(barW, barH, 5);
      geo.translate(0, barH / 2, 0);
      const mesh  = new THREE.Mesh(geo, mat);
      mesh.position.set(startX + i * slot, baseY, 0);
      mesh.scale.y = 0.001;
      scene.add(mesh);

      const eMat  = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.40 });
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), eMat);
      edges.position.copy(mesh.position);
      edges.scale.y = 0.001;
      scene.add(edges);

      barItems.push({ mesh, edges, eMat });
    });

    /* Grid guides */
    [0.25, 0.5, 0.75].forEach(f => {
      const y = baseY + H * f;
      scene.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-W/2,y,-2), new THREE.Vector3(W/2,y,-2)]),
        new THREE.LineBasicMaterial({ color: BLUE, transparent: true, opacity: 0.09 })
      ));
    });

    /* Particles */
    const particles = makeParticles(scene, 34, W, H, GOLD, 1.6, 0.34, 1);

    /* Sweep line */
    const swGeo = new THREE.BufferGeometry().setFromPoints(
      [new THREE.Vector3(-W/2, baseY, 3), new THREE.Vector3(W/2, baseY, 3)]);
    const sweep = new THREE.Line(swGeo,
      new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.44 }));
    scene.add(sweep);

    let started = false, startTs = 0;
    onLive(groupEl, () => { started = true; startTs = 0; });

    function loop(ts) {
      requestAnimationFrame(loop);
      const t = ts * 0.001;
      holoMats.forEach(m => { m.uniforms.uTime.value = t; });
      sweep.position.y = baseY + ((t * 42) % H);
      tickParticles(particles, H / 2);

      if (started) {
        if (!startTs) startTs = ts;
        const prog = Math.min((ts - startTs) / 920, 1);
        barItems.forEach(({ mesh, edges, eMat }, i) => {
          const d = (i / n) * 0.46;
          const p = easeOut3(Math.max(0, (prog - d) / (1 - d + 0.001)));
          mesh.scale.y = edges.scale.y = Math.max(0.001, p);
          eMat.opacity = p * 0.42;
        });
      }
      renderer.render(scene, camera);
    }
    requestAnimationFrame(loop);

    window.addEventListener('resize', () => {
      const nW = el.clientWidth, nH = el.clientHeight;
      if (!nW || !nH) return;
      renderer.setSize(nW, nH);
      Object.assign(camera, { left:-nW/2, right:nW/2, top:nH/2, bottom:-nH/2 });
      camera.updateProjectionMatrix();
    });
  }

  /* ==========================================================================
     2. GROWTH CURVE
     ========================================================================== */
  function initGrowthCurve() {
    const svgEl = document.querySelector('.growth-curve svg');
    if (!svgEl) return;

    const LW = 640, LH = 220;
    const canvas = document.createElement('canvas');
    canvas.width = LW; canvas.height = LH;
    Object.assign(canvas.style, { display:'block', width:'100%', height:'auto', marginTop:'8px' });
    svgEl.parentNode.replaceChild(canvas, svgEl);

    const groupEl = canvas.closest('.growth-animate');

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(LW, LH, false);
    renderer.setClearColor(0, 0);

    /* Camera mirrors SVG coordinate space (flip Y: cy = LH - svgY) */
    const camera = new THREE.OrthographicCamera(0, LW, LH, 0, 0.1, 100);
    camera.position.z = 10;
    const scene = new THREE.Scene();

    /* Spline through original SVG control points */
    const SVG_PTS = [[30,178],[164,150],[304,108],[444,76],[610,28]];
    const spline   = new THREE.SplineCurve(SVG_PTS.map(([x,y]) => new THREE.Vector2(x, LH - y)));
    const SEGS     = 150;
    const cPts     = spline.getPoints(SEGS);

    const linePos = new Float32Array((SEGS + 1) * 3);
    cPts.forEach((p, i) => { linePos[i*3]=p.x; linePos[i*3+1]=p.y; linePos[i*3+2]=0; });
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
    lineGeo.setDrawRange(0, 2);

    scene.add(new THREE.Line(lineGeo,
      new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.90 })));

    /* Glow clone */
    const glowGeo = lineGeo.clone();
    scene.add(new THREE.Line(glowGeo,
      new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.18 })));

    /* Area fill */
    const fillShape = new THREE.Shape(cPts.map(p => new THREE.Vector2(p.x, p.y)));
    fillShape.lineTo(cPts[SEGS].x, 0); fillShape.lineTo(cPts[0].x, 0); fillShape.closePath();
    const fillMat = new THREE.MeshBasicMaterial({ color: BLUE, transparent: true, opacity: 0, depthWrite: false });
    const fillMesh = new THREE.Mesh(new THREE.ShapeGeometry(fillShape), fillMat);
    fillMesh.position.z = -2;
    scene.add(fillMesh);

    /* Grid */
    [1,2,3].forEach(g => {
      const y = (LH/4)*g;
      scene.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,y,-3), new THREE.Vector3(LW,y,-3)]),
        new THREE.LineBasicMaterial({ color: BLUE, transparent: true, opacity: 0.09 })));
    });
    [1,2,3,4,5].forEach(g => {
      const x = (LW/6)*g;
      scene.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x,0,-3), new THREE.Vector3(x,LH,-3)]),
        new THREE.LineBasicMaterial({ color: BLUE, transparent: true, opacity: 0.06 })));
    });

    /* Data-point orbs */
    const orbs = SVG_PTS.map(([x,y]) => {
      const cy = LH - y;
      const dot = new THREE.Mesh(
        new THREE.CircleGeometry(4.5, 24),
        new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0 }));
      dot.position.set(x, cy, 1);
      scene.add(dot);

      const ring = new THREE.Mesh(
        new THREE.RingGeometry(6.5, 10, 24),
        new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0, side: THREE.DoubleSide }));
      ring.position.set(x, cy, 1);
      scene.add(ring);
      return { dot, ring };
    });

    /* Particles (use symmetric range around center for OrthographicCamera with origin at 0,0) */
    const PC   = 50;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(PC * 3);
    const pVel = new Float32Array(PC);
    for (let i = 0; i < PC; i++) {
      pPos[i*3]   = Math.random() * LW;
      pPos[i*3+1] = Math.random() * LH;
      pPos[i*3+2] = 2;
      pVel[i]     = 0.08 + Math.random() * 0.13;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    scene.add(new THREE.Points(pGeo,
      new THREE.PointsMaterial({ color: BLUE, size: 1.2, transparent: true, opacity: 0.28 })));

    /* Scan sweep (moves top→bottom: y=LH → y=0) */
    const scanGeo = new THREE.BufferGeometry().setFromPoints(
      [new THREE.Vector3(0, LH, 2), new THREE.Vector3(LW, LH, 2)]);
    const scanLine = new THREE.Line(scanGeo,
      new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.38 }));
    scene.add(scanLine);

    let started = false, startTs = 0;
    onLive(groupEl, () => { started = true; startTs = 0; });

    function loop(ts) {
      requestAnimationFrame(loop);
      const t = ts * 0.001;

      /* Scan top→bottom */
      scanLine.position.y = LH - ((t * 46) % (LH + 4));

      /* Particles drift upward */
      const pa = pGeo.attributes.position;
      for (let i = 0; i < PC; i++) {
        pa.array[i*3+1] += pVel[i];
        if (pa.array[i*3+1] > LH) pa.array[i*3+1] = 0;
      }
      pa.needsUpdate = true;

      /* Pulse orbs */
      orbs.forEach(({ ring }, i) => { ring.scale.setScalar(0.80 + 0.20 * Math.sin(t * 2.1 + i * 1.24)); });

      if (started) {
        if (!startTs) startTs = ts;
        const prog  = Math.min((ts - startTs) / 1500, 1);
        const eased = easeOut3(prog);

        const count = Math.max(2, Math.round(eased * SEGS));
        lineGeo.setDrawRange(0, count);
        glowGeo.setDrawRange(0, count);
        fillMat.opacity = eased * 0.13;

        orbs.forEach(({ dot, ring }, i) => {
          const p = easeOut3(Math.max(0, Math.min(prog * 6 - i, 1)));
          dot.material.opacity  = p * 0.95;
          ring.material.opacity = p * 0.52;
        });
      }

      renderer.render(scene, camera);
    }
    requestAnimationFrame(loop);
  }

  /* ==========================================================================
     3. MINI CHARTS  (Canvas2D — lightweight holographic)
     ========================================================================== */
  function initClinicalHologram() {
    const svgEl = document.querySelector('.growth-curve svg');
    if (!svgEl) return;

    const holder = svgEl.closest('.growth-curve');
    const LW = 720, LH = 320;
    const canvas = document.createElement('canvas');
    canvas.width = LW; canvas.height = LH;
    Object.assign(canvas.style, { display:'block', width:'100%', height:'auto', marginTop:'12px' });
    svgEl.parentNode.replaceChild(canvas, svgEl);

    const groupEl = canvas.closest('.growth-animate');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(LW, LH, false);
    renderer.setClearColor(0, 0);

    const camera = new THREE.PerspectiveCamera(38, LW / LH, 0.1, 100);
    camera.position.set(0, 4.7, 10.8);
    camera.lookAt(0, 1.2, 0);

    const scene = new THREE.Scene();
    const CYAN = new THREE.Color(0x00d9ff);
    const ICE = new THREE.Color(0xd9fbff);
    const grid = new THREE.Group();
    const gridW = 9.2, gridD = 4.6;
    const gridMat = new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.20 });
    const softGridMat = new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.09 });

    for (let i = -8; i <= 8; i++) {
      const x = (i / 8) * (gridW / 2);
      const z = (i / 8) * (gridD / 2);
      grid.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x, 0, -gridD / 2), new THREE.Vector3(x, 0, gridD / 2)]),
        Math.abs(i) % 4 === 0 ? gridMat : softGridMat));
      grid.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-gridW / 2, 0, z), new THREE.Vector3(gridW / 2, 0, z)]),
        Math.abs(i) % 4 === 0 ? gridMat : softGridMat));
    }
    scene.add(grid);

    [0.82, 1.52, 2.22, 2.92].forEach(y => {
      scene.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-4.65, y, -2.32), new THREE.Vector3(4.65, y, -2.32)]),
        new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.12 })));
    });

    const bars = [];
    const heights = [0.72, 1.18, 1.55, 2.04, 2.70, 3.22];
    heights.forEach((targetH, i) => {
      const width = 0.56;
      const x = -3.65 + i * 1.45;
      const geo = new THREE.BoxGeometry(width, targetH, 0.58);
      geo.translate(0, targetH / 2, 0);

      const mesh = new THREE.Mesh(geo, holoMat(CYAN));
      mesh.position.set(x, 0, 0);
      mesh.scale.y = 0.001;
      scene.add(mesh);

      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(geo),
        new THREE.LineBasicMaterial({ color: ICE, transparent: true, opacity: 0 }));
      edges.position.copy(mesh.position);
      edges.scale.y = 0.001;
      scene.add(edges);
      bars.push({ mesh, edges, targetH, x });
    });

    const curve = new THREE.CatmullRomCurve3(bars.map(({ x, targetH }) => new THREE.Vector3(x, targetH + 0.18, -0.06)));
    const curveGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(100));
    curveGeo.setDrawRange(0, 2);
    scene.add(new THREE.Line(curveGeo, new THREE.LineBasicMaterial({ color: ICE, transparent: true, opacity: 0.88 })));

    const curveGlowGeo = curveGeo.clone();
    const curveGlow = new THREE.Line(curveGlowGeo, new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.24 }));
    curveGlow.scale.setScalar(1.006);
    scene.add(curveGlow);

    const orbs = bars.map(({ x, targetH }) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.105, 0.023, 8, 28),
        new THREE.MeshBasicMaterial({ color: ICE, transparent: true, opacity: 0 }));
      ring.position.set(x, targetH + 0.18, -0.06);
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);
      return ring;
    });

    const label = document.createElement('div');
    label.className = 'growth-curve-badge';
    label.innerHTML = '<span></span>Crescimento clínico';
    if (holder) holder.appendChild(label);

    const PC = 70;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(PC * 3);
    const pVel = new Float32Array(PC);
    for (let i = 0; i < PC; i++) {
      pPos[i*3]   = (Math.random() - 0.5) * gridW;
      pPos[i*3+1] = Math.random() * 3.4;
      pPos[i*3+2] = (Math.random() - 0.5) * gridD;
      pVel[i]     = 0.006 + Math.random() * 0.012;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    scene.add(new THREE.Points(pGeo,
      new THREE.PointsMaterial({ color: CYAN, size: 0.035, transparent: true, opacity: 0.42 })));

    const scanGeo = new THREE.BufferGeometry().setFromPoints(
      [new THREE.Vector3(-4.8, 0.02, -2.45), new THREE.Vector3(4.8, 0.02, -2.45)]);
    const scanLine = new THREE.Line(scanGeo,
      new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.42 }));
    scene.add(scanLine);

    let started = false, startTs = 0;
    onLive(groupEl, () => { started = true; startTs = 0; });

    function loop(ts) {
      requestAnimationFrame(loop);
      const t = ts * 0.001;

      scanLine.position.y = (t * 0.72) % 3.45;
      grid.rotation.z = Math.sin(t * 0.35) * 0.006;

      const pa = pGeo.attributes.position;
      for (let i = 0; i < PC; i++) {
        pa.array[i*3+1] += pVel[i];
        if (pa.array[i*3+1] > 3.6) pa.array[i*3+1] = 0;
      }
      pa.needsUpdate = true;

      if (started) {
        if (!startTs) startTs = ts;
        const prog = Math.min((ts - startTs) / 1500, 1);
        const eased = easeOut3(prog);
        const count = Math.max(2, Math.round(eased * 100));
        curveGeo.setDrawRange(0, count);
        curveGlowGeo.setDrawRange(0, count);

        bars.forEach(({ mesh, edges }, i) => {
          const p = easeOut3(Math.max(0, Math.min(prog * 2.2 - i * 0.18, 1)));
          mesh.scale.y = edges.scale.y = Math.max(0.001, p);
          mesh.material.uniforms.uTime.value = t;
          edges.material.opacity = p * 0.58;
        });

        orbs.forEach((ring, i) => {
          const p = easeOut3(Math.max(0, Math.min(prog * 6 - i, 1)));
          ring.material.opacity = p * 0.70;
          ring.scale.setScalar(0.84 + 0.16 * Math.sin(t * 2.2 + i));
        });
      }

      renderer.render(scene, camera);
    }
    requestAnimationFrame(loop);
  }

  function initMiniChart(chart, heights) {
    Object.assign(chart.style, { position: 'relative', overflow: 'hidden' });
    const canvas = document.createElement('canvas');
    Object.assign(canvas.style, { position:'absolute', inset:'0', width:'100%', height:'100%' });
    chart.appendChild(canvas);

    const W   = chart.clientWidth  || 100;
    const H   = chart.clientHeight || 54;
    const DPR = window.devicePixelRatio || 1;
    canvas.width  = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(DPR, DPR);

    const n    = heights.length;
    const slot = W / n;
    const barW = slot * 0.55;
    const offX = (slot - barW) / 2;

    let started = chart.classList.contains('is-live');
    let startTs = 0;
    onLive(chart, () => { started = true; startTs = 0; });

    function draw(ts) {
      requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);
      if (!started) return;
      if (!startTs) startTs = ts;

      const prog  = Math.min((ts - startTs) / 700, 1);
      const t     = ts * 0.001;

      heights.forEach((h, i) => {
        const d    = (i / n) * 0.40;
        const barP = easeOut3(Math.max(0, (prog - d) / (1 - d + 0.001)));
        const bh   = H * h * barP;
        const x    = i * slot + offX;
        const y    = H - bh;
        const pulse = 0.78 + 0.22 * Math.sin(t * 2.8 + i * 0.9);

        const g = ctx.createLinearGradient(0, y, 0, H);
        g.addColorStop(0, `rgba(235,205,161,${0.78 * pulse})`);
        g.addColorStop(1, `rgba(127,163,196,${0.36 * pulse})`);
        ctx.fillStyle = g;
        ctx.fillRect(x, y, barW, bh);

        ctx.strokeStyle = `rgba(235,205,161,${0.38 * pulse})`;
        ctx.lineWidth   = 0.7;
        ctx.strokeRect(x + 0.35, y + 0.35, barW - 0.7, Math.max(bh - 0.7, 0));
      });

      /* Moving scan line */
      const sy = H - ((t * 36) % (H + 2));
      const sg = ctx.createLinearGradient(0, 0, W, 0);
      sg.addColorStop(0,   'rgba(235,205,161,0)');
      sg.addColorStop(0.5, 'rgba(235,205,161,0.34)');
      sg.addColorStop(1,   'rgba(235,205,161,0)');
      ctx.fillStyle = sg;
      ctx.fillRect(0, sy - 0.5, W, 1);
    }
    requestAnimationFrame(draw);
  }

  /* ==========================================================================
     Boot — two phases to prevent CSS animation flash on visible elements
     ========================================================================== */
  function boot() {
    /* Phase 1 — immediately harvest heights and clear DOM (prevents CSS bar flash) */
    const barsEl = document.querySelector('.growth-dashboard .growth-bars');
    const barHeights = barsEl
      ? [...barsEl.querySelectorAll('i')].map(el => parseFloat(el.style.getPropertyValue('--bar')) / 100 || 0.5)
      : [];
    if (barsEl) barsEl.innerHTML = '';

    const miniItems = [];
    document.querySelectorAll('.mini-chart').forEach(chart => {
      const h = [...chart.querySelectorAll('i')].map(el => parseFloat(el.style.getPropertyValue('--bar')) / 100 || 0.5);
      miniItems.push({ chart, heights: h });
      chart.innerHTML = '';
    });

    /* Phase 2 — init renderers after layout stabilises */
    setTimeout(() => {
      if (barsEl && barHeights.length) initBarChart(barsEl, barHeights);
      initClinicalHologram();
      miniItems.forEach(({ chart, heights }) => initMiniChart(chart, heights));
    }, 220);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

}());
