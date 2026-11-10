import { T } from '../data';
export default function Learn() {
  const S = ({ h, children }) => <div className="panel fade"><div className="ph">{h}</div><div className="space-y-2 text-slate-300 text-sm leading-relaxed">{children}</div></div>;
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <S h="Aim"><p>{T.aim}</p></S>
      <S h="Theory">{T.theory.map((p) => <p key={p}>{p}</p>)}</S>
      {T.sections.map(([h, ps]) => <S key={h} h={h}>{ps.map((p) => <p key={p}>{p}</p>)}</S>)}
      <div className="panel md:col-span-2"><div className="ph">Viva questions</div>
        {T.viva.map(([q, a]) => <details key={q} className="py-2 border-t border-cyan-400/10"><summary className="cursor-pointer font-medium text-cyan-100">{q}</summary><p className="mt-1 text-slate-300 text-sm">{a}</p></details>)}</div>
    </div>
  );
}
