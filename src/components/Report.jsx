import { analyze, conclusion } from '../data';
import { makeReport } from '../report';
export default function Report({ st, mol, E, obs, setObs, score }) {
  const a = analyze(mol, E);
  const rows = [['Student', st.name], ['Registration No.', st.reg], ['Course', `${st.course} (${st.code})`], ['Department', st.dept], ['Date', st.date], ['Molecule', `${a.m.f} (${a.m.name})`], ['Configuration', a.config], ['Bond order', `(${a.b} − ${a.a})/2 = ${a.bo}`], ['Magnetism', a.total ? (a.para ? `Paramagnetic (${a.unp.length} unpaired)` : 'Diamagnetic') : '—'], ['Challenge score', score ? `${score.s}/${score.t}` : 'not attempted']];
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="panel"><div className="ph">Report summary</div>
        <dl className="text-sm">{rows.map(([k, v]) => <div key={k} className="flex gap-3 py-1 border-b border-cyan-400/10"><dt className="w-36 shrink-0 text-slate-400">{k}</dt><dd className="mono break-words">{v}</dd></div>)}</dl>
        <p className="text-sm text-slate-300 mt-3"><b className="text-cyan-300">Conclusion: </b>{conclusion(mol, a)}</p></div>
      <div className="panel"><div className="ph">Lab notebook · observations</div>
        <textarea className="inp h-48" placeholder="Write your own observations (e.g. which orbitals held unpaired electrons, how the bond order changed when you added or removed electrons)…" value={obs} onChange={(e) => setObs(e.target.value)} />
        <p className="text-xs text-slate-400 my-2">The report uses the molecule currently selected in the Lab Workbench, with its present electron configuration.</p>
        <button className="btn w-full text-lg" onClick={() => makeReport(st, mol, E, obs, score)}>⬇ DOWNLOAD PDF REPORT</button></div>
    </div>
  );
}
