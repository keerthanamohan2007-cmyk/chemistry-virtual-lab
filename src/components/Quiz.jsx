import { useState } from 'react';
const Q = [
  ['MCQ', 'LCAO stands for…', ['Linear Combination of Atomic Orbitals', 'Large Combination of Atomic Orbits', 'Linear Chain of Atomic Orbitals', 'Light Combination of Atoms and Orbitals'], 0, 'Molecular orbitals are formed by adding or subtracting atomic orbital wave functions. N atomic orbitals give N molecular orbitals.'],
  ['MCQ', 'An antibonding molecular orbital has…', ['Highest electron density between the nuclei', 'A node between the nuclei and higher energy', 'Lower energy than the atomic orbitals', 'No wave function'], 1, 'Out-of-phase overlap cancels electron density between the nuclei, creating a node and raising the energy.'],
  ['Bond order', 'Bond order of N₂ is…', ['1', '2', '3', '4'], 2, 'Nb = 10, Na = 4, so (10 − 4)/2 = 3.'],
  ['Bond order', 'Bond order of O₂ is…', ['1', '2', '2.5', '3'], 1, 'Nb = 10, Na = 6, so (10 − 6)/2 = 2.'],
  ['Bond order', 'Bond order of He₂ is…', ['0', '0.5', '1', '2'], 0, 'Nb = 2, Na = 2, so bond order = 0: He₂ does not exist.'],
  ['Bond order', 'Bond order of O₂⁺ (15 electrons) is…', ['1.5', '2', '2.5', '3'], 2, 'Removing one π* electron gives Nb = 10, Na = 5, so (10 − 5)/2 = 2.5.'],
  ['Magnetism', 'Which molecule is paramagnetic?', ['H₂', 'He₂', 'N₂', 'O₂'], 3, 'O₂ has two unpaired electrons in the degenerate π*2p orbitals (Hund’s rule).'],
  ['Magnetism', 'Number of unpaired electrons in O₂ is…', ['0', '1', '2', '4'], 2, 'One electron in each of the two π*2p orbitals, with parallel spins.'],
  ['Config challenge', 'Highest occupied MO of N₂ is…', ['σ2p', 'π*2p', 'π2p', 'σ*2p'], 0, 'N₂ has 14 electrons; π2p holds 4 and σ2p holds the last 2 (σ2p lies above π2p because of s–p mixing).'],
  ['Config challenge', 'Valence MO configuration of O₂ is…', ['σ2s² σ*2s² π2p⁴ σ2p² π*2p²', 'σ2s² σ*2s² σ2p² π2p⁴ π*2p²', 'σ2s² σ*2s² σ2p² π2p⁴ π*2p⁴', 'σ2s² σ2p² π2p⁴ π*2p²'], 1, 'In O₂ the σ2p orbital lies below π2p. The 12 valence electrons give σ2s² σ*2s² σ2p² π2p⁴ π*2p².'],
  ['MCQ', 'Hund’s rule states that…', ['An orbital holds a maximum of 2 electrons', 'Degenerate orbitals are filled singly with parallel spins before pairing', 'Lowest-energy orbitals fill first', 'Electrons must be paired'], 1, 'Pauli: max 2 electrons per orbital with opposite spins. Aufbau: lowest energy first. Hund: single occupancy first in degenerate orbitals.'],
  ['MCQ', 'Which overlap forms a π molecular orbital?', ['Head-on s–s', 'Head-on p–p', 'Side-on p–p', 'None'], 2, 'π orbitals come from sideways p–p overlap and have a nodal plane containing the bond axis.'],
];
export default function Quiz({ onFinish }) {
  const [i, setI] = useState(0), [sel, setSel] = useState(null), [sc, setSc] = useState(0), [done, setDone] = useState(false);
  const q = Q[i];
  const pick = (k) => { if (sel !== null) return; setSel(k); if (k === q[3]) setSc(sc + 1); };
  const next = () => { if (i + 1 < Q.length) { setI(i + 1); setSel(null); } else { setDone(true); onFinish(sc, Q.length); } };
  const restart = () => { setI(0); setSel(null); setSc(0); setDone(false); };
  if (done) return (
    <div className="panel max-w-xl mx-auto text-center fade"><div className="ph">Challenge complete</div>
      <div className="text-6xl mono text-cyan-300">{sc}/{Q.length}</div><p className="my-2">{Math.round((sc / Q.length) * 100)}% · {sc >= 10 ? 'Outstanding mastery!' : sc >= 7 ? 'Good work. Review the explanations you missed.' : 'Keep practising in the Lab Workbench and Learning Centre.'}</p>
      <button className="btn" onClick={restart}>Restart challenge</button></div>
  );
  return (
    <div className="panel max-w-2xl mx-auto fade">
      <div className="ph">Challenge mode · Question {i + 1}/{Q.length} · Score {sc}</div>
      <div className="h-1.5 bg-slate-800 rounded mb-3"><div className="h-full rounded bg-gradient-to-r from-cyan-300 to-violet-400 transition-all" style={{ width: `${(i / Q.length) * 100}%` }} /></div>
      <span className="mono text-xs px-2 py-0.5 rounded bg-violet-400/20 text-violet-200">{q[0]}</span>
      <h2 className="text-lg font-semibold my-3 text-white">{q[1]}</h2>
      <div className="space-y-2">{q[2].map((o, k) => (
        <button key={k} onClick={() => pick(k)} className={`w-full text-left px-4 py-2 rounded-lg border transition ${sel === null ? 'border-cyan-400/30 hover:bg-cyan-400/10' : k === q[3] ? 'border-emerald-400 bg-emerald-400/15' : k === sel ? 'border-red-400 bg-red-400/15' : 'border-slate-700 opacity-60'}`}>{o}</button>))}</div>
      {sel !== null && <div className="mt-3 text-sm"><b>{sel === q[3] ? '✓ Correct. ' : '✗ Not quite. '}</b>{q[4]}<div className="mt-3"><button className="btn" onClick={next}>{i + 1 < Q.length ? 'Next question →' : 'Finish & see score'}</button></div></div>}
    </div>
  );
}
