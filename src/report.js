import { jsPDF } from 'jspdf';
import { T, analyze, stability, magneticWhy, conclusion } from './data';
const M = { 'σ': 'sigma', 'π': 'pi', 'ψ': 'psi', 'Ψ': 'Psi', '₂': '2', '²': '2', '⁺': '+', '→': '->', '–': '-', '−': '-', '×': 'x', '≥': '>=', '⁻': '-', '’': "'", '·': '.', 'ₐ': 'a' };
const A = (s) => String(s).replace(new RegExp('[' + Object.keys(M).join('') + ']', 'g'), (c) => M[c]);
export function makeReport(st, key, E, obs, score) {
  const a = analyze(key, E), m = a.m, d = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210, L = 15, mw = W - 2 * L; let y = 42;
  const need = (h) => { if (y + h > 282) { d.addPage(); y = 20; } };
  const H = (t) => { need(16); y += 4; d.setFont('helvetica', 'bold').setFontSize(12).setTextColor(14, 116, 190).text(A(t), L, y); d.setDrawColor(124, 58, 237).setLineWidth(.3).line(L, y + 1.5, W - L, y + 1.5); y += 7; };
  const P = (t) => { d.setFont('helvetica', 'normal').setFontSize(10).setTextColor(40); d.splitTextToSize(A(t), mw).forEach((l) => { need(5); d.text(l, L, y); y += 5; }); };
  d.setFillColor(5, 11, 31).rect(0, 0, W, 32, 'F'); d.setFillColor(34, 211, 238).rect(0, 32, W, 1.2, 'F');
  d.setTextColor(255).setFont('helvetica', 'bold').setFontSize(15).text('VIRTUAL SCIENCE LABORATORY - EXPERIMENT REPORT', W / 2, 14, { align: 'center' });
  d.setFontSize(11).setTextColor(103, 232, 249).text('Molecular Orbital Theory', W / 2, 23, { align: 'center' });
  [['Student Name', st.name], ['Registration Number', st.reg], ['Course Name', st.course], ['Course Code', st.code], ['Department', st.dept], ['Experiment Date', st.date]].forEach(([k, v]) => {
    d.setFont('helvetica', 'bold').setFontSize(10).setTextColor(30).text(k + ':', L, y); d.setFont('helvetica', 'normal').text(A(v), L + 48, y); y += 6;
  });
  H('Experiment Title'); P(T.title);
  H('Aim'); P(T.aim);
  H('Theory'); T.theory.forEach((p) => P(p));
  H('Selected Molecule'); P(`${m.f} (${m.name}). Electrons placed in the molecular orbitals: ${a.total} (ground state: ${m.n}).`);
  H('Molecular Orbital Diagram');
  const n = m.lv.length, step = n <= 2 ? 22 : 11, h = n * step + 8; need(h + 4);
  const cx = 105, base = y + h - 6, yy = (li) => base - li * step;
  d.setDrawColor(120).setLineWidth(.3).line(L + 4, base, L + 4, base - h + 8); d.setFontSize(8).setTextColor(100).text('Energy', L + 7, base - h + 11);
  const arrow = (x, Y, up) => { d.setDrawColor(30).setFillColor(30).setLineWidth(.4); if (up) { d.line(x, Y - 1, x, Y - 6); d.triangle(x - 1.2, Y - 5, x + 1.2, Y - 5, x, Y - 7.2, 'F'); } else { d.line(x, Y - 6.5, x, Y - 2.5); d.triangle(x - 1.2, Y - 3.5, x + 1.2, Y - 3.5, x, Y - 0.8, 'F'); } };
  m.lv.forEach((v, li) => {
    const Y = yy(li);
    for (let k = 0; k < v.c; k++) {
      const x = v.c === 1 ? cx : cx + (k ? 13 : -13);
      d.setLineWidth(.8); v.b ? d.setDrawColor(14, 116, 190) : d.setDrawColor(124, 58, 237); d.line(x - 8, Y, x + 8, Y);
      const es = E.filter((e) => e.s === a.S.findIndex((s) => s.li === li && s.k === k));
      es.forEach((e, j) => arrow(x + (es.length > 1 ? (j ? 3 : -3) : 0), Y, e.up));
    }
    d.setFont('helvetica', 'normal').setFontSize(8).setTextColor(60).text(`${v.a} (${v.b ? 'bonding' : 'antibonding'})`, cx + (v.c > 1 ? 27 : 14), Y + 1);
  });
  y += h + 2; P('Schematic diagram (not to scale). Arrows show electron spins; blue levels are bonding, violet levels are antibonding.');
  H('Electron Configuration'); P(a.configA);
  H('Bond Order Calculation');
  P(`Bonding electrons (Nb) = ${a.b}`); P(`Antibonding electrons (Na) = ${a.a}`);
  P(`Bond order = (Nb - Na) / 2 = (${a.b} - ${a.a}) / 2 = ${a.bo}`); P(stability(a));
  H('Magnetic Property'); P(`${a.total ? (a.para ? 'Paramagnetic' : 'Diamagnetic') : 'Undetermined'} (unpaired electrons: ${a.unp.length}). ${magneticWhy(a)}`);
  H('Observations');
  P(`1. Atomic orbitals combine in phase to give bonding MOs (lower energy) and out of phase to give antibonding MOs (higher energy, node between nuclei).`);
  P(`2. ${m.f} contains ${a.b} bonding and ${a.a} antibonding electrons.`);
  P(`3. Challenge mode score: ${score ? `${score.s}/${score.t}` : 'not attempted'}.`);
  P(`4. Student notes: ${obs.trim() || 'none entered.'}`);
  H('Conclusion'); P(conclusion(key, a));
  const pc = d.getNumberOfPages();
  for (let p = 1; p <= pc; p++) { d.setPage(p); d.setFontSize(8).setTextColor(120).text(A(`${st.name} (${st.reg}) - ${st.code} - Page ${p}/${pc}`), W / 2, 291, { align: 'center' }); }
  d.save(`MO_Theory_Report_${st.reg}.pdf`);
}
