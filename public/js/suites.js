window.PHIZIKS_SUITES = {
  // Active Quiz State
  quiz: {
    active: false,
    questions: [],
    answers: {},
    timeLeft: 0,
    timerId: null,
    submitted: false
  },

  // Pomodoro & Persistent Multi-Channel Audio Engine State
  pomo: {
    workMins: 50,
    restMins: 10,
    secondsLeft: 3000,
    running: false,
    mode: 'WORK',
    timerId: null,
    audioCtx: null,
    activeNodes: [],
    masterGain: null,
    ambientType: 'none', // 'none' | 'white' | 'rain' | 'nature' | 'lofi' | 'custom'
    audioPlaying: false,
    volume: 0.65,
    customFileUrl: null,
    customFileName: '',
    audioStatusText: 'Audio idle — select a soundscape or upload an audio file.'
  },

  // Journal Filter, Edit & Autosave State
  journalState: {
    editingId: null,
    searchQuery: '',
    filterActivity: 'ALL',
    selectedDateFilter: null,
    summaryPeriod: 'weekly', // 'daily' | 'weekly' | 'monthly'
    autosaveTimer: null
  },

  // Expanded 16-Question Built-in Seed Pool (Merges with all 29 chapter JSON question banks)
  seedQuestionBank: [
    {
      id: "q_bm_01", chapterId: "ch00_basic_maths", category: "Basic", difficulty: "Basic Foundation",
      prompt: "If the displacement of a particle is given by $x(t) = 3t^3 - 6t^2 + 4t + 5$ meters, find the instantaneous acceleration at $t = 2\\text{ s}$.",
      options: ["12 m/s²", "24 m/s²", "36 m/s²", "18 m/s²"],
      answer: "24 m/s²",
      explanation: "Velocity $v = \\frac{dx}{dt} = 9t^2 - 12t + 4$. Acceleration $a = \\frac{dv}{dt} = 18t - 12$. At $t = 2\\text{ s}$, $a = 18(2) - 12 = 24\\text{ m/s}^2$. <strong>JEE Trap:</strong> Do not substitute $t=2$ before differentiating!"
    },
    {
      id: "q_bm_02", chapterId: "ch00_basic_maths", category: "Repeated PYQ", difficulty: "JEE Main / PYQ-Pattern",
      prompt: "Find the maximum value of the function $f(\\theta) = 3\\sin\\theta + 4\\cos\\theta + 7$.",
      options: ["12", "14", "5", "7"],
      answer: "12",
      explanation: "The maximum value of $a\\sin\\theta + b\\cos\\theta$ is $\\sqrt{a^2 + b^2} = \\sqrt{3^2 + 4^2} = 5$. Adding the constant $7$ gives $5 + 7 = 12$."
    },
    {
      id: "q_bm_03", chapterId: "ch00_basic_maths", category: "Advanced", difficulty: "JEE Advanced",
      prompt: "A variable force $F(x) = (4x e^{-x^2})\\text{ N}$ acts on a particle along the x-axis from $x = 0$ to $x = \\infty$. The total work done $W = \\int_0^\\infty F(x)\\,dx$ is:",
      options: ["1 J", "2 J", "4 J", "0.5 J"],
      answer: "2 J",
      explanation: "Use substitution $u = x^2 \\Rightarrow du = 2x\\,dx$. Then $\\int_0^\\infty 4x e^{-x^2}dx = 2\\int_0^\\infty e^{-u}du = 2[-e^{-u}]_0^\\infty = 2(0 - (-1)) = 2\\text{ J}$."
    },
    {
      id: "q_unit_01", chapterId: "ch01_units_measurements", category: "Repeated PYQ", difficulty: "JEE Main / PYQ-Pattern",
      prompt: "If percentage errors in measuring mass $M$, length $L$, and time $T$ are $1\\%$, $2\\%$, and $3\\%$ respectively, the maximum percentage error in measuring kinetic energy $K = \\frac{1}{2}MV^2$ is:",
      options: ["8%", "11%", "10%", "6%"],
      answer: "11%",
      explanation: "Dimensions of kinetic energy are $[M L^2 T^{-2}]$. Maximum percentage error $\\frac{\\Delta K}{K}\\times 100 = 1(\\frac{\\Delta M}{M}) + 2(\\frac{\\Delta L}{L}) + 2(\\frac{\\Delta T}{T}) = 1(1\\%) + 2(2\\%) + 2(3\\%) = 11\\%$."
    },
    {
      id: "q_kin_01", chapterId: "ch02_motion_straight_line", category: "Repeated PYQ", difficulty: "JEE Main / PYQ-Pattern",
      prompt: "A ball is thrown vertically upward with speed $40\\text{ m/s}$ ($g = 10\\text{ m/s}^2$). What is the distance (not displacement) traveled during the 5th second of its motion?",
      options: ["0 m", "5 m", "10 m", "45 m"],
      answer: "5 m",
      explanation: "Time to reach highest point is $t = u/g = 40/10 = 4\\text{ s}$. Thus, during the 5th second (from $t=4\\text{ s}$ to $t=5\\text{ s}$), the ball falls from rest for $1\\text{ s}$: $d = \\frac{1}{2}g(1)^2 = 5\\text{ m}$."
    },
    {
      id: "q_kin_02", chapterId: "ch03_motion_plane", category: "Advanced", difficulty: "JEE Advanced",
      prompt: "A projectile is fired from ground with velocity $u$ at angle $\\theta$. At the instant its velocity vector makes an angle $\\theta/2$ with the horizontal, its speed is:",
      options: ["$u\\cos\\theta$", "$\\frac{u\\cos\\theta}{\\cos(\\theta/2)}$", "$u\\sin(\\theta/2)$", "$u\\cos(\\theta/2)$"],
      answer: "$\\frac{u\\cos\\theta}{\\cos(\\theta/2)}$",
      explanation: "Horizontal component of velocity remains invariant: $v \\cos(\\theta/2) = u \\cos\\theta \\Rightarrow v = \\frac{u\\cos\\theta}{\\cos(\\theta/2)}$."
    },
    {
      id: "q_nlm_01", chapterId: "ch04_laws_of_motion", category: "Basic", difficulty: "Basic Foundation",
      prompt: "Two blocks of masses $4\\text{ kg}$ and $6\\text{ kg}$ are connected by a massless string over a frictionless pulley (Atwood machine). The magnitude of acceleration of the system ($g = 10\\text{ m/s}^2$) is:",
      options: ["1 m/s²", "2 m/s²", "4 m/s²", "5 m/s²"],
      answer: "2 m/s²",
      explanation: "Net driving force is $(m_2 - m_1)g = (6 - 4)(10) = 20\\text{ N}$. Total mass $M = 6 + 4 = 10\\text{ kg}$. Acceleration $a = \\frac{20}{10} = 2\\text{ m/s}^2$."
    },
    {
      id: "q_wep_01", chapterId: "ch05_work_energy_power", category: "Repeated PYQ", difficulty: "JEE Main / PYQ-Pattern",
      prompt: "A particle of mass $m$ is tied to a light string of length $L$ and whirled in a vertical circle. What is the minimum speed required at the lowest point to complete the full vertical circle?",
      options: ["$\\sqrt{2gL}$", "$\\sqrt{3gL}$", "$\\sqrt{5gL}$", "$\\sqrt{gL}$"],
      answer: "$\\sqrt{5gL}$",
      explanation: "To just complete the vertical circle, tension at the top becomes zero ($v_{\\text{top}} = \\sqrt{gL}$). By Mechanical Energy Conservation between bottom and top: $\\frac{1}{2}mv_{\\text{bot}}^2 = \\frac{1}{2}m(gL) + mg(2L) \\Rightarrow v_{\\text{bot}} = \\sqrt{5gL}$."
    },
    {
      id: "q_rot_01", chapterId: "ch06_rotational_motion", category: "Repeated PYQ", difficulty: "JEE Main / PYQ-Pattern",
      prompt: "A solid sphere ($I = \\frac{2}{5}MR^2$) rolls purely without slipping down an incline of angle $\\theta$. Its linear acceleration down the incline is:",
      options: ["$\\frac{5}{7}g\\sin\\theta$", "$\\frac{2}{3}g\\sin\\theta$", "$\\frac{1}{2}g\\sin\\theta$", "$g\\sin\\theta$"],
      answer: "$\\frac{5}{7}g\\sin\\theta$",
      explanation: "For pure rolling on an incline, $a = \\frac{g\\sin\\theta}{1 + \\frac{I}{MR^2}}$. For a solid sphere, $\\frac{I}{MR^2} = \\frac{2}{5}$. Thus $a = \\frac{g\\sin\\theta}{1 + 2/5} = \\frac{5}{7}g\\sin\\theta$."
    },
    {
      id: "q_grav_01", chapterId: "ch07_gravitation", category: "Repeated PYQ", difficulty: "JEE Main / PYQ-Pattern",
      prompt: "At what height $h$ above the Earth's surface (radius $R$) is the acceleration due to gravity equal to that at a depth $d = R/2$ below the surface?",
      options: ["$R(\\sqrt{2}-1)$", "$R/2$", "$R/4$", "$R(\\sqrt{3}-1)$"],
      answer: "$R(\\sqrt{2}-1)$",
      explanation: "At depth $d = R/2$, $g' = g(1 - d/R) = g/2$. Outside at height $h$: $g' = \\frac{g}{(1 + h/R)^2} = \\frac{g}{2} \\Rightarrow 1 + h/R = \\sqrt{2} \\Rightarrow h = R(\\sqrt{2}-1)$."
    },
    {
      id: "q_therm_01", chapterId: "ch11_thermodynamics", category: "Basic", difficulty: "Basic Foundation",
      prompt: "A Carnot heat engine operates between a source at $600\\text{ K}$ and a sink at $300\\text{ K}$. Its thermal efficiency $\\eta$ is:",
      options: ["25%", "50%", "75%", "66.7%"],
      answer: "50%",
      explanation: "Carnot efficiency $\\eta = 1 - \\frac{T_{\\text{sink}}}{T_{\\text{source}}} = 1 - \\frac{300}{600} = 0.5 = 50\\%$."
    },
    {
      id: "q_shm_01", chapterId: "ch13_oscillations", category: "Advanced", difficulty: "JEE Advanced",
      prompt: "A particle executes SHM with amplitude $A$ and time period $T$. The minimum time taken by the particle to move from $x = A/2$ to $x = A$ is:",
      options: ["$T/12$", "$T/6$", "$T/8$", "$T/4$"],
      answer: "$T/6$",
      explanation: "Using the Phasor Circle: at $x = A/2$, phase is $\\pi/6$. At $x = A$, phase is $\\pi/2$. Phase difference $\\Delta\\phi = \\frac{\\pi}{2} - \\frac{\\pi}{6} = \\frac{\\pi}{3}$. Time $\\Delta t = \\frac{\\Delta\\phi}{2\\pi}T = \\frac{T}{6}$."
    },
    {
      id: "q_elec_01", chapterId: "ch15_electric_charges_fields", category: "Repeated PYQ", difficulty: "JEE Main / PYQ-Pattern",
      prompt: "A charge $Q$ is placed at the center of a cube of side $a$. The electric flux emerging through any one face of the cube is:",
      options: ["$\\frac{Q}{\\varepsilon_0}$", "$\\frac{Q}{6\\varepsilon_0}$", "$\\frac{Q}{4\\varepsilon_0}$", "$\\frac{Q}{8\\varepsilon_0}$"],
      answer: "$\\frac{Q}{6\\varepsilon_0}$",
      explanation: "By Gauss's Law, total flux through all 6 symmetrical faces is $\\Phi_{\\text{total}} = \\frac{Q}{\\varepsilon_0}$. Flux through one face is $\\frac{1}{6}\\Phi_{\\text{total}} = \\frac{Q}{6\\varepsilon_0}$."
    },
    {
      id: "q_cap_01", chapterId: "ch16_electrostatic_potential_capacitance", category: "Basic", difficulty: "Basic Foundation",
      prompt: "An air-filled parallel plate capacitor has capacitance $10\\text{ }\\mu\\text{F}$. When the space between plates is completely filled with a dielectric of constant $K = 4$, the new capacitance becomes:",
      options: ["2.5 μF", "14 μF", "40 μF", "160 μF"],
      answer: "40 μF",
      explanation: "Inserting a dielectric slab filling the space multiplies capacitance by $K$: $C' = K C_0 = 4 \\times 10\\text{ }\\mu\\text{F} = 40\\text{ }\\mu\\text{F}$."
    },
    {
      id: "q_opt_01", chapterId: "ch22_ray_optics", category: "Repeated PYQ", difficulty: "JEE Main / PYQ-Pattern",
      prompt: "An equiconvex lens of glass ($\\mu_g = 1.5$) has focal length $20\\text{ cm}$ in air. When completely immersed in water ($\\mu_w = 4/3$), its new focal length is:",
      options: ["80 cm", "40 cm", "-80 cm", "60 cm"],
      answer: "80 cm",
      explanation: "In air: $\\frac{1}{f_a} = (1.5 - 1)(\\frac{2}{R}) = \\frac{1}{R}$. In water: $\\frac{1}{f_w} = (\\frac{1.5}{4/3} - 1)(\\frac{2}{R}) = \\frac{1}{8}(\\frac{2}{R})$. Dividing gives $f_w = 4 f_a = 80\\text{ cm}$."
    },
    {
      id: "q_mod_01", chapterId: "ch24_dual_nature", category: "Basic", difficulty: "Basic Foundation",
      prompt: "In a photoelectric experiment, if the incident light frequency is doubled (above threshold frequency $\\nu_0$), the maximum kinetic energy of emitted photoelectrons becomes:",
      options: ["Exactly doubled", "More than doubled", "Less than doubled", "Remains unchanged"],
      answer: "More than doubled",
      explanation: "By Einstein's Photoelectric Equation, $K_{\\max} = h\\nu - \\phi_0$. When $\\nu \\to 2\\nu$, $K'_{\\max} = 2h\\nu - \\phi_0 = 2(h\\nu - \\phi_0) + \\phi_0 = 2K_{\\max} + \\phi_0 > 2K_{\\max}$."
    }
  ],

  init() {
    this.ensurePersistentAudioElement();
    this.renderDPPGenerator();
    this.renderRegainSuite();
    this.renderJournalSuite();
  },

  ensurePersistentAudioElement() {
    let audioEl = document.getElementById('custom-pomo-audio');
    if (!audioEl) {
      audioEl = document.createElement('audio');
      audioEl.id = 'custom-pomo-audio';
      audioEl.loop = true;
      audioEl.style.display = 'none';
      document.body.appendChild(audioEl);
    }
    audioEl.volume = this.pomo.volume;
    return audioEl;
  },

  // =========================================================================
  // MODULE 1: ADAPTIVE TEST & NON-REPEATING DPP GENERATOR
  // =========================================================================
  renderDPPGenerator() {
    const container = document.getElementById('dpp-content');
    if (!container) return;

    const seenCount = (PHIZIKS.state.seenQuestions || []).length;
    const history = PHIZIKS.state.testHistory || [];

    container.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:18px;">
        <div>
          <span class="badge" style="color:var(--accent);">dx/dy ADAPTIVE EVALUATION ENGINE</span>
          <h1 style="font-size:1.8rem;font-weight:900;margin-top:4px;">🎯 Adaptive Test & Non-Repeating DPP Suite</h1>
          <p style="color:var(--text-secondary);font-size:0.9rem;">Minimizes accidental question repetition using profile history, provides worked step-by-step LaTeX solutions, and queues missed concepts for spaced-repetition review.</p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <span class="badge" style="color:var(--success);">Unique Questions Attempted: ${seenCount}</span>
          <button class="tool-btn" onclick="PHIZIKS_SUITES.resetSeenQuestions()">🔄 Reset Seen Pool</button>
          <button class="tool-btn" onclick="PHIZIKS.toggleWhiteboard()">✏️ Whiteboard</button>
          <button class="tool-btn" onclick="PHIZIKS.togglePanel('calc-panel')">🧮 Calculator</button>
        </div>
      </div>

      <div class="stat-card" style="margin-bottom:20px;">
        <h3 style="color:var(--accent);margin-bottom:12px;">⚙️ Configure Custom Adaptive Test / DPP</h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;">
          <div>
            <label style="font-size:0.8rem;color:var(--text-secondary);">Target Chapter</label>
            <select id="dpp-chapter" class="global-search-input" style="margin-top:4px;">
              <option value="ALL">All Chapters (Mixed Pool)</option>
              ${PHIZIKS.syllabus.map(c => `<option value="${c.id}">Ch ${c.num}: ${c.title}</option>`).join('')}
            </select>
          </div>
          <div>
            <label style="font-size:0.8rem;color:var(--text-secondary);">Difficulty Tier</label>
            <select id="dpp-difficulty" class="global-search-input" style="margin-top:4px;">
              <option value="ALL">Adaptive Mix (All Tiers)</option>
              <option value="Basic">Basic Foundation</option>
              <option value="PYQ">JEE Main / PYQ-Pattern</option>
              <option value="Advanced">JEE Advanced</option>
            </select>
          </div>
          <div>
            <label style="font-size:0.8rem;color:var(--text-secondary);">Question Count</label>
            <select id="dpp-count" class="global-search-input" style="margin-top:4px;">
              <option value="5">5 Questions (Quick Sprint)</option>
              <option value="8" selected>8 Questions (Standard DPP)</option>
              <option value="15">15 Questions (Chapter Test)</option>
            </select>
          </div>
          <div>
            <label style="font-size:0.8rem;color:var(--text-secondary);">Time Limit (Minutes)</label>
            <input type="number" id="dpp-time" class="global-search-input" value="15" min="5" max="180" style="margin-top:4px;" />
          </div>
          <div style="display:flex;align-items:flex-end;">
            <button class="nav-btn btn-primary" style="width:100%;justify-content:center;" onclick="PHIZIKS_SUITES.generateDPP()">
              🚀 Start Adaptive Test
            </button>
          </div>
        </div>
      </div>

      <div id="dpp-active-arena">
        ${history.length > 0 ? `
          <div class="stat-card">
            <h3 style="color:var(--accent);margin-bottom:10px;">📊 Recent Test Performance History</h3>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px;">
              ${history.slice(0, 4).map(h => `
                <div style="padding:10px 12px;background:var(--bg-primary);border:1px solid var(--border-color);border-radius:6px;">
                  <div style="font-size:0.76rem;color:var(--text-secondary);">${h.date}</div>
                  <div style="font-size:1.2rem;font-weight:800;color:var(--accent);margin:4px 0;">Score: ${h.score} / ${h.maxScore}</div>
                  <div style="font-size:0.78rem;">✔ ${h.correct} Correct  •  ✖ ${h.wrong} Wrong</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  },

  async generateDPP(forcedChapter = null) {
    const chFilter = forcedChapter || (document.getElementById('dpp-chapter') ? document.getElementById('dpp-chapter').value : 'ALL');
    const diffFilter = document.getElementById('dpp-difficulty') ? document.getElementById('dpp-difficulty').value : 'ALL';
    const qCount = document.getElementById('dpp-count') ? Number(document.getElementById('dpp-count').value) : 8;
    const timeMins = document.getElementById('dpp-time') ? Number(document.getElementById('dpp-time').value) : 15;

    let pool = [...this.seedQuestionBank];

    // Load target chapter JSONs in parallel so we have a rich pool
    const chaptersToLoad = chFilter === 'ALL'
      ? PHIZIKS.syllabus.slice(0, 12).map(c => c.id)
      : [chFilter, 'ch00_basic_maths', 'ch02_motion_straight_line', 'ch03_motion_plane', 'ch04_laws_of_motion'];

    const uniqueChs = [...new Set(chaptersToLoad)];
    await Promise.all(uniqueChs.map(async (cid) => {
      try {
        const res = await fetch(`/api/chapters/${cid}`);
        if (res.ok) {
          const chData = await res.json();
          if (chData.questions) {
            chData.questions.forEach((q, idx) => {
              const qid = q.id || `${cid}_q_${idx}`;
              if (!pool.some(existing => existing.id === qid)) {
                pool.push({
                  id: qid,
                  chapterId: cid,
                  category: q.category || 'PYQ-Pattern',
                  difficulty: q.difficulty || 'JEE Main / PYQ-Pattern',
                  prompt: q.prompt,
                  options: q.options || ["Option A", "Option B", "Option C", "Option D"],
                  answer: q.answer,
                  explanation: q.explanation
                });
              }
            });
          }
        }
      } catch (e) {}
    }));

    const matchesDifficulty = (q) => {
      if (diffFilter === 'ALL') return true;
      const needle = diffFilter.toLowerCase();
      const cat = (q.category || '').toLowerCase();
      const diff = (q.difficulty || '').toLowerCase();
      if (needle.includes('pyq')) return cat.includes('pyq') || diff.includes('pyq') || diff.includes('main');
      return cat.includes(needle) || diff.includes(needle);
    };

    // Tier 1: Exact Chapter + Exact Difficulty
    let tier1 = pool.filter(q => (chFilter === 'ALL' || q.chapterId === chFilter) && matchesDifficulty(q));
    // Tier 2: Exact Chapter (Any Difficulty) — if Tier 1 has fewer than qCount
    let tier2 = pool.filter(q => (chFilter === 'ALL' || q.chapterId === chFilter) && !tier1.includes(q));
    // Tier 3: Mixed Physics Pool matching Difficulty — if the single chapter has fewer than qCount total questions
    let tier3 = pool.filter(q => !tier1.includes(q) && !tier2.includes(q) && matchesDifficulty(q));
    // Tier 4: Remaining Master Pool so we ALWAYS reach the exact qCount requested (5, 8, or 15)
    let tier4 = pool.filter(q => !tier1.includes(q) && !tier2.includes(q) && !tier3.includes(q));

    const prioritizeUnseen = (list) => {
      const unseen = list.filter(q => !PHIZIKS.state.seenQuestions.includes(q.id));
      const seen = list.filter(q => PHIZIKS.state.seenQuestions.includes(q.id));
      return [...unseen, ...seen];
    };

    const combinedOrdered = [
      ...prioritizeUnseen(tier1),
      ...prioritizeUnseen(tier2),
      ...prioritizeUnseen(tier3),
      ...prioritizeUnseen(tier4)
    ];

    this.quiz.questions = combinedOrdered.slice(0, qCount);
    this.quiz.answers = {};
    this.quiz.submitted = false;
    this.quiz.timeLeft = timeMins * 60;

    if (this.quiz.timerId) clearInterval(this.quiz.timerId);
    this.quiz.timerId = setInterval(() => {
      if (this.quiz.timeLeft > 0 && !this.quiz.submitted) {
        this.quiz.timeLeft--;
        const tEl = document.getElementById('quiz-live-timer');
        if (tEl) {
          const m = Math.floor(this.quiz.timeLeft / 60);
          const s = String(this.quiz.timeLeft % 60).padStart(2, '0');
          tEl.textContent = `${m}:${s}`;
        }
      } else if (this.quiz.timeLeft === 0 && !this.quiz.submitted) {
        this.submitDPP();
      }
    }, 1000);

    this.renderActiveQuiz();
  },

  launchQuickQuiz(chapterId) {
    this.renderDPPGenerator();
    const sel = document.getElementById('dpp-chapter');
    if (sel) sel.value = chapterId;
    this.generateDPP(chapterId);
  },

  selectOption(qIndex, optIndex) {
    if (this.quiz.submitted) return;
    const q = this.quiz.questions[qIndex];
    if (!q || !q.options) return;
    this.quiz.answers[qIndex] = q.options[optIndex];
    this.renderActiveQuiz();
  },

  submitDPP() {
    this.quiz.submitted = true;
    if (this.quiz.timerId) clearInterval(this.quiz.timerId);

    let score = 0, correct = 0, wrong = 0;
    this.quiz.questions.forEach((q, i) => {
      if (!PHIZIKS.state.seenQuestions.includes(q.id)) {
        PHIZIKS.state.seenQuestions.push(q.id);
      }
      const ans = this.quiz.answers[i];
      if (ans !== undefined) {
        if (ans === q.answer) {
          score += 4;
          correct++;
        } else {
          score -= 1;
          wrong++;
          if (q.chapterId) {
            const chMeta = PHIZIKS.syllabus.find(c => c.id === q.chapterId);
            if (!PHIZIKS.state.revisionQueue) PHIZIKS.state.revisionQueue = {};
            PHIZIKS.state.revisionQueue[q.chapterId] = {
              chapterId: q.chapterId,
              title: chMeta ? `Ch ${chMeta.num}: ${chMeta.title} (Missed in Test)` : q.chapterId,
              stars: 2,
              nextReviewAt: new Date(Date.now() + 86400000).toISOString()
            };
          }
        }
      }
    });

    PHIZIKS.state.testHistory.unshift({
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      score,
      maxScore: this.quiz.questions.length * 4,
      correct,
      wrong
    });
    PHIZIKS.saveState();
    this.renderActiveQuiz();
  },

  resetSeenQuestions() {
    PHIZIKS.state.seenQuestions = [];
    PHIZIKS.saveState();
    this.renderDPPGenerator();
  },

  renderActiveQuiz() {
    const arena = document.getElementById('dpp-active-arena');
    if (!arena) return;

    const maxScore = this.quiz.questions.length * 4;
    let scoreSummaryHtml = '';
    if (this.quiz.submitted) {
      const latest = PHIZIKS.state.testHistory[0] || { score: 0, correct: 0, wrong: 0 };
      scoreSummaryHtml = `
        <div class="stat-card" style="margin-bottom:18px;border:2px solid var(--success);">
          <h2 style="color:var(--success);">🏆 Test Score Analysis: ${latest.score} / ${maxScore}</h2>
          <p style="margin-top:6px;">✔ Correct (+4): <strong>${latest.correct}</strong> | ✖ Incorrect (-1): <strong>${latest.wrong}</strong> | Unattempted (0): <strong>${this.quiz.questions.length - latest.correct - latest.wrong}</strong></p>
          ${latest.wrong > 0 ? `<p style="font-size:0.82rem;color:#c4b5fd;margin-top:4px;">🔁 Chapters with incorrect answers have been automatically added to your Spaced-Repetition Queue for review.</p>` : ''}
        </div>
      `;
    }

    arena.innerHTML = `
      ${scoreSummaryHtml}
      <div class="stat-card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;padding-bottom:10px;border-bottom:1px solid var(--border-color);flex-wrap:wrap;gap:8px;">
          <h3>📝 Active Question Set (${this.quiz.questions.length} Questions)</h3>
          <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
            <span class="badge" style="font-size:0.95rem;color:var(--warning);font-family:var(--font-mono);">⏱️ <span id="quiz-live-timer">${Math.floor(this.quiz.timeLeft/60)}:${String(this.quiz.timeLeft%60).padStart(2,'0')}</span></span>
            <button class="tool-btn" onclick="PHIZIKS.toggleWhiteboard()">✏️ Whiteboard</button>
            ${!this.quiz.submitted ? `<button class="nav-btn btn-primary" onclick="PHIZIKS_SUITES.submitDPP()">✔ Submit & View Solutions</button>` : ''}
          </div>
        </div>

        ${this.quiz.questions.map((q, idx) => {
          const picked = this.quiz.answers[idx];
          const chMeta = PHIZIKS.syllabus.find(c => c.id === q.chapterId);
          const chBadge = chMeta ? `Ch ${chMeta.num}` : '';
          const catLabel = (q.category && q.category.toLowerCase().includes('pyq'))
            ? 'PYQ-Pattern / High-Frequency Concept'
            : (q.category || 'Practice Question');
          return `
            <div style="padding:16px;background:var(--bg-primary);border:1px solid var(--border-color);border-radius:8px;margin-bottom:14px;">
              <div style="display:flex;justify-content:space-between;margin-bottom:8px;flex-wrap:wrap;gap:6px;">
                <span class="badge" style="color:var(--accent);">Question ${idx + 1} ${chBadge ? `• ${chBadge}` : ''} • ${catLabel}</span>
                <span class="badge">${q.difficulty || 'JEE'}</span>
              </div>
              <div style="font-size:1rem;font-weight:600;margin-bottom:12px;">${q.prompt}</div>
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px;">
                ${(q.options || []).map((opt, oi) => {
                  const isPicked = picked === opt;
                  let borderCol = isPicked ? 'var(--accent)' : 'var(--border-color)';
                  if (this.quiz.submitted) {
                    if (opt === q.answer) borderCol = 'var(--success)';
                    else if (isPicked && opt !== q.answer) borderCol = 'var(--danger)';
                  }
                  return `
                    <button
                      class="tool-btn"
                      style="justify-content:flex-start;padding:10px;border:2px solid ${borderCol};text-align:left;"
                      onclick="PHIZIKS_SUITES.selectOption(${idx}, ${oi})"
                    >
                      <strong>(${String.fromCharCode(65 + oi)})</strong>&nbsp; ${opt}
                    </button>
                  `;
                }).join('')}
              </div>

              ${this.quiz.submitted ? `
                <div style="margin-top:12px;padding:12px;background:var(--bg-secondary);border-left:4px solid var(--success);border-radius:6px;">
                  ${PHIZIKS.formatStepByStepExplanation(q)}
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;

    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([arena]);
    }
  },

  // =========================================================================
  // MODULE 2: STUDY PLANNER, RECOVERY & DEBUGGED FOCUS TIMER AUDIO ENGINE
  // =========================================================================
  renderRegainSuite() {
    const container = document.getElementById('regain-content');
    if (!container) return;

    const tasks = PHIZIKS.state.tasks || [];
    const m = String(Math.floor(this.pomo.secondsLeft / 60)).padStart(2, '0');
    const s = String(this.pomo.secondsLeft % 60).padStart(2, '0');

    container.innerHTML = `
      <div style="margin-bottom:18px;">
        <span class="badge" style="color:var(--accent);">dx/dy PRODUCTIVITY & FOCUS WORKSPACE</span>
        <h1 style="font-size:1.8rem;font-weight:900;margin-top:4px;">⏱️ Study Planner, Focus Timer & Ambient Audio Suite</h1>
        <p style="color:var(--text-secondary);font-size:0.9rem;">Algorithmic time-blocking, guilt-free study recovery, multi-channel offline ambient synthesizer, and persistent custom audio player.</p>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:18px;margin-bottom:20px;">
        <!-- ALGORITHMIC TIME-BLOCKED SCHEDULE GENERATOR -->
        <div class="stat-card">
          <h3 style="color:var(--accent);margin-bottom:12px;">🧠 Algorithmic Time-Blocked Schedule Generator</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
            <div>
              <label style="font-size:0.78rem;color:var(--text-secondary);">Available Study Hours</label>
              <input type="number" id="reg-hours" class="global-search-input" value="6" min="1" max="16" />
            </div>
            <div>
              <label style="font-size:0.78rem;color:var(--text-secondary);">Current Energy Level</label>
              <select id="reg-energy" class="global-search-input">
                <option value="High">⚡ High (Deep Derivations + Adv Problems)</option>
                <option value="Medium" selected>⚖️ Medium (Concept Review + PYQs)</option>
                <option value="Low">🔋 Low (Formula Revision + Error Log)</option>
              </select>
            </div>
            <div>
              <label style="font-size:0.78rem;color:var(--text-secondary);">Day Type</label>
              <select id="reg-daytype" class="global-search-input">
                <option value="School Day">🏫 School Day (Evening Focus)</option>
                <option value="Holiday">☀️ Holiday / Full Prep Day</option>
              </select>
            </div>
            <div>
              <label style="font-size:0.78rem;color:var(--text-secondary);">Planning Horizon</label>
              <select id="reg-horizon" class="global-search-input">
                <option value="Daily">Daily Time-Blocked Schedule</option>
                <option value="Weekly">Weekly 7-Day Sprint</option>
                <option value="Monthly">Monthly Unit Target</option>
                <option value="Multi-Month">Multi-Month JEE Roadmap</option>
              </select>
            </div>
          </div>
          <button class="nav-btn btn-primary" style="width:100%;justify-content:center;" onclick="PHIZIKS_SUITES.generateAlgorithmicPlan()">
            ⚡ Generate Prioritized Schedule with Rest Intervals
          </button>
          <div id="reg-schedule-output" style="margin-top:14px;"></div>
        </div>

        <!-- DEBUGGED POMODORO TIMER + PERSISTENT AMBIENT & CUSTOM AUDIO ENGINE -->
        <div class="stat-card">
          <h3 style="color:var(--accent);margin-bottom:12px;">🎧 Focus Timer & Persistent Background Audio</h3>
          <div style="text-align:center;padding:16px;background:var(--bg-primary);border-radius:10px;border:1px solid var(--border-color);margin-bottom:12px;">
            <span class="badge" id="pomo-mode-badge" style="color:var(--accent);">${this.pomo.mode === 'WORK' ? 'DEEP FOCUS BLOCK' : 'MANDATORY REST INTERVAL'}</span>
            <div id="pomo-clock" style="font-size:3rem;font-weight:900;font-family:var(--font-mono);color:var(--accent);margin:8px 0;">${m}:${s}</div>
            <div style="display:flex;justify-content:center;gap:8px;flex-wrap:wrap;">
              <button class="nav-btn btn-primary" onclick="PHIZIKS_SUITES.togglePomo()">
                ${this.pomo.running ? '⏸ Pause Timer' : '▶ Start Timer'}
              </button>
              <button class="tool-btn" onclick="PHIZIKS_SUITES.resetPomo(50, 10)">50 / 10m</button>
              <button class="tool-btn" onclick="PHIZIKS_SUITES.resetPomo(25, 5)">25 / 5m</button>
            </div>
          </div>

          <!-- Built-In Ambient Soundscape Selector -->
          <div style="margin-bottom:12px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
              <label style="font-size:0.8rem;color:var(--text-secondary);">Built-In Offline Soundscapes & Custom Track:</label>
              <button class="tool-btn" id="audio-play-pause-btn" onclick="PHIZIKS_SUITES.toggleAudioPlayback()" style="padding:3px 10px;">
                ${this.pomo.audioPlaying ? '⏸ Pause Audio' : '▶ Play Audio'}
              </button>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button class="tool-btn ${this.pomo.ambientType === 'rain' ? 'btn-primary' : ''}" onclick="PHIZIKS_SUITES.setAmbientSound('rain')">🌧️ Steady Rain</button>
              <button class="tool-btn ${this.pomo.ambientType === 'nature' ? 'btn-primary' : ''}" onclick="PHIZIKS_SUITES.setAmbientSound('nature')">🌲 Forest Wind</button>
              <button class="tool-btn ${this.pomo.ambientType === 'lofi' ? 'btn-primary' : ''}" onclick="PHIZIKS_SUITES.setAmbientSound('lofi')">🎹 Warm Lo-Fi Pad</button>
              <button class="tool-btn ${this.pomo.ambientType === 'white' ? 'btn-primary' : ''}" onclick="PHIZIKS_SUITES.setAmbientSound('white')">🌊 White Noise</button>
              ${this.pomo.customFileUrl ? `<button class="tool-btn ${this.pomo.ambientType === 'custom' ? 'btn-primary' : ''}" onclick="PHIZIKS_SUITES.setAmbientSound('custom')">🎵 Custom Track</button>` : ''}
              <button class="tool-btn ${this.pomo.ambientType === 'none' ? 'active' : ''}" onclick="PHIZIKS_SUITES.setAmbientSound('none')">🔇 Stop</button>
            </div>
          </div>

          <!-- Volume Slider -->
          <div style="margin-bottom:12px;">
            <div style="display:flex;justify-content:space-between;font-size:0.78rem;margin-bottom:4px;">
              <span style="color:var(--text-secondary);">🔊 Audio Volume</span>
              <strong style="color:var(--accent);font-family:var(--font-mono);" id="pomo-vol-label">${Math.round(this.pomo.volume * 100)}%</strong>
            </div>
            <input type="range" min="0" max="1" step="0.02" value="${this.pomo.volume}"
              style="width:100%;accent-color:var(--accent);cursor:pointer;"
              oninput="PHIZIKS_SUITES.setAudioVolume(this.value)" />
          </div>

          <!-- Custom Audio File Upload -->
          <div>
            <label style="font-size:0.8rem;color:var(--text-secondary);">📁 Upload Custom Background Audio (MP3, WAV, OGG, M4A):</label>
            <input type="file" accept="audio/*,video/*" class="global-search-input" style="margin-top:4px;" onchange="PHIZIKS_SUITES.loadCustomMedia(this)" />
            <div id="pomo-audio-status" style="font-size:0.76rem;color:var(--success);margin-top:6px;">${this.pomo.audioStatusText}</div>
          </div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:18px;">
        <!-- FLEXIBLE DAILY TASKS CHECKLIST & STUDY-RECOVERY -->
        <div class="stat-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:12px;">
            <h3 style="color:var(--accent);">✅ Flexible Study Planner & Recovery</h3>
            <button class="tool-btn" onclick="PHIZIKS_SUITES.rebalanceStudyPlan()" title="Redistribute incomplete tasks calmly without penalty streaks">🔄 Rebalance Pending Tasks</button>
          </div>
          <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">
            <input type="text" id="new-task-input" class="global-search-input" style="flex:1;min-width:160px;" placeholder="Add Physics topic or numerical target..." />
            <input type="number" id="new-task-hrs" class="global-search-input" style="width:85px;" value="1.5" step="0.5" min="0.5" title="Planned Hours" />
            <button class="nav-btn btn-primary" onclick="PHIZIKS_SUITES.addTask()">+ Add</button>
          </div>
          <div style="display:grid;gap:8px;">
            ${tasks.map((t, i) => `
              <div style="display:flex;justify-content:space-between;align-items:center;padding:10px;background:var(--bg-primary);border-radius:6px;border:1px solid var(--border-color);">
                <label style="display:flex;align-items:center;gap:8px;cursor:pointer;text-decoration:${t.completed?'line-through':'none'};color:${t.completed?'var(--text-secondary)':'var(--text-primary)'};">
                  <input type="checkbox" ${t.completed?'checked':''} onchange="PHIZIKS_SUITES.toggleTask(${i})" />
                  <span>${t.text}</span>${t.plannedHours ? `<span class="badge" style="font-size:0.68rem;">${t.plannedHours}h</span>` : ''}
                </label>
                <button class="tool-btn" style="padding:2px 6px;" onclick="PHIZIKS_SUITES.deleteTask(${i})">✖</button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- FOCUS VS DISTRACTION ANALYTICS (STACKED BAR CHART) -->
        <div class="stat-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <h3 style="color:var(--accent);">📊 Focus vs. Distraction Analytics</h3>
            <span class="badge">Stacked Bar Efficiency</span>
          </div>
          <canvas id="regain-analytics-canvas" width="560" height="240" style="width:100%;height:auto;background:#04070f;border:1px solid var(--border-color);border-radius:8px;"></canvas>
          <div style="display:flex;gap:8px;margin-top:10px;align-items:center;flex-wrap:wrap;">
            <input type="text" id="log-day" class="global-search-input" placeholder="Day (e.g. Today)" style="width:110px;" />
            <input type="number" id="log-prod" class="global-search-input" placeholder="Focus Hrs" step="0.5" style="width:110px;" />
            <input type="number" id="log-dist" class="global-search-input" placeholder="Distract Hrs" step="0.5" style="width:120px;" />
            <button class="tool-btn btn-primary" onclick="PHIZIKS_SUITES.logFocusHours()">+ Log Hours</button>
          </div>
        </div>
      </div>
    `;

    this.generateAlgorithmicPlan();
    setTimeout(() => this.drawRegainStackedBarChart(), 30);
  },

  generateAlgorithmicPlan() {
    const out = document.getElementById('reg-schedule-output');
    if (!out) return;
    const hrs = Number(document.getElementById('reg-hours') ? document.getElementById('reg-hours').value : 6);
    const energy = document.getElementById('reg-energy') ? document.getElementById('reg-energy').value : 'Medium';
    const dayType = document.getElementById('reg-daytype') ? document.getElementById('reg-daytype').value : 'School Day';
    const horizon = document.getElementById('reg-horizon') ? document.getElementById('reg-horizon').value : 'Daily';

    if (horizon !== 'Daily') {
      out.innerHTML = `
        <div style="padding:12px;background:var(--bg-primary);border-left:4px solid var(--accent);border-radius:6px;font-size:0.86rem;">
          <strong>🗺️ ${horizon} Strategic Roadmap (${dayType} Mode):</strong>
          <ul style="padding-left:18px;margin-top:8px;display:grid;gap:6px;">
            <li><strong>Phase 1 (Mathematical Foundation):</strong> Complete Ch 00 Basic Mathematics + Kinematics 1D/2D with full derivation fluency.</li>
            <li><strong>Phase 2 (Core Mechanics & Electrodynamics):</strong> Allocate ${hrs} hrs/day (60% problem solving, 40% concept derivation).</li>
            <li><strong>Phase 3 (Adaptive Non-Repeating Tests):</strong> Solve 30 unique questions per chapter + spaced-repetition reviews.</li>
          </ul>
        </div>
      `;
      return;
    }

    const blocks = [];
    const totalMins = hrs * 60;
    let remaining = totalMins;
    let blockNum = 1;

    while (remaining > 0) {
      const studyDur = Math.min(50, remaining);
      let activity = '';
      if (energy === 'High' && blockNum === 1) activity = '🔥 Deep Concept Derivation & Visual Lab Exploration';
      else if (blockNum % 2 === 0) activity = '🎯 Adaptive Non-Repeating Numericals (Side-by-Side Whiteboard)';
      else activity = '📖 Active Recall Formula Sheet & JEE Trap Review';

      blocks.push({ type: 'STUDY', duration: studyDur, label: `Block ${blockNum}: ${activity}` });
      remaining -= studyDur;
      if (remaining > 0) {
        const restDur = Math.min(10, remaining);
        blocks.push({ type: 'REST', duration: restDur, label: '🌿 Hydration, Eye Rest & Stretching Interval' });
        remaining -= restDur;
      }
      blockNum++;
    }

    out.innerHTML = `
      <div style="max-height:220px;overflow-y:auto;display:grid;gap:6px;">
        ${blocks.map(b => `
          <div style="padding:8px 12px;border-radius:6px;background:${b.type==='REST'?'rgba(0,230,118,0.1)':'var(--bg-primary)'};border-left:4px solid ${b.type==='REST'?'var(--success)':'var(--accent)'};font-size:0.83rem;display:flex;justify-content:space-between;">
            <span>${b.label}</span>
            <strong style="font-family:var(--font-mono);">${b.duration} min</strong>
          </div>
        `).join('')}
      </div>
    `;
  },

  // =========================================================================
  // DEBUGGED WEB AUDIO SYNTHESIZER + CUSTOM AUDIO UPLOAD ENGINE
  // =========================================================================
  stopAllAudioNodes() {
    this.pomo.activeNodes.forEach(node => {
      try { if (node.stop) node.stop(); } catch (e) {}
      try { if (node.disconnect) node.disconnect(); } catch (e) {}
    });
    this.pomo.activeNodes = [];

    const audioEl = this.ensurePersistentAudioElement();
    try { audioEl.pause(); } catch (e) {}
  },

  setAudioVolume(val) {
    this.pomo.volume = Math.max(0, Math.min(1, parseFloat(val)));
    const lbl = document.getElementById('pomo-vol-label');
    if (lbl) lbl.textContent = `${Math.round(this.pomo.volume * 100)}%`;

    if (this.pomo.masterGain && this.pomo.audioCtx) {
      this.pomo.masterGain.gain.setTargetAtTime(this.pomo.volume, this.pomo.audioCtx.currentTime, 0.03);
    }
    const audioEl = this.ensurePersistentAudioElement();
    audioEl.volume = this.pomo.volume;
  },

  toggleAudioPlayback() {
    if (this.pomo.ambientType === 'none') {
      this.setAmbientSound('rain');
      return;
    }
    if (this.pomo.audioPlaying) {
      this.stopAllAudioNodes();
      this.pomo.audioPlaying = false;
      this.updateAudioUIStatus(`⏸ Audio paused (${this.pomo.ambientType.toUpperCase()}).`);
    } else {
      this.setAmbientSound(this.pomo.ambientType);
    }
  },

  updateAudioUIStatus(msg, isError = false) {
    this.pomo.audioStatusText = msg;
    const statusEl = document.getElementById('pomo-audio-status');
    if (statusEl) {
      statusEl.textContent = msg;
      statusEl.style.color = isError ? 'var(--danger)' : 'var(--success)';
    }
    const playBtn = document.getElementById('audio-play-pause-btn');
    if (playBtn) {
      playBtn.textContent = this.pomo.audioPlaying ? '⏸ Pause Audio' : '▶ Play Audio';
    }
  },

  async setAmbientSound(type) {
    this.stopAllAudioNodes();
    this.pomo.ambientType = type;

    if (type === 'none') {
      this.pomo.audioPlaying = false;
      this.updateAudioUIStatus('🔇 Background audio muted.');
      if (PHIZIKS.currentView === 'regain') this.renderRegainSuite();
      return;
    }

    if (type === 'custom') {
      const audioEl = this.ensurePersistentAudioElement();
      if (!this.pomo.customFileUrl) {
        this.pomo.audioPlaying = false;
        this.updateAudioUIStatus('⚠️ Please upload an audio file (MP3, WAV, OGG) first.', true);
        return;
      }
      audioEl.src = this.pomo.customFileUrl;
      audioEl.volume = this.pomo.volume;
      try {
        await audioEl.play();
        this.pomo.audioPlaying = true;
        this.updateAudioUIStatus(`🎵 Playing custom track: ${this.pomo.customFileName}`);
      } catch (err) {
        this.pomo.audioPlaying = false;
        this.updateAudioUIStatus('⚠️ Browser blocked autoplay or unsupported audio format. Click Play Audio to retry.', true);
      }
      if (PHIZIKS.currentView === 'regain') this.renderRegainSuite();
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      this.updateAudioUIStatus('⚠️ Web Audio API is not supported in this browser.', true);
      return;
    }
    if (!this.pomo.audioCtx) {
      this.pomo.audioCtx = new AudioContextClass();
    }
    const ctx = this.pomo.audioCtx;
    if (ctx.state === 'suspended') {
      try { await ctx.resume(); } catch (e) {}
    }

    const master = ctx.createGain();
    master.gain.value = this.pomo.volume;
    master.connect(ctx.destination);
    this.pomo.masterGain = master;

    if (type === 'lofi') {
      const freqs = [220.0, 277.18, 329.63, 415.30];
      const padFilter = ctx.createBiquadFilter();
      padFilter.type = 'lowpass';
      padFilter.frequency.value = 620;
      padFilter.connect(master);

      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
        osc.frequency.value = f;
        oscGain.gain.value = 0.14;
        osc.connect(oscGain);
        oscGain.connect(padFilter);
        osc.start();
        this.pomo.activeNodes.push(osc, oscGain);
      });
      this.pomo.activeNodes.push(padFilter);
      this.pomo.audioPlaying = true;
      this.updateAudioUIStatus('🎹 Playing: Warm Lo-Fi Ambient Pad');
    } else {
      const bufferSize = 3 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      if (type === 'white') {
        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * 0.25;
        }
      } else {
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.09;
          b6 = white * 0.115926;
        }
      }

      const source = ctx.createBufferSource();
      source.buffer = noiseBuffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      const boostGain = ctx.createGain();

      if (type === 'rain') {
        filter.type = 'lowpass';
        filter.frequency.value = 1150;
        boostGain.gain.value = 0.85;
      } else if (type === 'nature') {
        filter.type = 'bandpass';
        filter.frequency.value = 520;
        filter.Q.value = 1.4;
        boostGain.gain.value = 1.1;

        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.16;
        lfoGain.gain.value = 240;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();
        this.pomo.activeNodes.push(lfo, lfoGain);
      } else {
        filter.type = 'lowpass';
        filter.frequency.value = 3200;
        boostGain.gain.value = 0.45;
      }

      source.connect(filter);
      filter.connect(boostGain);
      boostGain.connect(master);
      source.start();

      this.pomo.activeNodes.push(source, filter, boostGain);
      this.pomo.audioPlaying = true;
      const labels = { rain: '🌧️ Playing: Steady Rain Soundscape', nature: '🌲 Playing: Forest Wind & Nature Breeze', white: '🌊 Playing: Soft White Noise' };
      this.updateAudioUIStatus(labels[type] || '🔊 Audio Active');
    }

    if (PHIZIKS.currentView === 'regain') this.renderRegainSuite();
  },

  loadCustomMedia(input) {
    const file = input.files && input.files[0];
    if (!file) return;

    if (!file.type.startsWith('audio/') && !file.type.startsWith('video/')) {
      this.updateAudioUIStatus('❌ Invalid file format. Please select a valid audio file (MP3, WAV, OGG, M4A).', true);
      return;
    }

    if (this.pomo.customFileUrl) {
      try { URL.revokeObjectURL(this.pomo.customFileUrl); } catch (e) {}
    }

    this.pomo.customFileUrl = URL.createObjectURL(file);
    this.pomo.customFileName = file.name;
    this.setAmbientSound('custom');
  },

  togglePomo() {
    this.pomo.running = !this.pomo.running;

    if (this.pomo.running && this.pomo.ambientType !== 'none' && !this.pomo.audioPlaying) {
      this.setAmbientSound(this.pomo.ambientType);
    }

    if (this.pomo.timerId) clearInterval(this.pomo.timerId);
    if (this.pomo.running) {
      this.pomo.timerId = setInterval(() => {
        if (this.pomo.secondsLeft > 0) {
          this.pomo.secondsLeft--;
        } else {
          this.pomo.mode = this.pomo.mode === 'WORK' ? 'REST' : 'WORK';
          this.pomo.secondsLeft = (this.pomo.mode === 'WORK' ? this.pomo.workMins : this.pomo.restMins) * 60;
        }
        const clk = document.getElementById('pomo-clock');
        const bdg = document.getElementById('pomo-mode-badge');
        if (clk) {
          const m = String(Math.floor(this.pomo.secondsLeft / 60)).padStart(2, '0');
          const s = String(this.pomo.secondsLeft % 60).padStart(2, '0');
          clk.textContent = `${m}:${s}`;
        }
        if (bdg) bdg.textContent = this.pomo.mode === 'WORK' ? 'DEEP FOCUS BLOCK' : 'MANDATORY REST INTERVAL';
      }, 1000);
    }
    this.renderRegainSuite();
  },

  resetPomo(w, r) {
    this.pomo.running = false;
    if (this.pomo.timerId) clearInterval(this.pomo.timerId);
    this.pomo.workMins = w;
    this.pomo.restMins = r;
    this.pomo.secondsLeft = w * 60;
    this.renderRegainSuite();
  },

  addTask() {
    const inp = document.getElementById('new-task-input');
    const hrsInp = document.getElementById('new-task-hrs');
    if (!inp || !inp.value.trim()) return;
    const plannedHours = hrsInp ? parseFloat(hrsInp.value || 1.5) : 1.5;
    PHIZIKS.state.tasks.push({ id: `t-${Date.now()}`, text: inp.value.trim(), completed: false, plannedHours });
    PHIZIKS.saveState();
    this.renderRegainSuite();
  },

  toggleTask(idx) {
    PHIZIKS.state.tasks[idx].completed = !PHIZIKS.state.tasks[idx].completed;
    PHIZIKS.saveState();
    this.renderRegainSuite();
  },

  deleteTask(idx) {
    PHIZIKS.state.tasks.splice(idx, 1);
    PHIZIKS.saveState();
    this.renderRegainSuite();
  },

  rebalanceStudyPlan() {
    const tasks = PHIZIKS.state.tasks || [];
    const pending = tasks.filter(t => !t.completed);
    const completed = tasks.filter(t => t.completed);
    pending.forEach((t, idx) => {
      t.text = t.text.replace(/^\[Day \d+\]\s*/, '');
      t.text = `[Day ${(idx % 3) + 1}] ${t.text}`;
    });
    PHIZIKS.state.tasks = [...pending, ...completed];
    PHIZIKS.saveState();
    this.renderRegainSuite();
  },

  logFocusHours() {
    const date = document.getElementById('log-day').value || 'Today';
    const productive = parseFloat(document.getElementById('log-prod').value || 5);
    const distracted = parseFloat(document.getElementById('log-dist').value || 1);
    PHIZIKS.state.distractionLogs.push({ date, productive, distracted, school: 6 });
    if (PHIZIKS.state.distractionLogs.length > 8) PHIZIKS.state.distractionLogs.shift();
    PHIZIKS.saveState();
    this.drawRegainStackedBarChart();
  },

  drawRegainStackedBarChart() {
    const canvas = document.getElementById('regain-analytics-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const logs = PHIZIKS.state.distractionLogs || [];
    const barW = 38;
    const gap = (W - 80) / Math.max(1, logs.length);
    const baseY = H - 30;
    const scaleY = 14;

    ctx.fillStyle = '#f0f4f8'; ctx.font = '11px Inter';
    ctx.fillText('Emerald: Productive Self-Study Hours | Red: Distracted Hours (Focus Efficiency %)', 20, 20);

    logs.forEach((item, idx) => {
      const x = 45 + idx * gap;
      const prodH = item.productive * scaleY;
      const distH = item.distracted * scaleY;

      ctx.fillStyle = '#00e676';
      ctx.fillRect(x, baseY - prodH, barW, prodH);

      ctx.fillStyle = '#ff3d57';
      ctx.fillRect(x, baseY - prodH - distH, barW, distH);

      ctx.fillStyle = '#94a3b8';
      ctx.fillText(item.date, x + 4, H - 10);
      const eff = Math.round((item.productive / Math.max(0.1, item.productive + item.distracted)) * 100);
      ctx.fillStyle = '#00f0ff';
      ctx.fillText(`${eff}%`, x + 5, baseY - prodH - distH - 6);
    });
  },

  // =========================================================================
  // MODULE 3: UPGRADED STUDENT LIFE & WELL-BEING JOURNAL
  // =========================================================================
  computeJournalSummaries() {
    const entries = PHIZIKS.state.journalEntries || [];
    const now = Date.now();
    const filterByDays = (days) => entries.filter(e => {
      const t = Date.parse(e.isoDate || e.date) || now;
      return (now - t) <= days * 86400000;
    });

    const calcStats = (list) => {
      const count = list.length;
      if (count === 0) return { count: 0, selfHrs: 0, schoolHrs: 0, qTotal: 0, avgSleep: 0, avgEnergy: 0 };
      const selfHrs = list.reduce((s, e) => s + (parseFloat(e.selfHrs) || 0), 0);
      const schoolHrs = list.reduce((s, e) => s + (parseFloat(e.schoolHrs) || 0), 0);
      const qTotal = list.reduce((s, e) => s + (parseInt(e.qCount, 10) || 0), 0);
      const avgSleep = list.reduce((s, e) => s + (parseFloat(e.sleepHrs) || 7), 0) / count;
      const avgEnergy = list.reduce((s, e) => s + (parseFloat(e.energyLevel) || 7), 0) / count;
      return {
        count,
        selfHrs: selfHrs.toFixed(1),
        schoolHrs: schoolHrs.toFixed(1),
        qTotal,
        avgSleep: avgSleep.toFixed(1),
        avgEnergy: avgEnergy.toFixed(1)
      };
    };

    return {
      daily: calcStats(filterByDays(1)),
      weekly: calcStats(filterByDays(7)),
      monthly: calcStats(filterByDays(30))
    };
  },

  renderJournalSuite() {
    const container = document.getElementById('journal-content');
    if (!container) return;

    const p = PHIZIKS.state.profile;
    const activities = PHIZIKS.state.customActivities || ["Drawing", "Hip-Hop Dance", "Guitar Practice", "Martial Arts / Sports"];
    const customMetrics = PHIZIKS.state.customMetrics || ["Concept Clarity (1-10)", "Mock Test Accuracy (%)"];
    const entries = PHIZIKS.state.journalEntries || [];
    const summaries = this.computeJournalSummaries();
    const curSum = summaries[this.journalState.summaryPeriod] || summaries.weekly;

    const filteredEntries = entries.filter(en => {
      const q = this.journalState.searchQuery.trim().toLowerCase();
      const matchSearch = !q ||
        (en.topics && en.topics.toLowerCase().includes(q)) ||
        (en.reflection && en.reflection.toLowerCase().includes(q)) ||
        (en.highlight && en.highlight.toLowerCase().includes(q)) ||
        (en.date && en.date.toLowerCase().includes(q));
      const matchAct = this.journalState.filterActivity === 'ALL' ||
        (en.activities && en.activities.includes(this.journalState.filterActivity));
      const matchDate = !this.journalState.selectedDateFilter ||
        (en.dayKey === this.journalState.selectedDateFilter);
      return matchSearch && matchAct && matchDate;
    });

    container.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:18px;">
        <div>
          <span class="badge" style="color:var(--accent);">dx/dy STUDENT LIFE & WELL-BEING WORKSPACE</span>
          <h1 style="font-size:1.8rem;font-weight:900;margin-top:4px;">🌱 Student Life, Well-Being Journal & Trend Analytics</h1>
          <p style="color:var(--text-secondary);font-size:0.9rem;">Separate School vs. Self-Study logs, custom metrics, autosave, calendar history, cautious correlation charts, and guilt-free reflections.</p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="tool-btn btn-primary" onclick="PHIZIKS_SUITES.exportJournalData()">⬇️ Export Journal (.JSON)</button>
          <button class="tool-btn" style="border-color:var(--danger);color:var(--danger);" onclick="PHIZIKS_SUITES.clearAllJournalEntries()">🗑️ Delete All Journal Data</button>
        </div>
      </div>

      <!-- DAILY / WEEKLY / MONTHLY SUMMARY ROLLUP CARDS -->
      <div class="stat-card" style="margin-bottom:20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:12px;">
          <h3 style="color:var(--accent);">📊 Study & Well-Being Summary Rollup (${this.journalState.summaryPeriod.toUpperCase()})</h3>
          <div style="display:flex;gap:6px;">
            <button class="tool-btn ${this.journalState.summaryPeriod==='daily'?'btn-primary':''}" onclick="PHIZIKS_SUITES.setSummaryPeriod('daily')">Today (24h)</button>
            <button class="tool-btn ${this.journalState.summaryPeriod==='weekly'?'btn-primary':''}" onclick="PHIZIKS_SUITES.setSummaryPeriod('weekly')">Weekly (7d)</button>
            <button class="tool-btn ${this.journalState.summaryPeriod==='monthly'?'btn-primary':''}" onclick="PHIZIKS_SUITES.setSummaryPeriod('monthly')">Monthly (30d)</button>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;">
          <div style="padding:12px;background:var(--bg-primary);border-radius:8px;border:1px solid var(--border-color);">
            <div style="font-size:0.74rem;color:var(--text-secondary);">SELF-STUDY LOGGED</div>
            <div style="font-size:1.5rem;font-weight:800;color:var(--accent);">${curSum.selfHrs} hrs</div>
          </div>
          <div style="padding:12px;background:var(--bg-primary);border-radius:8px;border:1px solid var(--border-color);">
            <div style="font-size:0.74rem;color:var(--text-secondary);">SCHOOL HOURS</div>
            <div style="font-size:1.5rem;font-weight:800;color:#c4b5fd;">${curSum.schoolHrs} hrs</div>
          </div>
          <div style="padding:12px;background:var(--bg-primary);border-radius:8px;border:1px solid var(--border-color);">
            <div style="font-size:0.74rem;color:var(--text-secondary);">QUESTIONS SOLVED</div>
            <div style="font-size:1.5rem;font-weight:800;color:var(--success);">${curSum.qTotal} Qs</div>
          </div>
          <div style="padding:12px;background:var(--bg-primary);border-radius:8px;border:1px solid var(--border-color);">
            <div style="font-size:0.74rem;color:var(--text-secondary);">AVG SLEEP / ENERGY</div>
            <div style="font-size:1.35rem;font-weight:800;color:var(--warning);">${curSum.avgSleep}h • ${curSum.avgEnergy}/10</div>
          </div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(350px,1fr));gap:18px;margin-bottom:20px;">
        <!-- LEFT: DAILY LOGGER WITH OPTIONAL FIELDS, CUSTOM METRICS & AUTOSAVE -->
        <div class="stat-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
            <h3 style="color:var(--accent);" id="journal-form-title">
              ${this.journalState.editingId ? '✏️ Editing Saved Journal Entry' : '📓 Daily Dual-Study & Well-Being Logger'}
            </h3>
            <span id="journal-autosave-status" style="font-size:0.74rem;color:var(--text-secondary);">Draft autosave ready</span>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;" oninput="PHIZIKS_SUITES.scheduleJournalDraftAutosave()">
            <div>
              <label style="font-size:0.76rem;color:var(--text-secondary);">🏫 School Hours Today</label>
              <input type="number" id="j-school-hrs" class="global-search-input" value="6" step="0.5" min="0" />
            </div>
            <div>
              <label style="font-size:0.76rem;color:var(--text-secondary);">🔥 Self-Study Hours (Actual vs ${p.dailyGoalHours || 6}h Goal)</label>
              <input type="number" id="j-self-hrs" class="global-search-input" value="5.5" step="0.5" min="0" />
            </div>
            <div>
              <label style="font-size:0.76rem;color:var(--text-secondary);">📚 Topics Completed (Optional)</label>
              <input type="text" id="j-topics" class="global-search-input" placeholder="e.g. Projectile Motion, Gauss Law" />
            </div>
            <div>
              <label style="font-size:0.76rem;color:var(--text-secondary);">🔢 Questions Solved Today</label>
              <input type="number" id="j-qcount" class="global-search-input" value="35" min="0" />
            </div>
            <div>
              <label style="font-size:0.76rem;color:var(--text-secondary);">😴 Sleep Hours</label>
              <input type="number" id="j-sleep-hrs" class="global-search-input" value="7.5" step="0.5" min="0" max="16" />
            </div>
            <div>
              <label style="font-size:0.76rem;color:var(--text-secondary);">⚡ Energy (1–10) & Stress (1–10)</label>
              <div style="display:flex;gap:6px;">
                <input type="number" id="j-energy" class="global-search-input" value="8" min="1" max="10" title="Energy Level (1-10)" />
                <input type="number" id="j-stress" class="global-search-input" value="3" min="1" max="10" title="Stress Level (1-10)" />
              </div>
            </div>
            <div style="grid-column:span 2;">
              <label style="font-size:0.76rem;color:var(--text-secondary);">💧 Hydration (Glasses) & Nutrition Notes (Optional)</label>
              <input type="text" id="j-water" class="global-search-input" value="8 Glasses | Home-cooked balanced meals" />
            </div>
          </div>

          <!-- Custom User-Created Metrics -->
          <div style="margin-bottom:12px;padding:10px;background:var(--bg-primary);border-radius:8px;border:1px solid var(--border-color);">
            <label style="font-size:0.78rem;color:var(--accent);font-weight:700;">📐 Custom Personal Metrics (Optional):</label>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px;">
              ${customMetrics.map((mName, mi) => `
                <div>
                  <label style="font-size:0.72rem;color:var(--text-secondary);">${mName}</label>
                  <input type="text" class="global-search-input j-custom-metric-val" data-metric="${mName}" id="j-metric-${mi}" placeholder="Log value..." style="padding:5px 8px;font-size:0.8rem;" />
                </div>
              `).join('')}
            </div>
            <div style="display:flex;gap:6px;margin-top:8px;">
              <input type="text" id="j-new-metric-name" class="global-search-input" placeholder="Create new custom metric (e.g. Revision Mins)..." style="padding:5px 8px;font-size:0.78rem;" />
              <button class="tool-btn" onclick="PHIZIKS_SUITES.addCustomMetric()">+ Metric</button>
            </div>
          </div>

          <!-- Creative & Physical Activities -->
          <div style="margin-bottom:12px;">
            <label style="font-size:0.78rem;color:var(--text-secondary);">🎨 Creative & Physical Activities Completed Today:</label>
            <div id="j-activity-pills" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px;">
              ${activities.map(act => `
                <label class="tool-btn" style="cursor:pointer;">
                  <input type="checkbox" class="j-act-check" value="${act}" /> ${act}
                </label>
              `).join('')}
            </div>
            <div style="display:flex;gap:8px;margin-top:8px;">
              <input type="text" id="j-custom-act-input" class="global-search-input" placeholder="Add custom hobby or sport..." />
              <button class="tool-btn" onclick="PHIZIKS_SUITES.addCustomActivity()">+ Add Activity</button>
            </div>
          </div>

          <!-- Structured Guided Reflection Prompts -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;" oninput="PHIZIKS_SUITES.scheduleJournalDraftAutosave()">
            <div>
              <label style="font-size:0.75rem;color:var(--text-secondary);">🌟 Daily Highlight / Win (Optional)</label>
              <input type="text" id="j-highlight" class="global-search-input" placeholder="What went well today?" />
            </div>
            <div>
              <label style="font-size:0.75rem;color:var(--text-secondary);">🚧 Distraction Triggers (Optional)</label>
              <input type="text" id="j-triggers" class="global-search-input" placeholder="What pulled focus away?" />
            </div>
          </div>
          <div style="margin-bottom:12px;" oninput="PHIZIKS_SUITES.scheduleJournalDraftAutosave()">
            <label style="font-size:0.78rem;color:var(--text-secondary);">🧠 Lessons Learned & Gentle Plan for Tomorrow:</label>
            <textarea id="j-reflection" rows="2" class="global-search-input" style="margin-top:4px;" placeholder="Reflect without self-judgment. What is one calm priority for tomorrow?"></textarea>
          </div>

          <div style="display:flex;gap:8px;">
            <button class="nav-btn btn-primary" style="flex:1;justify-content:center;" onclick="PHIZIKS_SUITES.saveJournalEntry()">
              💾 ${this.journalState.editingId ? 'Update Saved Entry' : 'Save Daily Journal Entry'}
            </button>
            ${this.journalState.editingId ? `<button class="tool-btn" onclick="PHIZIKS_SUITES.cancelEditJournalEntry()">Cancel Edit</button>` : ''}
          </div>
        </div>

        <!-- RIGHT: INTERACTIVE TREND CHARTS + CALENDAR & EXAM ALERT SETTINGS -->
        <div style="display:flex;flex-direction:column;gap:18px;">
          <div class="stat-card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:6px;">
              <h3 style="color:var(--accent);">📈 Study Hours, Question Volume & Sleep/Energy Trends</h3>
              <span class="badge">Self-Reflection Visual</span>
            </div>
            <canvas id="journal-trends-canvas" width="520" height="205" style="width:100%;height:auto;background:#04070f;border:1px solid var(--border-color);border-radius:8px;"></canvas>
            <p style="font-size:0.74rem;color:var(--text-secondary);margin-top:6px;">
              <em>Note: Visual patterns are for personal self-reflection only and do not represent medical or psychological advice.</em>
            </p>
          </div>

          <div class="stat-card">
            <h3 style="color:var(--accent);margin-bottom:8px;">📅 Monthly Activity Calendar & Exam Countdowns</h3>
            <div class="journal-calendar-grid">
              ${Array.from({ length: 14 }, (_, i) => {
                const d = new Date(Date.now() - (13 - i) * 86400000);
                const key = d.toLocaleDateString();
                const hasEntry = entries.some(e => e.dayKey === key || (e.date && e.date.startsWith(key)));
                const isSelected = this.journalState.selectedDateFilter === key;
                return `
                  <div class="journal-cal-day ${hasEntry ? 'has-entry' : ''}"
                    style="${isSelected ? 'outline:2px solid var(--warning);' : ''}"
                    onclick="PHIZIKS_SUITES.toggleCalendarDateFilter('${key}')"
                    title="${key}${hasEntry ? ' (Logged)' : ''}">
                    <div>${d.toLocaleDateString([], { weekday: 'short' })}</div>
                    <strong>${d.getDate()}</strong>
                  </div>
                `;
              }).join('')}
            </div>

            <div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--border-color);">
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
                <div>
                  <label style="font-size:0.74rem;color:var(--text-secondary);">Current Class</label>
                  <select id="prof-class" class="global-search-input" style="padding:5px 8px;">
                    <option value="Class 11" ${p.currentClass==='Class 11'?'selected':''}>Class 11</option>
                    <option value="Class 12" ${p.currentClass==='Class 12'?'selected':''}>Class 12</option>
                    <option value="JEE Dropper / Repeater" ${p.currentClass==='JEE Dropper / Repeater'?'selected':''}>JEE Dropper</option>
                    <option value="Class 10 Foundation" ${p.currentClass==='Class 10 Foundation'?'selected':''}>Class 10 Foundation</option>
                  </select>
                </div>
                <div>
                  <label style="font-size:0.74rem;color:var(--text-secondary);">Gentle Daily Self-Study Goal (Hrs)</label>
                  <input type="number" id="prof-goal-hrs" class="global-search-input" style="padding:5px 8px;" value="${p.dailyGoalHours || 6}" step="0.5" />
                </div>
                <div>
                  <label style="font-size:0.74rem;color:var(--text-secondary);">JEE Main Date</label>
                  <input type="date" id="prof-jeemain" class="global-search-input" style="padding:5px 8px;" value="${p.jeeMainDate}" />
                </div>
                <div>
                  <label style="font-size:0.74rem;color:var(--text-secondary);">JEE Advanced Date</label>
                  <input type="date" id="prof-jeeadv" class="global-search-input" style="padding:5px 8px;" value="${p.jeeAdvDate}" />
                </div>
                <div style="grid-column:span 2;">
                  <label style="font-size:0.74rem;color:var(--text-secondary);">Board / School Exam Date</label>
                  <input type="date" id="prof-board" class="global-search-input" style="padding:5px 8px;" value="${p.boardExamDate}" />
                </div>
              </div>
              <button class="tool-btn btn-primary" style="width:100%;justify-content:center;" onclick="PHIZIKS_SUITES.updateProfileDates()">
                ✔ Save Class, Goal & Countdown Dates
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- SEARCHABLE, FILTERABLE & EDITABLE JOURNAL HISTORY -->
      <div class="stat-card">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:14px;">
          <h3 style="color:var(--accent);">📜 Saved Journal History (${filteredEntries.length} entries)</h3>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <input type="text" class="global-search-input" style="width:220px;" placeholder="Search topics, highlights, notes..." value="${this.journalState.searchQuery}" oninput="PHIZIKS_SUITES.setJournalSearch(this.value)" />
            <select class="global-search-input" style="width:170px;" onchange="PHIZIKS_SUITES.setJournalActivityFilter(this.value)">
              <option value="ALL">All Activities</option>
              ${activities.map(a => `<option value="${a}" ${this.journalState.filterActivity===a?'selected':''}>${a}</option>`).join('')}
            </select>
            ${this.journalState.selectedDateFilter ? `<button class="tool-btn" onclick="PHIZIKS_SUITES.toggleCalendarDateFilter(null)">Clear Date (${this.journalState.selectedDateFilter}) ✖</button>` : ''}
          </div>
        </div>

        ${filteredEntries.length === 0 ? `
          <div style="padding:24px;text-align:center;background:var(--bg-primary);border-radius:8px;border:1px dashed var(--border-color);color:var(--text-secondary);">
            No matching journal entries yet. Log your day above—every step forward counts, and missed days are never penalized.
          </div>
        ` : `
          <div style="display:grid;gap:10px;">
            ${filteredEntries.map(en => `
              <div style="padding:14px;background:var(--bg-primary);border:1px solid var(--border-color);border-left:4px solid var(--accent);border-radius:8px;">
                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:6px;">
                  <div>
                    <strong style="color:var(--accent);">📅 ${en.date}</strong>
                    <span class="badge" style="margin-left:8px;">🏫 School: ${en.schoolHrs}h</span>
                    <span class="badge" style="color:var(--success);">🔥 Self-Study: ${en.selfHrs}h</span>
                    <span class="badge" style="color:#c4b5fd;">🔢 ${en.qCount} Qs</span>
                    <span class="badge">😴 ${en.sleepHrs || 7.5}h • ⚡ ${en.energyLevel || 8}/10</span>
                  </div>
                  <div style="display:flex;gap:6px;">
                    <button class="tool-btn" style="padding:2px 8px;font-size:0.74rem;" onclick="PHIZIKS_SUITES.editJournalEntry('${en.id}')">✏️ Edit</button>
                    <button class="tool-btn" style="padding:2px 8px;font-size:0.74rem;color:var(--danger);" onclick="PHIZIKS_SUITES.deleteJournalEntry('${en.id}')">🗑️ Delete</button>
                  </div>
                </div>
                <div style="font-size:0.85rem;margin-bottom:4px;">
                  <strong>Topics:</strong> ${en.topics || 'General Study'} &nbsp;|&nbsp;
                  <strong>Activities:</strong> ${(en.activities || []).join(', ') || 'Rest / Academic Focus'}
                </div>
                ${en.highlight || en.triggers ? `
                  <div style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:4px;">
                    ${en.highlight ? `🌟 <strong>Highlight:</strong> ${en.highlight} &nbsp; ` : ''}
                    ${en.triggers ? `🚧 <strong>Triggers:</strong> ${en.triggers}` : ''}
                  </div>
                ` : ''}
                ${en.metrics && Object.keys(en.metrics).length > 0 ? `
                  <div style="font-size:0.78rem;color:#c4b5fd;margin-bottom:4px;">
                    ${Object.entries(en.metrics).map(([k, v]) => `<span><strong>${k}:</strong> ${v}</span>`).join(' • ')}
                  </div>
                ` : ''}
                <div style="font-size:0.84rem;color:var(--text-secondary);"><strong>Reflection & Tomorrow's Plan:</strong> ${en.reflection}</div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;

    this.restoreJournalDraftIfAvailable();
    setTimeout(() => this.drawJournalTrendsChart(), 30);
  },

  setSummaryPeriod(period) {
    this.journalState.summaryPeriod = period;
    this.renderJournalSuite();
  },

  setJournalSearch(q) {
    this.journalState.searchQuery = q;
    this.renderJournalSuite();
  },

  setJournalActivityFilter(act) {
    this.journalState.filterActivity = act;
    this.renderJournalSuite();
  },

  toggleCalendarDateFilter(dayKey) {
    this.journalState.selectedDateFilter = (this.journalState.selectedDateFilter === dayKey) ? null : dayKey;
    this.renderJournalSuite();
  },

  scheduleJournalDraftAutosave() {
    const status = document.getElementById('journal-autosave-status');
    if (status) status.textContent = '⏳ Autosaving draft...';
    if (this.journalState.autosaveTimer) clearTimeout(this.journalState.autosaveTimer);
    this.journalState.autosaveTimer = setTimeout(() => {
      const draft = {
        schoolHrs: document.getElementById('j-school-hrs')?.value || '6',
        selfHrs: document.getElementById('j-self-hrs')?.value || '5.5',
        topics: document.getElementById('j-topics')?.value || '',
        qCount: document.getElementById('j-qcount')?.value || '35',
        sleepHrs: document.getElementById('j-sleep-hrs')?.value || '7.5',
        energy: document.getElementById('j-energy')?.value || '8',
        stress: document.getElementById('j-stress')?.value || '3',
        water: document.getElementById('j-water')?.value || '',
        highlight: document.getElementById('j-highlight')?.value || '',
        triggers: document.getElementById('j-triggers')?.value || '',
        reflection: document.getElementById('j-reflection')?.value || ''
      };
      localStorage.setItem('dxdy_journal_draft', JSON.stringify(draft));
      if (status) status.textContent = `✔ Draft autosaved at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }, 600);
  },

  restoreJournalDraftIfAvailable() {
    if (this.journalState.editingId) return;
    try {
      const raw = localStorage.getItem('dxdy_journal_draft');
      if (!raw) return;
      const d = JSON.parse(raw);
      if (d.topics && document.getElementById('j-topics')) document.getElementById('j-topics').value = d.topics;
      if (d.highlight && document.getElementById('j-highlight')) document.getElementById('j-highlight').value = d.highlight;
      if (d.triggers && document.getElementById('j-triggers')) document.getElementById('j-triggers').value = d.triggers;
      if (d.reflection && document.getElementById('j-reflection')) document.getElementById('j-reflection').value = d.reflection;
    } catch (e) {}
  },

  addCustomActivity() {
    const inp = document.getElementById('j-custom-act-input');
    if (!inp || !inp.value.trim()) return;
    PHIZIKS.state.customActivities.push(inp.value.trim());
    PHIZIKS.saveState();
    this.renderJournalSuite();
  },

  addCustomMetric() {
    const inp = document.getElementById('j-new-metric-name');
    if (!inp || !inp.value.trim()) return;
    if (!PHIZIKS.state.customMetrics) PHIZIKS.state.customMetrics = [];
    PHIZIKS.state.customMetrics.push(inp.value.trim());
    PHIZIKS.saveState();
    this.renderJournalSuite();
  },

  saveJournalEntry() {
    const checkedActs = Array.from(document.querySelectorAll('.j-act-check:checked')).map(el => el.value);
    const metrics = {};
    document.querySelectorAll('.j-custom-metric-val').forEach(el => {
      if (el.value.trim()) metrics[el.dataset.metric] = el.value.trim();
    });

    const now = new Date();
    const entryData = {
      id: this.journalState.editingId || `j_${Date.now()}`,
      isoDate: now.toISOString(),
      dayKey: now.toLocaleDateString(),
      date: now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      schoolHrs: document.getElementById('j-school-hrs').value,
      selfHrs: document.getElementById('j-self-hrs').value,
      topics: document.getElementById('j-topics').value || 'General Revision',
      qCount: document.getElementById('j-qcount').value,
      sleepHrs: document.getElementById('j-sleep-hrs').value,
      energyLevel: document.getElementById('j-energy').value,
      stressLevel: document.getElementById('j-stress').value,
      water: document.getElementById('j-water').value,
      highlight: document.getElementById('j-highlight').value,
      triggers: document.getElementById('j-triggers').value,
      activities: checkedActs,
      metrics,
      reflection: document.getElementById('j-reflection').value || 'Focused study session.'
    };

    if (this.journalState.editingId) {
      const idx = PHIZIKS.state.journalEntries.findIndex(e => e.id === this.journalState.editingId);
      if (idx !== -1) PHIZIKS.state.journalEntries[idx] = entryData;
      this.journalState.editingId = null;
    } else {
      PHIZIKS.state.journalEntries.unshift(entryData);
    }

    localStorage.removeItem('dxdy_journal_draft');
    PHIZIKS.saveState();
    this.renderJournalSuite();
  },

  editJournalEntry(id) {
    const en = (PHIZIKS.state.journalEntries || []).find(e => e.id === id);
    if (!en) return;
    this.journalState.editingId = id;
    this.renderJournalSuite();

    setTimeout(() => {
      if (document.getElementById('j-school-hrs')) document.getElementById('j-school-hrs').value = en.schoolHrs || 6;
      if (document.getElementById('j-self-hrs')) document.getElementById('j-self-hrs').value = en.selfHrs || 5.5;
      if (document.getElementById('j-topics')) document.getElementById('j-topics').value = en.topics || '';
      if (document.getElementById('j-qcount')) document.getElementById('j-qcount').value = en.qCount || 0;
      if (document.getElementById('j-sleep-hrs')) document.getElementById('j-sleep-hrs').value = en.sleepHrs || 7.5;
      if (document.getElementById('j-energy')) document.getElementById('j-energy').value = en.energyLevel || 8;
      if (document.getElementById('j-stress')) document.getElementById('j-stress').value = en.stressLevel || 3;
      if (document.getElementById('j-water')) document.getElementById('j-water').value = en.water || '';
      if (document.getElementById('j-highlight')) document.getElementById('j-highlight').value = en.highlight || '';
      if (document.getElementById('j-triggers')) document.getElementById('j-triggers').value = en.triggers || '';
      if (document.getElementById('j-reflection')) document.getElementById('j-reflection').value = en.reflection || '';
    }, 30);
  },

  cancelEditJournalEntry() {
    this.journalState.editingId = null;
    this.renderJournalSuite();
  },

  deleteJournalEntry(id) {
    PHIZIKS.state.journalEntries = (PHIZIKS.state.journalEntries || []).filter(e => e.id !== id);
    PHIZIKS.saveState();
    this.renderJournalSuite();
  },

  clearAllJournalEntries() {
    if (!confirm('Permanently delete all saved journal entries in this profile?')) return;
    PHIZIKS.state.journalEntries = [];
    localStorage.removeItem('dxdy_journal_draft');
    PHIZIKS.saveState();
    this.renderJournalSuite();
  },

  exportJournalData() {
    const blob = new Blob([JSON.stringify(PHIZIKS.state.journalEntries || [], null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `dxdy-journal-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  },

  drawJournalTrendsChart() {
    const canvas = document.getElementById('journal-trends-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const entries = (PHIZIKS.state.journalEntries || []).slice(0, 7).reverse();
    const data = entries.length > 0
      ? entries.map(e => ({
          label: (e.dayKey || e.date || '').slice(0, 5),
          selfHrs: parseFloat(e.selfHrs) || 5,
          goalHrs: parseFloat(PHIZIKS.state.profile.dailyGoalHours) || 6,
          sleep: parseFloat(e.sleepHrs) || 7.5
        }))
      : (PHIZIKS.state.distractionLogs || []).slice(-7).map(d => ({
          label: d.date,
          selfHrs: d.productive,
          goalHrs: parseFloat(PHIZIKS.state.profile.dailyGoalHours) || 6,
          sleep: 7.5
        }));

    const baseY = H - 28;
    const scaleY = 14;
    const gap = (W - 70) / Math.max(1, data.length);

    ctx.fillStyle = '#f0f4f8';
    ctx.font = '11px Inter';
    ctx.fillText('Cyan Bars: Actual Self-Study Hrs | Dashed Line: Goal Hrs | Violet Curve: Sleep Hrs', 16, 18);

    const goalY = baseY - (parseFloat(PHIZIKS.state.profile.dailyGoalHours || 6) * scaleY);
    ctx.strokeStyle = 'rgba(255, 171, 0, 0.55)';
    ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.moveTo(30, goalY); ctx.lineTo(W - 20, goalY); ctx.stroke();
    ctx.setLineDash([]);

    data.forEach((pt, idx) => {
      const x = 42 + idx * gap;
      const barH = pt.selfHrs * scaleY;
      ctx.fillStyle = 'rgba(0, 240, 255, 0.78)';
      ctx.fillRect(x, baseY - barH, 28, barH);
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(pt.label, x, H - 10);
    });

    ctx.strokeStyle = '#7c4dff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    data.forEach((pt, idx) => {
      const x = 56 + idx * gap;
      const y = baseY - pt.sleep * scaleY;
      if (idx === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();
  },

  updateProfileDates() {
    const p = PHIZIKS.state.profile;
    p.currentClass = document.getElementById('prof-class').value;
    p.dailyGoalHours = parseFloat(document.getElementById('prof-goal-hrs').value || 6);
    p.jeeMainDate = document.getElementById('prof-jeemain').value;
    p.jeeAdvDate = document.getElementById('prof-jeeadv').value;
    p.boardExamDate = document.getElementById('prof-board').value;
    PHIZIKS.saveState();
    this.renderJournalSuite();
  }
};
