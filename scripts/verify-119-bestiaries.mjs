import assert from 'node:assert/strict';
import {SRD521_MONSTERS,SRD521_MONSTER_GROUPS} from '../src/systems/dnd5e/srd521-monsters.js';
import {FABULA_LITE_EXAMPLES} from '../src/systems/fabulaUltima/liteThreatExamples.js';
import {MODELOS_SKYFALL_AMEACAS} from '../src/systems/skyfall/threatModels.js';
assert.equal(SRD521_MONSTERS.length,330);assert.equal(new Set(SRD521_MONSTERS.map(x=>x.nomeOriginal)).size,330);assert.equal(SRD521_MONSTER_GROUPS.flatMap(x=>x.items).length,330);for(const m of SRD521_MONSTERS){assert.ok(m.ca&&m.pv&&m.fonte&&m.desafio);assert.ok(Object.values(m.atributos).every(Number.isFinite));assert.ok(Array.isArray(m.acoes));}assert.equal(FABULA_LITE_EXAMPLES.length,8);assert.equal(MODELOS_SKYFALL_AMEACAS.filter(m=>m.fonte==='PJLite • exemplo original').length,6);console.log('✓ 330 entradas D&D SRD + modelos originais Fábula/Skyfall validados');
