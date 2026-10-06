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

/* Perfis dos membros do grupo */
.pjlite-cloud-group-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.pjlite-cloud-group-card__head > div {
  display: grid;
  gap: 2px;
  min-width: 0;
}
.pjlite-cloud-group-card__head > div > span {
  color: #8794a4;
  font-size: 8px;
}
.pjlite-cloud-group-members {
  display: grid;
  gap: 8px;
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #d7e0e9;
  border-radius: 9px;
  background: #fff;
}
.pjlite-cloud-group-members__title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.pjlite-cloud-group-members__title > span {
  color: #65768a;
  font-size: 8px;
  font-weight: 950;
  letter-spacing: .08em;
}
.pjlite-cloud-group-members__title > small {
  padding: 0;
  background: transparent;
  color: #93a0ae;
  font-size: 7.5px;
}
.pjlite-cloud-group-members__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 7px;
}
.pjlite-cloud-member {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  gap: 8px;
  align-items: center;
  min-width: 0;
  padding: 8px;
  border: 1px solid #e0e7ee;
  border-radius: 8px;
  background: #f8fafc;
}
.pjlite-cloud-member__avatar {
  width: 34px;
  height: 34px;
  overflow: hidden;
  border: 1px solid #ced8e2;
  border-radius: 50%;
  background: #e5ecf2;
}
.pjlite-cloud-member__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.pjlite-cloud-member__avatar > span {
  display: grid;
  width: 100%;
  height: 100%;
  place-items: center;
  color: #486078;
  font-size: 11px;
  font-weight: 950;
}
.pjlite-cloud-member__main {
  display: grid;
  gap: 3px;
  min-width: 0;
}
.pjlite-cloud-member__name {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}
.pjlite-cloud-member__name strong {
  overflow: hidden;
  color: #324960;
  font-size: 9.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pjlite-cloud-member__name em {
  padding: 2px 5px;
  border-radius: 999px;
  background: #e7eef5;
  color: #65778a;
  font-size: 7px;
  font-style: normal;
  font-weight: 900;
}
.pjlite-cloud-member__main > small {
  padding: 0;
  background: transparent;
  color: #8a97a6;
  font-size: 7.5px;
  font-weight: 700;
}
.pjlite-cloud-member__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.pjlite-cloud-member-tag {
  display: inline-flex;
  align-items: center;
  min-height: 19px;
  padding: 3px 5px;
  border: 1px solid #c9b47f;
  border-radius: 5px;
  background: #2a251a;
  color: #eadcb0;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 7px;
  font-weight: 950;
  letter-spacing: .07em;
}
.pjlite-cloud-member-tag.is-rz-88 {
  border-color: #637a69;
  background: #142019;
  color: #cee0d2;
}
.pjlite-cloud-member-tag.is-empty {
  border-color: #dbe3ea;
  background: #f3f6f8;
  color: #9aa6b3;
  font-family: inherit;
  font-weight: 750;
  letter-spacing: 0;
}

.theme-dark .pjlite-cloud-group-members {
  background: #101827;
  border-color: #3b4b60;
}
.theme-dark .pjlite-cloud-group-members__title > span {
  color: #b2c0ce;
}
.theme-dark .pjlite-cloud-member {
  background: #172233;
  border-color: #33465c;
}
.theme-dark .pjlite-cloud-member__avatar {
  background: #223147;
  border-color: #43566d;
}
.theme-dark .pjlite-cloud-member__avatar > span,
.theme-dark .pjlite-cloud-member__name strong {
  color: #e2eaf2;
}
.theme-dark .pjlite-cloud-member__name em {
  background: #243348;
  color: #bdcad7;
}
.theme-dark .pjlite-cloud-member__main > small {
  color: #96a7b8;
}
.theme-dark .pjlite-cloud-member-tag.is-empty {
  border-color: #3b4b60;
  background: #1d2939;
  color: #8495a7;
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
  .pjlite-cloud-group-members__grid {
    grid-template-columns: 1fr;
  }
  .pjlite-cloud-group-members__title {
    align-items: flex-start;
    flex-direction: column;
  }
}
`;

await writeFile(cssPath, css, 'utf8');
console.log('✓ Conta Lite real: painel desktop ampliado e cards de grupo refinados.');
