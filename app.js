const monthlyData = [
  { month: "Ene", year: "2026", site: "San Jose", co2: 92, renewable: 41, saving: 12800 },
  { month: "Feb", year: "2026", site: "San Jose", co2: 87, renewable: 45, saving: 14200 },
  { month: "Mar", year: "2026", site: "San Jose", co2: 78, renewable: 48, saving: 16700 },
  { month: "Abr", year: "2026", site: "Heredia", co2: 64, renewable: 58, saving: 11200 },
  { month: "May", year: "2026", site: "Heredia", co2: 59, renewable: 61, saving: 13350 },
  { month: "Jun", year: "2026", site: "Cartago", co2: 53, renewable: 66, saving: 14900 },
  { month: "Jul", year: "2026", site: "Cartago", co2: 49, renewable: 69, saving: 17250 },
  { month: "Ago", year: "2026", site: "San Jose", co2: 46, renewable: 72, saving: 18400 },
  { month: "Sep", year: "2026", site: "Heredia", co2: 43, renewable: 74, saving: 19600 },
  { month: "Oct", year: "2026", site: "Cartago", co2: 39, renewable: 78, saving: 21100 },
  { month: "Nov", year: "2026", site: "San Jose", co2: 36, renewable: 81, saving: 23600 },
  { month: "Dic", year: "2026", site: "Heredia", co2: 33, renewable: 83, saving: 25400 },
  { month: "Ene", year: "2025", site: "San Jose", co2: 112, renewable: 32, saving: 7400 },
  { month: "Feb", year: "2025", site: "Heredia", co2: 105, renewable: 34, saving: 8100 },
  { month: "Mar", year: "2025", site: "Cartago", co2: 98, renewable: 36, saving: 9100 },
  { month: "Abr", year: "2025", site: "San Jose", co2: 94, renewable: 39, saving: 10200 },
];

const suppliers = [
  { name: "TransLogix CR", category: "Logistica", co2: 42, score: 71, status: "Vigilar" },
  { name: "MetalWorks Norte", category: "Materia prima", co2: 58, score: 64, status: "Riesgo" },
  { name: "CleanGrid Energy", category: "Energia", co2: 18, score: 89, status: "Optimo" },
  { name: "Empaques Verde", category: "Packaging", co2: 24, score: 84, status: "Optimo" },
  { name: "ColdChain Services", category: "Refrigeracion", co2: 37, score: 69, status: "Vigilar" },
  { name: "OfficeLink LATAM", category: "Servicios", co2: 12, score: 91, status: "Optimo" },
];

const energyMix = [
  { label: "Solar", value: 36 },
  { label: "Hidroelectrica", value: 29 },
  { label: "Red nacional", value: 24 },
  { label: "Diesel respaldo", value: 11 },
];

const siteFilter = document.querySelector("#siteFilter");
const periodFilter = document.querySelector("#periodFilter");
const supplierSearch = document.querySelector("#supplierSearch");
const exportBtn = document.querySelector("#exportBtn");

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function getFilteredData() {
  return monthlyData.filter((item) => {
    const matchesSite = siteFilter.value === "all" || item.site === siteFilter.value;
    return matchesSite && item.year === periodFilter.value;
  });
}

function renderKpis(data) {
  const co2 = data.reduce((sum, item) => sum + item.co2, 0);
  const avgRenewable = Math.round(data.reduce((sum, item) => sum + item.renewable, 0) / data.length || 0);
  const saving = data.reduce((sum, item) => sum + item.saving, 0);
  const riskCount = suppliers.filter((supplier) => supplier.status !== "Optimo").length;
  const first = data[0]?.co2 ?? 0;
  const last = data[data.length - 1]?.co2 ?? 0;
  const reduction = first ? Math.round(((first - last) / first) * 100) : 0;

  document.querySelector("#co2Kpi").textContent = `${co2} t`;
  document.querySelector("#co2Trend").textContent = `${reduction}% menos contra inicio del periodo`;
  document.querySelector("#renewableKpi").textContent = `${avgRenewable}%`;
  document.querySelector("#savingKpi").textContent = money(saving);
  document.querySelector("#riskKpi").textContent = riskCount;
  document.querySelector("#healthScore").textContent = Math.max(62, Math.min(94, avgRenewable + reduction + 9));
}

function renderChart(data) {
  const canvas = document.querySelector("#emissionsChart");
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const padding = 52;
  const values = data.map((item) => item.co2);
  const max = Math.max(...values, 100);

  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = "#dce5de";
  ctx.lineWidth = 1;
  ctx.font = "24px Inter, system-ui";
  ctx.fillStyle = "#65736b";

  for (let i = 0; i <= 4; i += 1) {
    const y = padding + ((height - padding * 2) / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  if (!data.length) return;

  const step = (width - padding * 2) / Math.max(data.length - 1, 1);
  const points = data.map((item, index) => ({
    x: padding + step * index,
    y: height - padding - (item.co2 / max) * (height - padding * 2),
    label: item.month,
  }));

  ctx.strokeStyle = "#16784f";
  ctx.lineWidth = 5;
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();

  points.forEach((point, index) => {
    ctx.fillStyle = "#16784f";
    ctx.beginPath();
    ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#17201b";
    ctx.fillText(String(data[index].co2), point.x - 13, point.y - 18);
    ctx.fillStyle = "#65736b";
    ctx.fillText(point.label, point.x - 16, height - 16);
  });
}

function renderEnergyMix() {
  const container = document.querySelector("#energyMix");
  container.innerHTML = energyMix
    .map(
      (item) => `
        <div class="mix-item">
          <div class="mix-meta"><strong>${item.label}</strong><span>${item.value}%</span></div>
          <div class="bar"><span style="width:${item.value}%"></span></div>
        </div>
      `,
    )
    .join("");
}

function statusClass(status) {
  if (status === "Optimo") return "ok";
  if (status === "Vigilar") return "watch";
  return "risk";
}

function renderSuppliers() {
  const query = supplierSearch.value.toLowerCase();
  const rows = suppliers
    .filter((supplier) => supplier.name.toLowerCase().includes(query) || supplier.category.toLowerCase().includes(query))
    .map(
      (supplier) => `
        <tr>
          <td><strong>${supplier.name}</strong></td>
          <td>${supplier.category}</td>
          <td>${supplier.co2} t</td>
          <td>${supplier.score}/100</td>
          <td><span class="status ${statusClass(supplier.status)}">${supplier.status}</span></td>
        </tr>
      `,
    )
    .join("");
  document.querySelector("#supplierRows").innerHTML = rows;
}

function renderInsights(data) {
  const totalCo2 = data.reduce((sum, item) => sum + item.co2, 0);
  const highestSupplier = [...suppliers].sort((a, b) => b.co2 - a.co2)[0];
  const insights = [
    `Renegociar transporte con ${highestSupplier.name} puede reducir hasta 9 t CO2e por trimestre.`,
    `El consumo renovable supera el 70% en los ultimos meses; conviene fijar contratos PPA de largo plazo.`,
    `Con el ritmo actual, la organizacion cerraria el periodo con ${totalCo2} t CO2e registradas.`,
  ];

  document.querySelector("#insights").innerHTML = insights
    .map((text, index) => `<div class="insight"><strong>Prioridad ${index + 1}</strong><span>${text}</span></div>`)
    .join("");
}

function exportCsv() {
  const rows = getFilteredData();
  const csv = ["month,year,site,co2,renewable,saving", ...rows.map((row) => Object.values(row).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "ecotrack-report.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function updateDashboard() {
  const data = getFilteredData();
  renderKpis(data);
  renderChart(data);
  renderInsights(data);
  document.querySelectorAll(".metric, .panel, .program-card").forEach((element) => {
    element.classList.remove("is-refreshing");
    void element.offsetWidth;
    element.classList.add("is-refreshing");
  });
}

siteFilter.addEventListener("change", updateDashboard);
periodFilter.addEventListener("change", updateDashboard);
supplierSearch.addEventListener("input", renderSuppliers);
exportBtn.addEventListener("click", exportCsv);

renderEnergyMix();
renderSuppliers();
updateDashboard();
