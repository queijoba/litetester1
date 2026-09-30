import * as React from 'react';
import { TRESDET_SKILLS } from '../data.js';
import { TRESDET_SCALES, TRESDET_THREAT_CATEGORIES, TRESDET_THREAT_ROLES } from '../threatData.js';

const { useEffect, useState } = React;

const Field = ({ label, children }) => <label className="block"><span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-zinc-500">{label}</span>{children}</label>;
const Input = (props) => <input {...props} className={`w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200 ${props.className || ''}`} />;
const Textarea = (props) => <textarea {...props} className={`w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200 ${props.className || ''}`} />;

const Section = ({ title, icon, hint, action, children }) => (
  <section className="overflow-hidden rounded-xl border-2 border-zinc-200 bg-white shadow-sm">
    <header className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 bg-zinc-950 px-4 py-3 text-white">
      <div><h2 className="font-title text-sm font-black uppercase tracking-wider"><span className="mr-2 text-amber-400">{icon}</span>{title}</h2>{hint && <p className="mt-0.5 text-[10px] text-zinc-300">{hint}</p>}</div>
      {action}
    </header>
    <div className="p-4">{children}</div>
  </section>
);

const SimpleList = ({ items = [], onChange, kind }) => {
  const config = kind === 'desvantagem'
    ? { value: 'valor', label: 'Valor', add: 'Desvantagem' }
    : kind === 'tecnica'
      ? { value: 'custo', label: 'Custo', add: 'Técnica' }
      : kind === 'acao'
        ? { value: 'custo', label: 'Custo', add: 'Ação' }
        : { value: 'custo', label: 'Custo', add: 'Vantagem' };
  const add = () => onChange([...items, { nome: '', [config.value]: '', desc: '' }]);
  const patch = (index, key, value) => {
    const next = JSON.parse(JSON.stringify(items));
    next[index] = { nome: '', [config.value]: '', desc: '', ...(next[index] || {}), [key]: value };
    onChange(next);
  };
  return <div className="space-y-3">
    {items.map((entry, index) => <div key={index} className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
      <div className="grid gap-2 sm:grid-cols-[1fr_110px_36px]">
        <Input value={entry.nome || ''} onChange={e => patch(index, 'nome', e.target.value)} placeholder={`Nome da ${config.add.toLowerCase()}`} />
        <Input value={entry[config.value] || ''} onChange={e => patch(index, config.value, e.target.value)} placeholder={config.label} />
        <button type="button" onClick={() => onChange(items.filter((_, i) => i !== index))} className="rounded border border-red-200 bg-red-50 font-black text-red-700">×</button>
      </div>
      <Textarea rows="2" value={entry.desc || ''} onChange={e => patch(index, 'desc', e.target.value)} placeholder="Resumo para consulta rápida em mesa..." className="mt-2" />
    </div>)}
    <button type="button" onClick={add} className="w-full rounded-lg border-2 border-dashed border-zinc-300 py-3 text-xs font-black text-zinc-500 hover:border-amber-400 hover:text-amber-700">+ {config.add}</button>
  </div>;
};

export default function TresDeTThreatEditor({ scope }) {
  const { data, updateField, optimizeImageFile, showToast } = scope;
  const [tab, setTab] = useState('ficha');
  const [customSkill, setCustomSkill] = useState('');

  useEffect(() => {
    if (data?.system === '3det' && data?.type !== 'pc') {
      setTab('ficha');
      setCustomSkill('');
    }
  }, [data?.id]);

  if (!data || data.system !== '3det' || data.type === 'pc') return null;

  const attrs = data.atributos || {};
  const status = data.status || {};
  const customSkills = Array.isArray(data.periciasPersonalizadas) ? data.periciasPersonalizadas : [];
  const setList = (key, value) => updateField(key, value);

  const recalcResources = () => {
    const number = (value) => Number.isFinite(Number(value)) ? Number(value) : 0;
    const p = number(attrs.poder), h = number(attrs.habilidade), r = number(attrs.resistencia);
    updateField('status.pa', { atual: p, max: p });
    updateField('status.pm', { atual: h * 5, max: h * 5 });
    updateField('status.pv', { atual: r * 5, max: r * 5 });
    showToast('Recursos recalculados a partir de P/H/R.');
  };

  const handlePortrait = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const image = await optimizeImageFile(file, 900, 0.82);
      updateField('imagem', image);
      showToast('Imagem da ameaça atualizada.');
    } catch (error) {
      console.error(error);
      showToast('Não foi possível usar essa imagem.');
    }
  };

  const addCustomSkill = () => {
    const nome = customSkill.trim();
    if (!nome) return;
    const exists = customSkills.some(entry => String(entry?.nome || '').trim().toLocaleLowerCase('pt-BR') === nome.toLocaleLowerCase('pt-BR'));
    if (exists) { showToast('Essa perícia já está na ficha.'); return; }
    setList('periciasPersonalizadas', [...customSkills, { id: `threat-skill-${Date.now().toString(36)}`, nome, selecionada: true }]);
    setCustomSkill('');
  };

  const tabs = [['ficha','👾 Ficha'],['poderes','⭐ Poderes'],['acoes','⚔️ Ações'],['notas','📝 Notas']];

  return <div className="tresdet-sheet tresdet-threat-sheet bg-zinc-100 p-3 md:p-5">
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="overflow-x-auto rounded-lg border border-zinc-300 bg-white p-1 shadow-sm"><div className="flex min-w-max gap-1">{tabs.map(([id,label]) => <button key={id} type="button" onClick={() => setTab(id)} className={`rounded-md px-3 py-2 text-xs font-black transition ${tab === id ? 'bg-zinc-950 text-amber-400' : 'text-zinc-600 hover:bg-zinc-100'}`}>{label}</button>)}</div></div>

      {tab === 'ficha' && <div className="space-y-4">
        <Section title="Identidade da Ameaça / NPC" icon="◆" hint="Ficha rápida para aliados, rivais, monstros, vilões e criaturas.">
          <div className="grid gap-4 lg:grid-cols-[180px_1fr]">
            <div className="rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 p-3 text-center">
              <div className="aspect-square overflow-hidden rounded-lg bg-zinc-200">{data.imagem ? <img src={data.imagem} alt="Ameaça" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-4xl">👾</div>}</div>
              <label className="mt-3 block cursor-pointer rounded-md bg-zinc-950 px-3 py-2 text-xs font-black text-amber-400">Escolher imagem<input type="file" accept="image/*" className="hidden" onChange={handlePortrait}/></label>
              {data.imagem && <button type="button" onClick={() => updateField('imagem','')} className="mt-2 text-[10px] font-bold text-red-700">Remover imagem</button>}
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Nome"><Input value={data.nome || ''} onChange={e => updateField('nome', e.target.value)} placeholder="Nome da ameaça" /></Field>
              <Field label="Categoria"><select value={data.categoria || 'Criatura'} onChange={e => updateField('categoria', e.target.value)} className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm">{TRESDET_THREAT_CATEGORIES.map(v => <option key={v}>{v}</option>)}</select></Field>
              <Field label="Papel"><select value={data.papel || 'Comum'} onChange={e => updateField('papel', e.target.value)} className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm">{TRESDET_THREAT_ROLES.map(v => <option key={v}>{v}</option>)}</select></Field>
              <Field label="Pontos"><Input type="number" min="0" value={data.pontos ?? 0} onChange={e => updateField('pontos', Number(e.target.value))} /></Field>
              <Field label="Escala"><select value={data.escala || 'Ningen'} onChange={e => updateField('escala', e.target.value)} className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm">{TRESDET_SCALES.map(v => <option key={v}>{v}</option>)}</select></Field>
              <Field label="Conceito"><Input value={data.conceito || ''} onChange={e => updateField('conceito', e.target.value)} placeholder="Função e ideia central" /></Field>
            </div>
          </div>
        </Section>

        <div className="grid gap-4 lg:grid-cols-2">
          <Section title="P/H/R" icon="🎲" hint="Use — quando a criatura tiver um atributo nulo.">
            <div className="grid grid-cols-3 gap-3">{[['poder','Poder'],['habilidade','Habilidade'],['resistencia','Resistência']].map(([key,label]) => <Field key={key} label={label}><Input value={attrs[key] ?? 0} onChange={e => updateField(`atributos.${key}`, e.target.value === '—' || e.target.value === '-' ? '—' : Number(e.target.value))} /></Field>)}</div>
            <button type="button" onClick={recalcResources} className="mt-3 w-full rounded-md bg-amber-400 px-3 py-2 text-xs font-black text-zinc-950 hover:bg-amber-300">↻ Recalcular PA / PM / PV</button>
          </Section>
          <Section title="Recursos" icon="❤️" hint="Podem ser ajustados livremente pelo mestre.">
            <div className="grid grid-cols-3 gap-3">{[['pa','PA'],['pm','PM'],['pv','PV']].map(([key,label]) => <Field key={key} label={label}><div className="flex items-center gap-1"><Input type="number" min="0" value={status[key]?.atual ?? 0} onChange={e => updateField(`status.${key}.atual`, Number(e.target.value))}/><b>/</b><Input type="number" min="0" value={status[key]?.max ?? 0} onChange={e => updateField(`status.${key}.max`, Number(e.target.value))}/></div></Field>)}</div>
          </Section>
        </div>

        <Section title="Perícias" icon="🎯" hint="Marque as oficiais e adicione qualquer perícia específica da criatura ou cenário.">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">{TRESDET_SKILLS.map(([id,name]) => <button key={id} type="button" onClick={() => updateField(`pericias.${id}`, !data.pericias?.[id])} className={`rounded-md border px-3 py-2 text-xs font-bold ${data.pericias?.[id] ? 'border-amber-500 bg-amber-100 text-amber-950' : 'border-zinc-300 bg-white text-zinc-600'}`}>{data.pericias?.[id] ? '✓ ' : ''}{name}</button>)}</div>
          <div className="mt-3 flex gap-2"><Input value={customSkill} onChange={e => setCustomSkill(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomSkill(); } }} placeholder="Adicionar perícia personalizada..."/><button type="button" onClick={addCustomSkill} className="rounded-md bg-zinc-950 px-3 text-xs font-black text-amber-400">Adicionar</button></div>
          {customSkills.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{customSkills.map((entry,index) => <span key={entry.id || index} className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-700">{entry.nome}<button type="button" onClick={() => setList('periciasPersonalizadas', customSkills.filter((_,i) => i !== index))} className="text-red-700">×</button></span>)}</div>}
        </Section>
      </div>}

      {tab === 'poderes' && <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Vantagens" icon="⭐"><SimpleList kind="vantagem" items={data.vantagens || []} onChange={value => setList('vantagens', value)} /></Section>
        <Section title="Desvantagens" icon="⚠"><SimpleList kind="desvantagem" items={data.desvantagens || []} onChange={value => setList('desvantagens', value)} /></Section>
        <Section title="Técnicas" icon="⚡"><SimpleList kind="tecnica" items={data.tecnicas || []} onChange={value => setList('tecnicas', value)} /></Section>
      </div>}

      {tab === 'acoes' && <Section title="Ações / Poderes rápidos" icon="⚔️" hint="Atalhos para o que o mestre realmente precisa lembrar durante a cena."><SimpleList kind="acao" items={data.acoes || []} onChange={value => setList('acoes', value)} /></Section>}

      {tab === 'notas' && <Section title="Anotações do Mestre" icon="📝"><Textarea rows="14" value={data.notas || ''} onChange={e => updateField('notas', e.target.value)} placeholder="Comportamento, objetivos, táticas, recompensas, pistas, fraquezas..." /></Section>}
    </div>
  </div>;
}
