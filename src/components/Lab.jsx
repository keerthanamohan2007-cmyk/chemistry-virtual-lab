import { useState, useEffect } from 'react';
import { MOL, ground, analyze, stability, magneticWhy } from '../data';
const CY = '#22d3ee', VI = '#a78bfa';

function Energy({ a, E, click, dbl, hl }) {
  const { m, S } = a, n = m.lv.length, step = n <= 2 ? 130 : 58, H = n <= 2 ? 330 : n * step + 50;
  const y = (li) => H - 40 - li * step;
  const groups = [...new Set(m.lv.map((v) => v.g))];
  const gy = (g) => { const ys = m.lv.map((v, i) => (v.g === g ? y(i) : null)).filter((v) => v !== null); return ys.reduce((p, c) => p + c, 0) / ys.length; };
  return (
    <svg viewBox={`0 0 600 ${H}`} className="w-full max-h-[620px]">
      <defs><filter id="glow"><feGaussianBlur stdDeviation="2.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
      <line x1="14" y1={H - 20} x2="14" y2="14" stroke="#64748b" /><text x="22" y="22" fill="#94a3b8" fontSize="11">Energy ↑</text>
      {groups.map((g) => [[30, 90, 'A'], [510, 570, 'B']].map(([x1, x2, s]) => (
        <g key={g + s}><line x1={x1} x2={x2} y1={gy(g)} y2={gy(g)} stroke="#94a3b8" strokeWidth="2.5" /><text x={(x1 + x2) / 2} y={gy(g) + 16} textAnchor="middle" fill="#94a3b8" fontSize="11">AO {g} ({s})</text></g>
      )))}
      {m.lv.map((v, li) => [[90, 215], [510, 385]].map(([x1, x2], k) => <line key={li + '-' + k} x1={x1} y1={gy(v.g)} x2={x2} y2={y(li) + 2} stroke={v.b ? CY : VI} strokeDasharray="4 4" opacity=".45" />))}
      {m.lv.map((v, li) => <text key={'t' + li} x="300" y={y(li) + 20} textAnchor="middle" fontSize="12" fill={v.b ? CY : VI}>{v.l} · {v.t === 'σ' ? 'sigma' : 'pi'} · {v.b ? 'bonding' : 'antibonding'}</text>)}
      {S.map((s, i) => {
        const v = m.lv[s.li], cx = v.c === 1 ? 300 : s.k ? 355 : 245, yy = y(s.li), es = E.filter((e) => e.s === i);
        return (
          <g key={i} onClick={() => click(i)} onDoubleClick={() => dbl(i)} style={{ cursor: 'pointer' }}>
            <rect x={cx - 38} y={yy - 34} width="76" height="42" fill="transparent" />
            <rect x={cx - 32} y={yy} width="64" height="3" rx="1.5" fill={v.b ? CY : VI} filter="url(#glow)" />
            {es.map((e, j) => <text key={j} x={cx + (es.length > 1 ? (j ? 8 : -8) : 0)} y={yy - 6} textAnchor="middle" fontSize="26" fontWeight="700" fill={hl && es.length === 1 ? '#fbbf24' : '#e2e8f0'} filter={hl && es.length === 1 ? 'url(#glow)' : undefined}>{e.up ? '↑' : '↓'}</text>)}
          </g>
        );
      })}
    </svg>
  );
}

const lobes = (type, xa, xb, y, ph) => type === 's' ? [[xa, y, 36, 36, 1], [xb, y, 36, 36, ph]]
  : type === 'sp' ? [[xa - 26, y, 26, 16, -1], [xa + 26, y, 26, 16, 1], [xb - 26, y, 26, 16, ph], [xb + 26, y, 26, 16, -ph]]
  : [[xa, y - 24, 15, 24, 1], [xa, y + 24, 15, 24, -1], [xb, y - 24, 15, 24, ph], [xb, y + 24, 15, 24, -ph]];
const rnd = (i, k) => Math.abs(Math.sin(i * 12.9898 + k * 78.233) * 43758.5453) % 1;

function Lcao({ type, t, d3 }) {
  const end = type === 's' ? 42 : type === 'sp' ? 50 : 20, d = 150 + (end - 150) * t;
  const rows = [[55, 1, 'ATOMIC ORBITALS APPROACH', 1], [165, 1, 'BONDING MO  (in-phase, +  +)', t], [275, -1, 'ANTIBONDING MO  (out-of-phase, +  −)', t]];
  const Lb = ({ l }) => { const [x, y, rx, ry, s] = l; return d3
    ? <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={`url(#${s > 0 ? 'gp' : 'gn'})`} />
    : <g><ellipse cx={x} cy={y} rx={rx} ry={ry} fill={s > 0 ? 'rgba(34,211,238,.15)' : 'rgba(167,139,250,.15)'} stroke={s > 0 ? CY : VI} strokeWidth="1.5" /><text x={x} y={y + 5} textAnchor="middle" fontSize="15" fill={s > 0 ? CY : VI}>{s > 0 ? '+' : '−'}</text></g>; };
  return (
    <svg viewBox="0 0 600 330" className="w-full">
      <defs>
        <radialGradient id="gp"><stop offset="0" stopColor="#67e8f9" stopOpacity=".95" /><stop offset=".6" stopColor="#22d3ee" stopOpacity=".45" /><stop offset="1" stopColor="#22d3ee" stopOpacity="0" /></radialGradient>
        <radialGradient id="gn"><stop offset="0" stopColor="#c4b5fd" stopOpacity=".95" /><stop offset=".6" stopColor="#8b5cf6" stopOpacity=".45" /><stop offset="1" stopColor="#8b5cf6" stopOpacity="0" /></radialGradient>
        <filter id="gl2"><feGaussianBlur stdDeviation="3" /></filter>
      </defs>
      {rows.map(([y, ph, label, op], r) => (
        <g key={r} opacity={op}>
          <text x="10" y={y - 38} fill="#94a3b8" fontSize="11">{label}</text>
          <g style={d3 ? { filter: 'drop-shadow(0 0 8px rgba(34,211,238,.6))' } : undefined}>{lobes(type, 300 - d, 300 + d, y, ph).map((l, i) => <Lb key={i} l={l} />)}</g>
          {r > 0 && <line x1={type === 'pi' ? 60 : 300} x2={type === 'pi' ? 540 : 300} y1={type === 'pi' ? y : y - 45} y2={type === 'pi' ? y : y + 45} stroke="#f8fafc" strokeDasharray="4 4" opacity={r === 2 || type === 'pi' ? .7 : 0} />}
          <circle cx={300 - d} cy={y} r="3" fill="#fff" /><circle cx={300 + d} cy={y} r="3" fill="#fff" />
          {d3 && r > 0 && t > .7 && Array.from({ length: 36 }, (_, i) => {
            const px = 300 + (rnd(i, 1) - .5) * (2 * d + 90), py = y + (rnd(i, 2) - .5) * (type === 'pi' ? 110 : 64);
            if (r === 2 && (type === 'pi' ? Math.abs(py - y) < 6 : Math.abs(px - 300) < 10)) return null;
            return <circle key={i} cx={px} cy={py} r="1.8" fill="#e0f2fe"><animate attributeName="opacity" values="0;1;0" dur={`${1 + rnd(i, 3) * 2}s`} begin={`${rnd(i, 4)}s`} repeatCount="indefinite" /></circle>;
          })}
        </g>
      ))}
    </svg>
  );
}

export default function Lab({ mol, setMol, E, setE }) {
  const a = analyze(mol, E), { m, S, per } = a;
  const [view, setView] = useState('energy'), [type, setType] = useState('s'), [t, setT] = useState(0), [play, setPlay] = useState(false), [hl, setHl] = useState(true);
  const [note, setNote] = useState({ t: 'ok', m: 'Select a molecule, then add electrons: Aufbau principle, Pauli exclusion principle and Hund’s rule are applied for you.' });
  useEffect(() => {
    if (!play) return;
    const id = setInterval(() => setT((v) => (v >= 1 ? (setPlay(false), 1) : +(v + 0.012).toFixed(3))), 30);
    return () => clearInterval(id);
  }, [play]);
  const pickMol = (k) => { setMol(k); setE(ground(k)); setType(MOL[k].lv.length > 2 ? 'sp' : 's'); setNote({ t: 'ok', m: `${MOL[k].f} loaded in its ground state (${MOL[k].n} electrons).` }); };
  const add = () => {
    const s = (() => { for (let li = 0; li < m.lv.length; li++) { const ss = S.map((x, i) => ({ ...x, i })).filter((x) => x.li === li); const f = ss.find((x) => per[x.i] === 0) || ss.find((x) => per[x.i] === 1); if (f) return f.i; } return -1; })();
    if (s < 0) return setNote({ t: 'warn', m: 'All molecular orbitals are full: each holds 2 electrons (Pauli exclusion principle).' });
    const lv = m.lv[S[s].li];
    setE([...E, { s, up: per[s] === 0 }]);
    setNote({ t: 'ok', m: per[s] === 1 ? `Pauli exclusion principle: the second electron enters ${lv.l} with opposite spin (↓).` : lv.c > 1 ? `Hund’s rule: the electron goes singly (↑, parallel spin) into an empty degenerate ${lv.l} orbital before any pairing.` : `Aufbau principle: the electron fills the lowest-energy available orbital, ${lv.l}.` });
  };
  const click = (i) => {
    if (per[i] >= 2) return setNote({ t: 'warn', m: 'Pauli exclusion principle: an orbital holds at most 2 electrons, with opposite spins.' });
    const lv = S[i].li; let w = '';
    if (S.some((s, j) => s.li < lv && per[j] < 2)) w += 'Aufbau principle violated: a lower-energy orbital is not full yet. ';
    if (per[i] === 1 && S.some((s, j) => s.li === lv && per[j] === 0)) w += 'Hund’s rule violated: fill each degenerate orbital singly before pairing. ';
    setE([...E, { s: i, up: per[i] === 0 }]);
    setNote(w ? { t: 'warn', m: w + 'The diagram updated, but this is not the ground state.' } : { t: 'ok', m: 'Valid placement ✓' });
  };
  const dbl = (i) => { const j = E.map((e) => e.s).lastIndexOf(i); if (j >= 0) setE(E.filter((_, k) => k !== j)); };
  const views = [['energy', '2D Energy Diagram'], ['lcao2d', '2D LCAO'], ['lcao3d', '3D Orbitals']];
  return (
    <div className="grid xl:grid-cols-[1fr_350px] gap-4">
      <div className="panel">
        <div className="ph">Visualisation chamber · {m.f}</div>
        <div className="flex flex-wrap gap-2 mb-3">{views.map(([k, l]) => <button key={k} className={`btn2 ${view === k ? 'on' : ''}`} onClick={() => setView(k)}>{l}</button>)}</div>
        {view === 'energy' ? (
          <>
            <Energy a={a} E={E} click={click} dbl={dbl} hl={hl} />
            <p className="text-xs text-slate-400">Click an orbital to add an electron · double-click to remove one · <span className="text-amber-300">amber = unpaired</span> · diagram is schematic (not to scale).</p>
          </>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 items-center mb-2">
              {[['s', 'σ (s–s)'], ['sp', 'σ (p–p end-on)'], ['pi', 'π (p–p side-on)']].map(([k, l]) => <button key={k} className={`btn2 ${type === k ? 'on' : ''}`} onClick={() => setType(k)}>{l}</button>)}
              <button className="btn" onClick={() => { if (t >= 1) setT(0); setPlay(!play); }}>{play ? '❚❚ Pause' : '▶ Bring atoms together'}</button>
              <button className="btn2" onClick={() => { setPlay(false); setT(0); }}>↺ Restart</button>
            </div>
            <label className="block text-xs mono text-slate-400 mb-1">Internuclear distance: {t < .05 ? 'far apart' : t > .95 ? 'bonding distance' : 'approaching'}
              <input type="range" min="0" max="1" step="0.01" value={t} onChange={(e) => { setPlay(false); setT(+e.target.value); }} className="w-full accent-cyan-400" /></label>
            <Lcao type={type} t={t} d3={view === 'lcao3d'} />
            <p className="text-xs text-slate-400">Cyan = positive phase (+), violet = negative phase (−). In-phase overlap builds electron density between the nuclei (bonding, lower energy). Out-of-phase overlap cancels it, creating a node (antibonding, higher energy).{view === 'lcao3d' && ' Glowing dots represent the electron cloud.'}</p>
          </>
        )}
        <div className={`mt-3 rounded-lg border px-3 py-2 text-sm ${note.t === 'ok' ? 'border-cyan-400/30 bg-cyan-400/5 text-cyan-100' : 'border-amber-400/40 bg-amber-400/10 text-amber-100'}`}>{note.m}</div>
      </div>
      <div className="space-y-4">
        <div className="panel"><div className="ph">Molecule selector</div>
          <div className="grid grid-cols-2 gap-2">{Object.entries(MOL).map(([k, v]) => <button key={k} className={`btn2 ${mol === k ? 'on' : ''}`} onClick={() => pickMol(k)}><b className="text-lg">{v.f}</b><br /><span className="text-xs">{v.name}</span></button>)}</div></div>
        <div className="panel"><div className="ph">Electron filling · {a.total} electrons</div>
          <div className="grid grid-cols-2 gap-2">
            <button className="btn" onClick={add}>+ Add electron</button>
            <button className="btn2" onClick={() => { setE(E.slice(0, -1)); setNote({ t: 'ok', m: 'Last electron removed.' }); }} disabled={!E.length}>− Remove last</button>
            <button className="btn2" onClick={() => { setE(ground(mol)); setNote({ t: 'ok', m: 'Ground-state configuration restored.' }); }}>Ground state</button>
            <button className="btn2" onClick={() => { setE([]); setNote({ t: 'ok', m: 'All electrons cleared. Add electrons one by one.' }); }}>Clear all</button>
          </div></div>
        <div className="panel"><div className="ph">Bond order calculator</div>
          <div className="grid grid-cols-2 gap-2 text-center"><div className="rounded-lg bg-cyan-400/10 p-2"><div className="text-2xl mono text-cyan-300">{a.b}</div><div className="text-xs">bonding e⁻ (Nb)</div></div><div className="rounded-lg bg-violet-400/10 p-2"><div className="text-2xl mono text-violet-300">{a.a}</div><div className="text-xs">antibonding e⁻ (Na)</div></div></div>
          <div className="mono text-sm my-2">Bond order = (Nb − Na)/2 = ({a.b} − {a.a})/2 = <b className="text-xl text-white">{a.bo}</b></div>
          <p className="text-sm text-slate-300">{stability(a)}</p>
          <p className="text-xs mono mt-2 text-slate-400 break-words">{a.config}</p></div>
        <div className="panel"><div className="ph">Magnetic property</div>
          <div className={`inline-block px-3 py-1 rounded-full mono text-sm font-bold ${!a.total ? 'bg-slate-700' : a.para ? 'bg-amber-400 text-slate-900' : 'bg-cyan-300 text-slate-900'}`}>{!a.total ? 'NO ELECTRONS' : a.para ? `PARAMAGNETIC · ${a.unp.length} unpaired` : 'DIAMAGNETIC'}</div>
          <p className="text-sm text-slate-300 mt-2">{magneticWhy(a)}</p>
          <label className="text-xs mt-2 flex gap-2 items-center"><input type="checkbox" checked={hl} onChange={(e) => setHl(e.target.checked)} className="accent-amber-400" /> Highlight unpaired electrons</label></div>
      </div>
    </div>
  );
}
