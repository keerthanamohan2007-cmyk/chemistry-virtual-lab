import { useState } from 'react';
export default function Register({ onStart }) {
  const [f, setF] = useState({ name: '', reg: '', course: 'Chemistry for Computer Science', code: '26CYB1002J', dept: 'Chemistry', date: new Date().toISOString().slice(0, 10) });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const fields = [['name', 'Student Name'], ['reg', 'Registration Number'], ['course', 'Course Name'], ['code', 'Course Code'], ['dept', 'Department']];
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={(e) => { e.preventDefault(); onStart(f); }} className="panel w-full max-w-lg fade space-y-4 p-6">
        <div className="text-center">
          <div className="mono text-xs tracking-[.3em] text-cyan-300">VIRTUAL SCIENCE LABORATORY</div>
          <svg viewBox="0 0 120 50" className="w-40 mx-auto my-2"><defs><radialGradient id="a"><stop offset="0" stopColor="#22d3ee" /><stop offset="1" stopColor="#22d3ee" stopOpacity="0" /></radialGradient><radialGradient id="b"><stop offset="0" stopColor="#a78bfa" /><stop offset="1" stopColor="#a78bfa" stopOpacity="0" /></radialGradient></defs><circle cx="45" cy="25" r="22" fill="url(#a)" /><circle cx="75" cy="25" r="22" fill="url(#b)" /></svg>
          <h1 className="text-xl font-bold text-white">MOLECULAR ORBITAL THEORY</h1>
          <p className="text-slate-400 text-sm">Interactive Virtual Chemistry Lab · Student Access Terminal</p>
        </div>
        {fields.map(([k, l]) => <label key={k} className="block text-xs mono uppercase text-cyan-200">{l}<input required className="inp mt-1 normal-case" value={f[k]} onChange={set(k)} /></label>)}
        <label className="block text-xs mono uppercase text-cyan-200">Experiment Date<input required type="date" className="inp mt-1" value={f.date} onChange={set('date')} /></label>
        <button className="btn w-full text-lg">START VIRTUAL LAB</button>
      </form>
    </div>
  );
}
