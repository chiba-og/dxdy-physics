const fs = require('fs');
const path = require('path');

const root = __dirname;
const chapDir = path.join(root, 'data', 'chapters');

// Canonical 29-Chapter Registry (00 to 28)
const CANONICAL_CHAPTERS = {
  "00": "ch00_basic_maths",
  "01": "ch01_units_measurements",
  "02": "ch02_motion_straight_line",
  "03": "ch03_motion_plane",
  "04": "ch04_laws_of_motion",
  "05": "ch05_work_energy_power",
  "06": "ch06_rotational_motion",
  "07": "ch07_gravitation",
  "08": "ch08_mechanical_solids",
  "09": "ch09_mechanical_fluids",
  "10": "ch10_thermal_matter",
  "11": "ch11_thermodynamics",
  "12": "ch12_kinetic_theory",
  "13": "ch13_oscillations",
  "14": "ch14_waves",
  "15": "ch15_electric_charges_fields",
  "16": "ch16_electrostatic_potential_capacitance",
  "17": "ch17_current_electricity",
  "18": "ch18_moving_charges_magnetism",
  "19": "ch19_magnetism_matter",
  "20": "ch20_electromagnetic_induction",
  "21": "ch21_alternating_current",
  "22": "ch22_ray_optics",
  "23": "ch23_wave_optics",
  "24": "ch24_dual_nature",
  "25": "ch25_atoms",
  "26": "ch26_nuclei",
  "27": "ch27_semiconductors",
  "28": "ch28_experimental_physics"
};

if (!fs.existsSync(chapDir)) {
  console.log('❌ Folder not found:', chapDir);
  process.exit(1);
}

const foundCodes = new Set();

fs.readdirSync(chapDir).filter(f => f.endsWith('.json')).forEach(file => {
  const fullPath = path.join(chapDir, file);
  let raw = fs.readFileSync(fullPath, 'utf8').trim();

  // Fix any single backslashes inside JSON strings while preserving valid JSON escapes
  let fixed = raw.replace(/(?<!\\)\\(?![\\"/])/g, '\\\\');

  let data;
  try {
    data = JSON.parse(fixed);
  } catch (err) {
    try {
      data = JSON.parse(raw);
    } catch (err2) {
      console.log(`❌ JSON SYNTAX ERROR in ${file}: ${err2.message}`);
      return;
    }
  }

  const code = String(data.code || file.match(/\d{2}/)?.[0] || '').padStart(2, '0');
  const canonicalId = CANONICAL_CHAPTERS[code] || data.id;

  if (canonicalId && data.id !== canonicalId) {
    console.log(`🔄 Updating Chapter ${code} ID: "${data.id}" -> "${canonicalId}"`);
    data.id = canonicalId;
  }
  data.code = code;

  const targetFile = `${canonicalId}.json`;
  const targetPath = path.join(chapDir, targetFile);
  fs.writeFileSync(targetPath, JSON.stringify(data, null, 2), 'utf8');

  if (targetFile !== file && fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }

  foundCodes.add(code);
  console.log(`✅ CHAPTER ${code} VERIFIED: ${targetFile} (${data.title})`);
});

const missing = Object.keys(CANONICAL_CHAPTERS).filter(c => !foundCodes.has(c));
if (missing.length === 0) {
  console.log('\n🎉 ALL 29 CHAPTERS (00 to 28) ARE VALID AND LINKED!');
} else {
  console.log('\n⚠️ Missing Chapter Codes in data/chapters/:', missing.join(', '));
}