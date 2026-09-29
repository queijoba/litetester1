import * as React from 'react';
import { TRESDET_RARITIES, TRESDET_SKILLS } from '../data.js';

const { useEffect, useMemo, useState } = React;

const clampNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const Field = ({ label, children, className = '' }) => (
  <label className={`block ${className}`}>
    <span className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">{label}</span>
    {children}
  </label>
);

const Input = (props) => (
  <input {...props} className={`w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200 ${props.className || ''}`} />
);

const Textarea = (props) => (
  <textarea {...props} className={`w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200 ${props.className || ''}`} />
);

const Section = ({ title, icon, hint, action, children, className = '' }) => (
  <section className={`overflow-hidden rounded-xl border-2 border-zinc-200 bg-white shadow-sm ${className}`}>
    <header className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 bg-zinc-950 px-4 py-3 text-white">
      <div>
        <h2 className="font-title text-sm font-black uppercase tracking-wider"><span className="mr-2 text-amber-400">{icon}</span>{title}</h2>
        {hint && <p className="mt-0.5 text-[10px] text-zinc-300">{hint}</p>}
      </div>
      {action}
    </header>
    <div className="p-4">{children}</div>
  </section>
);

const ListEditor = ({ title, icon, hint, items, onChange, kind = 'vantagem' }) => {
  const config = kind === 'desvantagem'
    ? { valueKey: 'valor', valueLabel: 'Valor', addLabel: 'Desvantagem' }
    : kind === 'tecnica'
      ? { valueKey: 'custo', valueLabel: 'Custo', addLabel: 'Técnica' }
      : { valueKey: 'custo', valueLabel: 'Custo', addLabel: 'Vantagem' };

  const patch = (index, key, value) => {
    const next = JSON.parse(JSON.stringify(items || []));
    next[index] = { nome: '', [config.valueKey]: '', desc: '', ...(next[index] || {}), [key]: value };
    onChange(next);
  };
  const remove = (index) => onChange((items || []).filter((_, i) => i !== index));
  const move = (index, direction) => {
    const next = [...(items || [])];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };
  const add = () => onChange([...(items || []), { nome: '', [config.valueKey]: '', desc: '' }]);

  return (
    <Section
      title={title}
      icon={icon}
      hint={hint}
      action={<button type="button" onClick={add} className="rounded-md bg-amber-400 px-3 py-1.5 text-[11px] font-black text-zinc-950 hover:bg-amber-300">+ {config.addLabel}</button>}
    >
      {(items || []).length === 0 ? (
        <button type="button" onClick={add} className="w-full rounded-lg border-2 border-dashed border-zinc-300 p-5 text-xs font-bold text-zinc-400 hover:border-amber-400 hover:text-amber-700">Nenhum registro. Clique para adicionar.</button>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {(items || []).map((entry, index) => (
            <div key={index} className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-zinc-900 text-[10px] font-black text-amber-400">{index + 1}</span>
                <Input value={entry.nome || ''} onChange={(e) => patch(index, 'nome', e.target.value)} placeholder={`Nome da ${config.addLabel.toLowerCase()}`} className="font-bold" />
                <div className="flex shrink-0 gap-1">
                  <button type="button" disabled={index === 0} onClick={() => move(index, -1)} className="rounded border bg-white px-2 py-1 text-xs disabled:opacity-30">↑</button>
                  <button type="button" disabled={index === items.length - 1} onClick={() => move(index, 1)} className="rounded border bg-white px-2 py-1 text-xs disabled:opacity-30">↓</button>
                  <button type="button" onClick={() => remove(index)} className="rounded border border-red-200 bg-red-50 px-2 py-1 text-xs font-bold text-red-700">×</button>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-[120px_1fr]">
                <Field label={config.valueLabel}><Input value={entry[config.valueKey] || ''} onChange={(e) => patch(index, config.valueKey, e.target.value)} placeholder="Opcional" /></Field>
                <Field label="Resumo / lembrete"><Textarea rows="2" value={entry.desc || ''} onChange={(e) => patch(index, 'desc', e.target.value)} placeholder="Descrição curta para consulta em mesa..." /></Field>
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
};

export default function TresDeTCharacterEditor({ scope }) {
  const { data, setData, updateField, optimizeImageFile, showToast } = scope;
  const [tab, setTab] = useState('ficha');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (data?.system === '3det') setTab('ficha');
  }, [data?.id]);

  if (!data || data.system !== '3det' || data.type !== 'pc') return null;

  const attrs = data.atributos || {};
  const status = data.status || {};
  const skills = data.pericias || {};

  const rarityTotals = useMemo(() => {
    const totals = { Comum: 0, Incomum: 0, Raro: 0 };
    (data.inventario || []).forEach((item) => {
      const rarity = TRESDET_RARITIES.includes(item?.raridade) ? item.raridade : 'Comum';
      totals[rarity] += Math.max(0, Number(item?.quantidade || 0));
    });
    return totals;
  }, [data.inventario]);

  const setList = (key, value) => updateField(key, value);
  const patchInventory = (index, key, value) => {
    const next = JSON.parse(JSON.stringify(data.inventario || []));
    next[index] = { nome: '', quantidade: 1, raridade: 'Comum', notas: '', ...(next[index] || {}), [key]: value };
    setList('inventario', next);
  };
  const moveInventory = (index, direction) => {
    const next = [...(data.inventario || [])];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setList('inventario', next);
  };

  const handlePortrait = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const image = await optimizeImageFile(file, 900, 0.82);
      updateField('bio.imagem', image);
      showToast('Retrato do 3DeT atualizado.');
    } catch (error) {
      console.error(error);
      showToast('Não foi possível usar essa imagem.');
    }
  };

  const applyImageUrl = () => {
    const url = imageUrl.trim();
    if (!url) return;
    updateField('bio.imagem', url);
    setImageUrl('');
    showToast('Retrato aplicado por URL.');
  };

  const tabs = [
    ['ficha', '🎮 Ficha'],
    ['habilidades', '⭐ Vantagens & Técnicas'],
    ['inventario', '🎒 Inventário'],
    ['notas', '📝 Notas'],
  ];

  const attributeCards = [
    { key: 'poder', short: 'P', name: 'Poder', resource: 'pa', resourceName: 'PA' },
    { key: 'habilidade', short: 'H', name: 'Habilidade', resource: 'pm', resourceName: 'PM' },
    { key: 'resistencia', short: 'R', name: 'Resistência', resource: 'pv', resourceName: 'PV' },
  ];

  return (
    <div className="bg-[#f5f5f2] text-zinc-900">
      <div className="border-b-4 border-amber-400 bg-zinc-950 px-4 py-4 md:px-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.28em] text-amber-400">PJ Lite • primeira prévia</div>
            <div className="mt-1 flex items-center gap-3">
              <div className="rounded bg-amber-400 px-2 py-1 text-xl font-black italic text-zinc-950 shadow">3DeT</div>
              <div>
                <h1 className="font-title text-xl font-black uppercase tracking-wide text-white md:text-2xl">Victory</h1>
                <p className="text-[10px] text-zinc-400">Ficha digital compacta baseada nas referências enviadas.</p>
              </div>
            </div>
          </div>
          <div className="rounded-full border border-amber-400/50 bg-amber-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-300">Personagem</div>
        </div>
      </div>

      <nav className="no-print sticky top-0 z-20 flex gap-1 overflow-x-auto border-b border-zinc-300 bg-white/95 px-3 py-2 shadow-sm backdrop-blur md:px-7">
        {tabs.map(([id, label]) => (
          <button key={id} type="button" onClick={() => setTab(id)} className={`whitespace-nowrap rounded-md px-3 py-2 text-xs font-black transition ${tab === id ? 'bg-zinc-950 text-amber-400 shadow' : 'bg-zinc-100 text-zinc-600 hover:bg-amber-100 hover:text-zinc-950'}`}>{label}</button>
        ))}
      </nav>

      <div className="space-y-5 p-4 md:p-7">
        {tab === 'ficha' && <>
          <section className="grid gap-4 rounded-xl border-2 border-zinc-200 bg-white p-4 shadow-sm lg:grid-cols-[220px_1fr]">
            <div className="space-y-2">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-[220px] overflow-hidden rounded-lg border-4 border-zinc-950 bg-zinc-100 shadow-inner">
                {data.bio?.imagem ? <img src={data.bio.imagem} alt={data.bio?.nome || 'Retrato'} className="h-full w-full object-cover" /> : <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center text-zinc-400"><span className="text-5xl">👤</span><span className="text-[10px] font-black uppercase tracking-widest">Retrato opcional</span></div>}
                <div className="absolute bottom-0 left-0 right-0 bg-zinc-950/90 px-2 py-1 text-center text-[9px] font-black uppercase text-amber-400">Personagem</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="cursor-pointer rounded-md bg-zinc-900 px-2 py-2 text-center text-[10px] font-black text-white hover:bg-black">📷 Upload<input type="file" accept="image/*" className="hidden" onChange={handlePortrait} /></label>
                <button type="button" onClick={() => updateField('bio.imagem', '')} disabled={!data.bio?.imagem} className="rounded-md border border-zinc-300 bg-white px-2 py-2 text-[10px] font-black text-zinc-600 disabled:opacity-40">Remover</button>
              </div>
              <div className="flex gap-1">
                <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && applyImageUrl()} placeholder="URL da imagem" className="text-[10px]" />
                <button type="button" onClick={applyImageUrl} className="rounded-md bg-amber-400 px-3 text-[10px] font-black text-zinc-950">OK</button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Nome" className="md:col-span-2"><Input value={data.bio?.nome || ''} onChange={(e) => updateField('bio.nome', e.target.value)} placeholder="Nome do personagem" className="text-base font-black" /></Field>
                <Field label="Jogador"><Input value={data.bio?.jogador || ''} onChange={(e) => updateField('bio.jogador', e.target.value)} placeholder="Nome do jogador" /></Field>
                <Field label="Arquétipo"><Input value={data.bio?.arquetipo || ''} onChange={(e) => updateField('bio.arquetipo', e.target.value)} placeholder="Arquétipo" /></Field>
                <Field label="Kit (opcional)"><Input value={data.bio?.kit || ''} onChange={(e) => updateField('bio.kit', e.target.value)} placeholder="Kit, se estiver usando" /></Field>
                <Field label="Escala"><Input value={data.bio?.escala || ''} onChange={(e) => updateField('bio.escala', e.target.value)} placeholder="Escala" /></Field>
                <Field label="Conceito" className="md:col-span-2"><Textarea rows="3" value={data.bio?.conceito || ''} onChange={(e) => updateField('bio.conceito', e.target.value)} placeholder="Uma frase curta que explique quem é o personagem..." /></Field>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:max-w-md">
                <Field label="Pontos"><Input type="number" value={data.pontos ?? 0} onChange={(e) => updateField('pontos', clampNumber(e.target.value))} className="font-black" /></Field>
                <Field label="XP"><Input type="number" value={data.xp ?? 0} onChange={(e) => updateField('xp', clampNumber(e.target.value))} className="font-black" /></Field>
              </div>
            </div>
          </section>

          <Section title="Atributos & Recursos" icon="◆" hint="Poder, Habilidade e Resistência com PA, PM e PV atuais/máximos.">
            <div className="grid gap-3 md:grid-cols-3">
              {attributeCards.map((card) => (
                <div key={card.key} className="overflow-hidden rounded-xl border-2 border-zinc-900 bg-zinc-50 shadow-sm">
                  <div className="flex items-center justify-between bg-zinc-950 px-3 py-2 text-white">
                    <div className="flex items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded bg-amber-400 text-xl font-black text-zinc-950">{card.short}</span><span className="text-xs font-black uppercase tracking-wider">{card.name}</span></div>
                    <input aria-label={card.name} type="number" value={attrs[card.key] ?? 0} onChange={(e) => updateField(`atributos.${card.key}`, clampNumber(e.target.value))} className="w-16 rounded border-2 border-amber-400 bg-white px-2 py-1 text-center text-xl font-black text-zinc-950 outline-none" />
                  </div>
                  <div className="p-3">
                    <div className="mb-1 text-[10px] font-black uppercase tracking-widest text-zinc-500">{card.resourceName}</div>
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                      <Input aria-label={`${card.resourceName} atual`} type="number" value={status[card.resource]?.atual ?? 0} onChange={(e) => updateField(`status.${card.resource}.atual`, clampNumber(e.target.value))} className="text-center font-black" />
                      <span className="font-black text-zinc-400">/</span>
                      <Input aria-label={`${card.resourceName} máximo`} type="number" value={status[card.resource]?.max ?? 0} onChange={(e) => updateField(`status.${card.resource}.max`, clampNumber(e.target.value))} className="text-center font-black" />
                    </div>
                    <div className="mt-1 grid grid-cols-2 text-center text-[9px] font-bold uppercase text-zinc-400"><span>Atual</span><span>Máximo</span></div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
            <Section title="Perícias" icon="●" hint="Marque as perícias registradas para o personagem.">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {TRESDET_SKILLS.map(([id, name]) => (
                  <label key={id} className={`flex cursor-pointer items-center gap-2 rounded-lg border-2 px-3 py-2 text-xs font-bold transition ${skills[id] ? 'border-amber-500 bg-amber-100 text-zinc-950' : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-amber-300'}`}>
                    <input type="checkbox" checked={!!skills[id]} onChange={(e) => updateField(`pericias.${id}`, e.target.checked)} className="accent-amber-500" />
                    {name}
                  </label>
                ))}
              </div>
            </Section>

            <Section title="FA & FD" icon="⚔" hint="Campos livres para registrar a referência usada pela sua mesa.">
              <div className="space-y-3">
                {['fa', 'fd'].map((id) => <div key={id} className="rounded-lg border border-zinc-200 bg-zinc-50 p-3"><div className="mb-2 text-sm font-black uppercase text-zinc-900">{id.toUpperCase()}</div><div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1"><Field label="Atributo / referência"><Input value={data.combate?.[id]?.atributo || ''} onChange={(e) => updateField(`combate.${id}.atributo`, e.target.value)} placeholder="Ex.: P, H, R..." /></Field><Field label="Ganho / observação"><Input value={data.combate?.[id]?.ganho || ''} onChange={(e) => updateField(`combate.${id}.ganho`, e.target.value)} placeholder="Anotação rápida" /></Field></div></div>)}
              </div>
            </Section>
          </div>
        </>}

        {tab === 'habilidades' && <div className="space-y-5">
          <ListEditor title="Vantagens" icon="★" hint="Registre apenas as Vantagens escolhidas pelo personagem." items={data.vantagens || []} onChange={(value) => setList('vantagens', value)} kind="vantagem" />
          <ListEditor title="Desvantagens" icon="−" hint="Registre as Desvantagens relevantes para a ficha." items={data.desvantagens || []} onChange={(value) => setList('desvantagens', value)} kind="desvantagem" />
          <ListEditor title="Técnicas" icon="⚡" hint="Nome, custo e um lembrete curto do efeito." items={data.tecnicas || []} onChange={(value) => setList('tecnicas', value)} kind="tecnica" />
        </div>}

        {tab === 'inventario' && <Section
          title="Inventário"
          icon="🎒"
          hint="Itens organizados por raridade. Os contadores abaixo são apenas um resumo da ficha digital."
          action={<button type="button" onClick={() => setList('inventario', [...(data.inventario || []), { nome: '', quantidade: 1, raridade: 'Comum', notas: '' }])} className="rounded-md bg-amber-400 px-3 py-1.5 text-[11px] font-black text-zinc-950 hover:bg-amber-300">+ Item</button>}
        >
          <div className="mb-4 grid grid-cols-3 gap-2">
            {TRESDET_RARITIES.map((rarity) => <div key={rarity} className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-center"><div className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{rarity}</div><div className="mt-1 text-2xl font-black text-zinc-950">{rarityTotals[rarity]}</div></div>)}
          </div>
          {(data.inventario || []).length === 0 ? <button type="button" onClick={() => setList('inventario', [{ nome: '', quantidade: 1, raridade: 'Comum', notas: '' }])} className="w-full rounded-lg border-2 border-dashed border-zinc-300 p-6 text-xs font-bold text-zinc-400 hover:border-amber-400 hover:text-amber-700">Inventário vazio. Adicionar primeiro item.</button> : <div className="space-y-2">{(data.inventario || []).map((item, index) => <div key={index} className="grid gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 md:grid-cols-[1.3fr_90px_130px_1.5fr_auto] md:items-end"><Field label="Item"><Input value={item.nome || ''} onChange={(e) => patchInventory(index, 'nome', e.target.value)} placeholder="Nome do item" /></Field><Field label="Qtd."><Input type="number" min="0" value={item.quantidade ?? 1} onChange={(e) => patchInventory(index, 'quantidade', Math.max(0, clampNumber(e.target.value)))} /></Field><Field label="Raridade"><select value={item.raridade || 'Comum'} onChange={(e) => patchInventory(index, 'raridade', e.target.value)} className="w-full rounded-md border border-zinc-300 bg-white px-2 py-2 text-sm outline-none focus:border-amber-500">{TRESDET_RARITIES.map((rarity) => <option key={rarity}>{rarity}</option>)}</select></Field><Field label="Notas"><Input value={item.notas || ''} onChange={(e) => patchInventory(index, 'notas', e.target.value)} placeholder="Uso, detalhe, lembrete..." /></Field><div className="flex gap-1"><button type="button" disabled={index === 0} onClick={() => moveInventory(index, -1)} className="rounded border bg-white px-2 py-2 text-xs disabled:opacity-30">↑</button><button type="button" disabled={index === (data.inventario || []).length - 1} onClick={() => moveInventory(index, 1)} className="rounded border bg-white px-2 py-2 text-xs disabled:opacity-30">↓</button><button type="button" onClick={() => setList('inventario', (data.inventario || []).filter((_, i) => i !== index))} className="rounded border border-red-200 bg-red-50 px-2 py-2 text-xs font-black text-red-700">×</button></div></div>)}</div>}
        </Section>}

        {tab === 'notas' && <Section title="Anotações" icon="✎" hint="Espaço livre para campanha, transformação, forma alternativa ou qualquer detalhe que não caiba nas áreas anteriores."><Textarea rows="16" value={data.notas || ''} onChange={(e) => updateField('notas', e.target.value)} placeholder="Anotações do personagem..." /></Section>}

        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-[10px] leading-relaxed text-amber-950">
          <strong>3DeT Victory no PJ Lite:</strong> esta primeira prévia usa a estrutura das fichas que você forneceu como referência de organização. Os campos permanecem editáveis e evitam automações rígidas para facilitar ajustes da mesa. O livro continua sendo a referência para regras completas.
        </div>
      </div>
    </div>
  );
}
