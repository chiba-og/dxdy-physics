window.PHIZIKS_VISUAL = {
  activeMode: 'sliders', // 'sliders' OR 'animations' (Strictly separated)
  sliderModule: 'maths', // 'maths' | 'kinematics' | 'oscillations' | 'optics' | 'gravitation'
  animModule: 'kinematics', // 'maths' | 'kinematics' | 'oscillations' | 'optics' | 'gravitation'

  // Parametric Slider State
  params: {
    // Basic Maths (Calculus & Trig)
    mathCoeffA: 1.0,
    mathCoeffB: 0.5,
    mathX0: 2.0,
    mathDx: 0.8,
    mathIntLimit: 4.0,
    // Kinematics (1D, 2D Projectile, 3D Helix)
    kinU: 35,
    kinTheta: 45,
    kinH0: 10,
    kinG: 9.8,
    kinZSpeed: 12,
    // Oscillations (SHM)
    shmA: 5.0,
    shmOmega: 2.0,
    shmPhi: 30,
    shmMass: 1.5,
    shmDamp: 0.05,
    // Ray Optics
    optFocal: 20,      // +ve convex lens, -ve concave lens
    optU: -35,         // Object distance (cm)
    optHo: 6,          // Object height (cm)
    // Gravitation
    gravMassRatio: 1.0, // In Earth masses
    gravRadiusKm: 6400, // Planet radius (km)
    gravProbeR: 9600    // Probe distance from center (km)
  },

  // Animation Theater State
  anim: {
    running: true,
    speed: 1.0,
    showVectors: true,
    t: 0,
    rafId: null
  },

  init() {
    this.render();
    this.startAnimationLoop();
  },

  // Helper to draw crisp vector arrows with arrowheads on Canvas
  drawArrow(ctx, x1, y1, x2, y2, color, width = 2.5, label = '') {
    const headLen = 9;
    const angle = Math.atan2(y2 - y1, x2 - x1);
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();

    if (label) {
      ctx.font = 'bold 11px JetBrains Mono, monospace';
      ctx.fillText(label, x2 + 6 * Math.cos(angle), y2 + 6 * Math.sin(angle) - 4);
    }
    ctx.restore();
  },

  switchMode(mode) {
    this.activeMode = mode;
    this.render();
  },

  setSliderModule(mod) {
    this.sliderModule = mod;
    this.render();
  },

  setAnimModule(mod) {
    this.animModule = mod;
    this.anim.t = 0;
    this.render();
  },

  stepAnimationFrame() {
    this.anim.running = false;
    this.anim.t += 0.08;
    this.drawAnimationFrame();
  },

  updateParam(key, value) {
    this.params[key] = parseFloat(value);
    const valSpan = document.getElementById(`val-${key}`);
    if (valSpan) valSpan.textContent = this.params[key];
    this.drawSliderSandbox();
  },

  render() {
    const container = document.getElementById('visual-content');
    if (!container) return;

    container.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:20px;">
        <div>
          <span class="badge" style="color:var(--accent);">dx/dy INTERACTIVE SCIENTIFIC LABORATORY</span>
          <h1 style="font-size:1.8rem;font-weight:900;margin-top:4px;">🔬 Visual Physics Interactive Lab</h1>
          <p style="color:var(--text-secondary);font-size:0.9rem;">Strictly separated into (1) Parametric Slider Sandbox with Live Graphs & Coordinate Tables and (2) Real-Time Concept Animation Theater.</p>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <button class="nav-btn ${this.activeMode === 'sliders' ? 'btn-primary' : ''}" onclick="PHIZIKS_VISUAL.switchMode('sliders')">
            🎛️ ENGINE A: Parametric Slider Sandbox
          </button>
          <button class="nav-btn ${this.activeMode === 'animations' ? 'btn-exhibition' : ''}" onclick="PHIZIKS_VISUAL.switchMode('animations')">
            🎬 ENGINE B: Concept Animation Theater
          </button>
          <button class="tool-btn" onclick="PHIZIKS.toggleWhiteboard()">✏️ Whiteboard</button>
        </div>
      </div>

      ${this.activeMode === 'sliders' ? this.renderSliderSandboxHTML() : this.renderAnimationTheaterHTML()}
    `;

    if (this.activeMode === 'sliders') {
      setTimeout(() => this.drawSliderSandbox(), 20);
    } else {
      setTimeout(() => this.drawAnimationFrame(), 20);
    }
  },

  // =========================================================================
  // PART 1: PARAMETRIC SLIDER SANDBOX (LIVE GRAPHS + COORDINATE TABLES)
  // =========================================================================
  renderSliderSandboxHTML() {
    return `
      <div class="stat-card" style="margin-bottom:18px;border-left:4px solid var(--accent);">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
          <div>
            <span class="badge" style="color:var(--accent);">ENGINE A • PARAMETRIC SLIDERS</span>
            <strong style="margin-left:8px;">Select Simulation Domain:</strong>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button class="nav-btn ${this.sliderModule === 'maths' ? 'active' : ''}" onclick="PHIZIKS_VISUAL.setSliderModule('maths')">📐 Basic Maths (Calculus)</button>
            <button class="nav-btn ${this.sliderModule === 'kinematics' ? 'active' : ''}" onclick="PHIZIKS_VISUAL.setSliderModule('kinematics')">🚀 Kinematics (1D/2D/3D)</button>
            <button class="nav-btn ${this.sliderModule === 'oscillations' ? 'active' : ''}" onclick="PHIZIKS_VISUAL.setSliderModule('oscillations')">〰️ Oscillations (SHM)</button>
            <button class="nav-btn ${this.sliderModule === 'optics' ? 'active' : ''}" onclick="PHIZIKS_VISUAL.setSliderModule('optics')">🔍 Ray Optics (Lenses)</button>
            <button class="nav-btn ${this.sliderModule === 'gravitation' ? 'active' : ''}" onclick="PHIZIKS_VISUAL.setSliderModule('gravitation')">🪐 Gravitation (g & Orbits)</button>
          </div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:18px;align-items:start;">
        <!-- LEFT: VARIABLE SLIDERS + INSTANT FORMULAS -->
        <div class="stat-card" style="max-width:420px;width:100%;">
          <h3 style="color:var(--accent);margin-bottom:12px;">🎛️ Variable Controls</h3>
          ${this.getSlidersForModule(this.sliderModule)}
          <div id="slider-live-metrics" style="margin-top:16px;padding:12px;background:var(--bg-primary);border-radius:8px;border:1px solid var(--border-color);font-size:0.84rem;display:grid;gap:6px;"></div>
        </div>

        <!-- RIGHT: LIVE REAL-TIME CANVAS GRAPH + INSTANT COORDINATE TABLE -->
        <div style="display:flex;flex-direction:column;gap:18px;min-width:0;grid-column:span 2;">
          <div class="stat-card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:6px;">
              <h3 style="color:var(--accent);">📈 Live Parametric Graph & Vector Readout</h3>
              <span class="badge">Real-Time Analytical Plot</span>
            </div>
            <canvas id="slider-graph-canvas" width="820" height="360" style="width:100%;height:auto;background:#04070f;border:1px solid var(--border-color);border-radius:8px;"></canvas>
          </div>

          <div class="stat-card">
            <h3 style="color:var(--accent);margin-bottom:10px;">📋 Live Coordinate & Physical Quantities Table</h3>
            <div id="slider-coordinate-table" style="overflow-x:auto;"></div>
          </div>
        </div>
      </div>
    `;
  },

  getSlidersForModule(mod) {
    const p = this.params;
    const sliderRow = (label, key, min, max, step, unit) => `
      <div style="margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;font-size:0.83rem;margin-bottom:4px;">
          <span>${label}</span>
          <strong style="color:var(--accent);font-family:var(--font-mono);"><span id="val-${key}">${p[key]}</span> ${unit}</strong>
        </div>
        <input type="range" min="${min}" max="${max}" step="${step}" value="${p[key]}"
          style="width:100%;accent-color:var(--accent);cursor:pointer;"
          oninput="PHIZIKS_VISUAL.updateParam('${key}', this.value)" />
      </div>
    `;

    if (mod === 'maths') {
      return `
        <p style="font-size:0.78rem;color:var(--text-secondary);margin-bottom:10px;">Function: $y(x) = a x^2 + b x$ (Secant vs. Derivative Tangent & Definite Integral Area)</p>
        ${sliderRow('Quadratic Coeff (a)', 'mathCoeffA', 0.2, 2.5, 0.1, '')}
        ${sliderRow('Linear Coeff (b)', 'mathCoeffB', -2.0, 3.0, 0.1, '')}
        ${sliderRow('Point of Tangency (x₀)', 'mathX0', 0.5, 4.5, 0.1, 'units')}
        ${sliderRow('Secant Step (Δx → 0)', 'mathDx', 0.05, 2.0, 0.05, 'units')}
        ${sliderRow('Integral Upper Limit (X)', 'mathIntLimit', 1.0, 5.0, 0.2, 'units')}
      `;
    }
    if (mod === 'kinematics') {
      return `
        <p style="font-size:0.78rem;color:var(--text-secondary);margin-bottom:10px;">1D, 2D Projectile & 3D Z-Drift Parametric Motion</p>
        ${sliderRow('Launch Speed (u)', 'kinU', 5, 80, 1, 'm/s')}
        ${sliderRow('Launch Angle (θ)', 'kinTheta', 5, 85, 1, '°')}
        ${sliderRow('Initial Height (h₀)', 'kinH0', 0, 60, 1, 'm')}
        ${sliderRow('Gravity (g)', 'kinG', 1.6, 25.0, 0.2, 'm/s²')}
        ${sliderRow('3D Z-Axis Drift (v_z)', 'kinZSpeed', 0, 30, 1, 'm/s')}
      `;
    }
    if (mod === 'oscillations') {
      return `
        <p style="font-size:0.78rem;color:var(--text-secondary);margin-bottom:10px;">SHM & Damped Oscillator: $x(t) = A e^{-bt} \\cos(\\omega t + \\phi)$</p>
        ${sliderRow('Amplitude (A)', 'shmA', 1.0, 10.0, 0.5, 'm')}
        ${sliderRow('Angular Freq (ω)', 'shmOmega', 0.5, 6.0, 0.1, 'rad/s')}
        ${sliderRow('Initial Phase (φ)', 'shmPhi', 0, 180, 5, '°')}
        ${sliderRow('Block Mass (m)', 'shmMass', 0.5, 5.0, 0.5, 'kg')}
        ${sliderRow('Damping Factor (b)', 'shmDamp', 0.0, 0.35, 0.01, 's⁻¹')}
      `;
    }
    if (mod === 'optics') {
      return `
        <p style="font-size:0.78rem;color:var(--text-secondary);margin-bottom:10px;">Thin Lens Formula: $\\frac{1}{v} - \\frac{1}{u} = \\frac{1}{f}$ (+f Convex, -f Concave)</p>
        ${sliderRow('Focal Length (f)', 'optFocal', -40, 40, 1, 'cm')}
        ${sliderRow('Object Distance (u)', 'optU', -80, -8, 1, 'cm')}
        ${sliderRow('Object Height (h₀)', 'optHo', 2, 14, 0.5, 'cm')}
      `;
    }
    if (mod === 'gravitation') {
      return `
        <p style="font-size:0.78rem;color:var(--text-secondary);margin-bottom:10px;">Inside ($r < R$) vs Outside ($r \\ge R$) Field $g(r)$ & Potential $V(r)$</p>
        ${sliderRow('Planet Mass (M / M_E)', 'gravMassRatio', 0.2, 5.0, 0.1, 'M⊕')}
        ${sliderRow('Planet Radius (R)', 'gravRadiusKm', 2000, 12000, 200, 'km')}
        ${sliderRow('Test Distance (r)', 'gravProbeR', 500, 24000, 250, 'km')}
      `;
    }
    return '';
  },

  drawSliderSandbox() {
    const canvas = document.getElementById('slider-graph-canvas');
    const metricsBox = document.getElementById('slider-live-metrics');
    const tableBox = document.getElementById('slider-coordinate-table');
    if (!canvas || !metricsBox || !tableBox) return;

    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Scientific coordinate background grid
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.06)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    const p = this.params;
    const mod = this.sliderModule;

    // 1. BASIC MATHEMATICS SLIDER SANDBOX
    if (mod === 'maths') {
      const a = p.mathCoeffA, b = p.mathCoeffB, x0 = p.mathX0, dx = p.mathDx, X = p.mathIntLimit;
      const f = (x) => a * x * x + b * x;
      const dfExact = (x) => 2 * a * x + b;
      const secantSlope = (f(x0 + dx) - f(x0)) / dx;
      const exactSlope = dfExact(x0);
      const exactIntegral = (a * Math.pow(X, 3)) / 3 + (b * Math.pow(X, 2)) / 2;

      const ox = 70, oy = H - 50;
      const scaleX = (W - 120) / 5.5;
      const maxY = Math.max(25, f(5.2));
      const scaleY = (H - 90) / maxY;

      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(ox, 20); ctx.lineTo(ox, oy); ctx.lineTo(W - 20, oy); ctx.stroke();

      ctx.fillStyle = 'rgba(0, 230, 118, 0.14)';
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      for (let xv = 0; xv <= X; xv += 0.05) {
        ctx.lineTo(ox + xv * scaleX, oy - f(xv) * scaleY);
      }
      ctx.lineTo(ox + X * scaleX, oy);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#00f0ff'; ctx.lineWidth = 3;
      ctx.beginPath();
      for (let xv = 0; xv <= 5.2; xv += 0.05) {
        const px = ox + xv * scaleX, py = oy - f(xv) * scaleY;
        if (xv === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      ctx.strokeStyle = '#7c4dff'; ctx.lineWidth = 2.2;
      ctx.beginPath();
      const xStart = Math.max(0, x0 - 1.2), xEnd = Math.min(5.2, x0 + 1.2);
      ctx.moveTo(ox + xStart * scaleX, oy - (f(x0) + exactSlope * (xStart - x0)) * scaleY);
      ctx.lineTo(ox + xEnd * scaleX, oy - (f(x0) + exactSlope * (xEnd - x0)) * scaleY);
      ctx.stroke();

      ctx.strokeStyle = '#ffab00'; ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(ox + x0 * scaleX, oy - f(x0) * scaleY);
      ctx.lineTo(ox + (x0 + dx) * scaleX, oy - f(x0 + dx) * scaleY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#7c4dff';
      ctx.beginPath(); ctx.arc(ox + x0 * scaleX, oy - f(x0) * scaleY, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffab00';
      ctx.beginPath(); ctx.arc(ox + (x0 + dx) * scaleX, oy - f(x0 + dx) * scaleY, 5, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = '#f0f4f8'; ctx.font = '12px Inter';
      ctx.fillText(`Cyan: y(x) = ${a}x² + ${b}x | Violet: Tangent (dy/dx = ${exactSlope.toFixed(2)}) | Amber: Secant (Δy/Δx = ${secantSlope.toFixed(2)}) | Area: ∫y dx = ${exactIntegral.toFixed(2)}`, ox + 10, 28);

      metricsBox.innerHTML = `
        <div><strong>Exact Derivative $\\frac{dy}{dx}\\big|_{x_0}$:</strong> <span style="color:var(--accent);">${exactSlope.toFixed(4)}</span></div>
        <div><strong>Secant Slope $\\frac{\\Delta y}{\\Delta x}$:</strong> <span style="color:var(--warning);">${secantSlope.toFixed(4)}</span></div>
        <div><strong>Slope Discrepancy:</strong> ${(Math.abs(secantSlope - exactSlope)).toFixed(4)}</div>
        <div><strong>Definite Integral $\\int_0^{${X}} y\\,dx$:</strong> <span style="color:var(--success);">${exactIntegral.toFixed(4)}</span></div>
      `;

      let rows = '';
      for (let i = 0; i <= 8; i++) {
        const xv = (i * 0.6).toFixed(2);
        const yv = f(Number(xv)).toFixed(3);
        const dv = dfExact(Number(xv)).toFixed(3);
        const iv = ((a * Math.pow(xv, 3)) / 3 + (b * Math.pow(xv, 2)) / 2).toFixed(3);
        rows += `<tr><td>${xv}</td><td>${yv}</td><td>${dv}</td><td>${iv}</td></tr>`;
      }
      tableBox.innerHTML = `
        <table class="data-table">
          <thead><tr><th>Coordinate x</th><th>Function Value y(x)</th><th>Instantaneous Slope dy/dx</th><th>Accumulated Area ∫₀ˣ y dx</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      `;
    }

    // 2. KINEMATICS (1D, 2D & 3D) SLIDER SANDBOX
    if (mod === 'kinematics') {
      const u = p.kinU, deg = p.kinTheta, h0 = p.kinH0, g = p.kinG, vz = p.kinZSpeed;
      const rad = deg * Math.PI / 180;
      const ux = u * Math.cos(rad), uy = u * Math.sin(rad);
      const tFlight = (uy + Math.sqrt(uy * uy + 2 * g * h0)) / g;
      const rangeX = ux * tFlight;
      const hMax = h0 + (uy * uy) / (2 * g);
      const maxZ = vz * tFlight;

      const ox = 60, oy = H - 45;
      const scaleX = (W - 100) / Math.max(50, rangeX * 1.1);
      const scaleY = (H - 80) / Math.max(30, hMax * 1.15);

      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(ox, 20); ctx.lineTo(ox, oy); ctx.lineTo(W - 20, oy); ctx.stroke();

      ctx.strokeStyle = '#00f0ff'; ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const t = (i / 100) * tFlight;
        const x = ux * t;
        const y = Math.max(0, h0 + uy * t - 0.5 * g * t * t);
        const px = ox + x * scaleX, py = oy - y * scaleY;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      const tPeak = uy / g;
      const xPeak = ux * tPeak;
      const peakPx = ox + xPeak * scaleX, peakPy = oy - hMax * scaleY;
      ctx.fillStyle = '#7c4dff';
      ctx.beginPath(); ctx.arc(peakPx, peakPy, 6, 0, Math.PI * 2); ctx.fill();
      this.drawArrow(ctx, peakPx, peakPy, peakPx + 45, peakPy, '#00e676', 2.2, 'v_x = u cosθ');

      ctx.fillStyle = '#f0f4f8'; ctx.font = '12px Inter';
      ctx.fillText(`Peak (x=${xPeak.toFixed(1)}m, H_max=${hMax.toFixed(1)}m) | Range R = ${rangeX.toFixed(1)}m | Flight Time T = ${tFlight.toFixed(2)}s`, ox + 10, 28);

      metricsBox.innerHTML = `
        <div><strong>Components ($u_x, u_y, u_z$):</strong> ${ux.toFixed(2)}, ${uy.toFixed(2)}, ${vz.toFixed(2)} m/s</div>
        <div><strong>Time of Flight ($T$):</strong> <span style="color:var(--accent);">${tFlight.toFixed(2)} s</span></div>
        <div><strong>Maximum Height ($H_{\\max}$):</strong> <span style="color:#c4b5fd;">${hMax.toFixed(2)} m</span></div>
        <div><strong>Horizontal Range ($R$):</strong> <span style="color:var(--success);">${rangeX.toFixed(2)} m</span></div>
        <div><strong>3D Final Z-Drift:</strong> ${maxZ.toFixed(2)} m</div>
      `;

      let rows = '';
      for (let i = 0; i <= 8; i++) {
        const t = (i / 8) * tFlight;
        const x = ux * t;
        const y = Math.max(0, h0 + uy * t - 0.5 * g * t * t);
        const z = vz * t;
        const vy = uy - g * t;
        const speed = Math.sqrt(ux * ux + vy * vy + vz * vz);
        rows += `<tr><td>${t.toFixed(2)} s</td><td>${x.toFixed(2)} m</td><td>${y.toFixed(2)} m</td><td>${z.toFixed(2)} m</td><td>${ux.toFixed(2)} m/s</td><td>${vy.toFixed(2)} m/s</td><td>${speed.toFixed(2)} m/s</td></tr>`;
      }
      tableBox.innerHTML = `
        <table class="data-table">
          <thead><tr><th>Time (t)</th><th>x(t) [1D/2D]</th><th>y(t) [Height]</th><th>z(t) [3D]</th><th>vₓ</th><th>vᵧ(t)</th><th>Net Speed |v|</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      `;
    }

    // 3. OSCILLATIONS (SHM) SLIDER SANDBOX
    if (mod === 'oscillations') {
      const A = p.shmA, w = p.shmOmega, phi = p.shmPhi * Math.PI / 180, m = p.shmMass, b = p.shmDamp;
      const k = m * w * w;
      const T = (2 * Math.PI) / w;
      const ox = 60, oy = H / 2;
      const scaleT = (W - 90) / 10;
      const scaleY = (H / 2 - 35) / 10;

      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(ox, 20); ctx.lineTo(ox, H - 20); ctx.moveTo(ox, oy); ctx.lineTo(W - 20, oy); ctx.stroke();

      ctx.strokeStyle = '#00f0ff'; ctx.lineWidth = 2.8;
      ctx.beginPath();
      for (let t = 0; t <= 10; t += 0.04) {
        const x = A * Math.exp(-b * t) * Math.cos(w * t + phi);
        const px = ox + t * scaleT, py = oy - x * scaleY;
        if (t === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      ctx.strokeStyle = '#7c4dff'; ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (let t = 0; t <= 10; t += 0.04) {
        const vScaled = -A * Math.exp(-b * t) * Math.sin(w * t + phi);
        const px = ox + t * scaleT, py = oy - vScaled * scaleY;
        if (t === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      ctx.fillStyle = '#f0f4f8'; ctx.font = '12px Inter';
      ctx.fillText(`Cyan: Displacement x(t) | Violet: Velocity v(t)/ω | Period T = ${T.toFixed(2)}s | Stiffness k = ${k.toFixed(2)} N/m`, ox + 10, 26);

      metricsBox.innerHTML = `
        <div><strong>Time Period ($T$):</strong> <span style="color:var(--accent);">${T.toFixed(3)} s</span></div>
        <div><strong>Spring Constant ($k = m\\omega^2$):</strong> ${k.toFixed(2)} N/m</div>
        <div><strong>Max Velocity ($v_{\\max} = A\\omega$):</strong> ${(A * w).toFixed(2)} m/s</div>
        <div><strong>Max Acceleration ($a_{\\max} = A\\omega^2$):</strong> ${(A * w * w).toFixed(2)} m/s²</div>
        <div><strong>Initial Mechanical Energy ($\\frac{1}{2}kA^2$):</strong> <span style="color:var(--success);">${(0.5 * k * A * A).toFixed(2)} J</span></div>
      `;

      let rows = '';
      for (let i = 0; i <= 8; i++) {
        const t = i * (T / 4);
        const env = A * Math.exp(-b * t);
        const x = env * Math.cos(w * t + phi);
        const v = -w * env * Math.sin(w * t + phi);
        const acc = -w * w * x;
        const pe = 0.5 * k * x * x;
        const ke = 0.5 * m * v * v;
        rows += `<tr><td>${t.toFixed(2)} s</td><td>${x.toFixed(3)} m</td><td>${v.toFixed(3)} m/s</td><td>${acc.toFixed(3)} m/s²</td><td>${ke.toFixed(2)} J</td><td>${pe.toFixed(2)} J</td></tr>`;
      }
      tableBox.innerHTML = `
        <table class="data-table">
          <thead><tr><th>Time (t)</th><th>Position x(t)</th><th>Velocity v(t)</th><th>Acceleration a(t)</th><th>Kinetic Energy (K)</th><th>Potential Energy (U)</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      `;
    }

    // 4. RAY OPTICS SLIDER SANDBOX
    if (mod === 'optics') {
      const f = p.optFocal === 0 ? 1 : p.optFocal;
      const u = p.optU;
      const ho = p.optHo;
      const invV = (1 / f) + (1 / u);
      const v = Math.abs(invV) < 1e-5 ? 9999 : 1 / invV;
      const m = v / u;
      const hi = m * ho;

      const cx = W / 2, cy = H / 2;
      const scaleX = 4.2, scaleY = 8.0;

      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(20, cy); ctx.lineTo(W - 20, cy); ctx.stroke();

      ctx.strokeStyle = '#00f0ff'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(cx, cy - 120); ctx.lineTo(cx, cy + 120); ctx.stroke();

      ctx.fillStyle = '#ffab00';
      ctx.beginPath(); ctx.arc(cx + f * scaleX, cy, 4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx - f * scaleX, cy, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillText('F₂', cx + f * scaleX - 6, cy + 18);
      ctx.fillText('F₁', cx - f * scaleX - 6, cy + 18);

      const objX = cx + u * scaleX;
      const objY = cy - ho * scaleY;
      this.drawArrow(ctx, objX, cy, objX, objY, '#00e676', 3, 'Object');

      const imgX = cx + v * scaleX;
      const imgY = cy - hi * scaleY;
      this.drawArrow(ctx, imgX, cy, imgX, imgY, '#7c4dff', 3, 'Image');

      ctx.strokeStyle = 'rgba(0, 240, 255, 0.75)'; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.moveTo(objX, objY); ctx.lineTo(cx, objY); ctx.lineTo(imgX, imgY); ctx.stroke();

      ctx.strokeStyle = 'rgba(255, 171, 0, 0.75)';
      ctx.beginPath(); ctx.moveTo(objX, objY); ctx.lineTo(cx, cy); ctx.lineTo(imgX, imgY); ctx.stroke();

      const nature = v > 0 ? 'Real & Inverted' : 'Virtual & Erect';
      ctx.fillStyle = '#f0f4f8'; ctx.font = '12px Inter';
      ctx.fillText(`Green: Object (u=${u}cm) | Violet: Image (v=${v.toFixed(1)}cm, m=${m.toFixed(2)}×) | Nature: ${nature}`, 25, 26);

      metricsBox.innerHTML = `
        <div><strong>Lens Type:</strong> ${f > 0 ? 'Convex (Converging)' : 'Concave (Diverging)'}</div>
        <div><strong>Image Distance ($v$):</strong> <span style="color:var(--accent);">${v.toFixed(2)} cm</span></div>
        <div><strong>Magnification ($m = v/u$):</strong> <span style="color:#c4b5fd;">${m.toFixed(3)}×</span></div>
        <div><strong>Image Height ($h_i$):</strong> ${hi.toFixed(2)} cm</div>
        <div><strong>Optical Power ($P = 100/f$):</strong> ${(100 / f).toFixed(2)} D (${nature})</div>
      `;

      let rows = '';
      [-70, -50, -40, -30, -25, -15, -10].forEach(uTest => {
        const vTest = (uTest * f) / (uTest + f);
        const mTest = vTest / uTest;
        rows += `<tr><td>${uTest} cm</td><td>${f} cm</td><td>${vTest.toFixed(2)} cm</td><td>${mTest.toFixed(2)}×</td><td>${(mTest * ho).toFixed(2)} cm</td><td>${vTest > 0 ? 'Real' : 'Virtual'}</td></tr>`;
      });
      tableBox.innerHTML = `
        <table class="data-table">
          <thead><tr><th>Object Distance (u)</th><th>Focal Length (f)</th><th>Image Distance (v)</th><th>Magnification (m)</th><th>Image Height (hᵢ)</th><th>Nature</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      `;
    }

    // 5. GRAVITATION SLIDER SANDBOX
    if (mod === 'gravitation') {
      const mRatio = p.gravMassRatio;
      const R = p.gravRadiusKm;
      const rProbe = p.gravProbeR;
      const gSurface = 9.8 * mRatio * Math.pow(6400 / R, 2);

      const gAt = (r) => (r < R) ? gSurface * (r / R) : gSurface * Math.pow(R / r, 2);
      const vEscSurface = Math.sqrt(2 * gSurface * R * 1000) / 1000;
      const vOrbProbe = rProbe >= R ? Math.sqrt(gAt(rProbe) * rProbe * 1000) / 1000 : 0;

      const ox = 65, oy = H - 45;
      const maxR = 25000;
      const scaleX = (W - 95) / maxR;
      const scaleY = (H - 80) / Math.max(15, gSurface * 1.15);

      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(ox, 20); ctx.lineTo(ox, oy); ctx.lineTo(W - 20, oy); ctx.stroke();

      const rxPx = ox + R * scaleX;
      ctx.strokeStyle = 'rgba(255, 171, 0, 0.5)'; ctx.setLineDash([5, 5]);
      ctx.beginPath(); ctx.moveTo(rxPx, 20); ctx.lineTo(rxPx, oy); ctx.stroke();
      ctx.setLineDash([]);

      ctx.strokeStyle = '#00f0ff'; ctx.lineWidth = 3;
      ctx.beginPath();
      for (let r = 0; r <= maxR; r += 200) {
        const px = ox + r * scaleX;
        const py = oy - gAt(r) * scaleY;
        if (r === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      const probeG = gAt(rProbe);
      ctx.fillStyle = '#7c4dff';
      ctx.beginPath(); ctx.arc(ox + rProbe * scaleX, oy - probeG * scaleY, 6, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = '#f0f4f8'; ctx.font = '12px Inter';
      ctx.fillText(`Inside (r < R): g ∝ r | Surface (r = ${R}km): g_max = ${gSurface.toFixed(2)} m/s² | Outside (r > R): g ∝ 1/r²`, ox + 10, 26);

      metricsBox.innerHTML = `
        <div><strong>Surface Gravity ($g_0$):</strong> <span style="color:var(--accent);">${gSurface.toFixed(2)} m/s²</span></div>
        <div><strong>Gravity at Probe ($r = ${rProbe}$ km):</strong> <span style="color:#c4b5fd;">${probeG.toFixed(2)} m/s²</span></div>
        <div><strong>Surface Escape Speed ($v_e$):</strong> <span style="color:var(--success);">${vEscSurface.toFixed(2)} km/s</span></div>
        <div><strong>Orbital Speed at Probe ($v_o$):</strong> ${vOrbProbe > 0 ? vOrbProbe.toFixed(2) + ' km/s' : 'Inside Planet'}</div>
      `;

      let rows = '';
      [0.25, 0.5, 0.75, 1.0, 1.5, 2.0, 3.0, 4.0].forEach(mult => {
        const rVal = R * mult;
        const gVal = gAt(rVal);
        const vOrb = mult >= 1.0 ? (Math.sqrt(gVal * rVal * 1000) / 1000).toFixed(2) + ' km/s' : 'Sub-surface';
        rows += `<tr><td>${mult.toFixed(2)} R</td><td>${rVal.toFixed(0)} km</td><td>${gVal.toFixed(3)} m/s²</td><td>${vOrb}</td><td>${mult < 1 ? 'Linear (Inside)' : (mult === 1 ? 'Surface Peak' : 'Inverse-Square')}</td></tr>`;
      });
      tableBox.innerHTML = `
        <table class="data-table">
          <thead><tr><th>Ratio (r / R)</th><th>Distance r (km)</th><th>Gravitational Field g(r)</th><th>Orbital Speed v₀</th><th>Regime</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      `;
    }

    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([metricsBox]);
    }
  },

  // =========================================================================
  // PART 2: DEDICATED CONCEPT ANIMATION THEATER (PURE MOTION ANIMATIONS)
  // =========================================================================
  renderAnimationTheaterHTML() {
    return `
      <div class="stat-card" style="margin-bottom:18px;border-left:4px solid var(--accent-violet);">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
          <div>
            <span class="badge" style="color:#c4b5fd;">ENGINE B • REAL-TIME ANIMATION THEATER</span>
            <strong style="margin-left:8px;">Select Motion Simulation:</strong>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button class="nav-btn ${this.animModule === 'maths' ? 'active' : ''}" onclick="PHIZIKS_VISUAL.setAnimModule('maths')">📐 Basic Maths (Phasor & Wave)</button>
            <button class="nav-btn ${this.animModule === 'kinematics' ? 'active' : ''}" onclick="PHIZIKS_VISUAL.setAnimModule('kinematics')">🚀 Kinematics (1D, 2D & 3D Helix)</button>
            <button class="nav-btn ${this.animModule === 'oscillations' ? 'active' : ''}" onclick="PHIZIKS_VISUAL.setAnimModule('oscillations')">⏱️ Oscillations (Pendulum + Spring)</button>
            <button class="nav-btn ${this.animModule === 'optics' ? 'active' : ''}" onclick="PHIZIKS_VISUAL.setAnimModule('optics')">🌈 Optics (Wavefront Convergence)</button>
            <button class="nav-btn ${this.animModule === 'gravitation' ? 'active' : ''}" onclick="PHIZIKS_VISUAL.setAnimModule('gravitation')">🪐 Gravitation (Kepler Orbit)</button>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:12px;">
          <h3 style="color:var(--accent);">🎬 Live Physics Motion Stage</h3>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button class="tool-btn btn-primary" onclick="PHIZIKS_VISUAL.anim.running = !PHIZIKS_VISUAL.anim.running">⏯ Play / Pause</button>
            <button class="tool-btn" onclick="PHIZIKS_VISUAL.stepAnimationFrame()" title="Step forward by +Δt while paused">⏭ +Δt Step</button>
            <button class="tool-btn" onclick="PHIZIKS_VISUAL.anim.speed = 0.25">🐢 0.25×</button>
            <button class="tool-btn" onclick="PHIZIKS_VISUAL.anim.speed = 1.0">▶ 1×</button>
            <button class="tool-btn" onclick="PHIZIKS_VISUAL.anim.speed = 2.0">⏩ 2×</button>
            <button class="tool-btn" onclick="PHIZIKS_VISUAL.anim.showVectors = !PHIZIKS_VISUAL.anim.showVectors; PHIZIKS_VISUAL.drawAnimationFrame();">🏹 Toggle Vectors</button>
            <button class="tool-btn" onclick="PHIZIKS_VISUAL.anim.t = 0; PHIZIKS_VISUAL.drawAnimationFrame();">🔄 Reset t = 0</button>
          </div>
        </div>
        <canvas id="anim-theater-canvas" width="1020" height="440" style="width:100%;height:auto;background:#04070f;border:1px solid var(--border-color);border-radius:10px;"></canvas>
      </div>
    `;
  },

  startAnimationLoop() {
    const step = () => {
      if (this.activeMode === 'animations' && this.anim.running) {
        this.anim.t += 0.025 * this.anim.speed;
        this.drawAnimationFrame();
      }
      this.anim.rafId = requestAnimationFrame(step);
    };
    this.anim.rafId = requestAnimationFrame(step);
  },

  drawAnimationFrame() {
    const canvas = document.getElementById('anim-theater-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const t = this.anim.t;
    ctx.clearRect(0, 0, W, H);

    // 1. BASIC MATHS ANIMATION: UNIT CIRCLE PHASOR -> SINE & COSINE WAVE GENERATOR
    if (this.animModule === 'maths') {
      const cx = 180, cy = H / 2, R = 110;
      ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - R - 20, cy); ctx.lineTo(W - 40, cy); ctx.stroke();

      const px = cx + R * Math.cos(t * 2);
      const py = cy - R * Math.sin(t * 2);

      this.drawArrow(ctx, cx, cy, px, py, '#00f0ff', 3, 'A');
      ctx.fillStyle = '#7c4dff';
      ctx.beginPath(); ctx.arc(px, py, 7, 0, Math.PI * 2); ctx.fill();

      const waveStartX = 350;
      ctx.strokeStyle = 'rgba(124, 77, 255, 0.55)'; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(waveStartX, py); ctx.stroke();
      ctx.setLineDash([]);

      ctx.strokeStyle = '#00e676'; ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = 0; x < 600; x += 3) {
        const wy = cy - R * Math.sin(t * 2 - x * 0.025);
        if (x === 0) ctx.moveTo(waveStartX + x, wy); else ctx.lineTo(waveStartX + x, wy);
      }
      ctx.stroke();

      ctx.fillStyle = '#f0f4f8'; ctx.font = '14px Inter';
      ctx.fillText(`Phasor Projection: θ = ${((t * 2 * 180 / Math.PI) % 360).toFixed(0)}° | sin(θ) = ${Math.sin(t * 2).toFixed(2)} | cos(θ) = ${Math.cos(t * 2).toFixed(2)}`, 25, 32);
    }

    // 2. KINEMATICS ANIMATION: SIMULTANEOUS 1D, 2D PROJECTILE & 3D HELICAL SPIRAL
    if (this.animModule === 'kinematics') {
      const cycleT = t % 6.0;
      ctx.fillStyle = '#f0f4f8'; ctx.font = '13px Inter';
      ctx.fillText('1D Motion: Constant Velocity (Cyan) vs Constant Acceleration (Violet)', 30, 32);
      ctx.strokeStyle = '#334155'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(30, 60); ctx.lineTo(W - 30, 60); ctx.stroke();
      const x1DUniform = 30 + cycleT * 140;
      const x1DAcc = 30 + 0.5 * 48 * cycleT * cycleT;
      ctx.fillStyle = '#00f0ff'; ctx.beginPath(); ctx.arc(Math.min(W - 40, x1DUniform), 60, 8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#7c4dff'; ctx.beginPath(); ctx.arc(Math.min(W - 40, x1DAcc), 60, 8, 0, Math.PI * 2); ctx.fill();

      const ox = 60, oy = H - 40;
      ctx.fillStyle = '#f0f4f8';
      ctx.fillText('2D Projectile Motion (Live v_x and v_y Vector Decomposition)', 40, 120);
      const u = 68, ang = 52 * Math.PI / 180, g = 20;
      const ux = u * Math.cos(ang), uy = u * Math.sin(ang);
      const tMax = (2 * uy) / g;
      const tp = cycleT % tMax;
      const px = ox + ux * tp * 1.9;
      const py = oy - (uy * tp - 0.5 * g * tp * tp) * 1.9;

      ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
      ctx.beginPath();
      for (let s = 0; s <= tMax; s += 0.05) {
        const tx = ox + ux * s * 1.9, ty = oy - (uy * s - 0.5 * g * s * s) * 1.9;
        if (s === 0) ctx.moveTo(tx, ty); else ctx.lineTo(tx, ty);
      }
      ctx.stroke();

      ctx.fillStyle = '#00e676';
      ctx.beginPath(); ctx.arc(px, py, 9, 0, Math.PI * 2); ctx.fill();

      if (this.anim.showVectors) {
        const vyNow = uy - g * tp;
        this.drawArrow(ctx, px, py, px + ux * 0.8, py, '#00f0ff', 2.5, 'v_x');
        this.drawArrow(ctx, px, py, px, py - vyNow * 0.8, '#ffab00', 2.5, 'v_y');
      }

      const hCx = 760, hCy = 260;
      ctx.fillStyle = '#f0f4f8';
      ctx.fillText('3D Helical Motion: r(t) = R cos(ωt) i + R sin(ωt) j + v_z t k', 580, 120);
      ctx.strokeStyle = '#7c4dff'; ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let s = 0; s <= 14; s += 0.06) {
        const hx = hCx - 140 + s * 20 + 45 * Math.cos(s * 2.2);
        const hy = hCy + 55 * Math.sin(s * 2.2) - s * 4;
        if (s === 0) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy);
      }
      ctx.stroke();
      const sNow = (t * 2.5) % 14;
      const curHx = hCx - 140 + sNow * 20 + 45 * Math.cos(sNow * 2.2);
      const curHy = hCy + 55 * Math.sin(sNow * 2.2) - sNow * 4;
      ctx.fillStyle = '#00f0ff';
      ctx.beginPath(); ctx.arc(curHx, curHy, 8, 0, Math.PI * 2); ctx.fill();
    }

    // 3. OSCILLATIONS ANIMATION: SIMPLE PENDULUM + SPRING-BLOCK SYSTEM
    if (this.animModule === 'oscillations') {
      const w = 2.2;
      const theta = 0.45 * Math.cos(w * t);
      const omegaNow = -0.45 * w * Math.sin(w * t);

      const pivX = 260, pivY = 60, L = 250;
      const bobX = pivX + L * Math.sin(theta);
      const bobY = pivY + L * Math.cos(theta);

      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(pivX - 60, pivY); ctx.lineTo(pivX + 60, pivY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pivX, pivY); ctx.lineTo(bobX, bobY); ctx.stroke();
      ctx.fillStyle = '#00f0ff';
      ctx.beginPath(); ctx.arc(bobX, bobY, 18, 0, Math.PI * 2); ctx.fill();

      if (this.anim.showVectors) {
        this.drawArrow(ctx, bobX, bobY, bobX + omegaNow * 70 * Math.cos(theta), bobY - omegaNow * 70 * Math.sin(theta), '#00e676', 3, 'v');
      }

      const wallX = 540, floorY = 260;
      const eqX = 740;
      const disp = 95 * Math.cos(w * t);
      const blockX = eqX + disp;

      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(wallX, floorY - 80); ctx.lineTo(wallX, floorY + 25); ctx.lineTo(W - 40, floorY + 25); ctx.stroke();

      ctx.strokeStyle = '#ffab00'; ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(wallX, floorY);
      const coils = 16;
      const span = (blockX - 25) - wallX;
      for (let i = 1; i <= coils; i++) {
        const sx = wallX + (i / coils) * span;
        const sy = floorY + (i % 2 === 0 ? -14 : 14);
        ctx.lineTo(sx, sy);
      }
      ctx.lineTo(blockX - 25, floorY);
      ctx.stroke();

      ctx.fillStyle = '#7c4dff';
      ctx.fillRect(blockX - 25, floorY - 25, 50, 50);

      if (this.anim.showVectors) {
        this.drawArrow(ctx, blockX, floorY - 40, blockX - disp * 0.65, floorY - 40, '#00f0ff', 3, 'F = -kx');
      }

      ctx.fillStyle = '#f0f4f8'; ctx.font = '14px Inter';
      ctx.fillText('Synchronized Simple Pendulum & Spring-Block SHM (Green: Velocity v | Cyan: Restoring Force F = -kx)', 30, 32);
    }

    // 4. RAY OPTICS ANIMATION: ANIMATED PHOTON PULSES CONVERGING AT FOCUS
    if (this.animModule === 'optics') {
      const cx = W / 2, cy = H / 2, fPx = 220;
      ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(30, cy); ctx.lineTo(W - 30, cy); ctx.stroke();

      ctx.fillStyle = 'rgba(0, 240, 255, 0.16)';
      ctx.strokeStyle = '#00f0ff'; ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 22, 145, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();

      const focusX = cx + fPx;
      ctx.fillStyle = '#7c4dff';
      ctx.beginPath(); ctx.arc(focusX, cy, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#f0f4f8'; ctx.font = '13px Inter';
      ctx.fillText('Principal Focus (F₂)', focusX - 45, cy + 26);

      const heights = [-105, -70, -35, 35, 70, 105];
      const progress = (t * 140) % 820;

      heights.forEach(h => {
        ctx.strokeStyle = 'rgba(0, 230, 118, 0.45)'; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(80, cy + h);
        ctx.lineTo(cx, cy + h);
        ctx.lineTo(focusX + (focusX - cx) * 0.5, cy - h * 0.5);
        ctx.stroke();

        let px, py;
        if (80 + progress <= cx) {
          px = 80 + progress;
          py = cy + h;
        } else {
          const dAfter = (80 + progress) - cx;
          const slope = -h / fPx;
          px = cx + dAfter;
          py = (cy + h) + slope * dAfter;
        }
        if (px < W - 40) {
          ctx.fillStyle = '#ffab00';
          ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2); ctx.fill();
        }
      });

      ctx.fillStyle = '#f0f4f8'; ctx.font = '14px Inter';
      ctx.fillText('Ray Optics Wavefront Propagation: Parallel Incident Rays Refracting to Converge at Principal Focus F₂', 30, 32);
    }

    // 5. GRAVITATION ANIMATION: KEPLER'S ELLIPTICAL ORBIT & EQUAL-AREA SWEEP
    if (this.animModule === 'gravitation') {
      const cx = W / 2, cy = H / 2;
      const a = 260, b = 155;
      const c = Math.sqrt(a * a - b * b);
      const starX = cx + c * 0.55, starY = cy;

      ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(cx, cy, a, b, 0, 0, Math.PI * 2); ctx.stroke();

      ctx.fillStyle = '#ffab00';
      ctx.beginPath(); ctx.arc(starX, starY, 22, 0, Math.PI * 2); ctx.fill();

      const anomaly = t * 1.4 + 0.38 * Math.sin(t * 1.4);
      const px = cx + a * Math.cos(anomaly);
      const py = cy - b * Math.sin(anomaly);

      ctx.fillStyle = 'rgba(0, 240, 255, 0.14)';
      ctx.beginPath();
      ctx.moveTo(starX, starY);
      for (let da = -0.35; da <= 0; da += 0.05) {
        ctx.lineTo(cx + a * Math.cos(anomaly + da), cy - b * Math.sin(anomaly + da));
      }
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(starX, starY); ctx.lineTo(px, py); ctx.stroke();

      ctx.fillStyle = '#00f0ff';
      ctx.beginPath(); ctx.arc(px, py, 11, 0, Math.PI * 2); ctx.fill();

      if (this.anim.showVectors) {
        const dx = starX - px, dy = starY - py;
        const dist = Math.hypot(dx, dy);
        const fScale = 12000 / (dist * dist) * 90;
        this.drawArrow(ctx, px, py, px + (dx / dist) * fScale, py + (dy / dist) * fScale, '#ff3d57', 3, 'F_g');

        const vx = -a * Math.sin(anomaly), vy = -b * Math.cos(anomaly);
        const vMag = Math.hypot(vx, vy);
        const vScale = (220 / dist) * 55;
        this.drawArrow(ctx, px, py, px + (vx / vMag) * vScale, py + (vy / vMag) * vScale, '#00e676', 3, 'v');
      }

      ctx.fillStyle = '#f0f4f8'; ctx.font = '14px Inter';
      ctx.fillText("Kepler's Second Law Animation: dA/dt = L/(2m) = Constant (Red: Gravitational Force F_g | Green: Velocity v)", 30, 32);
    }
  }
};