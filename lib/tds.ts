import { company, fuelModes, hotspots, type FuelMode } from "@/lib/data";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function buildTdsHtml(selected: FuelMode) {
  const rows = fuelModes
    .map((mode) => {
      const mark = mode.id === selected.id ? " selected" : "";
      return `<tr class="${mark}">
        <td>${escapeHtml(mode.label)}</td>
        <td>₹${mode.costPerCycle.toLocaleString("en-IN")}</td>
        <td>${mode.cycleMins} min</td>
        <td>${mode.timberSavedKg} kg</td>
        <td>${mode.carbonSavedKg} kg</td>
        <td>${escapeHtml(mode.efficiency)}</td>
        <td>${escapeHtml(mode.power)}</td>
      </tr>`;
    })
    .join("");

  const chambers = hotspots
    .map(
      (spot) => `<section>
        <h2>${escapeHtml(spot.index)} · ${escapeHtml(spot.title)}</h2>
        <p>${escapeHtml(spot.summary)}</p>
        <ul>${spot.points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul>
      </section>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Alpha Equipments — Technical Data Sheet (${escapeHtml(selected.label)})</title>
  <style>
    body { font-family: "Segoe UI", sans-serif; color: #161616; margin: 40px auto; max-width: 880px; line-height: 1.5; }
    h1 { font-size: 28px; margin-bottom: 0; }
    h2 { font-size: 18px; margin-top: 28px; }
    .kicker { letter-spacing: 0.16em; text-transform: uppercase; font-size: 12px; color: #854d0e; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 14px; }
    th, td { border-bottom: 1px solid #e5e5e5; text-align: left; padding: 8px 6px; vertical-align: top; }
    tr.selected td { background: #fef9c3; font-weight: 600; }
    ul { padding-left: 18px; }
    .note { color: #525252; font-size: 13px; }
  </style>
</head>
<body>
  <p class="kicker">Technical data sheet</p>
  <h1>Alpha Equipments</h1>
  <p>Advanced high-temperature cremation furnaces and eco-friendly thermal incineration systems.</p>
  <p class="note">Selected duty: ${escapeHtml(selected.label)}. ${escapeHtml(selected.kicker)}.</p>
  <p class="note">${escapeHtml(company.city)} · ${escapeHtml(company.phoneDisplay)} · ${escapeHtml(company.email)}</p>
  <h2>Fuel modes</h2>
  <table>
    <thead>
      <tr><th>Mode</th><th>₹ / cycle</th><th>Cycle</th><th>Timber avoided</th><th>Carbon avoided</th><th>Efficiency</th><th>Power</th></tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <p class="note">Planning figures for a conversation with the Vadodara desk. They are not a quotation. Open-pyre baseline used alongside this sheet: 400 kg timber per cremation.</p>
  ${chambers}
  <h2>Turnkey scope</h2>
  <ul>
    <li>Civil and shed design</li>
    <li>Exhaust chimney fabrication — 30 m MS fabricated stack</li>
    <li>Ash handling and pulverizer machine</li>
    <li>Air pollution control systems (APCS), including wet scrubber and ID fan</li>
  </ul>
  <p class="note">Print this sheet to PDF from the browser if a fixed copy is required.</p>
</body>
</html>`;
}

export function downloadSpecification(mode: FuelMode) {
  const blob = new Blob([buildTdsHtml(mode)], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `Alpha-Equipments-TDS-${mode.id}.html`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
