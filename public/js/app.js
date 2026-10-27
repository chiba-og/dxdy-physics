const PHIZIKS = {
  state: null,
  installedChapters: {},
  installedByCode: {},
  currentView: 'home',
  currentChapterId: null,
  previousChapterId: null,
  pptIndex: 0,
  pptDirection: 'next',
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

  // 12-SLIDE PLATFORM GUIDE (PURE TEXT OVERVIEW SLIDES + ANNOTATED SCREENSHOT SLIDES)
  pptSlides: [
    {
      layout: "text-grid",
      tag: "OVERVIEW  |  PLATFORM INTRODUCTION",
      title: "dx/dy — Full-Stack Visual Physics & Study Workspace",
      subtitle: "An interactive learning laboratory built for Class 11, Class 12, and JEE Physics.",
      cards: [
        {
          title: "What is dx/dy?",
          desc: "A full-stack web platform combining 29 physics chapters, live math simulations, adaptive tests, and focus tools in one tab.",
          color: "#00f0ff"
        },
        {
          title: "The Problem It Solves",
          desc: "Static textbook formulas don't move, students juggle 5 different apps to study, and websites lock content behind password walls.",
          color: "#ffab00"
        },
        {
          title: "Our Core Solution",
          desc: "Interactive slider graphs, a side-by-side Whiteboard, Physics Calculator, Non-Repeating Tests, and an Offline Audio Timer.",
          color: "#00e676"
        },
        {
          title: "Zero-Login & Cloud Hosted",
          desc: "Hosted 24/7 on Render and indexed on Google Search. Saves progress privately in your browser with 1-click JSON backups.",
          color: "#c4b5fd"
        }
      ]
    },
    {
      layout: "screenshot",
      tag: "FEATURE 01  |  COMMAND CENTER",
      title: "Interactive Home & Telemetry",
      subtitle: "Your daily launchpad with live exam countdowns and progress tracking.",
      img: "/slide1.jpg",
      cards: [
        { title: "① 1-Click Navigation", desc: "Switch between 29 Chapters, Visual Lab, Tests, Planner, and Journal.", color: "#00f0ff" },
        { title: "② Quick Resume & Map", desc: "Jump right back into your last chapter or open the Prerequisite Map.", color: "#00e676" },
        { title: "③ Live Exam Countdowns", desc: "Track days remaining for JEE Main, JEE Advanced, and Board exams.", color: "#ffab00" }
      ],
      overlaySvg: `<svg viewBox="0 0 1280 720" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;">
        <rect x="300" y="6" width="675" height="36" rx="8" fill="none" stroke="#00f0ff" stroke-width="3" stroke-dasharray="6,4"/>
        <circle cx="282" cy="24" r="15" fill="#00f0ff"/><text x="282" y="29" fill="#03050a" font-size="15" font-weight="900" text-anchor="middle">1</text>
        <rect x="176" y="408" width="318" height="42" rx="8" fill="none" stroke="#00e676" stroke-width="3"/>
        <circle cx="156" cy="429" r="15" fill="#00e676"/><text x="156" y="434" fill="#03050a" font-size="15" font-weight="900" text-anchor="middle">2</text>
        <rect x="176" y="505" width="465" height="65" rx="8" fill="none" stroke="#ffab00" stroke-width="3"/>
        <circle cx="156" cy="538" r="15" fill="#ffab00"/><text x="156" y="543" fill="#03050a" font-size="15" font-weight="900" text-anchor="middle">3</text>
      </svg>`
    },
    {
      layout: "screenshot",
      tag: "FEATURE 02  |  29 CHAPTERS",
      title: "Complete Syllabus Explorer (Ch 00–28)",
      subtitle: "Starts with Basic Mathematics so you never get stuck on calculus in Physics.",
      img: "/slide2.jpg",
      cards: [
        { title: "① Class Filters", desc: "Filter between All 29 Chapters, Ch 00 Basic Maths, Class 11, or Class 12.", color: "#00f0ff" },
        { title: "② Starts at Ch 00", desc: "Covers Calculus and Vectors first before starting Kinematics.", color: "#00e676" },
        { title: "③ Prerequisite Pills", desc: "Click any purple pill to jump to required basics and return in 1 click.", color: "#ffab00" }
      ],
      overlaySvg: `<svg viewBox="0 0 1280 720" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;">
        <rect x="160" y="122" width="390" height="32" rx="6" fill="none" stroke="#00f0ff" stroke-width="3"/>
        <circle cx="140" cy="138" r="15" fill="#00f0ff"/><text x="140" y="143" fill="#03050a" font-size="15" font-weight="900" text-anchor="middle">1</text>
        <rect x="160" y="160" width="235" height="295" rx="10" fill="none" stroke="#00e676" stroke-width="3"/>
        <circle cx="140" cy="210" r="15" fill="#00e676"/><text x="140" y="215" fill="#03050a" font-size="15" font-weight="900" text-anchor="middle">2</text>
        <rect x="405" y="315" width="218" height="45" rx="6" fill="none" stroke="#ffab00" stroke-width="3"/>
        <circle cx="640" cy="338" r="15" fill="#ffab00"/><text x="640" y="343" fill="#03050a" font-size="15" font-weight="900" text-anchor="middle">3</text>
      </svg>`
    },
    {
      layout: "screenshot",
      tag: "FEATURE 03  |  VISUAL LAB (ENGINE A)",
      title: "Parametric Slider Sandbox",
      subtitle: "Drag sliders to watch graphs, derivatives, and integrals update live.",
      img: "/slide3.jpg",
      cards: [
        { title: "① 5 Physics Domains", desc: "Switch between Calculus, Kinematics, Oscillations, Optics, and Gravitation.", color: "#00f0ff" },
        { title: "② Live Variable Sliders", desc: "Drag sliders for coefficients, tangency points, or integral limits.", color: "#00e676" },
        { title: "③ Live Graph & Table", desc: "See exact derivative slopes (dy/dx) and shaded areas update in real time.", color: "#ffab00" }
      ],
      overlaySvg: `<svg viewBox="0 0 1280 720" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;">
        <rect x="168" y="190" width="625" height="36" rx="6" fill="none" stroke="#00f0ff" stroke-width="3"/>
        <circle cx="148" cy="208" r="15" fill="#00f0ff"/><text x="148" y="213" fill="#03050a" font-size="15" font-weight="900" text-anchor="middle">1</text>
        <rect x="160" y="236" width="295" height="365" rx="10" fill="none" stroke="#00e676" stroke-width="3"/>
        <circle cx="140" cy="310" r="15" fill="#00e676"/><text x="140" y="315" fill="#03050a" font-size="15" font-weight="900" text-anchor="middle">2</text>
        <rect x="468" y="236" width="650" height="290" rx="10" fill="none" stroke="#ffab00" stroke-width="3"/>
        <circle cx="488" cy="260" r="15" fill="#ffab00"/><text x="488" y="265" fill="#03050a" font-size="15" font-weight="900" text-anchor="middle">3</text>
      </svg>`
    },
    {
      layout: "screenshot",
      tag: "FEATURE 04  |  VISUAL LAB (ENGINE B)",
      title: "Concept Animation Theater",
      subtitle: "Inspect 1D, 2D, and 3D physics motion with slow-motion and frame stepping.",
      img: "/slide4.jpg",
      cards: [
        { title: "① Engine B Mode", desc: "Switches from graph sliders to the real-time motion animation stage.", color: "#c4b5fd" },
        { title: "② Slow-Mo & Step (+Δt)", desc: "Play, Pause, step forward frame-by-frame, or slow down to 0.25× speed.", color: "#00f0ff" },
        { title: "③ Live Vector Arrows", desc: "Watch horizontal (v_x) and vertical (v_y) velocity vectors change mid-flight.", color: "#00e676" }
      ],
      overlaySvg: `<svg viewBox="0 0 1280 720" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;">
        <rect x="360" y="120" width="198" height="32" rx="6" fill="none" stroke="#c4b5fd" stroke-width="3"/>
        <circle cx="340" cy="136" r="15" fill="#c4b5fd"/><text x="340" y="141" fill="#03050a" font-size="15" font-weight="900" text-anchor="middle">1</text>
        <rect x="572" y="242" width="490" height="34" rx="6" fill="none" stroke="#00f0ff" stroke-width="3"/>
        <circle cx="552" cy="259" r="15" fill="#00f0ff"/><text x="552" y="264" fill="#03050a" font-size="15" font-weight="900" text-anchor="middle">2</text>
        <rect x="180" y="365" width="910" height="260" rx="10" fill="none" stroke="#00e676" stroke-width="3"/>
        <circle cx="160" cy="495" r="15" fill="#00e676"/><text x="160" y="500" fill="#03050a" font-size="15" font-weight="900" text-anchor="middle">3</text>
      </svg>`
    },
    {
      layout: "screenshot",
      tag: "FEATURE 05  |  EVALUATION",
      title: "Adaptive Non-Repeating Tests",
      subtitle: "Custom practice tests that remember which questions you already solved.",
      img: "/slide5.jpg",
      cards: [
        { title: "① Seen-Question Memory", desc: "Tracks attempted question IDs so tests never accidentally repeat.", color: "#00e676" },
        { title: "② Custom Test Builder", desc: "Choose Target Chapter, Difficulty Tier, Question Count, and Timer.", color: "#00f0ff" },
        { title: "③ Score & Auto-Revision", desc: "Instant +4 / -1 JEE scoring and queues missed chapters for review.", color: "#ffab00" }
      ],
      overlaySvg: `<svg viewBox="0 0 1280 720" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;">
        <rect x="160" y="135" width="450" height="32" rx="6" fill="none" stroke="#00e676" stroke-width="3"/>
        <circle cx="140" cy="151" r="15" fill="#00e676"/><text x="140" y="156" fill="#03050a" font-size="15" font-weight="900" text-anchor="middle">1</text>
        <rect x="160" y="175" width="960" height="100" rx="10" fill="none" stroke="#00f0ff" stroke-width="3"/>
        <circle cx="140" cy="225" r="15" fill="#00f0ff"/><text x="140" y="230" fill="#03050a" font-size="15" font-weight="900" text-anchor="middle">2</text>
        <rect x="160" y="285" width="360" height="115" rx="10" fill="none" stroke="#ffab00" stroke-width="3"/>
        <circle cx="140" cy="340" r="15" fill="#ffab00"/><text x="140" y="345" fill="#03050a" font-size="15" font-weight="900" text-anchor="middle">3</text>
      </svg>`
    },
    {
      layout: "screenshot",
      tag: "FEATURE 06  |  PRODUCTIVITY",
      title: "Study Planner & Offline Audio Timer",
      subtitle: "Generates time-blocked schedules and plays calming focus sounds offline.",
      img: "/slide6.jpg",
      cards: [
        { title: "① Smart Time-Blocker", desc: "Builds 50-min study blocks with 10-min rest breaks based on energy.", color: "#00f0ff" },
        { title: "② Offline Soundscapes", desc: "Synthesizes Rain, Forest Wind, Lo-Fi Pad, or plays custom MP3 files.", color: "#00e676" },
        { title: "③ Task Recovery & Stats", desc: "Rebalance unfinished tasks guilt-free and track daily focus efficiency.", color: "#ffab00" }
      ],
      overlaySvg: `<svg viewBox="0 0 1280 720" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;">
        <rect x="160" y="128" width="470" height="310" rx="10" fill="none" stroke="#00f0ff" stroke-width="3"/>
        <circle cx="140" cy="200" r="15" fill="#00f0ff"/><text x="140" y="205" fill="#03050a" font-size="15" font-weight="900" text-anchor="middle">1</text>
        <rect x="645" y="128" width="475" height="310" rx="10" fill="none" stroke="#00e676" stroke-width="3"/>
        <circle cx="625" cy="200" r="15" fill="#00e676"/><text x="625" y="205" fill="#03050a" font-size="15" font-weight="900" text-anchor="middle">2</text>
        <rect x="160" y="455" width="960" height="235" rx="10" fill="none" stroke="#ffab00" stroke-width="3"/>
        <circle cx="140" cy="540" r="15" fill="#ffab00"/><text x="140" y="545" fill="#03050a" font-size="15" font-weight="900" text-anchor="middle">3</text>
      </svg>`
    },
    {
      layout: "screenshot",
      tag: "FEATURE 07  |  WELL-BEING",
      title: "Student Life & Habit Journal",
      subtitle: "Log school hours, self-study, sleep, and hobbies with visual trend charts.",
      img: "/slide7.jpg",
      cards: [
        { title: "① Weekly Rollups", desc: "See total self-study hours, school hours, questions solved, and sleep.", color: "#00f0ff" },
        { title: "② Dual-Study Logger", desc: "Log topics, energy, hydration, custom metrics, and creative hobbies.", color: "#00e676" },
        { title: "③ Trend Chart & Calendar", desc: "Compare actual study hours against your goal across a 14-day calendar.", color: "#ffab00" }
      ],
      overlaySvg: `<svg viewBox="0 0 1280 720" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;">
        <rect x="160" y="74" width="960" height="108" rx="10" fill="none" stroke="#00f0ff" stroke-width="3"/>
        <circle cx="140" cy="128" r="15" fill="#00f0ff"/><text x="140" y="133" fill="#03050a" font-size="15" font-weight="900" text-anchor="middle">1</text>
        <rect x="160" y="192" width="470" height="500" rx="10" fill="none" stroke="#00e676" stroke-width="3"/>
        <circle cx="140" cy="300" r="15" fill="#00e676"/><text x="140" y="305" fill="#03050a" font-size="15" font-weight="900" text-anchor="middle">2</text>
        <rect x="645" y="192" width="475" height="500" rx="10" fill="none" stroke="#ffab00" stroke-width="3"/>
        <circle cx="625" cy="300" r="15" fill="#ffab00"/><text x="625" y="305" fill="#03050a" font-size="15" font-weight="900" text-anchor="middle">3</text>
      </svg>`
    },
    {
      layout: "screenshot",
      tag: "FEATURE 08  |  PERSONALIZATION",
      title: "UI & Logo Customizer",
      subtitle: "Customize logos, dark/light mode, neon colors, and custom wallpapers.",
      img: "/slide8.jpg",
      imgFit: "contain",
      cards: [
        { title: "① 3 Logo Variations", desc: "Switch between Slash, Inflection Curve, and Vector Bracket logos.", color: "#00f0ff" },
        { title: "② Theme & Neon Accents", desc: "Toggle Cyber Glass Dark or Daylight Paper with 4 neon color presets.", color: "#00e676" },
        { title: "③ Custom Wallpaper URL", desc: "Pick Grid, Nebula, or paste any custom image URL privately.", color: "#ffab00" }
      ],
      overlaySvg: `<svg viewBox="0 0 1280 720" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;">
        <rect x="405" y="110" width="470" height="145" rx="10" fill="none" stroke="#00f0ff" stroke-width="3"/>
        <circle cx="380" cy="182" r="16" fill="#00f0ff"/><text x="380" y="188" fill="#03050a" font-size="16" font-weight="900" text-anchor="middle">1</text>
        <rect x="405" y="275" width="470" height="205" rx="10" fill="none" stroke="#00e676" stroke-width="3"/>
        <circle cx="380" cy="375" r="16" fill="#00e676"/><text x="380" y="381" fill="#03050a" font-size="16" font-weight="900" text-anchor="middle">2</text>
        <rect x="405" y="565" width="470" height="135" rx="10" fill="none" stroke="#ffab00" stroke-width="3"/>
        <circle cx="380" cy="632" r="16" fill="#ffab00"/><text x="380" y="638" fill="#03050a" font-size="16" font-weight="900" text-anchor="middle">3</text>
      </svg>`
    },
    {
      layout: "screenshot",
      tag: "FEATURE 09  |  PRIVACY & BACKUP",
      title: "Zero-Email Profiles & JSON Backup",
      subtitle: "Private browser profiles with 1-click portable JSON file backups.",
      img: "/slide9.jpg",
      imgFit: "contain",
      cards: [
        { title: "① 1-Click JSON Backup", desc: "Export your profile as a .JSON file and import it on any computer.", color: "#00f0ff" },
        { title: "② Multi-Profile Switcher", desc: "Create and switch between multiple student profiles on one device.", color: "#00e676" },
        { title: "③ No Email or Password", desc: "Type just Name and Class—keeps data private on your own browser.", color: "#ffab00" }
      ],
      overlaySvg: `<svg viewBox="0 0 1280 720" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;">
        <rect x="255" y="252" width="710" height="105" rx="10" fill="none" stroke="#00f0ff" stroke-width="3"/>
        <circle cx="230" cy="304" r="16" fill="#00f0ff"/><text x="230" y="310" fill="#03050a" font-size="16" font-weight="900" text-anchor="middle">1</text>
        <rect x="255" y="385" width="770" height="90" rx="10" fill="none" stroke="#00e676" stroke-width="3"/>
        <circle cx="230" cy="430" r="16" fill="#00e676"/><text x="230" y="436" fill="#03050a" font-size="16" font-weight="900" text-anchor="middle">2</text>
        <rect x="255" y="495" width="770" height="190" rx="10" fill="none" stroke="#ffab00" stroke-width="3"/>
        <circle cx="230" cy="590" r="16" fill="#ffab00"/><text x="230" y="596" fill="#03050a" font-size="16" font-weight="900" text-anchor="middle">3</text>
      </svg>`
    },
    {
      layout: "text-grid",
      tag: "ARCHITECTURE  |  HOW IT'S BUILT",
      title: "Technology Stack & Engineering",
      subtitle: "Built with lightweight, fast web technologies and deployed on the cloud.",
      cards: [
        {
          title: "Frontend (HTML5, CSS3, JS)",
          desc: "Pure Vanilla JavaScript and HTML5 Canvas for 60fps physics simulations with zero heavy framework lag.",
          color: "#00f0ff"
        },
        {
          title: "Backend (Node.js & Express)",
          desc: "Powered by server.js—serves static assets, chapter REST APIs, and auto-generates /sitemap.xml for Google.",
          color: "#c4b5fd"
        },
        {
          title: "Data (JSON + localStorage)",
          desc: "29 structured JSON chapter files on the server + isolated browser localStorage with JSON file export/import.",
          color: "#00e676"
        },
        {
          title: "MathJax 3 & Web Audio API",
          desc: "Renders textbook LaTeX equations cleanly and synthesizes offline Rain, Wind, and Lo-Fi audio in the browser.",
          color: "#ffab00"
        }
      ]
    },
    {
      layout: "text-grid",
      tag: "SUMMARY  |  IMPACT & ROADMAP",
      title: "Advantages, Limitations & Future Scope",
      subtitle: "Complete overview of platform strengths, current boundaries, and upcoming features.",
      cards: [
        {
          title: "✅ Key Advantages",
          desc: "• Visualizes math & physics live\n• Starts from Ch 00 Basic Maths\n• All tools in 1 tab (No app switching)\n• 100% free & no login walls",
          color: "#00e676"
        },
        {
          title: "⚡ Smart Learning Features",
          desc: "• Non-repeating adaptive test pool\n• Auto spaced-repetition queue\n• Side-by-side rough whiteboard\n• 100% offline focus soundscapes",
          color: "#00f0ff"
        },
        {
          title: "⚠️ Current Limitations",
          desc: "• Profiles save locally inside each device's browser for privacy, so moving to a new computer requires exporting a JSON Backup file.",
          color: "#ffab00"
        },
        {
          title: "🚀 Future Scope",
          desc: "• Add Chemistry & 3D Maths labs\n• Teacher classroom test-sharing codes\n• Installable offline mobile app (PWA)",
          color: "#c4b5fd"
        }
      ]
    }
  ],

  async init() {
    if (!document.getElementById('dxdy-ppt-anim-styles')) {
      const style = document.createElement('style');
      style.id = 'dxdy-ppt-anim-styles';
      style.textContent = `
        @keyframes pptSlideNext {
          0% { opacity: 0; transform: translateX(34px) scale(0.98); }
          100% { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes pptSlidePrev {
          0% { opacity: 0; transform: translateX(-34px) scale(0.98); }
          100% { opacity: 1; transform: translateX(0) scale(1); }
        }
        .ppt-anim-next { animation: pptSlideNext 0.34s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .ppt-anim-prev { animation: pptSlidePrev 0.34s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .ppt-click-zone {
          position: absolute; top: 0; bottom: 0; width: 16%; z-index: 8;
          display: flex; align-items: center; opacity: 0; transition: opacity 0.2s ease;
          cursor: pointer; user-select: none;
        }
        .ppt-click-zone:hover { opacity: 1; }
        .ppt-click-pill {
          padding: 7px 12px; border-radius: 99px; background: rgba(3, 5, 10, 0.88);
          border: 1px solid var(--accent); color: var(--accent); font-size: 0.76rem;
          font-weight: 700; box-shadow: 0 0 15px rgba(0, 240, 255, 0.25);
        }
        .ppt-feature-card {
          padding: 12px 15px; border-radius: 10px; background: #0e1526;
          border: 1px solid #243454; transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .ppt-feature-card:hover {
          transform: translateY(-2px); border-color: var(--accent);
        }
      `;
      document.head.appendChild(style);
    }

    // Load strictly from this device's browser storage
    try {
      const saved = localStorage.getItem('phiziks_state');
      this.state = saved ? JSON.parse(saved) : this.getDefaultClientState();
    } catch (e) {
      this.state = this.getDefaultClientState();
    }

    if (!this.state.profile) this.state.profile = this.getDefaultClientState().profile;
    if (!this.state.theme) this.state.theme = this.getDefaultClientState().theme;
    if (!this.state.progress) this.state.progress = {};
    if (!this.state.revisionQueue) this.state.revisionQueue = {};
    if (!this.state.lastVisited) this.state.lastVisited = { chapterId: "ch00_basic_maths", topicId: null, updatedAt: new Date().toISOString() };
    if (!this.state.seenQuestions) this.state.seenQuestions = [];
    if (!this.state.notes) this.state.notes = {};
    if (!this.state.tasks) this.state.tasks = this.getDefaultClientState().tasks;
    if (!this.state.distractionLogs) this.state.distractionLogs = this.getDefaultClientState().distractionLogs;
    if (!this.state.journalEntries) this.state.journalEntries = [];
    if (!this.state.customActivities) this.state.customActivities = ["Drawing", "Hip-Hop Dance", "Guitar Practice", "Martial Arts / Sports"];
    if (!this.state.customMetrics) this.state.customMetrics = ["Concept Clarity (1-10)", "Mock Test Accuracy (%)"];
    if (!this.state.testHistory) this.state.testHistory = [];

    this.saveState();

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
      inactivity: { inactiveDays: 0, daysUntilDeletion: 90, warningActive: false },
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
    this.state.lastActiveAt = new Date().toISOString();
    try {
      const map = JSON.parse(localStorage.getItem('phiziks_profiles_map') || '{}');
      const pid = this.state.activeProfileId || this.state.id || 'prof_default';
      this.state.id = pid;
      this.state.activeProfileId = pid;
      map[pid] = this.state;
      localStorage.setItem('phiziks_profiles_map', JSON.stringify(map));
      this.state.profilesSummary = Object.values(map).map(s => ({
        id: s.activeProfileId || s.id || 'prof_default',
        studentName: s.profile?.studentName || 'Scholar',
        currentClass: s.profile?.currentClass || 'Class 11',
        targetExam: s.profile?.targetExam || 'JEE Main & Advanced'
      }));
      localStorage.setItem('phiziks_state', JSON.stringify(this.state));
    } catch (e) {}
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
      document.documentElement.style.setProperty('--pointer-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--pointer-y', `${e.clientY}px`);
    }, { passive: true });

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

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
      const pptModal = document.getElementById('exhibition-ppt-modal');
      const pptOpen = pptModal && !pptModal.classList.contains('hidden');

      if (pptOpen && e.key === 'ArrowRight') {
        e.preventDefault();
        this.nextPPTSlide();
        return;
      }
      if (pptOpen && e.key === 'ArrowLeft') {
        e.preventDefault();
        this.prevPPTSlide();
        return;
      }

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

      document.querySelectorAll('[data-parallax]').forEach(el => {
        const speed = parseFloat(el.dataset.parallax || 0.15);
        const rot = parseFloat(el.dataset.parallaxRot || 0);
        const rect = el.parentElement.getBoundingClientRect();
        const offset = (window.innerHeight * 0.5 - rect.top) * speed;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0) rotate(${(offset * rot).toFixed(2)}deg)`;
      });

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
        document.querySelectorAll('.sb-riemann-bar').forEach((bar, bi) => {
          const threshold = bi / 10;
          const barScale = Math.min(1, Math.max(0.05, (bProg - threshold * 0.6) * 2.2));
          bar.style.transform = `scaleY(${barScale.toFixed(2)})`;
        });
      }

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

        <!-- SCENE A — CINEMATIC OPENING HERO -->
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

        <div class="scene-conduit" aria-hidden="true"><div class="scene-conduit-line"></div></div>

        <!-- SCENE B — SCROLL-DRAWING CALCULUS & VECTOR MORPH LABORATORY -->
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

          <div class="scroll-draw-lab-grid">
            <div class="scroll-draw-svg-stage">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:6px;">
                <span class="badge" style="color:var(--accent);">SCROLL-SCRUBBED MANIFOLD</span>
                <span id="sb-live-readout" style="font-family:var(--font-mono);font-size:0.76rem;color:var(--success);">x = 2.00 m  |  dy/dx = +0.42  |  ∫y dx = 9.2 J</span>
              </div>
              <svg id="scene-b-draw-svg" viewBox="0 0 480 210" style="width:100%;height:auto;">
                <line x1="40" y1="165" x2="450" y2="165" stroke="#475569" stroke-width="2"/>
                <line x1="50" y1="20" x2="50" y2="185" stroke="#475569" stroke-width="2"/>
                <g fill="rgba(0, 230, 118, 0.18)" stroke="rgba(0, 230, 118, 0.45)" stroke-width="1">
                  ${Array.from({ length: 10 }, (_, i) => {
                    const bx = 55 + i * 36;
                    const bh = Math.round(35 + Math.sin((i / 9) * Math.PI) * 85);
                    return `<rect class="sb-riemann-bar" x="${bx}" y="${165 - bh}" width="28" height="${bh}" style="transform-origin: ${bx}px 165px;" />`;
                  }).join('')}
                </g>
                <path id="sb-calc-curve" d="M 50 155 Q 150 20 260 110 T 435 65" fill="none" stroke="#00f0ff" stroke-width="3.5" stroke-linecap="round"/>
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

        <div class="scene-conduit" aria-hidden="true"><div class="scene-conduit-line"></div></div>

        <!-- SCENE C — SCROLL-PINNED INTERACTIVE SIMULATIONS -->
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

        <div class="scene-conduit" aria-hidden="true"><div class="scene-conduit-line"></div></div>

        <!-- SCENE D — LEARNING, SOLVED EXAMPLES & ADAPTIVE PRACTICE -->
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

        <div class="scene-conduit" aria-hidden="true"><div class="scene-conduit-line"></div></div>

        <!-- SCENE E — VERTICAL-SCROLL-DRIVEN HORIZONTAL WORKSPACE SHOWCASE -->
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

        <div class="scene-conduit" aria-hidden="true"><div class="scene-conduit-line"></div></div>

        <!-- SCENE F — FINAL CALL TO ACTION LAUNCHPAD -->
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

      <div class="stat-card" style="margin-bottom:20px;">
        <h2 style="color:var(--accent);margin-bottom:10px;">1. Intuitive Introduction (First-Time Reader Foundation)</h2>
        <div class="topic-theory">${ch.introduction || ''}</div>
      </div>

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

      <div class="stat-card" style="margin-bottom:20px;">
        <h2 style="color:var(--accent);margin-bottom:10px;">3. Chapter Conclusion & Executive Revision Summary</h2>
        <div>${ch.conclusion || ''}</div>
        <div style="margin-top:10px;">${ch.summary || ''}</div>
      </div>

      <div id="ch-formula-sheet" class="stat-card" style="margin-bottom:20px;">
        <h2 style="color:var(--accent);margin-bottom:10px;">4. Master Formula & Revision Sheet</h2>
        <div>${ch.formulaSheetHtml || ''}</div>
      </div>

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
            <strong>Device-Private Storage & Backup:</strong> Your profile, notes, and wallpaper save privately inside this browser with no email or password needed. Download a JSON Backup below anytime to carry your data to another device.
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
    try {
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
    } catch (e) {}
  },

  async deleteProfile(profileId) {
    if (!confirm('Permanently delete this profile and all its study plans, journal entries, and progress?')) return;
    try {
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
    } catch (e) {}
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
        const importedState = parsed.profileData || parsed;
        if (!importedState || !importedState.profile) throw new Error('Invalid backup');
        this.state = importedState;
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
  // INTERACTIVE PLATFORM GUIDE CONTROLLER (CLEAN CARDS + PURE TEXT + SCREENSHOTS)
  // =========================================================================
  openExhibitionPPT() {
    this.pptIndex = 0;
    this.pptDirection = 'next';
    document.getElementById('exhibition-ppt-modal').classList.remove('hidden');
    this.renderPPTSlide();
  },

  closeExhibitionPPT() {
    document.getElementById('exhibition-ppt-modal').classList.add('hidden');
  },

  nextPPTSlide() {
    this.pptDirection = 'next';
    this.pptIndex = (this.pptIndex + 1) % this.pptSlides.length;
    this.renderPPTSlide();
  },

  prevPPTSlide() {
    this.pptDirection = 'prev';
    this.pptIndex = (this.pptIndex - 1 + this.pptSlides.length) % this.pptSlides.length;
    this.renderPPTSlide();
  },

  renderPPTSlide() {
    const slide = this.pptSlides[this.pptIndex];
    const animClass = this.pptDirection === 'prev' ? 'ppt-anim-prev' : 'ppt-anim-next';
    document.getElementById('ppt-slide-indicator').textContent =
      `📊 dx/dy PLATFORM GUIDE  •  PAGE ${this.pptIndex + 1} / ${this.pptSlides.length}`;

    const container = document.getElementById('ppt-slide-container');

    const dotsHtml = `
      <div style="margin-top:16px;display:flex;justify-content:space-between;align-items:center;position:relative;z-index:12;padding-top:10px;border-top:1px solid rgba(148,163,184,0.14);">
        <span style="font-size:0.74rem;color:var(--text-secondary);">💡 Click Left / Right edges or press ⬅ / ➡ arrow keys</span>
        <div style="display:flex;gap:7px;align-items:center;">
          ${this.pptSlides.map((_, idx) => `
            <span style="width:${idx===this.pptIndex?'22px':'9px'};height:9px;border-radius:99px;background:${idx===this.pptIndex?'var(--accent)':'#475569'};display:inline-block;cursor:pointer;transition:all 0.25s ease;"
                  onclick="event.stopPropagation();PHIZIKS.pptDirection=${idx > this.pptIndex ? "'next'" : "'prev'"};PHIZIKS.pptIndex=${idx};PHIZIKS.renderPPTSlide();"
                  title="Page ${idx + 1}"></span>
          `).join('')}
        </div>
        <span style="font-size:0.76rem;font-weight:700;color:var(--text-secondary);">Page ${this.pptIndex + 1} / ${this.pptSlides.length}</span>
      </div>
    `;

    // Pure-Text 4-Card Grid Layout (For Intro, Tech Stack, and Advantages/Limitations)
    if (slide.layout === 'text-grid') {
      container.innerHTML = `
        <div class="${animClass}" style="position:relative;width:100%;grid-column:1 / -1;">
          <div class="ppt-click-zone" style="left:0;justify-content:flex-start;padding-left:8px;" onclick="PHIZIKS.prevPPTSlide()">
            <span class="ppt-click-pill">⬅ Prev</span>
          </div>
          <div class="ppt-click-zone" style="right:0;justify-content:flex-end;padding-right:8px;" onclick="PHIZIKS.nextPPTSlide()">
            <span class="ppt-click-pill">Next ➡</span>
          </div>

          <div style="margin-bottom:16px;">
            <div style="font-family:var(--font-mono);font-size:0.76rem;font-weight:800;color:var(--accent);letter-spacing:0.06em;margin-bottom:4px;">${slide.tag}</div>
            <h2 style="font-size:1.75rem;font-weight:900;margin-bottom:4px;">${slide.title}</h2>
            <p style="color:var(--text-secondary);font-size:0.9rem;">${slide.subtitle}</p>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;position:relative;z-index:9;">
            ${slide.cards.map(c => `
              <div class="ppt-feature-card" style="border-top:3px solid ${c.color};">
                <div style="font-size:1.02rem;font-weight:800;color:${c.color};margin-bottom:6px;">${c.title}</div>
                <div style="font-size:0.86rem;color:var(--text-primary);line-height:1.5;white-space:pre-line;">${c.desc}</div>
              </div>
            `).join('')}
          </div>

          ${dotsHtml}
        </div>
      `;
      return;
    }

    // Screenshot + 3 Clean Feature Cards Layout
    const fitMode = slide.imgFit || 'cover';
    container.innerHTML = `
      <div class="${animClass}" style="position:relative;width:100%;grid-column:1 / -1;">
        <div class="ppt-click-zone" style="left:0;justify-content:flex-start;padding-left:8px;" onclick="PHIZIKS.prevPPTSlide()">
          <span class="ppt-click-pill">⬅ Prev</span>
        </div>
        <div class="ppt-click-zone" style="right:0;justify-content:flex-end;padding-right:8px;" onclick="PHIZIKS.nextPPTSlide()">
          <span class="ppt-click-pill">Next ➡</span>
        </div>

        <div style="margin-bottom:14px;">
          <div style="font-family:var(--font-mono);font-size:0.75rem;font-weight:800;color:var(--accent);letter-spacing:0.06em;margin-bottom:3px;">${slide.tag}</div>
          <h2 style="font-size:1.6rem;font-weight:900;margin-bottom:2px;">${slide.title}</h2>
          <p style="color:var(--text-secondary);font-size:0.86rem;">${slide.subtitle}</p>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1.45fr;gap:18px;align-items:center;position:relative;z-index:9;">
          <!-- Left: 3 Short Feature Cards -->
          <div style="display:grid;gap:11px;">
            ${(slide.cards || []).map(c => `
              <div class="ppt-feature-card" style="border-left:3px solid ${c.color};">
                <div style="font-size:0.95rem;font-weight:800;color:${c.color};margin-bottom:3px;">${c.title}</div>
                <div style="font-size:0.83rem;color:var(--text-primary);line-height:1.4;">${c.desc}</div>
              </div>
            `).join('')}
          </div>

          <!-- Right: Framed Screenshot + Callouts -->
          <div style="padding:8px;background:#060a16;border:2px solid rgba(0,240,255,0.4);border-radius:12px;">
            <div style="position:relative;width:100%;aspect-ratio:16/9;border-radius:8px;overflow:hidden;background:#03050a;">
              <img src="${slide.img}" alt="${slide.title}"
                   style="width:100%;height:100%;object-fit:${fitMode};display:block;"
                   onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
              <div style="display:none;position:absolute;inset:0;flex-direction:column;align-items:center;justify-content:center;padding:20px;text-align:center;background:#080d1a;">
                <div style="font-family:var(--font-mono);font-size:1.15rem;font-weight:800;color:var(--accent);margin-bottom:6px;">${slide.title}</div>
                <p style="font-size:0.78rem;color:var(--text-secondary);">Screenshot <code>public${slide.img}</code></p>
              </div>
              ${slide.overlaySvg || ''}
            </div>
          </div>
        </div>

        ${dotsHtml}
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
        wp.classList.add('wp-custom');
        document.documentElement.style.setProperty('--custom-wallpaper', `url('${t.wallpaperUrl}')`);
        wp.style.backgroundImage = `url('${t.wallpaperUrl}')`;
        wp.style.backgroundSize = 'cover';
        wp.style.backgroundPosition = 'center';
      } else {
        document.documentElement.style.setProperty('--custom-wallpaper', 'none');
        wp.style.backgroundImage = '';
      }
    }

    const urlInp = document.getElementById('gx-wallpaper-url');
    if (urlInp && t.wallpaperUrl !== undefined) {
      urlInp.value = t.wallpaperUrl;
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
    if (type === 'custom') {
      this.state.theme.wallpaperUrl = url || '';
    } else {
      this.state.theme.wallpaperUrl = '';
    }
    this.applyTheme();
    this.saveState();
  }
};

window.addEventListener('DOMContentLoaded', () => PHIZIKS.init());
