import { readFile, writeFile } from 'node:fs/promises';

const cssPath = 'src/pjlite.css';
const marker = 'PJ LITE REAL CLOUD UI POLISH V1';
let css = await readFile(cssPath, 'utf8');

if (css.includes(marker)) {
  console.log('Real Cloud UI polish: already applied.');
  process.exit(0);
}

css += `
/* ${marker} */
@media (min-width: 721px) {
  .pjlite-cloud-settings {
    width: clamp(680px, 58vw, 960px);
  }
  .pjlite-cloud-settings__header {
    padding: 20px 24px 16px;
  }
  .pjlite-cloud-settings__header h2 {
    font-size: 21px;
  }
  .pjlite-cloud-settings__tabs {
    padding: 10px 24px 0;
    gap: 24px;
  }
  .pjlite-cloud-settings__tabs button {
    padding: 10px 5px 11px;
    font-size: 11px;
  }
  .pjlite-cloud-settings__content {
    padding: 22px 24px 28px;
  }
  .pjlite-cloud-settings__content:has(.pjlite-cloud-invite-join) {
    display: grid;
    grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr);
    gap: 14px;
    align-items: start;
  }
  .pjlite-cloud-settings__content:has(.pjlite-cloud-invite-join) > .pjlite-cloud-settings__group {
    margin-top: 0;
  }
  .pjlite-cloud-settings__content:has(.pjlite-cloud-invite-join) > .pjlite-cloud-settings__group:first-child {
    grid-column: 1 / -1;
  }
}

.pjlite-cloud-settings__group {
  padding: 15px;
  border-radius: 11px;
}
.pjlite-cloud-settings__group h3 {
  font-size: 12px;
}
.pjlite-cloud-settings__group p {
  margin-top: 5px;
  font-size: 10px;
  line-height: 1.5;
}
.pjlite-cloud-form-stack {
  gap: 10px;
  margin-top: 11px;
}
.pjlite-cloud-form-stack label > span {
  margin-bottom: 1px;
  font-size: 8.5px;
  letter-spacing: .055em;
}
.pjlite-cloud-form-stack input,
.pjlite-cloud-form-stack select,
.pjlite-cloud-form-stack textarea {
  min-height: 39px;
  padding: 9px 11px;
  border-radius: 8px;
  font-size: 11px;
}
.pjlite-cloud-primary,
.pjlite-cloud-form-stack > button.secondary,
.pjlite-cloud-actions button {
  min-height: 36px;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 10px;
}

/* Entrada por código real */
.pjlite-cloud-settings__group > .pjlite-cloud-invite-join {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
  margin-top: 11px;
  padding: 0;
  background: transparent;
}
.pjlite-cloud-settings__group > .pjlite-cloud-invite-join input {
  min-width: 0;
  min-height: 38px;
  padding: 9px 11px;
  border: 1px solid #bcc8d5;
  border-radius: 8px;
  background: #fff;
  color: #2e435b;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11px;
  font-weight: 850;
  letter-spacing: .07em;
  text-transform: uppercase;
}

/* Card de grupo real */
.pjlite-cloud-groups-list {
  gap: 10px;
  margin-top: 12px;
}
.pjlite-cloud-group-card {
  padding: 13px 44px 13px 13px;
  border-color: #d3dce6;
  border-radius: 10px;
  background: #f9fbfd;
  box-shadow: 0 2px 8px rgba(37, 57, 80, .045);
}
.pjlite-cloud-group-card > div:first-child {
  align-items: center;
}
.pjlite-cloud-group-card strong {
  font-size: 11px;
  color: #2d435b;
}
.pjlite-cloud-group-card small {
  padding: 3px 7px;
  border-radius: 999px;
  background: #edf2f6;
  color: #738194;
  font-size: 8px;
  font-weight: 800;
  white-space: nowrap;
}
.pjlite-cloud-invite {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
  align-items: end;
  margin-top: 10px;
  padding: 10px 11px;
  border: 1px solid #d5dfe9;
  border-radius: 8px;
  background: #eef3f8;
}
.pjlite-cloud-invite > div:first-child {
  display: grid;
  gap: 3px;
  min-width: 0;
}
.pjlite-cloud-invite > div:first-child > span {
  color: #718095;
  font-size: 8px;
  font-weight: 900;
  letter-spacing: .065em;
  text-transform: uppercase;
}
.pjlite-cloud-invite code {
  display: block;
  width: fit-content;
  max-width: 100%;
  padding: 5px 8px;
  border: 1px dashed #aab8c7;
  border-radius: 6px;
  background: #fff;
  color: #304962;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: .08em;
  white-space: nowrap;
}
.pjlite-cloud-invite-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 6px;
}
.pjlite-cloud-invite-actions button {
  min-height: 30px;
  padding: 6px 9px;
  border: 1px solid #c4cfda;
  border-radius: 7px;
  background: #fff;
  color: #4c6177;
  font-size: 9px;
  font-weight: 900;
}
.pjlite-cloud-invite-actions button:hover {
  background: #e5ecf3;
  border-color: #aebbc9;
}
.pjlite-cloud-icon-action {
  top: 10px;
  right: 10px;
  width: 26px;
  height: 26px;
}

.theme-dark .pjlite-cloud-settings__group > .pjlite-cloud-invite-join input,
.theme-dark .pjlite-cloud-invite code,
.theme-dark .pjlite-cloud-invite-actions button {
  background: #111827;
  border-color: #4a5c72;
  color: #e5edf5;
}
.theme-dark .pjlite-cloud-invite {
  background: #172233;
  border-color: #3f5065;
}
.theme-dark .pjlite-cloud-invite > div:first-child > span {
  color: #a9b7c7;
}
.theme-dark .pjlite-cloud-group-card small {
  background: #223044;
  color: #b9c6d5;
}

@media (max-width: 720px) {
  .pjlite-cloud-settings__content {
    padding: 16px 14px 22px;
  }
  .pjlite-cloud-settings__group > .pjlite-cloud-invite-join,
  .pjlite-cloud-invite {
    grid-template-columns: 1fr;
  }
  .pjlite-cloud-settings__group > .pjlite-cloud-invite-join button,
  .pjlite-cloud-invite-actions,
  .pjlite-cloud-invite-actions button {
    width: 100%;
  }
  .pjlite-cloud-invite-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .pjlite-cloud-group-card {
    padding: 12px 40px 12px 12px;
  }
}
`;

await writeFile(cssPath, css, 'utf8');
console.log('✓ Conta Lite real: painel desktop ampliado e cards de grupo refinados.');
