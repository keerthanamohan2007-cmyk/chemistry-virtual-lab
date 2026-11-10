const L = (l, a, t, b, c, g) => ({ l, a, t, b, c, g }); // label, ascii label, type, bonding?, orbitals (degeneracy), AO group
const s1 = [L('σ1s', 'sigma1s', 'σ', 1, 1, '1s'), L('σ*1s', 'sigma*1s', 'σ', 0, 1, '1s')];
const s2 = [L('σ2s', 'sigma2s', 'σ', 1, 1, '2s'), L('σ*2s', 'sigma*2s', 'σ', 0, 1, '2s')];
const P = (b) => L(b ? 'π2p' : 'π*2p', b ? 'pi2p' : 'pi*2p', 'π', b, 2, '2p');
const G = (b) => L(b ? 'σ2p' : 'σ*2p', b ? 'sigma2p' : 'sigma*2p', 'σ', b, 1, '2p');
export const MOL = {
  H2: { f: 'H₂', name: 'Hydrogen', n: 2, lv: s1 },
  He2: { f: 'He₂', name: 'Helium', n: 4, lv: s1 },
  Li2: { f: 'Li₂', name: 'Lithium', n: 6, lv: [...s1, ...s2] },
  Be2: { f: 'Be₂', name: 'Beryllium', n: 8, lv: [...s1, ...s2] },

  B2: { f: 'B₂', name: 'Boron', n: 10, lv: [...s1, ...s2, P(1), G(1), P(0), G(0)] },
  C2: { f: 'C₂', name: 'Carbon', n: 12, lv: [...s1, ...s2, P(1), G(1), P(0), G(0)] },
  N2: { f: 'N₂', name: 'Nitrogen', n: 14, lv: [...s1, ...s2, P(1), G(1), P(0), G(0)] }, // s-p mixing: π2p below σ2p
  O2: { f: 'O₂', name: 'Oxygen', n: 16, lv: [...s1, ...s2, G(1), P(1), P(0), G(0)] },
  F2: { f: 'F₂', name: 'Fluorine', n: 18, lv: [...s1, ...s2, G(1), P(1), P(0), G(0)] },
  Ne2: { f: 'Ne₂', name: 'Neon', n: 20, lv: [...s1, ...s2, G(1), P(1), P(0), G(0)] },

  CO: { f: 'CO', name: 'Carbon monoxide', n: 14, lv: [...s1, ...s2, P(1), G(1), P(0), G(0)] },
  NO: { f: 'NO', name: 'Nitric oxide', n: 15, lv: [...s1, ...s2, G(1), P(1), P(0), G(0)] },
};
export const slotsOf = (m) => m.lv.flatMap((v, li) => Array.from({ length: v.c }, (_, k) => ({ li, k })));
// Aufbau (lowest level first) + Hund (empty degenerate orbital first) + Pauli (max 2, opposite spin)
export const nextSlot = (S, E) => {
  const cnt = (i) => E.filter((e) => e.s === i).length;
  for (let li = 0; li < S.length; li++) {
    const ss = S.map((s, i) => ({ ...s, i })).filter((s) => s.li === li);
    const f = ss.find((s) => cnt(s.i) === 0) || ss.find((s) => cnt(s.i) === 1);
    if (f) return f.i;
  }
  return -1;
};
export const ground = (key) => {
  const S = slotsOf(MOL[key]); let E = [];
  for (let i = 0; i < MOL[key].n; i++) { const s = nextSlot(S, E); E = [...E, { s, up: E.filter((e) => e.s === s).length === 0 }]; }
  return E;
};
const sup = (n) => String(n).replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);
export function analyze(key, E) {
  const m = MOL[key], S = slotsOf(m);
  const per = S.map((_, i) => E.filter((e) => e.s === i).length);
  const lc = m.lv.map((_, li) => S.reduce((t, s, i) => t + (s.li === li ? per[i] : 0), 0));
  let b = 0, a = 0; m.lv.forEach((v, li) => (v.b ? (b += lc[li]) : (a += lc[li])));
  const unp = S.map((_, i) => (per[i] === 1 ? i : -1)).filter((i) => i >= 0);
  return { m, S, per, lc, b, a, bo: (b - a) / 2, unp, para: unp.length > 0, total: E.length,
    config: m.lv.map((v, li) => (lc[li] ? v.l + sup(lc[li]) : '')).filter(Boolean).join(' ') || '(no electrons)',
    configA: m.lv.map((v, li) => (lc[li] ? `(${v.a})^${lc[li]}` : '')).filter(Boolean).join(' ') || '(no electrons)' };
}
export const stability = (a) => {
  if (!a.total) return 'Add electrons to see how stable the molecule is.';
  if (a.bo <= 0) return `Bond order ${a.bo}: antibonding electrons cancel the bonding ones, so there is no net bond. The molecule is unstable and does not exist as a stable species.`;
  const kind = a.bo === 1 ? 'a single bond' : a.bo === 2 ? 'a double bond' : a.bo === 3 ? 'a triple bond' : a.bo < 1 ? 'only a weak bond' : 'an intermediate bond';
  return `Bond order ${a.bo} means ${kind}. A higher bond order gives a stronger, shorter bond and a more stable molecule.`;
};
export const magneticWhy = (a) => {
  if (!a.total) return 'Place electrons to determine the magnetic behaviour.';
  const f = a.m.f;
  if (a.para) { const names = [...new Set(a.unp.map((i) => a.m.lv[a.S[i].li].l))].join(', '); return `${f} has ${a.unp.length} unpaired electron${a.unp.length > 1 ? 's' : ''} (in ${names}). Unpaired spins leave a net magnetic moment, so the molecule is pulled into a magnetic field: PARAMAGNETIC.`; }
  return `All ${a.total} electrons in ${f} are paired. Opposite spins cancel each other's magnetic moment, so the molecule is weakly repelled by a magnetic field: DIAMAGNETIC.`;
};
export const conclusion = (key, a) => `${a.m.f} (${a.m.name}) has ${a.b} bonding and ${a.a} antibonding electrons, giving a bond order of ${a.bo}. ${stability(a)} ${magneticWhy(a)} This agrees with molecular orbital theory.`;
export const T = {
  title: 'Molecular Orbital Theory – Interactive Virtual Chemistry Lab',
  aim: 'To study how atomic orbitals combine to form bonding and antibonding molecular orbitals in H₂, He₂, N₂ and O₂, to fill them using the Aufbau principle, Pauli exclusion principle and Hund’s rule, and to find the bond order and magnetic property of each molecule.',
  theory: [
    'Molecular orbital (MO) theory treats electrons in a molecule as spread over the whole molecule in molecular orbitals, formed by the Linear Combination of Atomic Orbitals (LCAO). N atomic orbitals combine to give N molecular orbitals.',
    'In-phase (additive) overlap gives a bonding MO with lower energy and high electron density between the nuclei. Out-of-phase (subtractive) overlap gives an antibonding MO (marked *) with higher energy and a node between the nuclei.',
    'Head-on overlap gives sigma (σ) orbitals; sideways overlap of p orbitals gives pi (π) orbitals. Electrons fill MOs by the Aufbau principle, Pauli exclusion principle and Hund’s rule.',
    'Bond order = (Nb − Na) / 2, where Nb and Na are the numbers of bonding and antibonding electrons. A molecule with unpaired electrons is paramagnetic; with all electrons paired it is diamagnetic.',
  ],
  sections: [
    ['Introduction to Molecular Orbital Theory', ['Valence bond theory cannot explain why O₂ is attracted by a magnet or why He₂ does not exist. Molecular orbital theory (Hund and Mulliken) can. Electrons belong to the whole molecule, not to single atoms.']],
    ['Linear Combination of Atomic Orbitals (LCAO)', ['Atomic wave functions are added or subtracted: Ψ(bonding) = ψA + ψB and Ψ(antibonding) = ψA − ψB. Orbitals combine well only if they have similar energy, enough overlap and the same symmetry about the bond axis.']],
    ['Bonding and Antibonding Orbitals', ['Bonding MO: lower energy than the atomic orbitals, electrons hold the nuclei together. Antibonding MO (σ*, π*): higher energy, has a node between the nuclei, electrons push the nuclei apart.']],
    ['Sigma (σ) and Pi (π) Bonds', ['σ orbitals are symmetric about the bond axis (s–s or end-on p–p overlap). π orbitals have a nodal plane containing the bond axis (side-on p–p overlap); the two p orbitals px and py give two degenerate π orbitals.']],
    ['Molecular Orbital Electronic Configuration', ['H₂, He₂: σ1s, σ*1s.', 'N₂ (and lighter molecules): σ1s < σ*1s < σ2s < σ*2s < π2p(x,y) < σ2p < π*2p(x,y) < σ*2p.', 'O₂ (and heavier): σ1s < σ*1s < σ2s < σ*2s < σ2p < π2p(x,y) < π*2p(x,y) < σ*2p.', 'In N₂, s–p mixing pushes σ2p above π2p. Energy diagrams are schematic, not to scale.']],
    ['Bond Order', ['Bond order = (Nb − Na)/2. H₂ = 1, He₂ = 0, N₂ = 3, O₂ = 2. Higher bond order: shorter, stronger bond. Bond order 0: no stable molecule.']],
    ['Magnetic Properties', ['Paramagnetic: one or more unpaired electrons (O₂ has two unpaired electrons in π*2p). Diamagnetic: all electrons paired (H₂, He₂, N₂).']],
    ['Applications', ['Explaining bond strength, bond length and magnetism; predicting which molecules exist; understanding colour and conductivity of materials, band theory in semiconductors, and the HOMO–LUMO gap used in organic electronics and solar cells.']],
  ],
  viva: [
    ['What is LCAO?', 'Combining atomic orbital wave functions by addition or subtraction to form molecular orbitals.'],
    ['Why is He₂ not formed?', 'It has 2 bonding and 2 antibonding electrons, so bond order = 0 and there is no net stabilisation.'],
    ['Why is O₂ paramagnetic?', 'Its last two electrons occupy the two degenerate π*2p orbitals singly (Hund’s rule), leaving two unpaired electrons.'],
    ['Calculate the bond order of N₂.', 'Nb = 10, Na = 4, so bond order = (10 − 4)/2 = 3 (a triple bond).'],
    ['State Pauli’s exclusion principle.', 'An orbital holds at most two electrons and they must have opposite spins.'],
    ['State Hund’s rule.', 'Degenerate orbitals are filled singly with parallel spins before any pairing occurs.'],
    ['Difference between σ and π orbitals?', 'σ is formed by head-on overlap and is symmetric about the bond axis; π is formed by side-on overlap and has a nodal plane through the axis.'],
    ['What is a node?', 'A region where the wave function is zero; antibonding MOs have a node between the nuclei.'],
  ],
};
