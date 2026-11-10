import { useState, useEffect } from 'react';
import Register from './components/Register';
import Lab from './components/Lab';
import Learn from './components/Learn';
import Quiz from './components/Quiz';
import Report from './components/Report';
import { ground } from './data';
const tabs = ['Lab Workbench', 'Learning Centre', 'Challenge Mode', 'Lab Report'];
export default function App() {
  const [st, setSt] = useState(null), [tab, setTab] = useState(0), [mol, setMol] = useState('H2'), [E, setE] = useState(() => ground('H2'));
  const [obs, setObs] = useState(''), [score, setScore] = useState(null), [now, setNow] = useState(new Date()), [qk, setQk] = useState(0);
  useEffect(() => { const i = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(i); }, []);
  const restart = () => { setMol('H2'); setE(ground('H2')); setObs(''); setScore(null); setTab(0); setQk((k) => k + 1); };
  if (!st) return <Register onStart={setSt} />;
  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-5 space-y-4">
      <header className="panel flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="mono text-[11px] tracking-[.25em] text-cyan-300">VIRTUAL SCIENCE LABORATORY · DEPARTMENT OF {st.dept.toUpperCase()}</div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Molecular Orbital Theory <span className="text-violet-300">· Interactive Lab</span></h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mono text-xs flex items-center gap-2 mr-2"><i className="led w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />SESSION ACTIVE · {now.toLocaleTimeString()}</span>
          <button className="btn2" onClick={restart}>↺ Restart experiment</button>
          <button className="btn2" onClick={() => setSt(null)}>Exit lab</button>
        </div>
      </header>
      <div className="panel mono text-xs grid grid-cols-2 md:grid-cols-6 gap-2">
        {[['Student', st.name], ['Reg. No.', st.reg], ['Course', st.course], ['Code', st.code], ['Dept.', st.dept], ['Date', st.date]].map(([k, v]) => <div key={k}><div className="text-slate-500 uppercase">{k}</div><div className="text-cyan-100 break-words">{v}</div></div>)}
      </div>
      <nav className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t, i) => <button key={t} onClick={() => setTab(i)} className={`btn2 whitespace-nowrap ${tab === i ? 'on' : ''}`}>{t}</button>)}
      </nav>
      <div className={tab === 0 ? '' : 'hidden'}><Lab mol={mol} setMol={setMol} E={E} setE={setE} /></div>
      {tab === 1 && <Learn />}
      <div className={tab === 2 ? '' : 'hidden'}><Quiz key={qk} onFinish={(s, t) => setScore({ s, t })} /></div>
      {tab === 3 && <Report st={st} mol={mol} E={E} obs={obs} setObs={setObs} score={score} />}
    </div>
  );
}
