// bathroom-model.js — shared bathroom 3D model
// Requires: THREE loaded before this script
// Page must declare globals: W, D, H, layerGroups, layerState

// ── MATERIAL & GEOMETRY HELPERS ──
function mat(color, opacity = 1, emissive = 0, emissiveIntensity = 0) {
  const m = new THREE.MeshPhongMaterial({
    color, transparent: opacity < 1, opacity, side: THREE.DoubleSide,
    depthWrite: opacity >= 0.75,
  });
  if (emissive) { m.emissive = new THREE.Color(emissive); m.emissiveIntensity = emissiveIntensity; }
  return m;
}
function box(bw, bh, bd, material, px, py, pz) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), material);
  m.position.set(px || 0, py || 0, pz || 0);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}
function cyl(r, h, material, px, py, pz, rx, rz, specs) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 12), material);
  m.position.set(px || 0, py || 0, pz || 0);
  if (rx) m.rotation.x = rx;
  if (rz) m.rotation.z = rz;
  m.castShadow = true;
  if (specs) m.userData = {
    _hasSpecs: true,
    longitud: Math.round(Math.abs(h) * 1000) / 1000,
    diametro: Math.round(r * 2 * 1000),
    ...specs
  };
  return m;
}

// ════════════════════════════════════════════════
// FIXTURES
// ════════════════════════════════════════════════

function addToilet(group, px, pz, rotY) {
  const g = new THREE.Group();
  const white = mat(0xF0EDE8, 0.98);
  const bright = mat(0xFAF8F5, 1);
  const chrome = mat(0xC8C8C8, 1);
  const dark = mat(0x222233, 0.9);

  g.add(box(0.28, 0.04, 0.18, white, 0, 0.02, -0.10));
  g.add(box(0.34, 0.26, 0.44, white, 0, 0.16, 0.02));
  g.add(box(0.28, 0.20, 0.10, white, 0, 0.14, 0.26));
  g.add(box(0.36, 0.02, 0.50, bright, 0, 0.30, 0.03));
  const bowlInt = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.08, 0.06, 16), dark);
  bowlInt.position.set(0, 0.28, 0.06);
  g.add(bowlInt);
  const seat = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.022, 8, 20), bright);
  seat.rotation.x = -Math.PI / 2; seat.position.set(0, 0.32, 0.06);
  g.add(seat);
  g.add(box(0.32, 0.34, 0.14, white, 0, 0.38, -0.24));
  g.add(box(0.34, 0.02, 0.16, bright, 0, 0.56, -0.24));
  const fbtn = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.012, 10), chrome);
  fbtn.position.set(0, 0.575, -0.24); g.add(fbtn);
  g.add(cyl(0.007, 0.30, mat(0x3B82F6, 0.9), -0.16, 0.15, -0.30));
  const valve = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.025, 8), chrome);
  valve.position.set(-0.16, 0.28, -0.30); g.add(valve);

  g.position.set(px, 0, pz);
  g.rotation.y = rotY || 0;
  group.add(g);
}

function addSink(group, px, pz, rotY) {
  const g = new THREE.Group();
  const white = mat(0xF0EDE8, 0.98);
  const bright = mat(0xFAF8F5, 1);
  const chrome = mat(0xC8C8C8, 1);
  const wood = mat(0x8B6F47, 0.95);
  const dark = mat(0x2a2a3a, 0.85);

  g.add(box(0.56, 0.55, 0.38, wood, 0, 0.275, 0));
  g.add(box(0.005, 0.45, 0.36, mat(0x7A6040, 1), 0, 0.28, 0.01));
  const knob1 = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 8), chrome);
  knob1.position.set(-0.06, 0.30, 0.20); g.add(knob1);
  const knob2 = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 8), chrome);
  knob2.position.set(0.06, 0.30, 0.20); g.add(knob2);
  g.add(box(0.60, 0.025, 0.42, mat(0xE8E0D4, 1), 0, 0.565, 0));
  g.add(box(0.44, 0.12, 0.32, white, 0, 0.52, 0.02));
  const basinInt = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.10, 0.08, 16), dark);
  basinInt.position.set(0, 0.52, 0.02); g.add(basinInt);
  const faucetBase = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.016, 0.04, 10), chrome);
  faucetBase.position.set(0, 0.60, -0.14); g.add(faucetBase);
  g.add(cyl(0.006, 0.12, chrome, 0, 0.68, -0.12));
  g.add(cyl(0.006, 0.08, chrome, 0, 0.73, -0.08, Math.PI / 2.5));
  g.add(box(0.04, 0.006, 0.006, chrome, -0.04, 0.62, -0.14));
  g.add(box(0.04, 0.006, 0.006, chrome, 0.04, 0.62, -0.14));
  const mirrorM = new THREE.Mesh(new THREE.PlaneGeometry(0.48, 0.60), mat(0xB0CCE0, 0.55));
  mirrorM.position.set(0, H * 0.52, -0.20); g.add(mirrorM);
  g.add(box(0.50, 0.62, 0.012, mat(0xA0A0A0, 0.9), 0, H * 0.52, -0.20));
  g.add(cyl(0.008, 0.35, mat(0x3B82F6, 0.9), -0.14, 0.175, -0.14));
  g.add(cyl(0.008, 0.35, mat(0xEF4444, 0.9), 0.14, 0.175, -0.14));
  g.add(cyl(0.014, 0.30, mat(0x6B7280, 0.8), 0, 0.15, 0.02));
  g.add(cyl(0.014, 0.08, mat(0x6B7280, 0.8), 0, 0.04, 0.06, Math.PI / 2));

  g.position.set(px, 0, pz);
  g.rotation.y = rotY || 0;
  group.add(g);
}

function addShower(group, px, pz, sw, sd, rotY) {
  const g = new THREE.Group();
  const chrome = mat(0xC8C8C8, 1);
  const trayM = mat(0xE8E0D4, 0.95);
  const glassM = mat(0xBBDDEE, 0.15);
  const rimM = mat(0xD4CFC4, 1);

  g.add(box(sw, 0.045, sd, trayM, 0, 0.023, 0));
  g.add(box(sw + 0.02, 0.07, 0.025, rimM, 0, 0.035, -sd / 2));
  g.add(box(sw + 0.02, 0.07, 0.025, rimM, 0, 0.035, sd / 2));
  g.add(box(0.025, 0.07, sd, rimM, -sw / 2, 0.035, 0));
  g.add(box(0.025, 0.07, sd, rimM, sw / 2, 0.035, 0));
  const drain = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.006, 14), mat(0x808080, 1));
  drain.position.set(0, 0.048, 0); g.add(drain);

  const glassH = H * 0.70;
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(sw * 0.95, glassH), glassM);
  glass.position.set(0, glassH / 2 + 0.07, -sd / 2 + 0.01); g.add(glass);
  g.add(box(sw * 0.95, 0.012, 0.012, chrome, 0, glassH + 0.07, -sd / 2 + 0.01));
  g.add(cyl(0.005, glassH, chrome, -sw * 0.475, glassH / 2 + 0.07, -sd / 2 + 0.01));
  g.add(cyl(0.005, glassH, chrome, sw * 0.475, glassH / 2 + 0.07, -sd / 2 + 0.01));
  g.add(box(0.018, 0.12, 0.022, chrome, sw * 0.25, H * 0.40, -sd / 2 + 0.025));
  g.add(cyl(0.016, H * 0.55, chrome, 0, H * 0.40, sd / 2 - 0.04));
  const shHead = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.10, 0.012, 20), chrome);
  shHead.position.set(0, H * 0.72, sd / 2 - 0.12); g.add(shHead);
  g.add(cyl(0.009, 0.14, chrome, 0, H * 0.71, sd / 2 - 0.08, Math.PI / 3));
  const mixer = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.025, 12), chrome);
  mixer.position.set(0, H * 0.38, sd / 2 - 0.02); mixer.rotation.x = Math.PI / 2; g.add(mixer);
  g.add(box(0.07, 0.012, 0.012, chrome, 0, H * 0.38, sd / 2 - 0.04));
  g.add(cyl(0.008, H * 0.45, mat(0x3B82F6, 0.9), -0.05, H * 0.23, sd / 2 - 0.01));
  g.add(cyl(0.008, H * 0.45, mat(0xEF4444, 0.9), 0.05, H * 0.23, sd / 2 - 0.01));
  g.add(cyl(0.02, 0.10, mat(0x6B7280, 0.8), 0, -0.03, 0));

  g.position.set(px, 0, pz);
  g.rotation.y = rotY || 0;
  group.add(g);
}

// ════════════════════════════════════════════════
// BUILD MODEL
// ════════════════════════════════════════════════
function buildModel() {
  const lg = layerGroups;
  const w2 = W / 2, d2 = D / 2;
  const WT = 0.12;

  // ─── ESTRUCTURA ───
  const wallM   = mat(0x9CA3AF, 0.42);
  const wallExtM = mat(0x878F9B, 0.50);
  const floorM  = mat(0x374151, 0.92);
  const ceilM   = mat(0xE5E7EB, 0.10);
  const frameM  = mat(0x6B7280, 0.88);

  // Floor
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), floorM);
  floor.rotation.x = -Math.PI / 2; floor.position.y = 0.001; floor.receiveShadow = true;
  lg.estructura.add(floor);

  // Ceiling
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W, D), ceilM);
  ceil.rotation.x = Math.PI / 2; ceil.position.y = H - 0.001;
  lg.estructura.add(ceil);

  // North wall (solid, z = -d2)
  lg.estructura.add(box(W, H, WT, wallM, 0, H / 2, -d2 + WT / 2));
  // South wall (solid, z = +d2)
  lg.estructura.add(box(W, H, WT, wallM, 0, H / 2, d2 - WT / 2));

  // East wall — small bathroom window (x = +w2)
  // Window: 0.60m wide × 0.72m tall, positioned high for privacy in north area
  const winZc = -D * 0.18;          // center Z of window (-0.63 for D=3.5)
  const winHalfW = 0.30;             // half-width of window
  const winZ1 = winZc - winHalfW;   // north edge  ≈ -0.93
  const winZ2 = winZc + winHalfW;   // south edge  ≈ -0.33
  const winY1 = H * 0.50;           // bottom (privacy height)
  const winY2 = H * 0.82;           // top
  const winW  = winZ2 - winZ1;      // 0.60m
  const winHt = winY2 - winY1;      // H*0.32
  // Wall below/above window (full depth strips)
  lg.estructura.add(box(WT, winY1, D, wallExtM, w2-WT/2, winY1/2, 0));
  lg.estructura.add(box(WT, H-winY2, D, wallExtM, w2-WT/2, (H+winY2)/2, 0));
  // Wall north of window (from -d2 to winZ1)
  const segN = d2 + winZ1;          // positive length
  lg.estructura.add(box(WT, winHt, segN, wallExtM, w2-WT/2, (winY1+winY2)/2, (-d2+winZ1)/2));
  // Wall south of window (from winZ2 to d2)
  const segS = d2 - winZ2;          // positive length
  lg.estructura.add(box(WT, winHt, segS, wallExtM, w2-WT/2, (winY1+winY2)/2, (winZ2+d2)/2));
  // Window sill & lintel
  lg.estructura.add(box(0.05, 0.025, winW+0.06, frameM, w2-0.025, winY1, winZc));
  lg.estructura.add(box(0.05, 0.035, winW+0.10, frameM, w2-0.025, winY2+0.018, winZc));
  // Window glass
  const winGlass = new THREE.Mesh(new THREE.PlaneGeometry(winW, winHt), mat(0x87CEEB, 0.22));
  winGlass.position.set(w2-WT/2, (winY1+winY2)/2, winZc);
  winGlass.rotation.y = Math.PI/2; lg.estructura.add(winGlass);
  // Window vertical frame bars
  lg.estructura.add(box(0.025, winHt+0.04, 0.025, frameM, w2-0.06, (winY1+winY2)/2, winZ1));
  lg.estructura.add(box(0.025, winHt+0.04, 0.025, frameM, w2-0.06, (winY1+winY2)/2, winZ2));
  // Horizontal cross bar
  lg.estructura.add(box(0.025, 0.025, winW+0.04, frameM, w2-0.06, (winY1+winY2)/2, winZc));

  // West wall — door opening (x = -w2)
  const doorZ1 = -D * 0.22, doorZ2 = -D * 0.02;
  const doorH = H * 0.84;
  const doorW = doorZ2 - doorZ1;
  // Above door
  lg.estructura.add(box(WT, H-doorH, doorW, wallExtM, -w2+WT/2, (H+doorH)/2, (doorZ1+doorZ2)/2));
  // South of door (from doorZ2 to +d2)
  lg.estructura.add(box(WT, H, d2+doorZ2, wallExtM, -w2+WT/2, H/2, (doorZ2+d2)/2));
  // North of door (from -d2 to doorZ1) — FIX: d2+doorZ1 not d2-doorZ1
  lg.estructura.add(box(WT, H, d2+doorZ1, wallExtM, -w2+WT/2, H/2, (-d2+doorZ1)/2));
  // Door frame
  lg.estructura.add(box(0.06, doorH, 0.035, frameM, -w2+0.03, doorH/2, doorZ1));
  lg.estructura.add(box(0.06, doorH, 0.035, frameM, -w2+0.03, doorH/2, doorZ2));
  lg.estructura.add(box(0.06, 0.04, doorW+0.035, frameM, -w2+0.03, doorH, (doorZ1+doorZ2)/2));
  // Door panel (slightly open)
  const doorPanel = new THREE.Mesh(new THREE.PlaneGeometry(doorW, doorH), mat(0xB0987A, 0.70));
  doorPanel.position.set(-w2+WT/2+0.01, doorH/2, (doorZ1+doorZ2)/2);
  doorPanel.rotation.y = Math.PI/2; lg.estructura.add(doorPanel);
  // Door handle
  const dhM = mat(0xC8C8C8, 1);
  lg.estructura.add(cyl(0.008, 0.09, dhM, -w2+0.06, doorH*0.48, doorZ1+0.07, 0, Math.PI/2));
  const dhKnob = new THREE.Mesh(new THREE.SphereGeometry(0.016, 10, 10), dhM);
  dhKnob.position.set(-w2+0.09, doorH*0.48, doorZ1+0.07); lg.estructura.add(dhKnob);

  // ─── FONTANERÍA ───
  const pipeC = mat(0x3B82F6, 0.92);
  const pipeH = mat(0xEF4444, 0.92);
  const pipeD = mat(0x6B7280, 0.82);
  const PR = 0.010;

  // Fixture positions — proportional to room size
  const toiletX = -(w2 - 0.30);
  const toiletZ = d2 - 0.36;
  const sinkX   = -W * 0.05;
  const sinkZ   = -d2 + 0.28;
  const shW     = Math.min(1.0, W * 0.44);
  const shD     = Math.min(1.0, D * 0.30);
  const showerX = w2 - shW/2 - 0.05;
  const showerZ = d2 - shD/2 - 0.05;

  // ── Risers in NE corner (against east wall + north wall) ──
  const RX = w2 - 0.12;   // x position of east-wall risers
  const RZ = -d2 + 0.12;  // z position (north wall interior)

  const SF = 'Fontanería';  // sistema label shortcut

  // Main cold riser — NE corner, vertical full height
  lg.fontaneria.add(cyl(0.015, H, pipeC, RX, H/2, RZ, 0, 0,
    {nombre:'Riser agua fría principal', sistema:SF, material:'PVC Ø15mm'}));
  // Main hot riser — NE corner, slightly inset
  lg.fontaneria.add(cyl(0.013, H*0.72, pipeH, RX-0.07, H*0.36, RZ, 0, 0,
    {nombre:'Riser agua caliente', sistema:SF, material:'CPVC Ø13mm'}));

  // Cold horizontal — along north wall, from riser westward to sink
  const coldNorthLen = RX - (sinkX - 0.14);
  lg.fontaneria.add(cyl(PR, coldNorthLen, pipeC, (RX + sinkX-0.14)/2, H*0.26, RZ, 0, Math.PI/2,
    {nombre:'Ramal frío pared norte → lavabo', sistema:SF, material:'PVC Ø10mm'}));
  // Cold drop at sink
  lg.fontaneria.add(cyl(PR, H*0.26, pipeC, sinkX-0.14, H*0.13, RZ, 0, 0,
    {nombre:'Bajante frío lavabo', sistema:SF, material:'PVC Ø10mm'}));

  // Hot horizontal — along north wall, from riser westward to sink
  const hotNorthLen = (RX-0.07) - (sinkX + 0.14);
  lg.fontaneria.add(cyl(PR, hotNorthLen, pipeH, ((RX-0.07)+sinkX+0.14)/2, H*0.32, RZ+0.02, 0, Math.PI/2,
    {nombre:'Ramal caliente pared norte → lavabo', sistema:SF, material:'CPVC Ø10mm'}));
  // Hot drop at sink
  lg.fontaneria.add(cyl(PR, H*0.32, pipeH, sinkX+0.14, H*0.16, RZ+0.02, 0, 0,
    {nombre:'Bajante caliente lavabo', sistema:SF, material:'CPVC Ø10mm'}));

  // Cold vertical run — east wall, going south from riser to shower level
  const eastColdLen = showerZ - RZ;
  lg.fontaneria.add(cyl(PR, eastColdLen, pipeC, RX, H*0.26, (RZ+showerZ)/2, Math.PI/2, 0,
    {nombre:'Bajante frío pared este → ducha', sistema:SF, material:'PVC Ø10mm'}));
  // Hot vertical run — east wall, going south from riser to shower level
  lg.fontaneria.add(cyl(PR, eastColdLen, pipeH, RX-0.07, H*0.32, (RZ+showerZ)/2, Math.PI/2, 0,
    {nombre:'Bajante caliente pared este → ducha', sistema:SF, material:'CPVC Ø10mm'}));

  // Supply branch from east wall → toilet along SOUTH WALL
  const sWallZ = d2 - 0.13;
  const toiletBranchLen = RX - toiletX;
  lg.fontaneria.add(cyl(PR, toiletBranchLen, pipeC, (RX+toiletX)/2, H*0.26, sWallZ, 0, Math.PI/2,
    {nombre:'Ramal frío pared sur → WC', sistema:SF, material:'PVC Ø10mm'}));
  // Cold connector from east wall south run to south wall branch
  const connLen = sWallZ - showerZ;
  lg.fontaneria.add(cyl(PR, connLen, pipeC, RX, H*0.26, (showerZ+sWallZ)/2, Math.PI/2, 0,
    {nombre:'Conector pared este → pared sur', sistema:SF, material:'PVC Ø10mm'}));
  // Drop from south wall to toilet valve
  lg.fontaneria.add(cyl(PR, H*0.26, pipeC, toiletX-0.10, H*0.13, sWallZ, 0, 0,
    {nombre:'Bajante frío WC', sistema:SF, material:'PVC Ø10mm'}));

  // ── DRAIN pipes ──
  const drainZ = d2 - 0.14;
  const collectorLen = showerX - toiletX;
  lg.fontaneria.add(cyl(0.027, collectorLen, pipeD, (showerX+toiletX)/2, -0.03, drainZ, 0, Math.PI/2,
    {nombre:'Colector desagüe pared sur', sistema:SF, material:'PVC desagüe Ø27mm'}));

  const toiletDrainLen = drainZ - (toiletZ + 0.15);
  if (toiletDrainLen > 0.05)
    lg.fontaneria.add(cyl(0.022, toiletDrainLen, pipeD, toiletX, -0.03, (toiletZ+0.15+drainZ)/2, Math.PI/2, 0,
      {nombre:'Desagüe WC → colector', sistema:SF, material:'PVC desagüe Ø22mm'}));

  const shDrainEast = (w2-0.14) - showerX;
  lg.fontaneria.add(cyl(0.022, shDrainEast, pipeD, (showerX+(w2-0.14))/2, -0.03, showerZ, 0, Math.PI/2,
    {nombre:'Desagüe ducha → pared este', sistema:SF, material:'PVC desagüe Ø22mm'}));
  const eastDrainLen = drainZ - showerZ;
  lg.fontaneria.add(cyl(0.022, eastDrainLen, pipeD, w2-0.14, -0.03, (showerZ+drainZ)/2, Math.PI/2, 0,
    {nombre:'Desagüe pared este → colector', sistema:SF, material:'PVC desagüe Ø22mm'}));

  // Sink drain
  lg.fontaneria.add(cyl(0.016, 0.28, pipeD, sinkX, 0.14, RZ+0.02, 0, 0,
    {nombre:'Desagüe lavabo', sistema:SF, material:'PVC desagüe Ø16mm'}));

  // Pipe joints (spheres at key connections)
  [[RX, H*0.26, RZ],[RX-0.07, H*0.32, RZ],[sinkX-0.14, H*0.26, RZ],[sinkX+0.14, H*0.32, RZ+0.02],
   [RX, H*0.26, showerZ],[toiletX, -0.03, drainZ],[showerX, -0.03, drainZ]]
    .forEach(([x,y,z]) => {
      const j = new THREE.Mesh(new THREE.SphereGeometry(0.016, 8, 8), pipeC);
      j.position.set(x,y,z); lg.fontaneria.add(j);
    });

  // ─── MUEBLES ───
  addToilet(lg.muebles, toiletX, toiletZ, Math.PI/2);
  addSink(lg.muebles, sinkX, sinkZ, 0);
  addShower(lg.muebles, showerX, showerZ, shW, shD, 0);

  // Towel bar — south wall, runs east-west (rz=Math.PI/2 → X axis)
  const towelM = mat(0xC0C0C0, 1);
  lg.muebles.add(cyl(0.010, 0.65, towelM, toiletX+0.10, H*0.50, d2-WT-0.04, 0, Math.PI/2));
  [[-0.32, 0],[0.32, 0]].forEach(([dx]) => {
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.018,0.018,0.04,10), towelM);
    b.position.set(toiletX+0.10+dx, H*0.50, d2-WT-0.02); lg.muebles.add(b);
  });
  // Towel ring near sink — against north wall
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.065,0.010,8,20), towelM);
  ring.position.set(sinkX+0.40, H*0.44, -d2+WT+0.04); ring.rotation.y = Math.PI/2;
  lg.muebles.add(ring);
  // Toilet paper holder — west wall, bar sticks out in X direction (rz=Math.PI/2)
  const tph = new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.025,0.13,14), mat(0xD8D8D8,1));
  tph.rotation.x = Math.PI/2; tph.position.set(-w2+WT+0.12, H*0.30, toiletZ-0.22);
  lg.muebles.add(tph);
  const tphBar = cyl(0.008, 0.16, towelM, -w2+WT+0.10, H*0.30, toiletZ-0.22, 0, Math.PI/2);
  lg.muebles.add(tphBar);

  // ─── ELÉCTRICO ───
  const condM   = mat(0xFBBF24, 0.92, 0xFBBF24, 0.08);
  const outM    = mat(0xF59E0B, 1);
  const jboxM   = mat(0xD97706, 1);
  const lightEM = new THREE.MeshPhongMaterial({ color:0xFDE68A, emissive:new THREE.Color(0xFDE68A), emissiveIntensity:0.65 });
  const dlEM    = new THREE.MeshPhongMaterial({ color:0xFFFBE6, emissive:new THREE.Color(0xFFFBE6), emissiveIntensity:0.50 });
  const CR  = 0.007;
  const y_c = H * 0.93;  // ceiling conduit run height

  // Conduit backbone anchors
  const CE_X =  w2 - 0.07;   // east wall  (+x)
  const CW_X = -w2 + 0.07;   // west wall  (-x)
  const CN_Z = -d2 + 0.07;   // north wall (-z)
  const CS_Z =  d2 - 0.07;   // south wall (+z)

  // Inline junction-box helper
  function jbox(px, py, pz) {
    const j = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.045, 0.045), jboxM);
    j.position.set(px, py, pz); return j;
  }

  const SE = 'Eléctrico';
  const EMT = 'Conduit EMT Ø7mm';

  // ── ENTRY STUB: panel stub drops from ceiling into NE corner ──
  const entryH = H - y_c;
  lg.electrico.add(cyl(CR, entryH, condM, CE_X, y_c + entryH / 2, CN_Z, 0, 0,
    {nombre:'Acometida panel eléctrico', sistema:SE, material:EMT}));
  lg.electrico.add(jbox(CE_X, y_c, CN_Z));

  // ── RUN A: North wall ceiling conduit, east → west ──
  lg.electrico.add(cyl(CR, CE_X - CW_X, condM, 0, y_c, CN_Z, 0, Math.PI / 2,
    {nombre:'Run A — pared norte (E→O)', sistema:SE, material:EMT}));
  lg.electrico.add(jbox(CW_X, y_c, CN_Z));

  // ── RUN B: East wall ceiling conduit, north → south ──
  lg.electrico.add(cyl(CR, CS_Z - CN_Z, condM, CE_X, y_c, 0, Math.PI / 2, 0,
    {nombre:'Run B — pared este (N→S)', sistema:SE, material:EMT}));
  lg.electrico.add(jbox(CE_X, y_c, CS_Z));

  // ── RUN C: West wall ceiling conduit, north → south ──
  lg.electrico.add(cyl(CR, CS_Z - CN_Z, condM, CW_X, y_c, 0, Math.PI / 2, 0,
    {nombre:'Run C — pared oeste (N→S)', sistema:SE, material:EMT}));
  lg.electrico.add(jbox(CW_X, y_c, CS_Z));

  // ── RUN D: Ceiling cross N→S ──
  lg.electrico.add(jbox(0, y_c, CN_Z));
  lg.electrico.add(cyl(CR, -CN_Z, condM, 0, y_c, CN_Z / 2, Math.PI / 2, 0,
    {nombre:'Run D — cruce techo (N→S)', sistema:SE, material:EMT}));
  lg.electrico.add(jbox(0, y_c, 0));

  // ── FIXTURE 1: Main ceiling light ──
  const ceilUpLen = H - 0.005 - y_c;
  lg.electrico.add(cyl(CR, ceilUpLen, condM, 0, y_c + ceilUpLen / 2, 0, 0, 0,
    {nombre:'Bajante → lámpara techo centro', sistema:SE, material:EMT}));
  const ceilLight = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.015, 24), lightEM);
  ceilLight.position.set(0, H - 0.008, 0); lg.electrico.add(ceilLight);

  // ── FIXTURE 2: Exhaust fan + integrated light above shower ──
  lg.electrico.add(jbox(CE_X, y_c, showerZ));
  lg.electrico.add(cyl(CR, CE_X - showerX, condM, (CE_X + showerX) / 2, y_c, showerZ, 0, Math.PI / 2,
    {nombre:'Ramal → extractor/lámpara ducha', sistema:SE, material:EMT}));
  lg.electrico.add(jbox(showerX, y_c, showerZ));
  const fanUpLen = H - 0.005 - y_c;
  lg.electrico.add(cyl(CR, fanUpLen, condM, showerX, y_c + fanUpLen / 2, showerZ, 0, 0,
    {nombre:'Bajante → extractor ducha', sistema:SE, material:EMT}));
  const fan = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.03, 0.22), mat(0xE5E7EB, 0.92));
  fan.position.set(showerX, H - 0.016, showerZ); lg.electrico.add(fan);
  const fanGrill = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.01, 16), mat(0xD1D5DB, 1));
  fanGrill.position.set(showerX, H - 0.031, showerZ); lg.electrico.add(fanGrill);
  const dlDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.01, 16), dlEM);
  dlDisc.position.set(showerX, H - 0.006, showerZ); lg.electrico.add(dlDisc);

  // ── FIXTURE 3: Vanity / mirror light above sink ──
  lg.electrico.add(jbox(sinkX, y_c, CN_Z));
  const vanDropLen = y_c - H * 0.80;
  lg.electrico.add(cyl(CR, vanDropLen, condM, sinkX, H * 0.80 + vanDropLen / 2, CN_Z, 0, 0,
    {nombre:'Bajante → luz espejo lavabo', sistema:SE, material:EMT}));
  const mirLight = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.022, 0.04), lightEM);
  mirLight.position.set(sinkX, H * 0.80, CN_Z + 0.015); lg.electrico.add(mirLight);

  // ── FIXTURE 4: GFCI outlet on north wall ──
  const gfciX = sinkX + 0.40, gfciY = H * 0.46;
  lg.electrico.add(jbox(gfciX, y_c, CN_Z));
  const gfciDropLen = y_c - gfciY;
  lg.electrico.add(cyl(CR, gfciDropLen, condM, gfciX, gfciY + gfciDropLen / 2, CN_Z, 0, 0,
    {nombre:'Bajante → toma GFCI lavabo', sistema:SE, material:EMT}));
  lg.electrico.add(cyl(CR, 0.07, condM, gfciX, gfciY, CN_Z + 0.035, Math.PI / 2, 0,
    {nombre:'Ramal horizontal → toma GFCI', sistema:SE, material:EMT}));
  lg.electrico.add(box(0.065, 0.045, 0.016, outM, gfciX, gfciY, -d2 + WT + 0.01));

  // ── FIXTURE 5: Light switch south of door, west wall ──
  const swZ = doorZ2 + 0.14, swY = H * 0.43;
  lg.electrico.add(jbox(CW_X, y_c, swZ));
  const swDropLen = y_c - swY;
  lg.electrico.add(cyl(CR, swDropLen, condM, CW_X, swY + swDropLen / 2, swZ, 0, 0,
    {nombre:'Bajante → interruptor puerta', sistema:SE, material:EMT}));
  lg.electrico.add(cyl(CR, 0.07, condM, CW_X + 0.035, swY, swZ, 0, Math.PI / 2,
    {nombre:'Ramal horizontal → interruptor', sistema:SE, material:EMT}));
  lg.electrico.add(box(0.045, 0.065, 0.016, outM, -w2 + WT + 0.01, swY, swZ));

  // ── FIXTURE 6: Outlet near toilet, west wall ──
  const toZ = toiletZ - 0.28, toY = H * 0.18;
  lg.electrico.add(jbox(CW_X, y_c, toZ));
  const toDropLen = y_c - toY;
  lg.electrico.add(cyl(CR, toDropLen, condM, CW_X, toY + toDropLen / 2, toZ, 0, 0,
    {nombre:'Bajante → toma corriente WC', sistema:SE, material:EMT}));
  lg.electrico.add(cyl(CR, 0.07, condM, CW_X + 0.035, toY, toZ, 0, Math.PI / 2,
    {nombre:'Ramal horizontal → toma WC', sistema:SE, material:EMT}));
  lg.electrico.add(box(0.065, 0.045, 0.016, outM, -w2 + WT + 0.01, toY, toZ));

  // ─── ACABADOS ───
  const tileFloorM = mat(0xC8D6E5, 0.85);
  const tileWallM  = mat(0xD4E6F1, 0.50);
  const tileShower = mat(0xB8D0E8, 0.60);
  const tileAccent = mat(0x7EB8D4, 0.65);
  const groutM     = mat(0x9AAABB, 0.35);
  const paintM     = mat(0xF3F4F6, 0.18);
  const tileH  = H * 0.56;
  const tileSize = 0.32;

  // Floor tile field
  const tf = new THREE.Mesh(new THREE.PlaneGeometry(W-WT*2, D-WT*2), tileFloorM);
  tf.rotation.x = -Math.PI/2; tf.position.y = 0.003; tf.receiveShadow = true;
  lg.acabados.add(tf);
  // Floor grout lines
  for (let gx = -w2+WT+tileSize; gx < w2-WT; gx += tileSize)
    lg.acabados.add(box(0.005, 0.002, D-WT*2, groutM, gx, 0.004, 0));
  for (let gz = -d2+WT+tileSize; gz < d2-WT; gz += tileSize)
    lg.acabados.add(box(W-WT*2, 0.002, 0.005, groutM, 0, 0.004, gz));

  // Wall tiles — lower half of all four walls
  const wallTileData = [
    { w: W-WT*2, pos:[0,tileH/2,-d2+WT+0.006], ry:0 },
    { w: W-WT*2, pos:[0,tileH/2, d2-WT-0.006], ry:Math.PI },
    { w: D-WT*2, pos:[w2-WT-0.006, tileH/2, 0], ry:-Math.PI/2 },
    { w: D-WT*2, pos:[-w2+WT+0.006, tileH/2, 0], ry:Math.PI/2 },
  ];
  wallTileData.forEach(({w, pos, ry}) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, tileH), tileWallM);
    m.position.set(...pos); m.rotation.y = ry; lg.acabados.add(m);
  });
  // Shower accent tiles (full height on back and side walls of shower)
  const shAccH = H * 0.75;
  const shAccBack = new THREE.Mesh(new THREE.PlaneGeometry(shW-0.01, shAccH), tileShower);
  shAccBack.position.set(showerX, shAccH/2, d2-WT-0.007); shAccBack.rotation.y = Math.PI;
  lg.acabados.add(shAccBack);
  const shAccSide = new THREE.Mesh(new THREE.PlaneGeometry(shD-0.01, shAccH), tileShower);
  shAccSide.position.set(w2-WT-0.007, shAccH/2, showerZ); shAccSide.rotation.y = -Math.PI/2;
  lg.acabados.add(shAccSide);

  // Accent tile band (decorative stripe at ~H*0.42)
  const bandH = 0.07;
  wallTileData.forEach(({w, pos, ry}) => {
    const ab = new THREE.Mesh(new THREE.PlaneGeometry(w, bandH), tileAccent);
    ab.position.set(pos[0], H*0.42, pos[2] + (ry===0?0.001:ry===Math.PI?-0.001:0));
    ab.rotation.y = ry; lg.acabados.add(ab);
  });

  // Upper wall paint (above tiles)
  const paintHt = H - tileH;
  [
    { w:W-WT*2, pos:[0, tileH+paintHt/2, -d2+WT+0.007], ry:0 },
    { w:W-WT*2, pos:[0, tileH+paintHt/2,  d2-WT-0.007], ry:Math.PI },
    { w:D-WT*2, pos:[ w2-WT-0.007, tileH+paintHt/2, 0], ry:-Math.PI/2 },
    { w:D-WT*2, pos:[-w2+WT+0.007, tileH+paintHt/2, 0], ry:Math.PI/2 },
  ].forEach(({w,pos,ry}) => {
    const pm = new THREE.Mesh(new THREE.PlaneGeometry(w, paintHt), paintM);
    pm.position.set(...pos); pm.rotation.y = ry; lg.acabados.add(pm);
  });

  // Baseboards
  const baseM = mat(0xD0D8E0, 0.75);
  const bh = 0.08, bt = 0.010;
  lg.acabados.add(box(W-WT*2, bh, bt, baseM, 0, bh/2, -d2+WT+bt/2));
  lg.acabados.add(box(W-WT*2, bh, bt, baseM, 0, bh/2,  d2-WT-bt/2));
  lg.acabados.add(box(bt, bh, D-WT*2, baseM,  w2-WT-bt/2, bh/2, 0));
  lg.acabados.add(box(bt, bh, D-WT*2, baseM, -w2+WT+bt/2, bh/2, 0));

  // Crown molding
  const crownM = mat(0xE8ECF0, 0.55);
  const ch = 0.06, cd = 0.008;
  lg.acabados.add(box(W-WT*2, ch, cd, crownM, 0, H-ch/2, -d2+WT+cd/2));
  lg.acabados.add(box(W-WT*2, ch, cd, crownM, 0, H-ch/2,  d2-WT-cd/2));
  lg.acabados.add(box(cd, ch, D-WT*2, crownM,  w2-WT-cd/2, H-ch/2, 0));
  lg.acabados.add(box(cd, ch, D-WT*2, crownM, -w2+WT+cd/2, H-ch/2, 0));
}

function rebuildModel() {
  Object.values(layerGroups).forEach(g => {
    while (g.children.length > 0) g.remove(g.children[0]);
  });
  buildModel();
  // Apply current visibility
  Object.entries(layerState).forEach(([name, visible]) => {
    layerGroups[name].visible = visible;
  });
  updateDimsDisplay();
  // Soft re-center camera target
  controls.target.set(0, H / 2, 0);
  controls.update();
}
