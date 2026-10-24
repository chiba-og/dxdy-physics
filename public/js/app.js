const PHIZIKS = {
  state: null,
  installedChapters: {},
  installedByCode: {},
  currentView: 'home',
  currentChapterId: null,
  previousChapterId: null,
  pptIndex: 0,
  pinnedStepIndex: -1,
  calcExpression: '',
  calcAngleMode: 'DEG',
  noteAutosaveTimer: null,
  scrollObserver: null,
  particleRafId: null,
  wb: {
    active: false,
    drawing: false,
    tool: 'pen',
    color: '#00f0ff',
    size: 4,
    ctx: null,
    canvas: null
  },

  // 3 INLINE SVG LOGO TEMPLATES FOR dx/dy
  logoTemplates: {
    slash: `
      <svg class="dxdy-logo" viewBox="0 0 132 40" role="img" aria-label="dx/dy">
        <text x="6" y="27" class="dxdy-word dxdy-dx">dx</text>
        <path d="M 74 6 L 54 34" class="dxdy-slash-base" />
        <path d="M 74 6 L 54 34" class="dxdy-slash-highlight" />
        <text x="73" y="29" class="dxdy-word dxdy-dy">dy</text>
      </svg>`,
    curve: `
      <svg class="dxdy-logo" viewBox="0 0 140 40" role="img" aria-label="dx/dy">
        <text x="5" y="27" class="dxdy-word dxdy-dx">dx</text>
        <path d="M 50 35 C 62 35, 64 5, 78 5" class="dxdy-slash-base" fill="none" />
        <path d="M 50 35 C 62 35, 64 5, 78 5" class="dxdy-slash-highlight" fill="none" />
        <circle cx="64" cy="20" r="2.6" fill="var(--accent)" />
        <text x="77" y="29" class="dxdy-word dxdy-dy">dy</text>
      </svg>`,
    vector: `
      <svg class="dxdy-logo" viewBox="0 0 148 40" role="img" aria-label="dx/dy">
        <path d="M 9 10 L 4 10 L 4 30 L 9 30" stroke="var(--text-secondary)" stroke-width="1.8" fill="none" />
        <text x="12" y="27" class="dxdy-word dxdy-dx">dx</text>
        <path d="M 58 34 L 78 6 M 78 6 L 70 8 M 78 6 L 76 14" class="dxdy-slash-base" fill="none" />
        <path d="M 58 34 L 78 6" class="dxdy-slash-highlight" fill="none" />
        <text x="80" y="29" class="dxdy-word dxdy-dy">dy</text>
        <path d="M 136 10 L 141 10 L 141 30 L 136 30" stroke="var(--text-secondary)" stroke-width="1.8" fill="none" />
      </svg>`
  },

  // CANONICAL 29-CHAPTER SYLLABUS REGISTRY (00 to 28)
  syllabus: [
    { id: "ch00_basic_maths", num: "00", classLevel: "Foundation (11 & 12)", unit: "Mathematical Tools", title: "Basic Mathematics for Physics", prereqs: [], summary: "Trigonometry, Coordinate Geometry, Limits, Differentiation, Maxima-Minima, Integration, Differential Equations, Vectors & Graphs." },
    { id: "ch01_units_measurements", num: "01", classLevel: "Class 11", unit: "Mechanics I", title: "Units, Dimensions and Measurements", prereqs: ["ch00_basic_maths"], summary: "SI units, Dimensional Analysis, Significant Figures, Error Propagation, Vernier Callipers & Screw Gauge." },
    { id: "ch02_motion_straight_line", num: "02", classLevel: "Class 11", unit: "Mechanics I", title: "Motion in a Straight Line (1D Kinematics)", prereqs: ["ch00_basic_maths"], summary: "Frame of reference, distance vs displacement, instantaneous velocity/acceleration via calculus, kinematic equations, motion under gravity & graphs." },
    { id: "ch03_motion_plane", num: "03", classLevel: "Class 11", unit: "Mechanics I", title: "Motion in a Plane (2D & 3D Kinematics)", prereqs: ["ch00_basic_maths", "ch02_motion_straight_line"], summary: "Vector resolution, Ground & Inclined Projectile Motion, River-Boat & Rain-Man Relative Motion, and Circular Kinematics." },
    { id: "ch04_laws_of_motion", num: "04", classLevel: "Class 11", unit: "Mechanics I", title: "Newton's Laws of Motion & Friction", prereqs: ["ch03_motion_plane"], summary: "Free Body Diagrams (FBDs), String & Wedge Constraints, Pseudo Force, Static/Kinetic Friction, Angle of Repose & Banking of Roads." },
    { id: "ch05_work_energy_power", num: "05", classLevel: "Class 11", unit: "Mechanics II", title: "Work, Energy, Power & Vertical Circle", prereqs: ["ch00_basic_maths", "ch04_laws_of_motion"], summary: "Work by variable forces, Work-Energy Theorem, Conservative Forces, Potential Energy Curves & Vertical Circular Motion." },
    { id: "ch06_rotational_motion", num: "06", classLevel: "Class 11", unit: "Mechanics II", title: "System of Particles & Rotational Motion", prereqs: ["ch05_work_energy_power"], summary: "Center of Mass, Collisions, Moment of Inertia Theorems, Torque, Angular Momentum Conservation & Pure Rolling Motion." },
    { id: "ch07_gravitation", num: "07", classLevel: "Class 11", unit: "Mechanics II", title: "Gravitation", prereqs: ["ch00_basic_maths", "ch05_work_energy_power"], summary: "Newton's Law of Gravitation, Shell Theorem, Variation of g, Gravitational Potential, Escape Velocity, Satellites & Kepler's Laws." },
    { id: "ch08_mechanical_solids", num: "08", classLevel: "Class 11", unit: "Properties of Matter", title: "Mechanical Properties of Solids", prereqs: ["ch04_laws_of_motion"], summary: "Stress-Strain Curve, Hooke's Law, Young's, Bulk & Shear Moduli, Poisson's Ratio & Elastic Potential Energy." },
    { id: "ch09_mechanical_fluids", num: "09", classLevel: "Class 11", unit: "Properties of Matter", title: "Mechanical Properties of Fluids", prereqs: ["ch05_work_energy_power"], summary: "Hydrostatics, Pascal's Law, Buoyancy, Continuity, Bernoulli's Theorem, Torricelli's Law, Viscosity, Stokes' Law & Surface Tension." },
    { id: "ch10_thermal_matter", num: "10", classLevel: "Class 11", unit: "Heat & Thermodynamics", title: "Thermal Properties of Matter", prereqs: ["ch00_basic_maths"], summary: "Thermometry, Thermal Expansion, Calorimetry, Fourier Heat Conduction, Stefan-Boltzmann & Wien Radiation Laws & Newton's Cooling." },
    { id: "ch11_thermodynamics", num: "11", classLevel: "Class 11", unit: "Heat & Thermodynamics", title: "Thermodynamics", prereqs: ["ch00_basic_maths", "ch10_thermal_matter"], summary: "Zeroth & First Law, Isochoric/Isobaric/Isothermal/Adiabatic/Polytropic Processes, Cyclic Processes, Carnot Engine & Second Law." },
    { id: "ch12_kinetic_theory", num: "12", classLevel: "Class 11", unit: "Heat & Thermodynamics", title: "Kinetic Theory of Gases (KTG)", prereqs: ["ch11_thermodynamics"], summary: "Microscopic Gas Pressure, RMS/Average/Most Probable Speeds, Maxwell Distribution, Degrees of Freedom, Equipartition & Mean Free Path." },
    { id: "ch13_oscillations", num: "13", classLevel: "Class 11", unit: "Oscillations & Waves", title: "Oscillations (Simple Harmonic Motion)", prereqs: ["ch00_basic_maths", "ch05_work_energy_power"], summary: "SHM Kinematics & Phasor Circle, Energy in SHM, Spring Combinations, Simple/Compound/Torsional Pendulums & Damped/Forced SHM." },
    { id: "ch14_waves", num: "14", classLevel: "Class 11", unit: "Oscillations & Waves", title: "Waves & Sound", prereqs: ["ch13_oscillations"], summary: "Traveling Wave Equation, String & Sound Wave Speed, Newton-Laplace Formula, Standing Waves in Strings & Pipes, Beats & Doppler Effect." },
    { id: "ch15_electric_charges_fields", num: "15", classLevel: "Class 12", unit: "Electrodynamics I", title: "Electric Charges, Fields & Gauss's Law", prereqs: ["ch00_basic_maths", "ch07_gravitation"], summary: "Coulomb's Law, Continuous Charge Distributions (Rod, Arc, Ring, Disk), Electric Dipole Dynamics, Electric Flux & Gauss's Law." },
    { id: "ch16_electrostatic_potential_capacitance", num: "16", classLevel: "Class 12", unit: "Electrodynamics I", title: "Electrostatic Potential & Capacitance", prereqs: ["ch15_electric_charges_fields"], summary: "Electrostatic Potential & Energy, E = -grad V, Conductors & Earthing, Parallel/Spherical/Cylindrical Capacitors & Dielectrics." },
    { id: "ch17_current_electricity", num: "17", classLevel: "Class 12", unit: "Electrodynamics I", title: "Current Electricity & RC Circuits", prereqs: ["ch16_electrostatic_potential_capacitance"], summary: "Drift Velocity, Ohm's Law, Kirchhoff's Laws, Symmetry Networks, Cells, Wheatstone/Meter Bridge, Potentiometer & RC Transients." },
    { id: "ch18_moving_charges_magnetism", num: "18", classLevel: "Class 12", unit: "Electrodynamics II", title: "Moving Charges & Magnetism", prereqs: ["ch00_basic_maths", "ch17_current_electricity"], summary: "Biot-Savart Law, Ampere's Law, Solenoid & Toroid, Lorentz Force, Helical Motion, Cyclotron, Wire Forces, Dipole Torque & Galvanometer." },
    { id: "ch19_magnetism_matter", num: "19", classLevel: "Class 12", unit: "Electrodynamics II", title: "Magnetism & Matter", prereqs: ["ch18_moving_charges_magnetism"], summary: "Bar Magnet & Solenoid Equivalence, Earth's Magnetic Elements (Declination, Dip), Vibration Magnetometer & Dia/Para/Ferromagnetism." },
    { id: "ch20_electromagnetic_induction", num: "20", classLevel: "Class 12", unit: "Electrodynamics II", title: "Electromagnetic Induction (EMI)", prereqs: ["ch00_basic_maths", "ch18_moving_charges_magnetism"], summary: "Faraday's & Lenz's Laws, Induced Charge, Translating & Rotating Motional EMF, Induced Electric Field, Inductance (L, M), RL & LC Circuits." },
    { id: "ch21_alternating_current", num: "21", classLevel: "Class 12", unit: "Electrodynamics II", title: "Alternating Current (AC) & EM Waves", prereqs: ["ch13_oscillations", "ch20_electromagnetic_induction"], summary: "Mean & RMS Values, Phasors, Series LCR Resonance & Q-Factor, Power Factor, Transformers, Displacement Current & EM Waves." },
    { id: "ch22_ray_optics", num: "22", classLevel: "Class 12", unit: "Optics", title: "Ray Optics & Optical Instruments", prereqs: ["ch00_basic_maths"], summary: "Plane & Spherical Mirrors, Snell's Law, Total Internal Reflection, Spherical Surface Refraction, Lens Maker's Formula, Prism & Microscopes/Telescopes." },
    { id: "ch23_wave_optics", num: "23", classLevel: "Class 12", unit: "Optics", title: "Wave Optics", prereqs: ["ch14_waves", "ch22_ray_optics"], summary: "Huygens' Principle, Coherent Superposition, YDSE & Slab Shift, Thin Film Interference, Single-Slit Diffraction & Polarization (Malus & Brewster)." },
    { id: "ch24_dual_nature", num: "24", classLevel: "Class 12", unit: "Modern Physics", title: "Dual Nature of Radiation & Matter", prereqs: ["ch05_work_energy_power"], summary: "Photon Quantum Theory, Radiation Pressure, Einstein's Photoelectric Equation, Stopping Potential Graphs, de Broglie Waves & Uncertainty." },
    { id: "ch25_atoms", num: "25", classLevel: "Class 12", unit: "Modern Physics", title: "Atoms & X-Rays", prereqs: ["ch15_electric_charges_fields", "ch24_dual_nature"], summary: "Rutherford Alpha Scattering, Distance of Closest Approach, Bohr Model Scaling Laws, Rydberg Spectral Series, Recoil & X-Ray Spectra (Moseley's Law)." },
    { id: "ch26_nuclei", num: "26", classLevel: "Class 12", unit: "Modern Physics", title: "Nuclei & Radioactivity", prereqs: ["ch00_basic_maths", "ch25_atoms"], summary: "Nuclear Radius & Constant Density, Mass Defect, Binding Energy Curve, Radioactive Decay Law, Half-Life, Parallel Decay, Alpha/Beta/Gamma & Fission/Fusion." },
    { id: "ch27_semiconductors", num: "27", classLevel: "Class 12", unit: "Modern Physics & Electronics", title: "Semiconductor Electronics & Logic Gates", prereqs: ["ch17_current_electricity"], summary: "Energy Bands, Intrinsic & Extrinsic Semiconductors, Mass-Action Law, p-n Diode, Rectifiers, Zener Regulator, Optoelectronics & Digital Logic Gates." },
    { id: "ch28_experimental_physics", num: "28", classLevel: "Class 11 & 12", unit: "Experimental Skills", title: "Experimental Physics & Lab Instruments", prereqs: ["ch01_units_measurements", "ch17_current_electricity"], summary: "Vernier Callipers (Standard & Sub-Multiple), Screw Gauge, Zero Error, Simple Pendulum Error, Searle's Apparatus, Meter Bridge & Half-Deflection." }
  ],

  // 8-SLIDE PLATFORM WALKTHROUGH PRESENTATION
  pptSlides: [
    {
      title: "1. Welcome to dx/dy — Interactive Physics & JEE Learning Laboratory",
      subtitle: "A futuristic scientific learning environment combined with a calm student productivity workspace",
      points: [
        "Bridges 10th-grade physical intuition and rigorous JEE Advanced multi-concept problem solving.",
        "Every chapter progresses from first-principles intuition to calculus derivations, SVG phase/motion graphs, JEE trap alerts, and multi-tier numericals.",
        "Unifies 5 core engines: 29-Chapter Encyclopedia, Dual Visual Physics Lab, Adaptive Non-Repeating Test Suite, Algorithmic Study Planner + Audio Timer, and Well-Being Journal."
      ],
      speakerNote: "Highlight the signature animated dx/dy wordmark—representing rate of change, calculus foundations, and continuous growth.",
      svg: `<svg viewBox="0 0 420 260" style="width:100%;height:auto;">
        <rect x="10" y="10" width="400" height="240" rx="12" fill="#080d1a" stroke="#00f0ff" stroke-width="2"/>
        <circle cx="210" cy="130" r="42" fill="rgba(0,240,255,0.12)" stroke="#00f0ff" stroke-width="2"/>
        <text x="210" y="136" fill="#00f0ff" font-family="monospace" font-size="18" font-weight="bold" text-anchor="middle">dx/dy</text>
        <g fill="#f0f4f8" font-size="11" font-weight="600" text-anchor="middle">
          <rect x="28" y="28" width="118" height="42" rx="6" fill="#0f172a" stroke="#7c4dff"/><text x="87" y="53">29 Chapters (00–28)</text>
          <rect x="274" y="28" width="118" height="42" rx="6" fill="#0f172a" stroke="#00e676"/><text x="333" y="53">Dual Visual Lab</text>
          <rect x="28" y="190" width="118" height="42" rx="6" fill="#0f172a" stroke="#ffab00"/><text x="87" y="215">Adaptive Tests</text>
          <rect x="274" y="190" width="118" height="42" rx="6" fill="#0f172a" stroke="#00f0ff"/><text x="333" y="215">Planner & Journal</text>
        </g>
        <line x1="146" y1="50" x2="176" y2="102" stroke="#7c4dff" stroke-width="2"/>
        <line x1="274" y1="50" x2="244" y2="102" stroke="#00e676" stroke-width="2"/>
        <line x1="146" y1="210" x2="176" y2="158" stroke="#ffab00" stroke-width="2"/>
        <line x1="274" y1="210" x2="244" y2="158" stroke="#00f0ff" stroke-width="2"/>
      </svg>`
    },
    {
      title: "2. Chapter 00 (Basic Mathematics) + 28 Complete Physics Chapters",
      subtitle: "Zero-to-JEE-Advanced progression with Spaced Repetition & Focus Mode",
      points: [
        "Starts with Chapter 00: Basic Mathematics (Trigonometry, Limits, Differentiation, Integration, Differential Equations & Vectors).",
        "Every topic tracks self-rating stars (1–5) and automatically schedules Spaced-Repetition reviews on your Continue Learning dashboard.",
        "One-click Distraction-Free Focus Mode hides navigation bars so you can read long derivations without visual clutter."
      ],
      speakerNote: "Demonstrate pressing '🧘 Focus' or opening the Prerequisite Dependency Map inside any chapter.",
      svg: `<svg viewBox="0 0 420 260" style="width:100%;height:auto;">
        <rect x="15" y="20" width="390" height="50" rx="8" fill="#0f172a" stroke="#00f0ff" stroke-width="2"/>
        <text x="30" y="50" fill="#00f0ff" font-size="13" font-weight="bold">CH 00: Basic Mathematics for Physics (Calculus, Vectors, Graphs)</text>
        <rect x="15" y="85" width="185" height="70" rx="8" fill="#080d1a" stroke="#94a3b8"/>
        <text x="30" y="115" fill="#fff" font-size="12" font-weight="bold">Class 11 (Ch 01 – Ch 14)</text>
        <text x="30" y="135" fill="#94a3b8" font-size="10">Mechanics, Heat, SHM & Waves</text>
        <rect x="220" y="85" width="185" height="70" rx="8" fill="#080d1a" stroke="#94a3b8"/>
        <text x="235" y="115" fill="#fff" font-size="12" font-weight="bold">Class 12 (Ch 15 – Ch 28)</text>
        <text x="235" y="135" fill="#94a3b8" font-size="10">Electrodynamics, Optics, Modern, Lab</text>
        <rect x="15" y="170" width="390" height="65" rx="8" fill="rgba(0,240,255,0.08)" stroke="#00f0ff"/>
        <text x="30" y="195" fill="#00f0ff" font-size="12" font-weight="bold">🔁 Spaced-Repetition Queue + Step-by-Step Numerical Solver</text>
        <text x="30" y="215" fill="#f0f4f8" font-size="10">Automatically surfaces topics due for review based on your confidence rating.</text>
      </svg>`
    },
    {
      title: "3. Prerequisite Dependency Map & Step-by-Step Numerical Solver",
      subtitle: "Trace every concept to its roots and break down tough numericals stage by stage",
      points: [
        "Interactive Prerequisite Pills & Dependency Map: Jump directly to foundational math or physics chapters and return with a single click.",
        "Step-by-Step Physics Solver: Breaks down problems into (1) Given Data & Units, (2) Governing Formula, (3) Substitution & Algebra, and (4) Final Verdict & Trap Check.",
        "Expandable JEE Trap drawers warn against sign mistakes, frame-of-reference errors, and non-standard limits."
      ],
      speakerNote: "Click any Prerequisite Pill inside a chapter to show the instant breadcrumb return banner.",
      svg: `<svg viewBox="0 0 420 260" style="width:100%;height:auto;">
        <rect x="20" y="25" width="380" height="90" rx="8" fill="#080d1a" stroke="#7c4dff" stroke-width="2"/>
        <text x="35" y="55" fill="#fff" font-size="12">Instantaneous Acceleration: a = dv/dt = v (dv/dx)</text>
        <rect x="35" y="70" width="250" height="28" rx="6" fill="rgba(124,77,255,0.2)" stroke="#7c4dff"/>
        <text x="48" y="88" fill="#c4b5fd" font-size="11" font-weight="bold">🔗 Prerequisite: Chain Rule & Calculus →</text>
        <path d="M 160 100 L 160 145" stroke="#00f0ff" stroke-width="2" stroke-dasharray="4"/>
        <rect x="20" y="145" width="380" height="90" rx="8" fill="#0f172a" stroke="#00f0ff" stroke-width="2"/>
        <text x="35" y="175" fill="#00f0ff" font-size="12" font-weight="bold">Instant Jump to Ch 00 + One-Click Return Breadcrumb!</text>
        <text x="35" y="200" fill="#94a3b8" font-size="11">Master the mathematical tool visually, then resume your physics derivation.</text>
      </svg>`
    },
    {
      title: "4. Dual Visual Physics Lab: Parametric Sliders vs. Animation Theater",
      subtitle: "Strictly separated controls for quantitative graphing and real-time motion",
      points: [
        "Engine A — Parametric Slider Sandbox: Drag sliders for velocity, angle, damping, focal length, or planet radius to update live graphs and coordinate tables.",
        "Engine B — Concept Animation Theater: Play, Pause, Step (+Δt), Slow-Mo (0.25×), and toggle live velocity/force vectors across 5 core physics domains.",
        "100% mathematically accurate equations—never decorative mockups."
      ],
      speakerNote: "Open '🔬 Visual Lab' to demonstrate both the Slider Sandbox and the frame-by-frame '+Δt Step' button in Animation Theater.",
      svg: `<svg viewBox="0 0 420 260" style="width:100%;height:auto;">
        <rect x="15" y="20" width="188" height="220" rx="8" fill="#080d1a" stroke="#00f0ff" stroke-width="2"/>
        <text x="109" y="45" fill="#00f0ff" font-size="12" font-weight="bold" text-anchor="middle">ENGINE A: SLIDER SANDBOX</text>
        <line x1="35" y1="75" x2="180" y2="75" stroke="#475569" stroke-width="4"/>
        <circle cx="110" cy="75" r="7" fill="#00f0ff"/>
        <polyline points="35,150 70,110 110,95 150,120 180,150" fill="none" stroke="#00e676" stroke-width="2"/>
        <rect x="30" y="170" width="158" height="52" fill="#0f172a" stroke="#00f0ff"/>
        <text x="109" y="200" fill="#fff" font-size="10" text-anchor="middle">Live Coordinate Table (t, x, y, v)</text>
        <rect x="217" y="20" width="188" height="220" rx="8" fill="#080d1a" stroke="#7c4dff" stroke-width="2"/>
        <text x="311" y="45" fill="#c4b5fd" font-size="12" font-weight="bold" text-anchor="middle">ENGINE B: MOTION THEATER</text>
        <circle cx="311" cy="125" r="45" fill="none" stroke="#94a3b8" stroke-dasharray="4"/>
        <circle cx="311" cy="125" r="14" fill="#ffab00"/>
        <circle cx="356" cy="125" r="6" fill="#00f0ff"/>
        <rect x="232" y="190" width="158" height="30" rx="5" fill="#0f172a"/>
        <text x="311" y="209" fill="#fff" font-size="10" text-anchor="middle">▶ Play | ⏸ | +Δt Step | 0.25×</text>
      </svg>`
    },
    {
      title: "5. Side-by-Side Whiteboard, Scientific Calculator & Autosave Notes",
      subtitle: "Zero context-switching while solving problems",
      points: [
        "Side-by-Side HTML5 Whiteboard: Docks beside any chapter or test with pen colors, brush sizes, eraser, coordinate grid, and PNG save.",
        "Scientific & Physics Calculator: Explicit DEG/RAD mode, trig/inverse trig, logs, powers, and one-tap physical constants (g, G, c, h, ε₀, e).",
        "Chapter Notes with Debounced Autosave: Automatically saves your notes to your active profile as you type and exports to Markdown (.MD)."
      ],
      speakerNote: "Click '✏️ Board' and '🧮 Calc' in the header to show how they work simultaneously over any screen.",
      svg: `<svg viewBox="0 0 420 260" style="width:100%;height:auto;">
        <rect x="15" y="20" width="220" height="220" rx="8" fill="#080d1a" stroke="#94a3b8"/>
        <text x="30" y="50" fill="#fff" font-size="12" font-weight="bold">Chapter Numerical / Live Test</text>
        <text x="30" y="80" fill="#94a3b8" font-size="10">Solve side-by-side without leaving the page</text>
        <rect x="245" y="20" width="160" height="220" rx="8" fill="#060913" stroke="#00f0ff" stroke-width="2"/>
        <text x="260" y="45" fill="#00f0ff" font-size="11" font-weight="bold">✏️ HTML5 Whiteboard</text>
        <path d="M 265 160 Q 320 70 385 160" fill="none" stroke="#00f0ff" stroke-width="3"/>
        <text x="285" y="195" fill="#00e676" font-size="11">R = u²sin(2θ)/g</text>
      </svg>`
    },
    {
      title: "6. Adaptive Testing & Non-Repeating DPP Generator",
      subtitle: "Smart question selection across Foundation, PYQ-Pattern, and Advanced tiers",
      points: [
        "Select any Chapter (or All Chapters), Difficulty Tier, Question Count, and Timer duration.",
        "Question-History Tracking: Tracks seen question IDs per profile to minimize accidental repetition until you reset the pool.",
        "Post-Test Analytics: Instant +4 / -1 JEE scoring, accuracy breakdown, and step-by-step worked solutions."
      ],
      speakerNote: "Demonstrate generating a custom test in '🎯 Adaptive Tests'.",
      svg: `<svg viewBox="0 0 420 260" style="width:100%;height:auto;">
        <rect x="20" y="25" width="380" height="210" rx="10" fill="#080d1a" stroke="#00e676" stroke-width="2"/>
        <text x="40" y="60" fill="#00e676" font-size="14" font-weight="bold">🎯 Adaptive Non-Repeating Test Engine</text>
        <rect x="40" y="80" width="105" height="45" rx="6" fill="#0f172a"/><text x="92" y="107" fill="#fff" font-size="11" text-anchor="middle">Basic Foundation</text>
        <rect x="158" y="80" width="105" height="45" rx="6" fill="#0f172a"/><text x="210" y="107" fill="#ffab00" font-size="11" text-anchor="middle">JEE Main / PYQ</text>
        <rect x="275" y="80" width="105" height="45" rx="6" fill="#0f172a"/><text x="327" y="107" fill="#7c4dff" font-size="11" text-anchor="middle">JEE Advanced</text>
        <rect x="40" y="145" width="340" height="65" rx="6" fill="#03050a" stroke="#00f0ff"/>
        <text x="55" y="175" fill="#00f0ff" font-size="12" font-weight="bold">✓ Profile-Scoped History | Worked LaTeX Solutions</text>
        <text x="55" y="195" fill="#94a3b8" font-size="10">Automatically queues missed concepts for spaced-repetition review.</text>
      </svg>`
    },
    {
      title: "7. Study Planner, Study-Recovery & Debugged Ambient Audio Timer",
      subtitle: "Calm, guilt-free scheduling with continuous background audio",
      points: [
        "Flexible Planner & Recovery: Rebalance incomplete tasks across upcoming days with zero red penalty streaks.",
        "Multi-Sound Web Audio Synthesizer: Built-in White Noise, Steady Rain, Forest Wind/Nature, and Warm Lo-Fi Chord Drone work 100% offline with volume control.",
        "Persistent Custom Audio Uploads: Upload your own MP3/WAV/OGG tracks—playback continues smoothly across tab switches while the timer runs."
      ],
      speakerNote: "Show the volume slider, Play/Pause controls, and all 4 built-in ambient sounds + custom audio upload in '⏱️ Planner & Timer'.",
      svg: `<svg viewBox="0 0 420 260" style="width:100%;height:auto;">
        <rect x="20" y="20" width="380" height="220" rx="10" fill="#080d1a" stroke="#7c4dff" stroke-width="2"/>
        <text x="40" y="50" fill="#c4b5fd" font-size="13" font-weight="bold">🎧 Focus Timer & Persistent Audio Engine</text>
        <rect x="40" y="70" width="150" height="140" rx="8" fill="#03050a" stroke="#00f0ff"/>
        <text x="115" y="125" fill="#00f0ff" font-family="monospace" font-size="26" font-weight="bold" text-anchor="middle">50:00</text>
        <text x="115" y="155" fill="#00e676" font-size="10" text-anchor="middle">● Audio Active</text>
        <rect x="210" y="70" width="170" height="140" rx="8" fill="#0f172a"/>
        <text x="225" y="98" fill="#f0f4f8" font-size="11">🌧️ Rain | 🌲 Nature | 🌊 White</text>
        <text x="225" y="125" fill="#00f0ff" font-size="11">🎹 Lo-Fi | 📁 Custom Upload</text>
        <text x="225" y="155" fill="#94a3b8" font-size="10">🔊 Volume & Play/Pause</text>
        <text x="225" y="185" fill="#ffab00" font-size="10">🔄 Guilt-Free Task Recovery</text>
      </svg>`
    },
    {
      title: "8. Upgraded Well-Being Journal & No-Email/No-Phone Profiles",
      subtitle: "Privacy-respecting profiles with 90-day inactivity lifecycle & full JSON backup",
      points: [
        "Upgraded Journal: Separate School vs. Self-Study logs, custom user metrics, autosave, editable entries, calendar history, filters, and cautious correlation charts.",
        "Zero-PII Profiles: Create profiles with just Name and Class—no email or phone number required.",
        "Transparent Data Lifecycle: Automatic deletion after 90 days of inactivity with an in-app warning banner 7 days in advance, plus 1-click JSON Export/Import."
      ],
      speakerNote: "Open '👤 Scholar' in the top navbar to demonstrate creating a profile, exporting a JSON backup, and testing the 7-day inactivity warning banner.",
      svg: `<svg viewBox="0 0 420 260" style="width:100%;height:auto;">
        <rect x="20" y="20" width="380" height="220" rx="10" fill="#080d1a" stroke="#00f0ff" stroke-width="2"/>
        <text x="40" y="52" fill="#00f0ff" font-size="13" font-weight="bold">🌱 Holistic Journal + Zero-PII Profile System</text>
        <rect x="40" y="70" width="160" height="65" rx="6" fill="#0f172a"/><text x="52" y="98" fill="#fff" font-size="11">Calendar & Trend Charts</text><text x="52" y="118" fill="#00e676" font-size="10">Autosave + Editable Logs</text>
        <rect x="220" y="70" width="160" height="65" rx="6" fill="#0f172a"/><text x="232" y="98" fill="#fff" font-size="11">No-Email Profiles</text><text x="232" y="118" fill="#ffab00" font-size="10">90d Auto-Clean + 7d Alert</text>
        <rect x="40" y="150" width="340" height="65" rx="6" fill="#0f172a" stroke="#7c4dff"/>
        <text x="55" y="178" fill="#c4b5fd" font-size="11" font-weight="bold">⬇️ Full User-Controlled JSON Export & Import</text>
        <text x="55" y="198" fill="#94a3b8" font-size="10">Move your data across devices or delete permanently anytime.</text>
      </svg>`
    }
  ],

  async init() {
    const saved = localStorage.getItem('phiziks_state');
    this.state = saved ? JSON.parse(saved) : this.getDefaultClientState();

    if (!this.state.revisionQueue) this.state.revisionQueue = {};
    if (!this.state.lastVisited) this.state.lastVisited = { chapterId: "ch00_basic_maths", topicId: null, updatedAt: new Date().toISOString() };
    if (!this.state.customMetrics) this.state.customMetrics = ["Concept Clarity (1-10)", "Mock Test Accuracy (%)"];

    try {
      const chRes = await fetch('/api/chapters');
      const chData = await chRes.json();
      if (chData.installed) {
        chData.installed.forEach(c => {
          this.installedChapters[c.id] = c;
          if (c.code) this.installedByCode[String(c.code).padStart(2, '0')] = c;
        });
      }
    } catch (e) {}

    this.applyTheme();
    this.updateProfileBadgeAndWarning();
    this.initWhiteboard();
    this.initParticleField();
    this.initKeyboardAndScrollChoreography();
    this.populateNotesSelector();
    this.renderHome();

    if (window.PHIZIKS_VISUAL) window.PHIZIKS_VISUAL.init();
    if (window.PHIZIKS_SUITES) window.PHIZIKS_SUITES.init();
  },

  getDefaultClientState() {
    return {
      id: "prof_default",
      activeProfileId: "prof_default",
      lastActiveAt: new Date().toISOString(),
      profile: {
        studentName: "Scholar",
        currentClass: "Class 11",
        targetExam: "JEE Main & Advanced",
        jeeMainDate: "2028-01-24",
        jeeAdvDate: "2028-05-28",
        boardExamDate: "2027-03-01",
        dailyGoalHours: 6,
        schoolAlerts: [
          { id: "al-1", title: "Physics Practical Lab Manual Submission", dueDate: "2026-11-05", category: "Practical" },
          { id: "al-2", title: "Rotational Motion Coaching Minor Test", dueDate: "2026-10-28", category: "Test" }
        ]
      },
      theme: { mode: "dark", accent: "#00f0ff", fontFamily: "'Inter', sans-serif", wallpaperType: "grid", wallpaperUrl: "", logoVariant: "slash", monochromeLogo: false },
      progress: {},
      revisionQueue: {},
      lastVisited: { chapterId: "ch00_basic_maths", topicId: null, updatedAt: new Date().toISOString() },
      seenQuestions: [],
      notes: {},
      tasks: [
        { id: "t-1", text: "Complete Basic Mathematics Calculus Derivations", completed: false, priority: "High", chapterId: "ch00_basic_maths", plannedHours: 2.0 },
        { id: "t-2", text: "Solve 25 Kinematics 2D Projectile PYQs", completed: false, priority: "High", chapterId: "ch03_motion_plane", plannedHours: 2.5 }
      ],
      distractionLogs: [
        { date: "Mon", productive: 5.5, distracted: 1.5, school: 6.0 },
        { date: "Tue", productive: 6.0, distracted: 1.0, school: 6.0 },
        { date: "Wed", productive: 4.5, distracted: 2.0, school: 6.0 },
        { date: "Thu", productive: 7.0, distracted: 0.8, school: 6.0 },
        { date: "Fri", productive: 6.5, distracted: 1.2, school: 6.0 },
        { date: "Sat", productive: 8.5, distracted: 1.5, school: 0.0 },
        { date: "Sun", productive: 9.0, distracted: 1.0, school: 0.0 }
      ],
      journalEntries: [],
      customActivities: ["Drawing", "Hip-Hop Dance", "Guitar Practice", "Martial Arts / Sports"],
      customMetrics: ["Concept Clarity (1-10)", "Mock Test Accuracy (%)"],
      testHistory: []
    };
  },

  async saveState() {
    async saveState() {
    this.state.lastActiveAt = new Date().toISOString();
    localStorage.setItem('phiziks_state', JSON.stringify(this.state));
    const map = JSON.parse(localStorage.getItem('phiziks_profiles_map') || '{}');
    const pid = this.state.activeProfileId || this.state.id || 'prof_default';
    map[pid] = this.state;
    localStorage.setItem('phiziks_profiles_map', JSON.stringify(map));
    this.state.profilesSummary = Object.values(map).map(s => ({
      id: s.activeProfileId || s.id || 'prof_default',
      studentName: s.profile?.studentName || 'Scholar',
      currentClass: s.profile?.currentClass || 'Class 11',
      targetExam: s.profile?.targetExam || 'JEE Main & Advanced'
    }));
    this.updateProfileBadgeAndWarning();
  },
    
   
  

  isChapterInstalled(ch) {
    return Boolean(
      this.installedChapters[ch.id] ||
      this.installedByCode[ch.num] ||
      (window.PHIZIKS_BUILTIN_CHAPTERS && window.PHIZIKS_BUILTIN_CHAPTERS[ch.id])
    );
  },

  // =========================================================================
  // AMBIENT CYBERPUNK NEBULA & PHASE-SPACE PARTICLE FIELD CANVAS
  // =========================================================================
  initParticleField() {
    const canvas = document.getElementById('cyber-particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    });

    // Soft glowing nebula bokeh orbs + crisp phase-space vector nodes
    const bokehOrbs = [
      { x: W * 0.2, y: H * 0.25, r: 210, vx: 0.35, vy: 0.22, color: 'rgba(0, 240, 255, 0.08)' },
      { x: W * 0.8, y: H * 0.7, r: 250, vx: -0.3, vy: -0.25, color: 'rgba(124, 77, 255, 0.09)' },
      { x: W * 0.5, y: H * 0.45, r: 190, vx: 0.25, vy: -0.3, color: 'rgba(236, 72, 153, 0.06)' }
    ];

    const count = Math.min(44, Math.floor((W * H) / 32000));
    const nodes = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.52,
      vy: (Math.random() - 0.5) * 0.52,
      r: Math.random() * 2.0 + 1.0,
      cyan: Math.random() > 0.35
    }));

    const mouse = { x: W * 0.5, y: H * 0.5 };
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      // Feed pointer coordinates to the CSS blurry nebula layer
      document.documentElement.style.setProperty('--pointer-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--pointer-y', `${e.clientY}px`);
    }, { passive: true });

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Draw drifting atmospheric light bokeh
      bokehOrbs.forEach(orb => {
        orb.x += orb.vx;
        orb.y += orb.vy;
        if (orb.x < -100 || orb.x > W + 100) orb.vx *= -1;
        if (orb.y < -100 || orb.y > H + 100) orb.vy *= -1;
        const grad = ctx.createRadialGradient(orb.x, orb.y, 10, orb.x, orb.y, orb.r);
        grad.addColorStop(0, orb.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw interactive phase-space nodes & connecting field lines
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0) n.x = W;
        if (n.x > W) n.x = 0;
        if (n.y < 0) n.y = H;
        if (n.y > H) n.y = 0;

        const dxM = n.x - mouse.x;
        const dyM = n.y - mouse.y;
        const distM = Math.hypot(dxM, dyM);
        if (distM < 140 && distM > 1) {
          n.x += (dxM / distM) * 0.9;
          n.y += (dyM / distM) * 0.9;
        }

        ctx.fillStyle = n.cyan ? 'rgba(0, 240, 255, 0.72)' : 'rgba(167, 139, 250, 0.72)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const d = Math.hypot(n.x - m.x, n.y - m.y);
          if (d < 140) {
            ctx.strokeStyle = `rgba(0, 240, 255, ${(1 - d / 140) * 0.16})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }
      }
      this.particleRafId = requestAnimationFrame(draw);
    };
    draw();
  },

  // =========================================================================
  // 3D TILT CARDS, ROLLING NUMBER COUNTERS & SCROLL CHOREOGRAPHY
  // =========================================================================
  bind3DTiltCards() {
    document.querySelectorAll('.cyber-tilt-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        const rx = ((y / r.height) - 0.5) * -8;
        const ry = ((x / r.width) - 0.5) * 8;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
        card.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
        card.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
      });
      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  },

  animateHeroCountdowns() {
    document.querySelectorAll('[data-countup]').forEach(el => {
      const target = parseInt(el.dataset.countup, 10) || 0;
      const duration = 1200;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = `${Math.round(target * eased)}d`;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  },

  initKeyboardAndScrollChoreography() {
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const inp = document.getElementById('global-search-input');
        if (inp) { inp.focus(); inp.select(); }
      } else if (e.key === 'Escape') {
        document.getElementById('search-results-dropdown').style.display = 'none';
        document.getElementById('profile-modal').classList.add('hidden');
        document.getElementById('prereq-map-modal').classList.add('hidden');
        document.getElementById('exhibition-ppt-modal').classList.add('hidden');
        if (document.body.classList.contains('focus-mode')) {
          this.toggleFocusMode();
        }
      }
    });

    document.addEventListener('click', (e) => {
      const wrap = document.querySelector('.global-search-wrap');
      const drop = document.getElementById('search-results-dropdown');
      if (wrap && drop && !wrap.contains(e.target)) {
        drop.style.display = 'none';
      }
    });

    const onScrollFrame = () => {
      const docEl = document.documentElement;
      const scrollTop = window.scrollY || docEl.scrollTop;
      const maxScroll = Math.max(1, docEl.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, scrollTop / maxScroll));
      docEl.style.setProperty('--page-progress', progress.toFixed(4));
      docEl.style.setProperty('--scroll-y', `${scrollTop}px`);

      const nav = document.getElementById('top-navbar');
      if (nav) nav.classList.toggle('nav-scrolled', scrollTop > 24);

      if (this.currentView !== 'home') return;

      // 1. Multi-Speed Parallax Layers
      document.querySelectorAll('[data-parallax]').forEach(el => {
        const speed = parseFloat(el.dataset.parallax || 0.15);
        const rot = parseFloat(el.dataset.parallaxRot || 0);
        const rect = el.parentElement.getBoundingClientRect();
        const offset = (window.innerHeight * 0.5 - rect.top) * speed;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0) rotate(${(offset * rot).toFixed(2)}deg)`;
      });

      // 2. Scene B — Live Scroll-Drawing Calculus & Electrodynamics SVG Lab
      const sceneB = document.getElementById('scene-b');
      if (sceneB) {
        const r = sceneB.getBoundingClientRect();
        const bProg = Math.min(1, Math.max(0, (window.innerHeight * 0.85 - r.top) / (r.height + window.innerHeight * 0.35)));
        const curvePath = document.getElementById('sb-calc-curve');
        if (curvePath) {
          const totalLen = 520;
          curvePath.style.strokeDasharray = totalLen;
          curvePath.style.strokeDashoffset = (totalLen * (1 - bProg)).toFixed(1);
        }
        // Move tangent point along curve y(x) = 165 - 115 sin(x)
        const tanDot = document.getElementById('sb-tangent-dot');
        const tanLine = document.getElementById('sb-tangent-line');
        const readout = document.getElementById('sb-live-readout');
        if (tanDot && tanLine) {
          const tx = 50 + bProg * 380;
          const rad = bProg * Math.PI * 1.35;
          const ty = 155 - Math.sin(rad) * 95;
          const slope = -Math.cos(rad) * 0.65;
          tanDot.setAttribute('cx', tx.toFixed(1));
          tanDot.setAttribute('cy', ty.toFixed(1));
          tanLine.setAttribute('x1', (tx - 55).toFixed(1));
          tanLine.setAttribute('y1', (ty - slope * 55).toFixed(1));
          tanLine.setAttribute('x2', (tx + 55).toFixed(1));
          tanLine.setAttribute('y2', (ty + slope * 55).toFixed(1));
          if (readout) {
            readout.textContent = `x = ${(bProg * 4.0).toFixed(2)} m  |  dy/dx = ${(-slope).toFixed(2)}  |  ∫y dx = ${(bProg * 18.4).toFixed(1)} J`;
          }
        }
        // Scale Riemann integral bars progressively with scroll
        document.querySelectorAll('.sb-riemann-bar').forEach((bar, bi) => {
          const threshold = bi / 10;
          const barScale = Math.min(1, Math.max(0.05, (bProg - threshold * 0.6) * 2.2));
          bar.style.transform = `scaleY(${barScale.toFixed(2)})`;
        });
      }

      // 3. Scene C — Scroll-Synced Sticky Simulation Pinning (3 Stages + Live Scrubbing)
      const pinTrack = document.getElementById('scene-c-pin-track');
      if (pinTrack && window.innerWidth > 1024) {
        const r = pinTrack.getBoundingClientRect();
        const scrollable = Math.max(1, r.height - window.innerHeight);
        const pinProg = Math.min(1, Math.max(0, -r.top / scrollable));

        if (r.top <= 140 && r.bottom >= 160) {
          const stageIdx = pinProg < 0.34 ? 0 : (pinProg < 0.68 ? 1 : 2);
          if (this.pinnedStepIndex !== stageIdx) {
            this.setPinnedStep(stageIdx);
          }
          const scrubBar = document.getElementById('scene-c-scrub-fill');
          if (scrubBar) scrubBar.style.width = `${(pinProg * 100).toFixed(1)}%`;
          const orbDot = document.getElementById('scene-c-scrub-orb');
          if (orbDot) {
            const localP = (pinProg * 3) % 1;
            const sx = 55 + localP * 410;
            const sy = 185 - Math.sin(localP * Math.PI) * 140;
            orbDot.setAttribute('cx', sx.toFixed(1));
            orbDot.setAttribute('cy', sy.toFixed(1));
          }
        }
      }

      // 4. Scene E — Vertical-Scroll-Driven Horizontal Ribbon Translation
      const hPin = document.getElementById('scene-e-horizontal-pin');
      const hRibbon = document.getElementById('scene-e-horizontal-ribbon');
      if (hPin && hRibbon && window.innerWidth > 1024) {
        const r = hPin.getBoundingClientRect();
        const scrollable = Math.max(1, r.height - window.innerHeight);
        const hProg = Math.min(1, Math.max(0, -r.top / scrollable));
        const maxShift = Math.max(0, hRibbon.scrollWidth - hPin.clientWidth + 56);
        hRibbon.style.transform = `translate3d(${(-hProg * maxShift).toFixed(1)}px, 0, 0)`;
        const hBar = document.getElementById('scene-e-progress-fill');
        if (hBar) hBar.style.width = `${(hProg * 100).toFixed(1)}%`;
      }

      // 5. Update Bottom-Left Scene Telemetry HUD
      const sceneLabel = document.getElementById('scroll-scene-label');
      if (sceneLabel) {
        const scenes = [
          { id: 'scene-a', name: 'SCENE 01 / OPENING' },
          { id: 'scene-b', name: 'SCENE 02 / CALCULUS MORPH LAB' },
          { id: 'scene-c-pin-track', name: 'SCENE 03 / LIVE SIMULATIONS' },
          { id: 'scene-d', name: 'SCENE 04 / CHAPTERS & MASTERY' },
          { id: 'scene-e-horizontal-pin', name: 'SCENE 05 / STUDY WORKSPACE' },
          { id: 'scene-f', name: 'SCENE 06 / LAUNCHPAD' }
        ];
        let activeName = scenes[0].name;
        scenes.forEach(s => {
          const el = document.getElementById(s.id);
          if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.55) {
            activeName = s.name;
          }
        });
        sceneLabel.textContent = activeName;
      }
    };

    window.addEventListener('scroll', () => requestAnimationFrame(onScrollFrame), { passive: true });
  },

  setupScrollRevealObserver() {
    if (this.scrollObserver) this.scrollObserver.disconnect();
    this.scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else if (entry.boundingClientRect.top > 0) {
          entry.target.classList.remove('is-visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-reveal]').forEach(el => {
      this.scrollObserver.observe(el);
    });

    // Enhance with GSAP + ScrollTrigger when loaded
    const initGSAP = () => {
      if (!window.gsap || !window.ScrollTrigger) return;
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.getAll().forEach(st => st.kill());

      gsap.fromTo('.scene-a-hero .hero-cta-group > *',
        { y: 24, opacity: 0, scale: 0.92 },
        { y: 0, opacity: 1, scale: 1, duration: 0.65, stagger: 0.09, delay: 0.35, ease: 'back.out(1.5)' }
      );

      gsap.fromTo('#scene-d .cyber-tilt-card',
        { y: 70, opacity: 0, scale: 0.9, rotateX: 14 },
        {
          y: 0, opacity: 1, scale: 1, rotateX: 0,
          duration: 0.8, stagger: 0.14, ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: '#scene-d',
            start: 'top 82%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      ScrollTrigger.refresh();
    };
    setTimeout(initGSAP, 150);
  },

  toggleFocusMode() {
    const isFocus = document.body.classList.toggle('focus-mode');
    const fab = document.getElementById('exit-focus-fab');
    if (fab) fab.classList.toggle('hidden', !isFocus);
  },

  switchView(viewName) {
    this.currentView = viewName;
    document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
    const target = document.getElementById(`view-${viewName}`);
    if (target) target.classList.remove('hidden');

    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewName);
    });

    const hud = document.getElementById('scroll-scene-indicator');
    if (hud) hud.style.display = viewName === 'home' ? 'inline-flex' : 'none';

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (viewName === 'home') this.renderHome();
    if (viewName === 'chapters' && !this.currentChapterId) this.renderChaptersHub();
  },

  // =========================================================================
  // 6-SCENE SCROLL-DRIVEN HOMEPAGE + CONTINUE LEARNING & SPACED REPETITION
  // =========================================================================
  daysUntil(dateStr) {
    const diff = new Date(dateStr) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  },

  getDueRevisions() {
    const q = this.state.revisionQueue || {};
    const now = Date.now();
    return Object.entries(q)
      .map(([id, item]) => ({ id, ...item, isDue: new Date(item.nextReviewAt).getTime() <= now }))
      .sort((a, b) => new Date(a.nextReviewAt) - new Date(b.nextReviewAt));
  },

  setPinnedStep(idx) {
    this.pinnedStepIndex = idx;
    document.querySelectorAll('.scene-c-step-card').forEach((el, i) => {
      el.classList.toggle('active-step', i === idx);
    });
    const stage = document.getElementById('scene-c-visual-box');
    if (!stage) return;

    const stages = [
      {
        badge: "SIMULATION STAGE 01 / 03 • 2D PROJECTILE KINEMATICS",
        title: "Orthogonal Velocity Decomposition & Parabolic Trajectory",
        eq: "x(t) = (u cos θ)t   •   y(t) = (u sin θ)t − ½gt²",
        desc: "As you scroll down, watch the projectile trace its parabola while horizontal velocity u_x remains invariant and vertical velocity v_y reverses sign across the apex.",
        actionLabel: "Launch Projectile Sandbox in Visual Lab →",
        svg: `<svg viewBox="0 0 520 230" style="width:100%;height:auto;">
          <rect width="520" height="230" rx="10" fill="#03050a" stroke="rgba(0,240,255,0.28)"/>
          <line x1="45" y1="185" x2="480" y2="185" stroke="#475569" stroke-width="2"/>
          <path d="M 55 185 Q 260 15 465 185" fill="none" stroke="rgba(0,240,255,0.45)" stroke-width="2.5" stroke-dasharray="6,4"/>
          <path d="M 55 185 Q 260 15 465 185" fill="none" stroke="#00f0ff" stroke-width="3"/>
          <circle id="scene-c-scrub-orb" cx="260" cy="100" r="8" fill="#00e676" stroke="#ffffff" stroke-width="2"/>
          <line x1="260" y1="100" x2="325" y2="100" stroke="#00f0ff" stroke-width="2.5"/>
          <text x="260" y="38" fill="#00f0ff" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle">Apex H_max = u² sin²θ / (2g)  |  v_y = 0, v_x = u cos θ</text>
          <text x="260" y="212" fill="#94a3b8" font-size="11" text-anchor="middle">Scroll vertically to scrub the projectile along its trajectory</text>
        </svg>`
      },
      {
        badge: "SIMULATION STAGE 02 / 03 • SIMPLE HARMONIC PHASE SPACE",
        title: "Coupled Phasor Projection & Conservative Energy Exchange",
        eq: "d²x/dt² + ω²x = 0   •   E = ½kA² = ½mv² + ½kx²",
        desc: "Every simple harmonic oscillation is the exact diameter shadow of uniform circular motion. Potential energy U(x) and kinetic energy K(x) intersect at x = ±A/√2.",
        actionLabel: "Open SHM Phase-Space Lab →",
        svg: `<svg viewBox="0 0 520 230" style="width:100%;height:auto;">
          <rect width="520" height="230" rx="10" fill="#03050a" stroke="rgba(124,77,255,0.38)"/>
          <circle cx="115" cy="115" r="65" fill="rgba(124,77,255,0.08)" stroke="#7c4dff" stroke-width="2"/>
          <line x1="115" y1="115" x2="162" y2="68" stroke="#00f0ff" stroke-width="3"/>
          <circle cx="162" cy="68" r="6" fill="#00e676"/>
          <line x1="162" y1="68" x2="230" y2="68" stroke="#ffab00" stroke-dasharray="4,4"/>
          <path d="M 230 68 Q 275 15 320 115 T 410 115 T 490 68" fill="none" stroke="#00f0ff" stroke-width="3"/>
          <path d="M 230 162 Q 275 215 320 115 T 410 115 T 490 162" fill="none" stroke="#7c4dff" stroke-width="2" stroke-dasharray="5,4"/>
          <circle id="scene-c-scrub-orb" cx="320" cy="115" r="7" fill="#ffab00"/>
          <text x="265" y="34" fill="#c4b5fd" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle">Velocity v(t) Leads Displacement x(t) by Phase π/2 (90°)</text>
          <text x="265" y="212" fill="#94a3b8" font-size="11" text-anchor="middle">Cyan: x(t) = A sin(ωt + φ)   •   Violet: v(t) = Aω cos(ωt + φ)</text>
        </svg>`
      },
      {
        badge: "SIMULATION STAGE 03 / 03 • RAY & WAVE OPTICS CONVERGENCE",
        title: "Refraction Wavefronts, Lens Maker's Law & Interference",
        eq: "1/v − 1/u = (μ − 1)(1/R₁ − 1/R₂)   •   Δx = d sin θ = nλ",
        desc: "Watch parallel incident wavefronts refract through a biconvex glass element to converge at the principal focus F₂ while maintaining constant optical path length.",
        actionLabel: "Launch Optics Bench in Visual Lab →",
        svg: `<svg viewBox="0 0 520 230" style="width:100%;height:auto;">
          <rect width="520" height="230" rx="10" fill="#03050a" stroke="rgba(0,230,118,0.35)"/>
          <line x1="30" y1="115" x2="490" y2="115" stroke="#475569" stroke-width="1.5"/>
          <ellipse cx="240" cy="115" rx="18" ry="82" fill="rgba(0,240,255,0.16)" stroke="#00f0ff" stroke-width="2.5"/>
          <polyline points="50,55 240,55 410,115 475,138" fill="none" stroke="#00e676" stroke-width="2.2"/>
          <polyline points="50,85 240,85 410,115 475,126" fill="none" stroke="#00f0ff" stroke-width="2.2"/>
          <polyline points="50,145 240,145 410,115 475,104" fill="none" stroke="#00f0ff" stroke-width="2.2"/>
          <polyline points="50,175 240,175 410,115 475,92" fill="none" stroke="#00e676" stroke-width="2.2"/>
          <circle id="scene-c-scrub-orb" cx="410" cy="115" r="8" fill="#ffab00"/>
          <text x="410" y="96" fill="#ffab00" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">Focus F₂</text>
          <text x="260" y="212" fill="#94a3b8" font-size="11" text-anchor="middle">All paraxial rays experience equal optical path length to principal focus F₂</text>
        </svg>`
      }
    ];

    const cur = stages[idx] || stages[0];
    stage.innerHTML = `
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
          <span class="badge" style="color:var(--accent);border-color:var(--border-cyan);">${cur.badge}</span>
          <span style="font-family:var(--font-mono);font-size:0.75rem;color:#c4b5fd;">${cur.eq}</span>
        </div>
        <h3 style="font-size:1.3rem;margin-bottom:6px;">${cur.title}</h3>
        <p style="font-size:0.86rem;color:var(--text-secondary);margin-bottom:14px;">${cur.desc}</p>
      </div>
      ${cur.svg}
      <div style="margin-top:14px;">
        <div style="height:4px;background:rgba(148,163,184,0.16);border-radius:99px;overflow:hidden;margin-bottom:12px;">
          <div id="scene-c-scrub-fill" style="height:100%;width:${((idx + 1) * 33.3)}%;background:linear-gradient(90deg,var(--accent),var(--accent-violet));transition:width 0.1s linear;"></div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
          <div style="display:flex;gap:6px;">
            ${[0, 1, 2].map(i => `<button class="tool-btn ${i===idx?'btn-primary':''}" onclick="PHIZIKS.setPinnedStep(${i})">0${i+1}</button>`).join('')}
          </div>
          <button class="nav-btn btn-primary" onclick="PHIZIKS.switchView('visual')">${cur.actionLabel}</button>
        </div>
      </div>
    `;
  },

  renderHome() {
    const p = this.state.profile;
    const completedCount = Object.values(this.state.progress).filter(x => x.completed).length;
    const bookmarkedTopics = Object.entries(this.state.progress).filter(([_, v]) => v.bookmarked);
    const lastChId = (this.state.lastVisited && this.state.lastVisited.chapterId) || "ch00_basic_maths";
    const lastChMeta = this.syllabus.find(c => c.id === lastChId) || this.syllabus[0];
    const pendingTasks = (this.state.tasks || []).filter(t => !t.completed);
    const dueRevisions = this.getDueRevisions();

    const mainDays = this.daysUntil(p.jeeMainDate);
    const advDays = this.daysUntil(p.jeeAdvDate);
    const boardDays = this.daysUntil(p.boardExamDate);

    const container = document.getElementById('home-content');
    container.innerHTML = `
      <div class="cinematic-home">

        <!-- =================================================================
             SCENE A — CINEMATIC OPENING HERO (STAGGERED WORD MASKS + HOLO)
             ================================================================= -->
        <section id="scene-a" class="scene-a-hero border-beam-box">
          <div>
            <div class="scene-header-tag">
              <span class="scene-dot"></span>
              <span>dx/dy • futuristic physics & jee laboratory • ${p.currentClass}</span>
            </div>

            <h1 class="hero-display-title" aria-label="Where calculus meets dx/dy physical intuition">
              <span class="word-mask"><span class="word-inner" style="--word-idx:0;">Where</span></span>
              <span class="word-mask"><span class="word-inner" style="--word-idx:1;">calculus</span></span>
              <span class="word-mask"><span class="word-inner" style="--word-idx:2;">meets</span></span>
              <span class="word-mask"><span class="word-inner gradient-cyber-text" style="--word-idx:3;">dx/dy</span></span>
              <span class="word-mask"><span class="word-inner" style="--word-idx:4;">physical</span></span>
              <span class="word-mask"><span class="word-inner" style="--word-idx:5;">intuition.</span></span>
            </h1>

            <p class="hero-lead">
              Experience Class 11, Class 12, and JEE Advanced Physics inside a scroll-driven scientific laboratory. Move seamlessly from zero-prerequisite calculus foundations to live vector simulations, non-repeating adaptive tests, and a calm student workspace.
            </p>

            <div class="hero-cta-group" style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:26px;">
              <button class="nav-btn btn-primary" style="padding:11px 20px;font-size:0.92rem;" onclick="PHIZIKS.openChapter('${lastChMeta.id}')">
                ▶ Resume Ch ${lastChMeta.num}: ${lastChMeta.title}
              </button>
              <button class="nav-btn" style="padding:11px 16px;" onclick="PHIZIKS.switchView('chapters')">📚 Explore 29 Chapters</button>
              <button class="nav-btn" style="padding:11px 16px;" onclick="PHIZIKS.switchView('visual')">🔬 Launch Visual Lab</button>
              <button class="tool-btn" style="padding:11px 14px;" onclick="PHIZIKS.openPrereqMapModal()">🕸️ Dependency Map</button>
            </div>

            <!-- Live Animated Exam Countdowns Strip -->
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:10px;">
              <div class="cyber-tilt-card" style="padding:12px 14px;">
                <div style="font-size:0.68rem;color:var(--text-secondary);font-family:var(--font-mono);">JEE MAIN TARGET</div>
                <div style="font-size:1.45rem;font-weight:900;color:var(--accent);">
                  <span data-countup="${mainDays}">${mainDays}d</span>
                  <span style="font-size:0.72rem;color:var(--text-secondary);font-weight:400;">(${p.jeeMainDate})</span>
                </div>
              </div>
              <div class="cyber-tilt-card" style="padding:12px 14px;">
                <div style="font-size:0.68rem;color:var(--text-secondary);font-family:var(--font-mono);">JEE ADVANCED</div>
                <div style="font-size:1.45rem;font-weight:900;color:#c4b5fd;">
                  <span data-countup="${advDays}">${advDays}d</span>
                  <span style="font-size:0.72rem;color:var(--text-secondary);font-weight:400;">(${p.jeeAdvDate})</span>
                </div>
              </div>
              <div class="cyber-tilt-card" style="padding:12px 14px;">
                <div style="font-size:0.68rem;color:var(--text-secondary);font-family:var(--font-mono);">BOARD / SCHOOL</div>
                <div style="font-size:1.45rem;font-weight:900;color:var(--success);">
                  <span data-countup="${boardDays}">${boardDays}d</span>
                  <span style="font-size:0.72rem;color:var(--text-secondary);font-weight:400;">(${p.boardExamDate})</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Animated Scientific Hologram Stage -->
          <div class="hero-holo-stage" data-parallax="-0.08">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
              <span class="badge" style="color:var(--accent);border-color:var(--border-cyan);">LIVE PHASE-SPACE & WAVE HARMONICS</span>
              <span style="font-family:var(--font-mono);font-size:0.74rem;color:#c4b5fd;">∮ E·dℓ = −dΦ_B/dt</span>
            </div>
            <svg viewBox="0 0 420 220" style="width:100%;height:auto;background:#03050a;border-radius:10px;border:1px solid var(--border-color);">
              <defs>
                <linearGradient id="hero-wave-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#00f0ff" />
                  <stop offset="50%" stop-color="#7c4dff" />
                  <stop offset="100%" stop-color="#00e676" />
                </linearGradient>
              </defs>
              <line x1="20" y1="110" x2="400" y2="110" stroke="rgba(148,163,184,0.18)" stroke-width="1.5"/>
              <line x1="95" y1="20" x2="95" y2="200" stroke="rgba(148,163,184,0.18)" stroke-width="1.5"/>
              <circle cx="95" cy="110" r="64" fill="none" stroke="rgba(0,240,255,0.32)" stroke-width="1.8" stroke-dasharray="4,4">
                <animateTransform attributeName="transform" type="rotate" from="0 95 110" to="360 95 110" dur="14s" repeatCount="indefinite"/>
              </circle>
              <g>
                <animateTransform attributeName="transform" type="rotate" from="0 95 110" to="-360 95 110" dur="6s" repeatCount="indefinite"/>
                <line x1="95" y1="110" x2="159" y2="110" stroke="#00f0ff" stroke-width="2.8"/>
                <circle cx="159" cy="110" r="5.5" fill="#00e676"/>
              </g>
              <path d="M 185 110 Q 220 25 255 110 T 325 110 T 395 110" fill="none" stroke="url(#hero-wave-grad)" stroke-width="3.2">
                <animate attributeName="d" values="M 185 110 Q 220 25 255 110 T 325 110 T 395 110; M 185 110 Q 220 195 255 110 T 325 110 T 395 110; M 185 110 Q 220 25 255 110 T 325 110 T 395 110" dur="3.6s" repeatCount="indefinite"/>
              </path>
              <text x="95" y="196" fill="#94a3b8" font-family="monospace" font-size="10" text-anchor="middle">Phasor Space (A, ω)</text>
              <text x="295" y="196" fill="#00f0ff" font-family="monospace" font-size="10" text-anchor="middle">Standing Wave Superposition</text>
            </svg>

            <div style="margin-top:14px;padding:12px 14px;background:rgba(6,10,22,0.68);border-radius:10px;border:1px solid var(--border-glass);">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <strong style="font-size:0.84rem;color:var(--accent);">⚡ Active Scholar Telemetry (${p.studentName})</strong>
                <button class="tool-btn" style="padding:2px 8px;font-size:0.72rem;" onclick="PHIZIKS.openProfileModal()">Switch / Backup</button>
              </div>
              <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;font-size:0.78rem;">
                <div><span style="color:var(--text-secondary);">Mastered:</span> <strong>${completedCount}</strong></div>
                <div><span style="color:var(--text-secondary);">Solved:</span> <strong>${this.state.seenQuestions.length} Qs</strong></div>
                <div><span style="color:var(--text-secondary);">Saved:</span> <strong>${bookmarkedTopics.length}</strong></div>
              </div>
            </div>
          </div>
        </section>

        <!-- Glowing Connected Conduit -->
        <div class="scene-conduit" aria-hidden="true"><div class="scene-conduit-line"></div></div>

        <!-- PERSONALIZED CONTINUE LEARNING & SPACED REPETITION HUB -->
        <section data-reveal>
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:16px;">
            <div>
              <span class="scene-header-tag" style="margin-bottom:6px;">ACTIVE COMMAND CENTER</span>
              <h2 style="font-size:1.55rem;font-weight:900;">Continue Learning, Revision Queue & School Alerts</h2>
            </div>
            <div style="display:flex;gap:8px;">
              <button class="tool-btn" onclick="PHIZIKS.openPrereqMapModal()">🕸️ Prerequisite Dependency Map</button>
              <button class="tool-btn" onclick="PHIZIKS.switchView('journal')">+ Manage Alerts & Dates</button>
            </div>
          </div>

          <div class="continue-learning-strip">
            <div class="cyber-tilt-card" data-reveal="left" style="--stagger:0;border-left:4px solid var(--accent);">
              <div style="font-size:0.73rem;color:var(--accent);font-family:var(--font-mono);margin-bottom:4px;">RESUME LAST CHAPTER</div>
              <h3 style="font-size:1.08rem;margin-bottom:6px;">Ch ${lastChMeta.num}: ${lastChMeta.title}</h3>
              <p style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:12px;">${lastChMeta.summary}</p>
              <button class="nav-btn btn-primary" style="width:100%;justify-content:center;" onclick="PHIZIKS.openChapter('${lastChMeta.id}')">
                📖 Open Chapter ${lastChMeta.num} →
              </button>
            </div>

            <div class="cyber-tilt-card" data-reveal="scale" style="--stagger:1;border-left:4px solid var(--accent-violet);">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <span style="font-size:0.73rem;color:#c4b5fd;font-family:var(--font-mono);">SPACED-REPETITION QUEUE</span>
                <span class="badge">${dueRevisions.length} tracked</span>
              </div>
              ${dueRevisions.length === 0 ? `
                <p style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:12px;">Rate any chapter (1–5 ★) while studying to automatically schedule spaced-repetition reviews (+1d, +3d, +7d, +21d).</p>
                <button class="nav-btn" style="width:100%;justify-content:center;" onclick="PHIZIKS.openChapter('ch03_motion_plane')">Rate Topics in Ch 03 →</button>
              ` : `
                <div style="display:grid;gap:6px;margin-bottom:10px;max-height:110px;overflow-y:auto;">
                  ${dueRevisions.slice(0, 3).map(r => `
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 8px;background:var(--bg-primary);border-radius:6px;font-size:0.8rem;cursor:pointer;" onclick="PHIZIKS.openChapter('${r.chapterId || r.id}')">
                      <span><strong>${r.title || r.id}</strong> (${r.stars || 3}★)</span>
                      <span class="badge" style="color:${r.isDue ? 'var(--warning)' : 'var(--success)'};">${r.isDue ? 'Due Now' : 'Scheduled'}</span>
                    </div>
                  `).join('')}
                </div>
              `}
            </div>

            <div class="cyber-tilt-card" data-reveal="scale" style="--stagger:2;border-left:4px solid var(--success);">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <span style="font-size:0.73rem;color:var(--success);font-family:var(--font-mono);">STUDY PLANNER TARGETS</span>
                <span class="badge">${pendingTasks.length} pending</span>
              </div>
              <div style="display:grid;gap:6px;margin-bottom:10px;">
                ${pendingTasks.slice(0, 2).map(t => `
                  <div style="padding:6px 8px;background:var(--bg-primary);border-radius:6px;font-size:0.8rem;">• ${t.text}</div>
                `).join('') || `<div style="font-size:0.82rem;color:var(--text-secondary);">All tasks completed!</div>`}
              </div>
              <button class="nav-btn" style="width:100%;justify-content:center;" onclick="PHIZIKS.switchView('regain')">⏱️ Planner & Audio Timer →</button>
            </div>

            <div class="cyber-tilt-card" data-reveal="right" style="--stagger:3;border-left:4px solid var(--warning);">
              <div style="font-size:0.73rem;color:var(--warning);font-family:var(--font-mono);margin-bottom:6px;">SCHOOL & PRACTICAL ALERTS</div>
              <div style="display:grid;gap:6px;margin-bottom:10px;">
                ${(p.schoolAlerts || []).slice(0, 2).map(al => `
                  <div style="display:flex;justify-content:space-between;padding:6px 8px;background:var(--bg-primary);border-radius:6px;font-size:0.8rem;">
                    <span>${al.title}</span>
                    <strong style="color:var(--warning);font-family:var(--font-mono);">${this.daysUntil(al.dueDate)}d</strong>
                  </div>
                `).join('') || `<div style="font-size:0.82rem;color:var(--text-secondary);">No upcoming alerts.</div>`}
              </div>
              <button class="nav-btn" style="width:100%;justify-content:center;" onclick="PHIZIKS.switchView('journal')">🌱 Life & Well-Being Journal →</button>
            </div>
          </div>
        </section>

        <!-- Glowing Connected Conduit -->
        <div class="scene-conduit" aria-hidden="true"><div class="scene-conduit-line"></div></div>

        <!-- =================================================================
             SCENE B — SCROLL-DRAWING CALCULUS & VECTOR MORPH LABORATORY
             ================================================================= -->
        <section id="scene-b" class="scene-b-parallax-stage border-beam-box" data-reveal>
          <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:16px;">
            <div style="max-width:640px;">
              <span class="scene-header-tag">SCENE 02 • SCROLL-REACTIVE CALCULUS LABORATORY</span>
              <h2 style="font-size:2rem;font-weight:900;line-height:1.15;">Watch Derivatives & Integrals Draw Live As You Scroll</h2>
              <p style="color:var(--text-secondary);margin-top:8px;">
                Scroll up and down through this laboratory: the displacement curve $y(x)$ draws itself, the instantaneous tangent slope $dy/dx$ glides across the manifold, and the Riemann integral area $\int y\,dx$ accumulates in real time.
              </p>
            </div>
            <div style="display:flex;gap:10px;flex-wrap:wrap;">
              <div class="parallax-math-pill" data-parallax="-0.16" data-parallax-rot="0.05">⚡ F_net = dp / dt</div>
              <div class="parallax-math-pill" data-parallax="0.18" data-parallax-rot="-0.05" style="color:#c4b5fd;border-color:rgba(124,77,255,0.45);">🧲 ∮ B·dℓ = μ₀(I_c + I_d)</div>
              <div class="parallax-math-pill" data-parallax="-0.12" style="color:var(--success);border-color:rgba(0,230,118,0.4);">🌊 ∂²y/∂t² = v² ∂²y/∂x²</div>
            </div>
          </div>

          <!-- Interactive Scroll-Scrubbed SVG Calculus & Vector Morph Stage -->
          <div class="scroll-draw-lab-grid">
            <div class="scroll-draw-svg-stage">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:6px;">
                <span class="badge" style="color:var(--accent);">SCROLL-SCRUBBED MANIFOLD</span>
                <span id="sb-live-readout" style="font-family:var(--font-mono);font-size:0.76rem;color:var(--success);">x = 2.00 m  |  dy/dx = +0.42  |  ∫y dx = 9.2 J</span>
              </div>
              <svg id="scene-b-draw-svg" viewBox="0 0 480 210" style="width:100%;height:auto;">
                <line x1="40" y1="165" x2="450" y2="165" stroke="#475569" stroke-width="2"/>
                <line x1="50" y1="20" x2="50" y2="185" stroke="#475569" stroke-width="2"/>
                <!-- Scroll-Rising Riemann Integral Bars -->
                <g fill="rgba(0, 230, 118, 0.18)" stroke="rgba(0, 230, 118, 0.45)" stroke-width="1">
                  ${Array.from({ length: 10 }, (_, i) => {
                    const bx = 55 + i * 36;
                    const bh = Math.round(35 + Math.sin((i / 9) * Math.PI) * 85);
                    return `<rect class="sb-riemann-bar" x="${bx}" y="${165 - bh}" width="28" height="${bh}" style="transform-origin: ${bx}px 165px;" />`;
                  }).join('')}
                </g>
                <!-- Self-Drawing Curve y(x) -->
                <path id="sb-calc-curve" d="M 50 155 Q 150 20 260 110 T 435 65" fill="none" stroke="#00f0ff" stroke-width="3.5" stroke-linecap="round"/>
                <!-- Sliding Secant/Tangent Line -->
                <line id="sb-tangent-line" x1="140" y1="95" x2="250" y2="55" stroke="#ec4899" stroke-width="2.5" stroke-dasharray="5,3"/>
                <circle id="sb-tangent-dot" cx="195" cy="75" r="7" fill="#00e676" stroke="#ffffff" stroke-width="2"/>
                <text x="250" y="196" fill="#9cb0c9" font-family="monospace" font-size="10" text-anchor="middle">Cyan: Trajectory y(x)  •  Pink: Instantaneous Slope dy/dx  •  Green Bars: Area ∫y dx</text>
              </svg>
            </div>

            <div style="display:grid;gap:14px;">
              <div class="cyber-tilt-card" data-reveal="right" style="--stagger:0;">
                <span class="badge" style="color:var(--accent);margin-bottom:6px;">01 • DERIVATIVES AS SLOPES</span>
                <h3 style="font-size:1.1rem;margin-bottom:4px;">Instantaneous Rates ($v = dx/dt$, $E = -dV/dr$)</h3>
                <p style="font-size:0.84rem;color:var(--text-secondary);margin-bottom:10px;">Every rate of change in Mechanics and Electrodynamics is the tangent slope to a state curve.</p>
                <button class="tool-btn btn-primary" onclick="PHIZIKS.openChapter('ch00_basic_maths')">Open Ch 00: Calculus →</button>
              </div>

              <div class="cyber-tilt-card" data-reveal="right" style="--stagger:1;">
                <span class="badge" style="color:#c4b5fd;margin-bottom:6px;">02 • INTEGRALS AS CONTINUOUS SUMS</span>
                <h3 style="font-size:1.1rem;margin-bottom:4px;">Area Accumulation ($W = \int F\,dx$, $I = \int r^2 dm$)</h3>
                <p style="font-size:0.84rem;color:var(--text-secondary);margin-bottom:10px;">Slice continuous rods, rings, disks, and spheres into differential elements $dm$ or $dq$ and sum across space.</p>
                <button class="tool-btn" onclick="PHIZIKS.openChapter('ch06_rotational_motion')">Explore Rotational Proofs →</button>
              </div>
            </div>
          </div>
        </section>

        <!-- Glowing Connected Conduit -->
        <div class="scene-conduit" aria-hidden="true"><div class="scene-conduit-line"></div></div>

        <!-- =================================================================
             SCENE C — SCROLL-PINNED INTERACTIVE SIMULATIONS (285vh Track)
             ================================================================= -->
        <section id="scene-c-pin-track" class="scene-c-pin-track">
          <div class="scene-c-sticky-viewport">
            <div>
              <span class="scene-header-tag">SCENE 03 • PINNED SIMULATION THEATER</span>
              <h2 style="font-size:1.8rem;font-weight:900;margin-bottom:8px;">Scroll to Advance Through 3 Live Physics Stages</h2>
              <p style="color:var(--text-secondary);font-size:0.88rem;margin-bottom:16px;">
                This viewport locks in place as you scroll—advancing automatically through Kinematics, Simple Harmonic Phase Space, and Ray/Wave Optics.
              </p>

              <div class="scene-c-step-list">
                <div class="scene-c-step-card active-step" onclick="PHIZIKS.setPinnedStep(0)">
                  <span class="badge" style="color:var(--accent);margin-bottom:4px;">STAGE 01 • MECHANICS</span>
                  <h3 style="font-size:1.05rem;">2D Projectile Vector Decomposition</h3>
                  <p style="font-size:0.82rem;color:var(--text-secondary);">Observe independent horizontal transport and vertical gravitational acceleration along a live trajectory.</p>
                </div>

                <div class="scene-c-step-card" onclick="PHIZIKS.setPinnedStep(1)">
                  <span class="badge" style="color:#c4b5fd;margin-bottom:4px;">STAGE 02 • OSCILLATIONS</span>
                  <h3 style="font-size:1.05rem;">SHM Phasor Circle & Phase Lead</h3>
                  <p style="font-size:0.82rem;color:var(--text-secondary);">Visualize how rotating phasors generate sinusoidal displacement $x(t)$ and phase-shifted velocity $v(t)$.</p>
                </div>

                <div class="scene-c-step-card" onclick="PHIZIKS.setPinnedStep(2)">
                  <span class="badge" style="color:var(--success);margin-bottom:4px;">STAGE 03 • OPTICS</span>
                  <h3 style="font-size:1.05rem;">Wavefront Refraction & Focal Convergence</h3>
                  <p style="font-size:0.82rem;color:var(--text-secondary);">Track paraxial rays refracting through a convex lens to converge at the principal focus $F_2$.</p>
                </div>
              </div>
            </div>

            <div id="scene-c-visual-box" class="scene-c-visual-box"></div>
          </div>
        </section>

        <!-- Glowing Connected Conduit -->
        <div class="scene-conduit" aria-hidden="true"><div class="scene-conduit-line"></div></div>

        <!-- =================================================================
             SCENE D — LEARNING, SOLVED EXAMPLES & ADAPTIVE PRACTICE
             ================================================================= -->
        <section id="scene-d" data-reveal>
          <div style="margin-bottom:20px;">
            <span class="scene-header-tag">SCENE 04 • DEEP LEARNING & ADAPTIVE PRACTICE</span>
            <h2 style="font-size:1.95rem;font-weight:900;">29 Complete Textbooks + 3-Stage Numerical Solver</h2>
            <p style="color:var(--text-secondary);max-width:680px;margin-top:6px;">
              Hover over any module card below to experience real-time 3D perspective tilt and radial neon spotlighting—then dive directly into chapters or adaptive tests.
            </p>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:18px;">
            <div class="cyber-tilt-card" data-reveal="left" style="--stagger:0;">
              <div>
                <span class="badge" style="color:var(--accent);margin-bottom:8px;">CHAPTERS 00–14 • CLASS 11</span>
                <h3 style="font-size:1.2rem;margin-bottom:8px;">Mechanics, Heat, Thermodynamics, KTG, SHM & Waves</h3>
                <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:14px;">Complete derivations from Basic Mathematics and Kinematics to Rotational Dynamics, Carnot Cycles, and Doppler Shifts.</p>
              </div>
              <button class="nav-btn btn-primary" style="width:100%;justify-content:center;" onclick="PHIZIKS.renderChaptersHub('Class 11');PHIZIKS.switchView('chapters');">Explore Class 11 Chapters →</button>
            </div>

            <div class="cyber-tilt-card" data-reveal="scale" style="--stagger:1;">
              <div>
                <span class="badge" style="color:#c4b5fd;margin-bottom:8px;">CHAPTERS 15–28 • CLASS 12 & LAB</span>
                <h3 style="font-size:1.2rem;margin-bottom:8px;">Electrodynamics, Optics, Modern Physics & Lab Skills</h3>
                <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:14px;">Gauss's Law, RC/RL/LCR Circuits, Ray & Wave Optics, Bohr Atom, X-Rays, Nuclei, Zener Diodes, and Vernier/Screw Gauge Lab Instruments.</p>
              </div>
              <button class="nav-btn" style="width:100%;justify-content:center;border-color:var(--accent-violet);color:#c4b5fd;" onclick="PHIZIKS.renderChaptersHub('Class 12');PHIZIKS.switchView('chapters');">Explore Class 12 Chapters →</button>
            </div>

            <div class="cyber-tilt-card" data-reveal="right" style="--stagger:2;">
              <div>
                <span class="badge" style="color:var(--success);margin-bottom:8px;">ZERO DUPLICATES • +4 / −1 SCORING</span>
                <h3 style="font-size:1.2rem;margin-bottom:8px;">Adaptive Non-Repeating DPP & Test Generator</h3>
                <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:14px;">Tracks every attempted question ID in your profile, reveals 3-stage worked LaTeX solutions, and schedules missed concepts for review.</p>
              </div>
              <button class="nav-btn" style="width:100%;justify-content:center;border-color:var(--success);color:var(--success);" onclick="PHIZIKS.switchView('dpp')">Launch Adaptive Tests →</button>
            </div>
          </div>
        </section>

        <!-- Glowing Connected Conduit -->
        <div class="scene-conduit" aria-hidden="true"><div class="scene-conduit-line"></div></div>

        <!-- =================================================================
             SCENE E — VERTICAL-SCROLL-DRIVEN HORIZONTAL WORKSPACE SHOWCASE
             ================================================================= -->
        <section id="scene-e-horizontal-pin" class="scene-e-horizontal-pin">
          <div class="scene-e-sticky-frame">
            <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:12px;margin-bottom:18px;">
              <div>
                <span class="scene-header-tag">SCENE 05 • HORIZONTAL WORKSPACE GLIDE</span>
                <h2 style="font-size:1.85rem;font-weight:900;">Scroll Down to Glide Across Your Study Tools</h2>
              </div>
              <div style="width:200px;">
                <div style="font-size:0.72rem;font-family:var(--font-mono);color:var(--text-secondary);margin-bottom:4px;">HORIZONTAL TRACK PROGRESS</div>
                <div style="height:4px;background:rgba(148,163,184,0.18);border-radius:99px;overflow:hidden;">
                  <div id="scene-e-progress-fill" style="height:100%;width:0%;background:var(--accent);"></div>
                </div>
              </div>
            </div>

            <div id="scene-e-horizontal-ribbon" class="scene-e-horizontal-ribbon">
              <div class="h-cyber-panel">
                <div>
                  <span class="badge" style="color:var(--accent);margin-bottom:10px;">01 / DUAL VISUAL PHYSICS LAB</span>
                  <h3 style="font-size:1.25rem;margin-bottom:8px;">Parametric Sliders + Motion Theater</h3>
                  <p style="font-size:0.86rem;color:var(--text-secondary);">Adjust initial speed, angle, damping, focal length, or planet radius with live coordinate tables—or switch to the Motion Theater with frame-by-frame +Δt stepping.</p>
                </div>
                <button class="nav-btn btn-primary" onclick="PHIZIKS.switchView('visual')">🔬 Open Visual Physics Lab →</button>
              </div>

              <div class="h-cyber-panel" style="border-top-color:var(--accent-violet);">
                <div>
                  <span class="badge" style="color:#c4b5fd;margin-bottom:10px;">02 / PLANNER & PERSISTENT AUDIO</span>
                  <h3 style="font-size:1.25rem;margin-bottom:8px;">Algorithmic Time-Blocker & Soundscapes</h3>
                  <p style="font-size:0.86rem;color:var(--text-secondary);">Generate realistic study blocks with mandatory rest intervals. Listen to offline Steady Rain, Forest Wind, Warm Lo-Fi Pad, White Noise, or your own uploaded audio files.</p>
                </div>
                <button class="nav-btn" onclick="PHIZIKS.switchView('regain')">⏱️ Open Planner & Audio Timer →</button>
              </div>

              <div class="h-cyber-panel" style="border-top-color:var(--success);">
                <div>
                  <span class="badge" style="color:var(--success);margin-bottom:10px;">03 / STUDENT LIFE & WELL-BEING JOURNAL</span>
                  <h3 style="font-size:1.25rem;margin-bottom:8px;">Dual Study Logs, Calendar & Trend Charts</h3>
                  <p style="font-size:0.86rem;color:var(--text-secondary);">Log School vs. Self-Study hours, question counts, sleep, energy, hydration, and creative hobbies with autosave, calendar filtering, and cautious correlation charts.</p>
                </div>
                <button class="nav-btn" onclick="PHIZIKS.switchView('journal')">🌱 Open Student Journal →</button>
              </div>

              <div class="h-cyber-panel" style="border-top-color:var(--warning);">
                <div>
                  <span class="badge" style="color:var(--warning);margin-bottom:10px;">04 / SIDE-BY-SIDE UTILITIES & PROFILES</span>
                  <h3 style="font-size:1.25rem;margin-bottom:8px;">Whiteboard, Calculator & Zero-PII Profiles</h3>
                  <p style="font-size:0.86rem;color:var(--text-secondary);">Solve rough work right beside any derivation, use 1-tap physical constants on the calculator, and export/import your profile JSON anytime with zero email required.</p>
                </div>
                <div style="display:flex;gap:8px;">
                  <button class="tool-btn btn-primary" onclick="PHIZIKS.toggleWhiteboard()">✏️ Whiteboard</button>
                  <button class="tool-btn" onclick="PHIZIKS.openProfileModal()">👤 Profiles & Backup</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Glowing Connected Conduit -->
        <div class="scene-conduit" aria-hidden="true"><div class="scene-conduit-line"></div></div>

        <!-- =================================================================
             SCENE F — FINAL CALL TO ACTION LAUNCHPAD
             ================================================================= -->
        <section id="scene-f" class="cyber-glass-panel border-beam-box" style="text-align:center;padding:52px 28px;border:1px solid var(--border-cyan);" data-reveal="scale">
          <span class="scene-header-tag">SCENE 06 • LAUNCHPAD</span>
          <h2 style="font-size:clamp(1.9rem,3.2vw,2.7rem);font-weight:900;margin-bottom:10px;">
            Step Inside the <span style="font-family:var(--font-mono);color:var(--accent);">dx/dy</span> Laboratory
          </h2>
          <p style="color:var(--text-secondary);max-width:620px;margin:0 auto 24px auto;font-size:0.96rem;">
            All 29 chapters (<code>00</code> through <code>28</code>), interactive simulations, non-repeating adaptive tests, and productivity tools are live and ready.
          </p>
          <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;">
            <button class="nav-btn btn-primary" style="padding:12px 22px;font-size:0.95rem;" onclick="PHIZIKS.openChapter('ch00_basic_maths')">🚀 Start Ch 00: Basic Mathematics</button>
            <button class="nav-btn" style="padding:12px 20px;" onclick="PHIZIKS.switchView('chapters')">📚 Browse All 29 Chapters</button>
            <button class="nav-btn btn-exhibition" style="padding:12px 20px;" onclick="PHIZIKS.openExhibitionPPT()">🖥️ Interactive Platform Walkthrough</button>
          </div>
        </section>

      </div>
    `;

    this.setPinnedStep(0);
    this.setupScrollRevealObserver();
    this.bind3DTiltCards();
    this.animateHeroCountdowns();
  },

  // =========================================================================
  // UNIVERSAL SEARCH & COMMAND NAVIGATION
  // =========================================================================
  handleSearch(query) {
    const box = document.getElementById('search-results-dropdown');
    const q = query.trim().toLowerCase();
    if (!q) {
      box.style.display = 'none';
      return;
    }

    const commands = [
      { label: "🧘 Command: Toggle Distraction-Free Focus Mode", action: "PHIZIKS.toggleFocusMode()" },
      { label: "✏️ Command: Open Side-by-Side Whiteboard", action: "PHIZIKS.toggleWhiteboard()" },
      { label: "🧮 Command: Open Scientific Calculator", action: "PHIZIKS.togglePanel('calc-panel')" },
      { label: "🕸️ Command: View Prerequisite Dependency Map", action: "PHIZIKS.openPrereqMapModal()" },
      { label: "👤 Command: Open Profile & JSON Backup Manager", action: "PHIZIKS.openProfileModal()" },
      { label: "🔬 Command: Launch Visual Physics Lab", action: "PHIZIKS.switchView('visual')" }
    ].filter(c => c.label.toLowerCase().includes(q));

    const matches = this.syllabus.filter(ch =>
      ch.title.toLowerCase().includes(q) ||
      ch.summary.toLowerCase().includes(q) ||
      ch.unit.toLowerCase().includes(q) ||
      ch.num.includes(q)
    );

    let html = '';
    commands.forEach(cmd => {
      html += `
        <div class="search-result-item" onclick="${cmd.action}; document.getElementById('search-results-dropdown').style.display='none';">
          <strong style="color:#c4b5fd;">${cmd.label}</strong>
          <span class="badge">Command</span>
        </div>`;
    });

    matches.forEach(ch => {
      html += `
        <div class="search-result-item" onclick="PHIZIKS.openChapter('${ch.id}'); document.getElementById('search-results-dropdown').style.display='none';">
          <div>
            <strong style="color:var(--accent);">Ch ${ch.num}: ${ch.title}</strong>
            <div style="font-size:0.76rem;color:var(--text-secondary);">${ch.summary}</div>
          </div>
          <span class="badge">${ch.classLevel}</span>
        </div>`;
    });

    if (!html) {
      html = `<div class="search-result-item">No matching chapters, formulas, or commands found.</div>`;
    }
    box.innerHTML = html;
    box.style.display = 'block';
  },

  // =========================================================================
  // PREREQUISITE DEPENDENCY MAP MODAL
  // =========================================================================
  openPrereqMapModal() {
    const modal = document.getElementById('prereq-map-modal');
    const body = document.getElementById('prereq-map-body');
    if (!modal || !body) return;

    const units = [...new Set(this.syllabus.map(c => c.unit))];
    body.innerHTML = `
      <p style="font-size:0.88rem;color:var(--text-secondary);margin-bottom:16px;">
        Every chapter in <strong>dx/dy</strong> builds on <strong>Chapter 00: Basic Mathematics</strong>. Click any chapter node below to jump directly to it, or click its prerequisite pills to strengthen foundational concepts first.
      </p>
      <div style="display:grid;gap:14px;">
        ${units.map(unitName => {
          const chs = this.syllabus.filter(c => c.unit === unitName);
          return `
            <div style="padding:14px;background:var(--bg-primary);border:1px solid var(--border-color);border-radius:8px;">
              <div style="font-size:0.8rem;font-weight:800;color:var(--accent);text-transform:uppercase;margin-bottom:10px;">Unit: ${unitName}</div>
              <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px;">
                ${chs.map(c => `
                  <div style="padding:10px 12px;background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:6px;display:flex;flex-direction:column;justify-content:space-between;gap:8px;">
                    <div>
                      <strong style="color:var(--text-primary);font-size:0.88rem;cursor:pointer;" onclick="document.getElementById('prereq-map-modal').classList.add('hidden');PHIZIKS.openChapter('${c.id}')">Ch ${c.num}: ${c.title} →</strong>
                      <div style="margin-top:6px;">
                        ${c.prereqs.length === 0
                          ? `<span class="badge" style="color:var(--success);">Root Mathematical Foundation</span>`
                          : c.prereqs.map(pr => {
                              const pObj = this.syllabus.find(x => x.id === pr);
                              return `<span class="prereq-pill" style="font-size:0.72rem;padding:2px 7px;" onclick="document.getElementById('prereq-map-modal').classList.add('hidden');PHIZIKS.openChapter('${pr}')">Requires Ch ${pObj ? pObj.num : pr}</span>`;
                            }).join('')}
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
    modal.classList.remove('hidden');
  },

  // =========================================================================
  // CHAPTER EXPLORER, READER & STEP-BY-STEP NUMERICAL SOLVER
  // =========================================================================
  renderChaptersHub(filterClass = 'ALL') {
    this.currentChapterId = null;
    const container = document.getElementById('chapters-content');

    const filtered = this.syllabus.filter(ch => {
      if (filterClass === 'ALL') return true;
      return ch.classLevel.includes(filterClass);
    });

    container.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:18px;">
        <div>
          <span class="scene-header-tag" style="margin-bottom:6px;">dx/dy ENCYCLOPEDIA</span>
          <h1 style="font-size:1.75rem;font-weight:900;">📚 Complete Syllabus Explorer (Ch 00 to Ch 28)</h1>
          <p style="color:var(--text-secondary);font-size:0.9rem;">Starts with Basic Mathematics (Ch 00) followed by all Class 11, Class 12, and Experimental Physics chapters.</p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="tool-btn" onclick="PHIZIKS.openPrereqMapModal()">🕸️ Prerequisite Map</button>
          <button class="nav-btn ${filterClass==='ALL'?'active':''}" onclick="PHIZIKS.renderChaptersHub('ALL')">All (29)</button>
          <button class="nav-btn ${filterClass==='Foundation'?'active':''}" onclick="PHIZIKS.renderChaptersHub('Foundation')">Ch 00: Basic Maths</button>
          <button class="nav-btn ${filterClass==='Class 11'?'active':''}" onclick="PHIZIKS.renderChaptersHub('Class 11')">Class 11</button>
          <button class="nav-btn ${filterClass==='Class 12'?'active':''}" onclick="PHIZIKS.renderChaptersHub('Class 12')">Class 12</button>
        </div>
      </div>

      <div class="chapter-grid">
        ${filtered.map(ch => {
          const prog = this.state.progress[ch.id] || { stars: 0, bookmarked: false, completed: false };
          const isInstalled = this.isChapterInstalled(ch);
          return `
            <div class="chapter-card cyber-tilt-card ${ch.id === 'ch00_basic_maths' ? 'basic-maths-card' : ''}">
              <div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                  <span class="badge" style="color:var(--accent);">CH ${ch.num} • ${ch.classLevel}</span>
                  <button class="tool-btn" style="padding:2px 8px;" onclick="PHIZIKS.toggleBookmark('${ch.id}')" title="Bookmark Chapter">
                    ${prog.bookmarked ? '🔖 Saved' : '☆ Bookmark'}
                  </button>
                </div>
                <h3 style="font-size:1.12rem;margin-bottom:6px;">${ch.title}</h3>
                <div style="font-size:0.78rem;color:#c4b5fd;margin-bottom:6px;">Unit: ${ch.unit}</div>
                <p style="font-size:0.84rem;color:var(--text-secondary);margin-bottom:10px;">${ch.summary}</p>
                ${ch.prereqs.length > 0 ? `
                  <div style="margin-bottom:8px;">
                    ${ch.prereqs.map(pr => {
                      const pObj = this.syllabus.find(x => x.id === pr);
                      return `<span class="prereq-pill" onclick="PHIZIKS.openChapter('${pr}', null, '${ch.id}')">🔗 Prereq: Ch ${pObj ? pObj.num + ' ' + pObj.title : pr} →</span>`;
                    }).join('')}
                  </div>
                ` : ''}
              </div>
              <div>
                <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.78rem;margin-bottom:8px;">
                  <span>Confidence: ${[1,2,3,4,5].map(s => `<span style="cursor:pointer;color:${s<=prog.stars?'#ffab00':'#475569'}" onclick="PHIZIKS.rateTopic('${ch.id}', ${s})">★</span>`).join('')}</span>
                  <span style="color:${isInstalled ? 'var(--success)' : 'var(--warning)'};">${isInstalled ? '● Full Chapter Ready' : '○ Ready for JSON'}</span>
                </div>
                <button class="nav-btn ${ch.id==='ch00_basic_maths'?'btn-primary':''}" style="width:100%;justify-content:center;" onclick="PHIZIKS.openChapter('${ch.id}')">
                  📖 Open Complete Chapter Lesson →
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
    this.bind3DTiltCards();
  },

  async openChapter(chapterId, highlightSection = null, fromChapterId = null) {
    if (fromChapterId) this.previousChapterId = fromChapterId;
    this.currentChapterId = chapterId;
    this.state.lastVisited = { chapterId, topicId: highlightSection, updatedAt: new Date().toISOString() };
    this.saveState();

    this.switchView('chapters');
    const container = document.getElementById('chapters-content');
    const meta = this.syllabus.find(c => c.id === chapterId) || { id: chapterId, num: "00", title: chapterId, summary: "" };

    let chData = null;
    if (window.PHIZIKS_BUILTIN_CHAPTERS && window.PHIZIKS_BUILTIN_CHAPTERS[chapterId]) {
      chData = window.PHIZIKS_BUILTIN_CHAPTERS[chapterId];
    } else {
      try {
        const res = await fetch(`/api/chapters/${chapterId}`);
        if (res.ok) chData = await res.json();
      } catch (e) {}
    }

    if (!chData) {
      container.innerHTML = `
        <div style="margin-bottom:16px;">
          <button class="nav-btn" onclick="PHIZIKS.renderChaptersHub()">⬅ Back to All 29 Chapters</button>
        </div>
        <div class="stat-card" style="border-left:5px solid var(--accent);padding:24px;">
          <span class="badge">CH ${meta.num} • ${meta.classLevel}</span>
          <h1 style="font-size:1.8rem;margin:8px 0;">${meta.title}</h1>
          <p style="color:var(--text-secondary);margin-bottom:16px;">${meta.summary}</p>
          <p>Run <code>node fix.js</code> in your project folder to link <code>data/chapters/${chapterId}.json</code>.</p>
        </div>
      `;
      return;
    }

    this.renderFullChapterView(chData, highlightSection);
  },

  formatStepByStepExplanation(q) {
    const rawExp = q.explanation || '';
    return `
      <div style="display:grid;gap:8px;margin-top:8px;">
        <div class="deriv-step" style="margin:0;">
          <span class="deriv-step-label">STEP 1 • IDENTIFY CONCEPT & FORMULA</span>
          <div style="font-size:0.86rem;">Category: <strong>${q.category || 'Core Concept'}</strong> (${q.difficulty || 'JEE'}). Identify the given variables in standard SI units and select the governing relation from the Master Formula Sheet.</div>
        </div>
        <div class="deriv-step" style="margin:0;border-left-color:var(--accent);">
          <span class="deriv-step-label" style="color:var(--accent);border-color:var(--border-cyan);background:rgba(0,240,255,0.12);">STEP 2 • SUBSTITUTION & MATHEMATICAL DERIVATION</span>
          <div style="font-size:0.9rem;">${rawExp}</div>
        </div>
        <div class="deriv-step" style="margin:0;border-left-color:var(--success);">
          <span class="deriv-step-label" style="color:var(--success);border-color:var(--success);background:rgba(0,230,118,0.12);">STEP 3 • VERIFIED FINAL VERDICT</span>
          <div style="font-size:0.9rem;"><strong>Correct Answer:</strong> <span style="color:var(--success);font-weight:700;">${q.answer}</span></div>
        </div>
      </div>
    `;
  },

  renderFullChapterView(ch, highlightSection) {
    const container = document.getElementById('chapters-content');
    const prog = this.state.progress[ch.id] || { stars: 0, bookmarked: false, completed: false };
    const prevMeta = this.previousChapterId ? this.syllabus.find(c => c.id === this.previousChapterId) : null;

    container.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:18px;">
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="nav-btn" onclick="PHIZIKS.renderChaptersHub()">⬅ All 29 Chapters</button>
          ${prevMeta ? `<button class="nav-btn" style="border-color:var(--accent-violet);color:#c4b5fd;" onclick="PHIZIKS.openChapter('${prevMeta.id}')">↩ Return to Ch ${prevMeta.num}: ${prevMeta.title}</button>` : ''}
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="tool-btn" onclick="PHIZIKS.toggleFocusMode()">🧘 Focus Mode</button>
          <button class="tool-btn" onclick="PHIZIKS.toggleWhiteboard()">✏️ Whiteboard</button>
          <button class="tool-btn" onclick="PHIZIKS.togglePanel('calc-panel')">🧮 Calc</button>
          <button class="tool-btn" onclick="PHIZIKS.toggleBookmark('${ch.id}')">${prog.bookmarked ? '🔖 Bookmarked' : '☆ Bookmark'}</button>
          <button class="tool-btn btn-primary" onclick="PHIZIKS.startChapterQuiz('${ch.id}')">🎯 Take Chapter Test</button>
        </div>
      </div>

      <div class="hero-banner">
        <div>
          <span class="badge" style="color:var(--accent);">CHAPTER ${ch.code || ch.id} • ${ch.classLevel}</span>
          <h1 style="font-size:2rem;font-weight:900;margin:6px 0;">${ch.title}</h1>
          <p style="color:var(--text-secondary);">${ch.subtitle || ''}</p>
        </div>
        <div style="text-align:right;">
          <div style="font-size:0.82rem;color:var(--text-secondary);">Confidence Rating (Schedules Spaced Review):</div>
          <div style="font-size:1.35rem;">
            ${[1,2,3,4,5].map(s => `<span style="cursor:pointer;color:${s<=prog.stars?'#ffab00':'#475569'}" onclick="PHIZIKS.rateTopic('${ch.id}',${s})">★</span>`).join('')}
          </div>
        </div>
      </div>

      <!-- Topic Quick-Jump Table of Contents -->
      <div class="stat-card" style="margin-bottom:20px;padding:14px 18px;">
        <div style="font-size:0.78rem;font-weight:800;color:var(--accent);margin-bottom:8px;">📑 QUICK TOPIC NAVIGATION</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          ${(ch.topics || []).map((t, idx) => `
            <a href="#topic-${t.id}" class="tool-btn" style="text-decoration:none;font-size:0.78rem;">${idx + 1}. ${t.title}</a>
          `).join('')}
          <a href="#ch-formula-sheet" class="tool-btn" style="text-decoration:none;font-size:0.78rem;color:var(--accent);">⚡ Formula Sheet</a>
          <a href="#ch-problem-bank" class="tool-btn" style="text-decoration:none;font-size:0.78rem;color:var(--success);">🎯 Problem Bank & Solver</a>
        </div>
      </div>

      <!-- 1. INTRODUCTION -->
      <div class="stat-card" style="margin-bottom:20px;">
        <h2 style="color:var(--accent);margin-bottom:10px;">1. Intuitive Introduction (First-Time Reader Foundation)</h2>
        <div class="topic-theory">${ch.introduction || ''}</div>
      </div>

      <!-- 2. DETAILED TOPICS & DERIVATIONS -->
      <div style="margin-bottom:20px;">
        <h2 style="color:var(--accent);margin-bottom:12px;">2. Complete Topics, Derivations, Graphs & JEE Trap Drawers</h2>
        ${(ch.topics || []).map((t, idx) => {
          const tProg = this.state.progress[t.id] || { completed: false, stars: 0 };
          return `
            <div id="topic-${t.id}" class="stat-card" style="margin-bottom:18px;border-left:4px solid var(--accent);">
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
                <h3 style="font-size:1.28rem;">Topic ${idx + 1}: ${t.title}</h3>
                <div style="display:flex;gap:8px;align-items:center;">
                  <label style="font-size:0.82rem;cursor:pointer;display:flex;align-items:center;gap:5px;">
                    <input type="checkbox" ${tProg.completed ? 'checked' : ''} onchange="PHIZIKS.toggleComplete('${t.id}', this.checked, '${ch.id}', '${t.title.replace(/'/g, "\\'")}')" /> Mark Mastered
                  </label>
                  <button class="tool-btn" onclick="PHIZIKS.toggleWhiteboard()">✏️ Rough Work</button>
                </div>
              </div>

              ${(t.prerequisites || []).length > 0 ? `
                <div style="margin-bottom:12px;">
                  ${t.prerequisites.map(p => `<span class="prereq-pill" onclick="PHIZIKS.openChapter('${p.targetChapter}', '${p.targetTopic || ''}', '${ch.id}')">🔗 Prerequisite: ${p.label} →</span>`).join('')}
                </div>
              ` : ''}

              <div class="topic-theory">${t.theoryHtml || ''}</div>
              ${t.derivationHtml ? `<div style="margin-top:14px;padding:14px;background:var(--bg-primary);border-radius:8px;border:1px solid var(--border-color);"><strong style="color:var(--accent);">📐 Complete Step-by-Step Derivation & Proof:</strong><div style="margin-top:8px;">${t.derivationHtml}</div></div>` : ''}
              ${t.graphSvg ? `<div style="margin-top:14px;padding:14px;background:var(--bg-primary);border-radius:8px;text-align:center;">${t.graphSvg}</div>` : ''}

              ${t.jeeTraps ? `
                <details class="trap-drawer" open>
                  <summary>⚠️ High-Frequency JEE Conceptual Traps & Graph/Solving Mistakes</summary>
                  <div class="trap-drawer-body">${t.jeeTraps}</div>
                </details>
              ` : ''}

              <div style="margin-top:12px;display:flex;justify-content:flex-end;">
                <button class="nav-btn" onclick="PHIZIKS.startChapterQuiz('${ch.id}', '${t.id}')">🎯 Practice Topic Questions →</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- 3. CONCLUSION & SUMMARY -->
      <div class="stat-card" style="margin-bottom:20px;">
        <h2 style="color:var(--accent);margin-bottom:10px;">3. Chapter Conclusion & Executive Revision Summary</h2>
        <div>${ch.conclusion || ''}</div>
        <div style="margin-top:10px;">${ch.summary || ''}</div>
      </div>

      <!-- 4. MASTER FORMULA SHEET -->
      <div id="ch-formula-sheet" class="stat-card" style="margin-bottom:20px;">
        <h2 style="color:var(--accent);margin-bottom:10px;">4. Master Formula & Revision Sheet</h2>
        <div>${ch.formulaSheetHtml || ''}</div>
      </div>

      <!-- 5. CATEGORIZED QUESTION BANK WITH STEP-BY-STEP NUMERICAL SOLVER -->
      <div id="ch-problem-bank" class="stat-card">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:14px;">
          <div>
            <h2 style="color:var(--accent);">5. Complete Problem Bank & Step-by-Step Numerical Solver</h2>
            <p style="font-size:0.84rem;color:var(--text-secondary);">Attempt each problem first, then expand the 3-stage Step-by-Step Solver to verify your setup, substitution, and final answer.</p>
          </div>
          <button class="tool-btn" onclick="PHIZIKS.toggleWhiteboard()">✏️ Open Side-by-Side Whiteboard</button>
        </div>
        ${(ch.questions || []).map((q, i) => `
          <div style="padding:16px;background:var(--bg-primary);border:1px solid var(--border-color);border-radius:8px;margin-bottom:12px;">
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
              <span class="badge" style="color:var(--accent);">Q${i+1} • ${(q.category || 'CONCEPT').toUpperCase()}</span>
              <span class="badge">${q.difficulty || 'JEE'}</span>
            </div>
            <div style="margin-bottom:12px;font-weight:600;">${q.prompt}</div>
            ${q.options ? `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px;margin-bottom:10px;">
              ${q.options.map((opt, oi) => `<div style="padding:7px 11px;background:var(--bg-secondary);border-radius:6px;border:1px solid var(--border-color);">(${String.fromCharCode(65+oi)}) ${opt}</div>`).join('')}
            </div>` : ''}
            <details class="trap-drawer" style="margin:6px 0;border-color:rgba(0,230,118,0.4);border-left-color:var(--success);background:rgba(0,230,118,0.04);">
              <summary style="color:var(--success);">🧮 Open 3-Stage Step-by-Step Numerical Solver & Verdict</summary>
              <div class="trap-drawer-body">
                ${this.formatStepByStepExplanation(q)}
              </div>
            </details>
          </div>
        `).join('')}
      </div>
    `;

    if (highlightSection) {
      setTimeout(() => {
        const targetEl = document.getElementById(`topic-${highlightSection}`);
        if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }

    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([container]);
    }
  },

  toggleBookmark(id) {
    if (!this.state.progress[id]) this.state.progress[id] = { stars: 0, bookmarked: false, completed: false };
    this.state.progress[id].bookmarked = !this.state.progress[id].bookmarked;
    this.saveState();
    if (this.currentChapterId) this.openChapter(this.currentChapterId);
    else this.renderChaptersHub();
  },

  rateTopic(id, stars) {
    if (!this.state.progress[id]) this.state.progress[id] = { stars: 0, bookmarked: false, completed: false };
    this.state.progress[id].stars = stars;

    const daysMap = { 1: 1, 2: 1, 3: 3, 4: 7, 5: 21 };
    const intervalDays = daysMap[stars] || 3;
    const chMeta = this.syllabus.find(c => c.id === id);
    if (!this.state.revisionQueue) this.state.revisionQueue = {};
    this.state.revisionQueue[id] = {
      chapterId: id,
      title: chMeta ? `Ch ${chMeta.num}: ${chMeta.title}` : id,
      stars,
      nextReviewAt: new Date(Date.now() + intervalDays * 86400000).toISOString()
    };

    this.saveState();
    if (this.currentChapterId) this.openChapter(this.currentChapterId);
    else this.renderChaptersHub();
  },

  toggleComplete(id, completed, chapterId = null, title = null) {
    if (!this.state.progress[id]) this.state.progress[id] = { stars: 0, bookmarked: false, completed: false };
    this.state.progress[id].completed = completed;
    if (completed && chapterId) {
      if (!this.state.revisionQueue) this.state.revisionQueue = {};
      this.state.revisionQueue[id] = {
        chapterId,
        title: title || id,
        stars: 4,
        nextReviewAt: new Date(Date.now() + 7 * 86400000).toISOString()
      };
    }
    this.saveState();
  },

  startChapterQuiz(chapterId, topicId = null) {
    this.switchView('dpp');
    if (window.PHIZIKS_SUITES) {
      window.PHIZIKS_SUITES.launchQuickQuiz(chapterId, topicId);
    }
  },

  // =========================================================================
  // NO-EMAIL / NO-PHONE PROFILE, INACTIVITY & JSON BACKUP MANAGER
  // =========================================================================
  updateProfileBadgeAndWarning() {
    const nameSpan = document.getElementById('nav-profile-name');
    if (nameSpan && this.state && this.state.profile) {
      nameSpan.textContent = this.state.profile.studentName || 'Scholar';
    }

    const banner = document.getElementById('inactivity-warning-banner');
    const msg = document.getElementById('inactivity-warning-msg');
    if (banner && this.state && this.state.inactivity) {
      if (this.state.inactivity.warningActive) {
        banner.classList.remove('hidden');
        if (msg) msg.textContent = this.state.inactivity.warningMessage;
      } else {
        banner.classList.add('hidden');
      }
    }
  },

  openProfileModal() {
    const modal = document.getElementById('profile-modal');
    const body = document.getElementById('profile-modal-body');
    if (!modal || !body) return;

    const p = this.state.profile || {};
    const inact = this.state.inactivity || { inactiveDays: 0, daysUntilDeletion: 90, warningActive: false };
    const profiles = this.state.profilesSummary || [
      { id: this.state.activeProfileId || 'prof_default', studentName: p.studentName, currentClass: p.currentClass, targetExam: p.targetExam }
    ];

    body.innerHTML = `
      <div style="display:grid;gap:18px;">
        <div style="padding:14px;background:var(--bg-primary);border:1px solid var(--border-cyan);border-radius:8px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
            <div>
              <span class="badge" style="color:var(--accent);">ACTIVE PROFILE</span>
              <strong style="font-size:1.1rem;margin-left:8px;">${p.studentName} (${p.currentClass})</strong>
            </div>
            <span class="badge" style="color:${inact.warningActive ? 'var(--warning)' : 'var(--success)'};">
              Inactivity Timer: ${inact.daysUntilDeletion ?? 90} days remaining (of 90d)
            </span>
          </div>
          <p style="font-size:0.8rem;color:var(--text-secondary);">
            <strong>Privacy & Auto-Deletion Policy:</strong> <code>dx/dy</code> requires no email address or phone number. Profiles are automatically deleted after <strong>3 months (90 days) of inactivity</strong>, with an in-website warning displayed <strong>7 days in advance (at day 83)</strong>. Any study action resets the 90-day deadline. Export a JSON Backup below to move your data across devices.
          </p>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;">
            <button class="tool-btn btn-primary" onclick="PHIZIKS.exportProfileBackup()">⬇️ Export JSON Backup</button>
            <label class="tool-btn" style="cursor:pointer;">
              ⬆️ Import JSON Backup
              <input type="file" accept=".json" style="display:none;" onchange="PHIZIKS.importProfileBackup(this)" />
            </label>
            <button class="tool-btn" onclick="PHIZIKS.simulateInactivityWarning()">🧪 Test 7-Day Warning Banner</button>
            <button class="tool-btn" style="border-color:var(--danger);color:var(--danger);" onclick="PHIZIKS.deleteProfile('${this.state.activeProfileId || 'prof_default'}')">🗑️ Delete Profile Now</button>
          </div>
        </div>

        <div>
          <h4 style="color:var(--accent);margin-bottom:8px;">🔄 Switch Profile (${profiles.length} on this device)</h4>
          <div style="display:grid;gap:8px;">
            ${profiles.map(pr => `
              <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:var(--bg-primary);border:1px solid ${pr.id === this.state.activeProfileId ? 'var(--accent)' : 'var(--border-color)'};border-radius:6px;">
                <div>
                  <strong>${pr.studentName}</strong>
                  <span class="badge" style="margin-left:6px;">${pr.currentClass}</span>
                  <span style="font-size:0.75rem;color:var(--text-secondary);margin-left:8px;">${pr.targetExam || 'JEE'}</span>
                </div>
                <div style="display:flex;gap:6px;">
                  ${pr.id === this.state.activeProfileId
                    ? `<span class="badge" style="color:var(--success);">● Active</span>`
                    : `<button class="tool-btn btn-primary" onclick="PHIZIKS.switchProfile('${pr.id}')">Switch</button>`}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="padding:14px;background:var(--bg-primary);border:1px solid var(--border-color);border-radius:8px;">
          <h4 style="color:var(--accent);margin-bottom:10px;">➕ Create New Profile (No Email or Phone Required)</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin-bottom:12px;">
            <div>
              <label style="font-size:0.76rem;color:var(--text-secondary);">Student Name / Handle</label>
              <input type="text" id="new-prof-name" class="global-search-input" placeholder="e.g. Scholar" />
            </div>
            <div>
              <label style="font-size:0.76rem;color:var(--text-secondary);">Class / Stage</label>
              <select id="new-prof-class" class="global-search-input">
                <option value="Class 11">Class 11</option>
                <option value="Class 12">Class 12</option>
                <option value="JEE Dropper / Repeater">JEE Dropper / Repeater</option>
                <option value="Class 10 Foundation">Class 10 Foundation</option>
              </select>
            </div>
            <div>
              <label style="font-size:0.76rem;color:var(--text-secondary);">Target Goal</label>
              <input type="text" id="new-prof-exam" class="global-search-input" value="JEE Main & Advanced" />
            </div>
          </div>
          <button class="nav-btn btn-primary" onclick="PHIZIKS.createNewProfile()">✔ Create & Switch to Profile</button>
        </div>
      </div>
    `;
    modal.classList.remove('hidden');
  },

  closeProfileModal() {
    document.getElementById('profile-modal').classList.add('hidden');
  },

  async createNewProfile() {
    const studentName = document.getElementById('new-prof-name').value.trim() || 'Scholar';
    const currentClass = document.getElementById('new-prof-class').value;
    const targetExam = document.getElementById('new-prof-exam').value.trim() || 'JEE Main & Advanced';

    const newId = 'prof_' + Date.now();
    const fresh = this.getDefaultClientState();
    fresh.id = newId;
    fresh.activeProfileId = newId;
    fresh.profile.studentName = studentName;
    fresh.profile.currentClass = currentClass;
    fresh.profile.targetExam = targetExam;

    this.state = fresh;
    this.saveState();
    this.applyTheme();
    this.updateProfileBadgeAndWarning();
    this.openProfileModal();
    this.renderHome();
    if (window.PHIZIKS_SUITES) window.PHIZIKS_SUITES.init();
  },

  async switchProfile(profileId) {
    const map = JSON.parse(localStorage.getItem('phiziks_profiles_map') || '{}');
    if (map[profileId]) {
      this.state = map[profileId];
      this.state.activeProfileId = profileId;
      this.saveState();
      this.applyTheme();
      this.updateProfileBadgeAndWarning();
      this.openProfileModal();
      this.renderHome();
      if (window.PHIZIKS_SUITES) window.PHIZIKS_SUITES.init();
    }
  },

  async deleteProfile(profileId) {
    if (!confirm('Permanently delete this profile and all its study plans, journal entries, and progress?')) return;
    const map = JSON.parse(localStorage.getItem('phiziks_profiles_map') || '{}');
    delete map[profileId];
    localStorage.setItem('phiziks_profiles_map', JSON.stringify(map));

    const remainingIds = Object.keys(map);
    this.state = remainingIds.length > 0 ? map[remainingIds[0]] : this.getDefaultClientState();
    this.saveState();
    this.applyTheme();
    this.updateProfileBadgeAndWarning();
    this.openProfileModal();
    this.renderHome();
    if (window.PHIZIKS_SUITES) window.PHIZIKS_SUITES.init();
  },

  async keepAccountActive() {
    this.state.inactivity = { inactiveDays: 0, daysUntilDeletion: 90, warningActive: false };
    this.saveState();
    this.updateProfileBadgeAndWarning();
  },

  async simulateInactivityWarning() {
    this.state.inactivity = {
      inactiveDays: 84,
      daysUntilDeletion: 6,
      warningActive: true,
      warningMessage: 'Your profile has been inactive for 83+ days and is scheduled for automatic deletion in 6 days.'
    };
    this.saveState();
    this.updateProfileBadgeAndWarning();
    this.openProfileModal();
  },

  exportProfileBackup() {
    const blob = new Blob([JSON.stringify({ exportedFrom: "dx/dy", exportedAt: new Date().toISOString(), profileData: this.state }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `dxdy-backup-${(this.state.profile?.studentName || 'scholar').toLowerCase()}.json`;
    a.click();
  },

  importProfileBackup(input) {
    const file = input.files && input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        this.state = parsed.profileData || parsed;
        this.saveState();
        this.applyTheme();
        this.updateProfileBadgeAndWarning();
        this.openProfileModal();
        this.renderHome();
        if (window.PHIZIKS_SUITES) window.PHIZIKS_SUITES.init();
      } catch (err) {
        alert('Invalid backup JSON file.');
      }
    };
    reader.readAsText(file);
  },


  // =========================================================================
  // EXHIBITION WALKTHROUGH CONTROLLER
  // =========================================================================
  openExhibitionPPT() {
    this.pptIndex = 0;
    document.getElementById('exhibition-ppt-modal').classList.remove('hidden');
    this.renderPPTSlide();
  },

  closeExhibitionPPT() {
    document.getElementById('exhibition-ppt-modal').classList.add('hidden');
  },

  nextPPTSlide() {
    this.pptIndex = (this.pptIndex + 1) % this.pptSlides.length;
    this.renderPPTSlide();
  },

  prevPPTSlide() {
    this.pptIndex = (this.pptIndex - 1 + this.pptSlides.length) % this.pptSlides.length;
    this.renderPPTSlide();
  },

  renderPPTSlide() {
    const slide = this.pptSlides[this.pptIndex];
    document.getElementById('ppt-slide-indicator').textContent = `📊 dx/dy PLATFORM WALKTHROUGH — SLIDE ${this.pptIndex + 1} / ${this.pptSlides.length}`;
    document.getElementById('ppt-slide-container').innerHTML = `
      <div>
        <span class="badge" style="color:var(--accent);margin-bottom:8px;">dx/dy FEATURE WALKTHROUGH</span>
        <h2 style="font-size:1.6rem;font-weight:900;margin-bottom:6px;">${slide.title}</h2>
        <p style="color:#c4b5fd;font-weight:600;margin-bottom:16px;">${slide.subtitle}</p>
        <ul style="padding-left:20px;display:grid;gap:10px;margin-bottom:18px;">
          ${slide.points.map(pt => `<li>${pt}</li>`).join('')}
        </ul>
        <div style="padding:12px;background:var(--bg-primary);border-left:4px solid var(--warning);border-radius:6px;font-size:0.85rem;">
          <strong style="color:var(--warning);">🎙️ Presentation Note:</strong> ${slide.speakerNote}
        </div>
      </div>
      <div class="ppt-visual-box">
        ${slide.svg}
        <div style="margin-top:10px;display:flex;justify-content:center;gap:6px;">
          ${this.pptSlides.map((_, idx) => `<span style="width:10px;height:10px;border-radius:50%;background:${idx===this.pptIndex?'var(--accent)':'#475569'};display:inline-block;cursor:pointer;" onclick="PHIZIKS.pptIndex=${idx};PHIZIKS.renderPPTSlide();"></span>`).join('')}
        </div>
      </div>
    `;
  },

  // =========================================================================
  // SIDE-BY-SIDE HTML5 WHITEBOARD ENGINE
  // =========================================================================
  initWhiteboard() {
    const canvas = document.getElementById('whiteboard-canvas');
    if (!canvas) return;
    this.wb.canvas = canvas;
    this.wb.ctx = canvas.getContext('2d');

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const temp = canvas.toDataURL();
      canvas.width = rect.width;
      canvas.height = rect.height;
      const img = new Image();
      img.onload = () => this.wb.ctx.drawImage(img, 0, 0);
      img.src = temp;
    };
    window.addEventListener('resize', resize);

    const getPos = (e) => {
      const r = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: clientX - r.left, y: clientY - r.top };
    };

    const start = (e) => {
      this.wb.drawing = true;
      const pos = getPos(e);
      this.wb.ctx.beginPath();
      this.wb.ctx.moveTo(pos.x, pos.y);
    };

    const move = (e) => {
      if (!this.wb.drawing) return;
      e.preventDefault();
      const pos = getPos(e);
      this.wb.ctx.lineCap = 'round';
      this.wb.ctx.lineJoin = 'round';
      this.wb.ctx.lineWidth = this.wb.size;
      if (this.wb.tool === 'eraser') {
        this.wb.ctx.globalCompositeOperation = 'destination-out';
        this.wb.ctx.lineWidth = this.wb.size * 3;
      } else {
        this.wb.ctx.globalCompositeOperation = 'source-over';
        this.wb.ctx.strokeStyle = this.wb.color;
      }
      this.wb.ctx.lineTo(pos.x, pos.y);
      this.wb.ctx.stroke();
    };

    const stop = () => { this.wb.drawing = false; };

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    window.addEventListener('mouseup', stop);
    canvas.addEventListener('touchstart', start, { passive: false });
    canvas.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', stop);
  },

  toggleWhiteboard() {
    const dock = document.getElementById('whiteboard-dock');
    dock.classList.toggle('hidden');
    if (!dock.classList.contains('hidden')) {
      setTimeout(() => {
        const rect = this.wb.canvas.parentElement.getBoundingClientRect();
        this.wb.canvas.width = rect.width;
        this.wb.canvas.height = rect.height;
      }, 50);
    }
  },

  setWbTool(t) {
    this.wb.tool = t;
    const pBtn = document.getElementById('wb-pen-btn');
    const eBtn = document.getElementById('wb-eraser-btn');
    if (pBtn) pBtn.classList.toggle('active-tool', t === 'pen');
    if (eBtn) eBtn.classList.toggle('active-tool', t === 'eraser');
  },
  setWbColor(c) { this.wb.color = c; this.setWbTool('pen'); },
  setWbSize(s) { this.wb.size = Number(s); },
  toggleWbGrid() { document.getElementById('wb-canvas-wrap').classList.toggle('wb-grid-bg'); },
  clearWhiteboard() { this.wb.ctx.clearRect(0, 0, this.wb.canvas.width, this.wb.canvas.height); },
  downloadWhiteboard() {
    const a = document.createElement('a');
    a.download = `dxdy-whiteboard-${Date.now()}.png`;
    a.href = this.wb.canvas.toDataURL();
    a.click();
  },

  // =========================================================================
  // SCIENTIFIC CALCULATOR ENGINE
  // =========================================================================
  togglePanel(id) {
    document.getElementById(id).classList.toggle('hidden');
  },

  toggleCalcAngleMode() {
    this.calcAngleMode = this.calcAngleMode === 'DEG' ? 'RAD' : 'DEG';
    document.getElementById('calc-angle-btn').textContent = this.calcAngleMode;
  },

  calcInsert(token) {
    this.calcExpression += token;
    document.getElementById('calc-screen').textContent = this.calcExpression || '0';
  },

  calcClear() {
    this.calcExpression = '';
    document.getElementById('calc-screen').textContent = '0';
  },

  calcBackspace() {
    this.calcExpression = this.calcExpression.slice(0, -1);
    document.getElementById('calc-screen').textContent = this.calcExpression || '0';
  },

  calcFunc(fn) {
    try {
      const val = Number(eval(this.calcExpression || '0'));
      const toRad = this.calcAngleMode === 'DEG' ? (val * Math.PI / 180) : val;
      const fromRad = (r) => this.calcAngleMode === 'DEG' ? (r * 180 / Math.PI) : r;
      let res = 0;
      if (fn === 'sin') res = Math.sin(toRad);
      if (fn === 'cos') res = Math.cos(toRad);
      if (fn === 'tan') res = Math.tan(toRad);
      if (fn === 'asin') res = fromRad(Math.asin(val));
      if (fn === 'acos') res = fromRad(Math.acos(val));
      if (fn === 'atan') res = fromRad(Math.atan(val));
      if (fn === 'sqrt') res = Math.sqrt(val);
      if (fn === 'cbrt') res = Math.cbrt(val);
      if (fn === 'log10') res = Math.log10(val);
      if (fn === 'ln') res = Math.log(val);
      if (fn === 'sq') res = val * val;
      if (fn === 'inv') res = 1 / val;

      document.getElementById('calc-history').textContent = `${fn}(${val}) =`;
      this.calcExpression = String(Number(res.toPrecision(10)));
      document.getElementById('calc-screen').textContent = this.calcExpression;
    } catch (e) {
      document.getElementById('calc-screen').textContent = 'Error';
    }
  },

  calcEvaluate() {
    try {
      const res = eval(this.calcExpression || '0');
      document.getElementById('calc-history').textContent = `${this.calcExpression} =`;
      this.calcExpression = String(Number(Number(res).toPrecision(10)));
      document.getElementById('calc-screen').textContent = this.calcExpression;
    } catch (e) {
      document.getElementById('calc-screen').textContent = 'Syntax Error';
    }
  },

  // =========================================================================
  // CHAPTER NOTES ENGINE WITH DEBOUNCED AUTOSAVE
  // =========================================================================
  populateNotesSelector() {
    const sel = document.getElementById('notes-chapter-select');
    if (!sel) return;
    sel.innerHTML = this.syllabus.map(ch => `<option value="${ch.id}">Ch ${ch.num}: ${ch.title}</option>`).join('');
    this.loadChapterNote(this.syllabus[0].id);
  },

  loadChapterNote(chId) {
    const note = this.state.notes[chId];
    const editor = document.getElementById('notes-editor');
    const ch = this.syllabus.find(x => x.id === chId);
    editor.innerHTML = note ? note.htmlContent : `<h3>📒 Notes: ${ch ? ch.title : chId}</h3><p>Type your key derivations, shortcuts, and formula reminders here...</p>`;
  },

  insertNoteCallout() {
    const editor = document.getElementById('notes-editor');
    editor.innerHTML += `<div style="padding:10px;border-left:4px solid var(--accent);background:var(--bg-secondary);margin:8px 0;">💡 <strong>Key dx/dy Insight:</strong> Write your point here...</div>`;
    this.scheduleNoteAutosave();
  },

  scheduleNoteAutosave() {
    const status = document.getElementById('notes-status');
    if (status) status.textContent = '⏳ Saving changes...';
    if (this.noteAutosaveTimer) clearTimeout(this.noteAutosaveTimer);
    this.noteAutosaveTimer = setTimeout(() => {
      this.saveCurrentNote();
    }, 800);
  },

  saveCurrentNote() {
    const chId = document.getElementById('notes-chapter-select').value;
    const htmlContent = document.getElementById('notes-editor').innerHTML;
    this.state.notes[chId] = { htmlContent, updatedAt: new Date().toLocaleTimeString() };
    this.saveState();
    const status = document.getElementById('notes-status');
    if (status) status.textContent = `✔ Autosaved to active profile at ${this.state.notes[chId].updatedAt}`;
  },

  exportCurrentNote() {
    const chId = document.getElementById('notes-chapter-select').value;
    const text = document.getElementById('notes-editor').innerText;
    const blob = new Blob([text], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${chId}_notes.md`;
    a.click();
  },

  // =========================================================================
  // dx/dy LOGO VARIATIONS & THEME CUSTOMIZER
  // =========================================================================
  applyTheme() {
    const t = this.state.theme || {};
    document.body.classList.toggle('theme-light', t.mode === 'light');
    document.body.classList.toggle('logo-monochrome', Boolean(t.monochromeLogo));
    document.documentElement.style.setProperty('--accent', t.accent || '#00f0ff');
    document.documentElement.style.setProperty('--font-main', t.fontFamily || "'Inter', sans-serif");

    const variant = t.logoVariant || 'slash';
    const mount = document.getElementById('brand-logo-svg-mount');
    if (mount && this.logoTemplates[variant]) {
      mount.innerHTML = this.logoTemplates[variant];
    }
    ['slash', 'curve', 'vector'].forEach(v => {
      const card = document.getElementById(`logo-card-${v}`);
      if (card) card.classList.toggle('active-logo', v === variant);
    });

    const wp = document.getElementById('wallpaper-layer');
    if (wp) {
      wp.className = '';
      if (t.wallpaperType === 'grid') wp.classList.add('wp-grid');
      if (t.wallpaperType === 'cyber') wp.classList.add('wp-cyber');
      if (t.wallpaperType === 'custom' && t.wallpaperUrl) {
        document.documentElement.style.setProperty('--custom-wallpaper', `url('${t.wallpaperUrl}')`);
      } else {
        document.documentElement.style.setProperty('--custom-wallpaper', 'none');
      }
    }
  },

  setLogoVariant(variant) {
    this.state.theme.logoVariant = variant;
    this.applyTheme();
    this.saveState();
  },

  toggleLogoMonochrome() {
    this.state.theme.monochromeLogo = !this.state.theme.monochromeLogo;
    this.applyTheme();
    this.saveState();
  },

  setThemeMode(mode) { this.state.theme.mode = mode; this.applyTheme(); this.saveState(); },
  setAccentColor(color) { this.state.theme.accent = color; this.applyTheme(); this.saveState(); },
  setFontFamily(font) { this.state.theme.fontFamily = font; this.applyTheme(); this.saveState(); },
  setWallpaper(type, url) {
    this.state.theme.wallpaperType = type;
    if (url) this.state.theme.wallpaperUrl = url;
    this.applyTheme();
    this.saveState();
  }
};

window.addEventListener('DOMContentLoaded', () => PHIZIKS.init());
