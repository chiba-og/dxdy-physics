const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const DATA_DIR = path.join(__dirname, 'data');
const CHAPTERS_DIR = path.join(DATA_DIR, 'chapters');
const DB_FILE = path.join(DATA_DIR, 'user_database.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(CHAPTERS_DIR)) fs.mkdirSync(CHAPTERS_DIR);

// Inactivity Policy Constants (90 Days Auto-Delete, 83 Days = 7-Day Advance Warning)
const DAY_MS = 24 * 60 * 60 * 1000;
const INACTIVITY_DELETE_DAYS = 90;
const INACTIVITY_WARNING_DAYS = 83;

function createFreshProfileData(overrides = {}) {
  const now = new Date().toISOString();
  return {
    id: overrides.id || `prof_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: overrides.createdAt || now,
    lastActiveAt: overrides.lastActiveAt || now,
    profile: {
      studentName: (overrides.profile && overrides.profile.studentName) || overrides.studentName || "Scholar",
      currentClass: (overrides.profile && overrides.profile.currentClass) || overrides.currentClass || "Class 11",
      targetExam: (overrides.profile && overrides.profile.targetExam) || overrides.targetExam || "JEE Main & Advanced",
      jeeMainDate: (overrides.profile && overrides.profile.jeeMainDate) || "2028-01-24",
      jeeAdvDate: (overrides.profile && overrides.profile.jeeAdvDate) || "2028-05-28",
      boardExamDate: (overrides.profile && overrides.profile.boardExamDate) || "2027-03-01",
      dailyGoalHours: (overrides.profile && overrides.profile.dailyGoalHours) || 6,
      schoolAlerts: (overrides.profile && overrides.profile.schoolAlerts) || [
        { id: "al-1", title: "Physics Practical Lab Manual Submission", dueDate: "2026-11-05", category: "Practical" },
        { id: "al-2", title: "Rotational Motion Coaching Minor Test", dueDate: "2026-10-28", category: "Test" }
      ]
    },
    theme: overrides.theme || {
      mode: "dark",
      accent: "#00f0ff",
      secondaryAccent: "#7c4dff",
      fontFamily: "'Inter', sans-serif",
      wallpaperType: "grid",
      wallpaperUrl: "",
      logoVariant: "slash",
      uiSounds: true
    },
    progress: overrides.progress || {},
    revisionQueue: overrides.revisionQueue || {},
    lastVisited: overrides.lastVisited || { chapterId: "ch00_basic_maths", topicId: null, updatedAt: now },
    seenQuestions: overrides.seenQuestions || [],
    notes: overrides.notes || {},
    tasks: overrides.tasks || [
      { id: "t-1", text: "Complete Basic Mathematics Calculus Derivations", completed: false, priority: "High", chapterId: "ch00_basic_maths", plannedHours: 2.0 },
      { id: "t-2", text: "Solve 25 Kinematics 2D Projectile PYQs", completed: false, priority: "High", chapterId: "ch03_motion_plane", plannedHours: 2.5 }
    ],
    distractionLogs: overrides.distractionLogs || [
      { date: "Mon", productive: 5.5, distracted: 1.5, school: 6.0 },
      { date: "Tue", productive: 6.0, distracted: 1.0, school: 6.0 },
      { date: "Wed", productive: 4.5, distracted: 2.0, school: 6.0 },
      { date: "Thu", productive: 7.0, distracted: 0.8, school: 6.0 },
      { date: "Fri", productive: 6.5, distracted: 1.2, school: 6.0 },
      { date: "Sat", productive: 8.5, distracted: 1.5, school: 0.0 },
      { date: "Sun", productive: 9.0, distracted: 1.0, school: 0.0 }
    ],
    journalEntries: overrides.journalEntries || [],
    customActivities: overrides.customActivities || ["Drawing", "Hip-Hop Dance", "Guitar Practice", "Martial Arts / Sports"],
    customMetrics: overrides.customMetrics || ["Concept Clarity (1-10)", "Mock Test Accuracy (%)"],
    testHistory: overrides.testHistory || []
  };
}

function computeInactivityStatus(lastActiveIso) {
  const nowMs = Date.now();
  const lastMs = Date.parse(lastActiveIso || new Date().toISOString()) || nowMs;
  const elapsedMs = Math.max(0, nowMs - lastMs);
  const inactiveDays = Math.floor(elapsedMs / DAY_MS);
  const deleteAtMs = lastMs + INACTIVITY_DELETE_DAYS * DAY_MS;
  const daysUntilDeletion = Math.max(0, Math.ceil((deleteAtMs - nowMs) / DAY_MS));
  const warningActive = inactiveDays >= INACTIVITY_WARNING_DAYS && inactiveDays < INACTIVITY_DELETE_DAYS;
  const expired = elapsedMs >= INACTIVITY_DELETE_DAYS * DAY_MS;

  return {
    lastActiveAt: new Date(lastMs).toISOString(),
    deleteAt: new Date(deleteAtMs).toISOString(),
    inactiveDays,
    daysUntilDeletion,
    warningActive,
    expired,
    warningMessage: warningActive
      ? `Inactivity Notice: This dx/dy profile has been inactive for ${inactiveDays} days and will be automatically deleted in ${daysUntilDeletion} day(s). Click "Keep My Account Active" or log any study activity to reset your 90-day timer.`
      : null
  };
}

// Read & auto-migrate database while enforcing 90-day inactivity cleanup
function readRawStore() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initialProfile = createFreshProfileData({ id: "prof_default" });
      const store = {
        version: 2,
        activeProfileId: initialProfile.id,
        profiles: { [initialProfile.id]: initialProfile }
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2), 'utf8');
      return store;
    }

    const raw = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));

    // Migrate legacy single-user user_database.json seamlessly without losing user data
    if (!raw.profiles) {
      const migrated = createFreshProfileData({
        id: "prof_default",
        profile: raw.profile,
        theme: raw.theme,
        progress: raw.progress,
        seenQuestions: raw.seenQuestions,
        notes: raw.notes,
        tasks: raw.tasks,
        distractionLogs: raw.distractionLogs,
        journalEntries: raw.journalEntries,
        customActivities: raw.customActivities,
        testHistory: raw.testHistory
      });
      const store = {
        version: 2,
        activeProfileId: migrated.id,
        profiles: { [migrated.id]: migrated }
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2), 'utf8');
      return store;
    }

    return raw;
  } catch (err) {
    console.error("Database read error, initializing default store:", err);
    const fallback = createFreshProfileData({ id: "prof_default" });
    return { version: 2, activeProfileId: fallback.id, profiles: { [fallback.id]: fallback } };
  }
}

function writeRawStore(store) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error("Database write error:", err);
    return false;
  }
}

function enforceInactivitySweep() {
  const store = readRawStore();
  let modified = false;

  Object.keys(store.profiles).forEach(pid => {
    const pData = store.profiles[pid];
    const status = computeInactivityStatus(pData.lastActiveAt);
    if (status.expired) {
      console.log(`🗑️ Auto-deleting profile "${pData.profile?.studentName}" (${pid}) after 90 days of inactivity.`);
      delete store.profiles[pid];
      modified = true;
    }
  });

  const remainingIds = Object.keys(store.profiles);
  if (remainingIds.length === 0) {
    const fresh = createFreshProfileData({ id: "prof_default" });
    store.profiles[fresh.id] = fresh;
    store.activeProfileId = fresh.id;
    modified = true;
  } else if (!store.profiles[store.activeProfileId]) {
    store.activeProfileId = remainingIds[0];
    modified = true;
  }

  if (modified) writeRawStore(store);
  return store;
}

// Run inactivity sweep on server boot and every 6 hours
enforceInactivitySweep();
setInterval(enforceInactivitySweep, 6 * 60 * 60 * 1000);

function buildStateResponse(store) {
  const active = store.profiles[store.activeProfileId];
  const inactivity = computeInactivityStatus(active.lastActiveAt);
  const profileList = Object.values(store.profiles).map(p => ({
    id: p.id,
    studentName: p.profile?.studentName || "Scholar",
    currentClass: p.profile?.currentClass || "Class 11",
    targetExam: p.profile?.targetExam || "JEE Main & Advanced",
    lastActiveAt: p.lastActiveAt,
    inactivity: computeInactivityStatus(p.lastActiveAt)
  }));

  return {
    ...active,
    activeProfileId: store.activeProfileId,
    profilesSummary: profileList,
    inactivity
  };
}

// ==========================================
// REST API: STATE & NO-PII PROFILE SYSTEM
// ==========================================

// 1. Get active profile state + inactivity warning status + profile list
app.get('/api/state', (req, res) => {
  const store = enforceInactivitySweep();
  res.json(buildStateResponse(store));
});

// 2. Save / sync active profile state & update lastActiveAt
app.post('/api/state', (req, res) => {
  const store = enforceInactivitySweep();
  const activeId = (req.body && req.body.activeProfileId && store.profiles[req.body.activeProfileId])
    ? req.body.activeProfileId
    : store.activeProfileId;

  const current = store.profiles[activeId];
  const incoming = { ...req.body };
  delete incoming.profilesSummary;
  delete incoming.inactivity;
  delete incoming.activeProfileId;

  const updated = {
    ...current,
    ...incoming,
    id: activeId,
    lastActiveAt: incoming.simulateLastActiveAt || new Date().toISOString()
  };
  delete updated.simulateLastActiveAt;

  store.profiles[activeId] = updated;
  writeRawStore(store);
  res.json({ success: true, state: buildStateResponse(store) });
});

// 3. Create a new no-email / no-phone profile
app.post('/api/profiles', (req, res) => {
  const store = enforceInactivitySweep();
  const { studentName, currentClass, targetExam, jeeMainDate, jeeAdvDate, boardExamDate } = req.body || {};
  const newProf = createFreshProfileData({
    profile: {
      studentName: (studentName || "New Scholar").trim(),
      currentClass: currentClass || "Class 11",
      targetExam: targetExam || "JEE Main & Advanced",
      jeeMainDate: jeeMainDate || "2028-01-24",
      jeeAdvDate: jeeAdvDate || "2028-05-28",
      boardExamDate: boardExamDate || "2027-03-01",
      schoolAlerts: []
    }
  });
  store.profiles[newProf.id] = newProf;
  store.activeProfileId = newProf.id;
  writeRawStore(store);
  res.json({ success: true, state: buildStateResponse(store) });
});

// 4. Switch active profile
app.post('/api/profiles/switch', (req, res) => {
  const store = enforceInactivitySweep();
  const { profileId } = req.body || {};
  if (!profileId || !store.profiles[profileId]) {
    return res.status(404).json({ error: "Profile not found" });
  }
  store.activeProfileId = profileId;
  store.profiles[profileId].lastActiveAt = new Date().toISOString();
  writeRawStore(store);
  res.json({ success: true, state: buildStateResponse(store) });
});

// 5. Touch / reset inactivity deadline ("Keep My Account Active")
app.post('/api/profiles/touch', (req, res) => {
  const store = enforceInactivitySweep();
  const active = store.profiles[store.activeProfileId];
  if (active) {
    active.lastActiveAt = (req.body && req.body.simulateLastActiveAt)
      ? req.body.simulateLastActiveAt
      : new Date().toISOString();
    writeRawStore(store);
  }
  res.json({ success: true, state: buildStateResponse(store) });
});

// 6. Manually delete a profile and all its personal data permanently
app.delete('/api/profiles/:id', (req, res) => {
  const store = enforceInactivitySweep();
  const targetId = req.params.id;
  if (!store.profiles[targetId]) {
    return res.status(404).json({ error: "Profile not found" });
  }
  delete store.profiles[targetId];
  const remaining = Object.keys(store.profiles);
  if (remaining.length === 0) {
    const fresh = createFreshProfileData({ id: "prof_default" });
    store.profiles[fresh.id] = fresh;
    store.activeProfileId = fresh.id;
  } else if (store.activeProfileId === targetId) {
    store.activeProfileId = remaining[0];
  }
  writeRawStore(store);
  res.json({ success: true, state: buildStateResponse(store) });
});

// 7. Export active profile data as JSON backup
app.get('/api/export', (req, res) => {
  const store = enforceInactivitySweep();
  const active = store.profiles[store.activeProfileId];
  res.setHeader('Content-Disposition', `attachment; filename="dxdy-profile-${active.profile?.studentName || 'backup'}.json"`);
  res.json({
    exportedFrom: "dx/dy",
    exportedAt: new Date().toISOString(),
    profileData: active
  });
});

// 8. Import profile data from JSON backup
app.post('/api/import', (req, res) => {
  const store = enforceInactivitySweep();
  const payload = req.body && (req.body.profileData || req.body);
  if (!payload || typeof payload !== 'object') {
    return res.status(400).json({ error: "Invalid backup file format" });
  }
  const imported = createFreshProfileData({
    ...payload,
    id: payload.id && !store.profiles[payload.id] ? payload.id : `prof_${Date.now()}`,
    lastActiveAt: new Date().toISOString()
  });
  store.profiles[imported.id] = imported;
  store.activeProfileId = imported.id;
  writeRawStore(store);
  res.json({ success: true, state: buildStateResponse(store) });
});

// ==========================================
// REST API: CHAPTERS (WITH ALIAS FALLBACK)
// ==========================================

app.get('/api/chapters', (req, res) => {
  try {
    const files = fs.readdirSync(CHAPTERS_DIR).filter(f => f.endsWith('.json'));
    const installed = files.map(file => {
      try {
        const raw = JSON.parse(fs.readFileSync(path.join(CHAPTERS_DIR, file), 'utf8'));
        return {
          id: raw.id,
          code: raw.code,
          title: raw.title,
          classLevel: raw.classLevel,
          unit: raw.unit,
          topicCount: raw.topics ? raw.topics.length : 0,
          questionCount: raw.questions ? raw.questions.length : 0,
          installed: true
        };
      } catch (e) {
        return null;
      }
    }).filter(Boolean);
    res.json({ installed });
  } catch (err) {
    res.json({ installed: [] });
  }
});

app.get('/api/chapters/:id', (req, res) => {
  const requestedId = req.params.id.replace(/[^a-zA-Z0-9_-]/g, '');
  const directPath = path.join(CHAPTERS_DIR, `${requestedId}.json`);
  if (fs.existsSync(directPath)) {
    return res.json(JSON.parse(fs.readFileSync(directPath, 'utf8')));
  }

  // Fallback: match by 2-digit chapter code prefix (e.g., ch14_*) so no chapter ever 404s due to an alias
  const codeMatch = requestedId.match(/^ch(\d{2})/);
  if (codeMatch) {
    const code = codeMatch[1];
    const files = fs.readdirSync(CHAPTERS_DIR).filter(f => f.endsWith('.json'));
    for (const file of files) {
      if (file.startsWith(`ch${code}_`)) {
        return res.json(JSON.parse(fs.readFileSync(path.join(CHAPTERS_DIR, file), 'utf8')));
      }
    }
  }

  res.status(404).json({
    error: "Chapter data file not yet installed in data/chapters/",
    chapterId: requestedId
  });
});

app.post('/api/chapters/:id', (req, res) => {
  const chapterId = req.params.id.replace(/[^a-zA-Z0-9_-]/g, '');
  const filePath = path.join(CHAPTERS_DIR, `${chapterId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2), 'utf8');
  res.json({ success: true, chapterId });
});

// ==========================================
// GOOGLE SEO: ROBOTS.TXT & SITEMAP.XML
// ==========================================
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\nSitemap: ${req.protocol}://${req.get('host')}/sitemap.xml`);
});

app.get('/sitemap.xml', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const chapters = [
    "ch00_basic_maths", "ch01_units_measurements", "ch02_motion_straight_line",
    "ch03_motion_plane", "ch04_laws_of_motion", "ch05_work_energy_power",
    "ch06_rotational_motion", "ch07_gravitation", "ch08_mechanical_solids",
    "ch09_mechanical_fluids", "ch10_thermal_matter", "ch11_thermodynamics",
    "ch12_kinetic_theory", "ch13_oscillations", "ch14_waves",
    "ch15_electric_charges_fields", "ch16_electrostatic_potential_capacitance",
    "ch17_current_electricity", "ch18_moving_charges_magnetism",
    "ch19_magnetism_matter", "ch20_electromagnetic_induction",
    "ch21_alternating_current", "ch22_ray_optics", "ch23_wave_optics",
    "ch24_dual_nature", "ch25_atoms", "ch26_nuclei",
    "ch27_semiconductors", "ch28_experimental_physics"
  ];

  const urls = chapters.map(ch => `
  <url>
    <loc>${baseUrl}/#chapter/${ch}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`).join('');

  res.header('Content-Type', 'application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>${urls}
</urlset>`);
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 dx/dy ENGINE LIVE AT: http://localhost:${PORT}`);
  console.log(`📚 29-Chapter Registry & Profile Engine Active`);
  console.log(`======================================================\n`);
});