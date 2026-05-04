document.addEventListener('DOMContentLoaded', () => {
  const main = document.querySelector('.app');
  const navLinks = [...document.querySelectorAll('.sidebar nav a')];
  const dashboard = main.innerHTML;
  const navOrder = ['Overview', 'Emissions', 'Energy', 'Suppliers', 'Facilities', 'Reports', 'Targets', 'Alerts', 'Settings'];

  const records = {
    Emissions: [
      ['Fleet fuel', 'Building A', '112 t', '-4.2%', 'High'],
      ['Natural gas', 'Building C', '96 t', '-2.1%', 'Medium'],
      ['Purchased electricity', 'HQ', '184 t', '+1.8%', 'Medium'],
      ['Logistics', 'North route', '74 t', '-6.7%', 'Low'],
    ],
    Energy: [
      ['Solar PPA', 'Energy team', '62%', '70%', 'Medium'],
      ['HVAC efficiency', 'Facilities', '+4.3%', '+8%', 'High'],
      ['Peak load', 'Operations', '812 MWh', '760 MWh', 'Medium'],
      ['Lighting retrofit', 'Building C', '42%', '100%', 'Low'],
    ],
    Suppliers: [
      ['Global Metals Co.', 'Raw Materials', '$2,154,000', 'High', 'Engage'],
      ['GreenPack Solutions', 'Packaging', '$1,125,000', 'Medium', 'Review'],
      ['TransLogix', 'Logistics', '$980,000', 'Medium', 'Monitor'],
      ['EcoEnergy Supplies', 'Energy', '$850,000', 'Low', 'Maintain'],
    ],
    Facilities: [
      ['Building A', 'North', '95%', 'Good', 'Maria'],
      ['Building B', 'Central', '84%', 'Review', 'Ana'],
      ['Building C', 'West', '91%', 'Good', 'Luis'],
      ['Warehouse 2', 'South', '72%', 'Missing data', 'Sofia'],
    ],
    Reports: [
      ['Monthly report', 'Apr 2025', 'EA', 'Ready', 'PDF'],
      ['Audit pack', 'Q2 2025', 'Finance', 'Draft', 'ZIP'],
      ['Board view', 'May 2025', 'Leadership', 'Ready', 'Slides'],
      ['Supplier export', 'Apr 2025', 'Procurement', 'Ready', 'CSV'],
    ],
    Targets: [
      ['CO2e reduction', '2024 baseline', '-12%', 'Dec 2025', 'On track'],
      ['Renewable energy', '55%', '62%', 'Sep 2025', 'Medium'],
      ['Facility coverage', '80%', '8 / 10', 'Jun 2025', 'Needs action'],
      ['Supplier quality', '76%', '91%', 'Aug 2025', 'On track'],
    ],
    Alerts: [
      ['Missing supplier data', 'High', 'Suppliers', 'Today', 'Ana'],
      ['Energy spike', 'Medium', 'Building B', 'Yesterday', 'Luis'],
      ['Emission factor outdated', 'Medium', 'Reports', 'May 22', 'EA'],
      ['Facility report pending', 'Low', 'Warehouse 2', 'May 20', 'Sofia'],
    ],
    Settings: [
      ['Workspace name', 'EcoTrack', 'Global', 'Today', 'Active'],
      ['Currency', 'USD', 'Reports', 'May 23', 'Active'],
      ['Emission library', 'EPA 2025', 'Calculations', 'May 22', 'Active'],
      ['Access role', 'Admin', 'EA profile', 'Today', 'Active'],
    ],
  };

  const cards = {
    Emissions: [['Scope 1', '320 t', 'Natural gas and fleet fuel'], ['Scope 2', '468 t', 'Purchased electricity'], ['Scope 3', '460 t', 'Supplier activity'], ['Reduction', '-8.2%', 'Compared with previous month']],
    Energy: [['Renewable', '62%', 'Target is 70%'], ['Electricity', '812 MWh', 'Across 8 facilities'], ['Efficiency', '+4.3%', 'Improved vs last period'], ['Cost saved', '$18.4K', 'Estimated monthly saving']],
    Suppliers: [['High risk', '1', 'Needs supplier plan'], ['Medium risk', '2', 'Monitor this month'], ['Low risk', '1', 'Stable partners'], ['Coverage', '91%', 'Data completeness']],
    Facilities: [['Reporting', '8 / 10', 'Two facilities pending'], ['Best quality', '95%', 'Building A'], ['Open gaps', '4', 'Missing activity data'], ['Audit ready', '6', 'Facilities ready']],
    Reports: [['Monthly report', 'Ready', 'PDF and CSV'], ['Audit pack', 'Draft', 'Needs approval'], ['Board view', 'Ready', 'Executive summary'], ['Exports', '12', 'This month']],
    Targets: [['CO2e target', '-12%', 'On track'], ['Renewable target', '70%', '8 pp remaining'], ['Coverage target', '100%', '2 facilities remaining'], ['Forecast', 'Good', 'Low risk']],
    Alerts: [['Open alerts', '4', '1 high priority'], ['Data gaps', '3', 'Supplier data missing'], ['Anomalies', '2', 'Energy spike detected'], ['Resolved', '18', 'Last 30 days']],
    Settings: [['Workspace', 'EcoTrack', 'Production demo'], ['Currency', 'USD', 'Reporting default'], ['Factors', 'EPA 2025', 'Active library'], ['Access', 'Admin', 'EA profile']],
  };

  function renderPage(pageName) {
    if (pageName === 'Overview') {
      main.innerHTML = dashboard;
    } else {
      main.innerHTML = modulePage(pageName);
    }

    bindActions();
    animateCards();
  }

  function modulePage(title) {
    const columns = title === 'Reports'
      ? ['Report', 'Period', 'Owner', 'Status', 'Format']
      : title === 'Alerts'
        ? ['Alert', 'Severity', 'Area', 'Detected', 'Owner']
        : ['Name', 'Area', 'Current', 'Trend', 'Status'];

    return `
      <header class="topbar">
        <h1>${title}</h1>
        <div class="actions">
          <select data-period><option>Apr 2025</option><option>May 2025</option><option>Q2 2025</option></select>
          <select data-filter><option>All status</option><option>High</option><option>Medium</option><option>Low</option><option>Ready</option><option>Active</option></select>
          <input data-search placeholder="Search ${title.toLowerCase()}..." />
          <button data-export class="export">Export CSV</button>
          <b>EA</b>
        </div>
      </header>
      <section class="kpis module-kpis">
        ${cards[title].map(([label, value, note], index) => `<article><i class="ico ${['green','blue','amber','purple'][index % 4]}">${index + 1}</i><span>${label}<small>${note}</small></span><strong>${value}</strong><p data-live>Updated now</p></article>`).join('')}
      </section>
      <section class="dashboard-grid module-grid">
        <article class="panel supplier-table module-panel">
          <div class="panel-head">
            <h2>${title} workspace</h2>
            <div><button data-reset>Reset</button><button data-add>New record</button></div>
          </div>
          <table>
            <thead><tr>${columns.map((col) => `<th>${col}</th>`).join('')}</tr></thead>
            <tbody data-table>${tableRows(records[title])}</tbody>
          </table>
        </article>
        <article class="panel recommendations module-side">
          <h2>Recommended actions</h2>
          <div><i>1</i><strong>Validate data</strong><p data-summary>Showing ${records[title].length} records for ${title}.</p><small>High Impact</small></div>
          <div><i>2</i><strong>Assign owner</strong><p>Create accountability for pending records.</p><small class="medium">Medium Impact</small></div>
        </article>
      </section>`;
  }

  function tableRows(rows) {
    return rows.map((row) => `<tr>${row.map((cell, index) => {
      const css = cell === 'High' ? 'high' : cell === 'Medium' ? 'med' : 'low';
      return `<td>${index === 3 || index === 4 ? `<mark class="${css}">${cell}</mark>` : cell}</td>`;
    }).join('')}</tr>`).join('');
  }

  function bindActions() {
    const table = document.querySelector('[data-table]');
    const search = document.querySelector('[data-search]');
    const filter = document.querySelector('[data-filter]');
    const period = document.querySelector('[data-period]');

    const applyFilter = () => {
      if (!table) return;
      const term = (search?.value || '').toLowerCase();
      const status = filter?.value || 'All status';
      let visible = 0;

      table.querySelectorAll('tr').forEach((row) => {
        const matchesText = row.textContent.toLowerCase().includes(term);
        const matchesStatus = status === 'All status' || row.textContent.includes(status);
        const show = matchesText && matchesStatus;
        row.style.display = show ? '' : 'none';
        if (show) visible += 1;
      });

      document.querySelector('[data-summary]')?.replaceChildren(document.createTextNode(`Showing ${visible} filtered records.`));
    };

    search?.addEventListener('input', applyFilter);
    filter?.addEventListener('change', applyFilter);
    period?.addEventListener('change', () => {
      document.querySelectorAll('[data-live]').forEach((item) => {
        item.textContent = `Updated for ${period.value}`;
      });
    });

    document.querySelectorAll('[data-export], .export').forEach((button) => {
      button.onclick = () => flash(button, 'CSV ready');
    });

    document.querySelector('[data-reset]')?.addEventListener('click', () => {
      if (search) search.value = '';
      if (filter) filter.value = 'All status';
      applyFilter();
    });

    document.querySelector('[data-add]')?.addEventListener('click', (event) => {
      if (!table) return;
      table.insertAdjacentHTML('afterbegin', `<tr><td>New record</td><td>Workspace</td><td>Pending</td><td><mark class="med">Medium</mark></td><td><mark class="low">Review</mark></td></tr>`);
      flash(event.currentTarget, 'Added');
      applyFilter();
    });

    document.querySelectorAll('.actions button:not([data-export]), .panel button:not([data-add]):not([data-reset])').forEach((button) => {
      button.onclick = () => flash(button, 'Applied');
    });
  }

  function flash(button, text) {
    const original = button.textContent;
    button.textContent = text;
    setTimeout(() => {
      button.textContent = original;
    }, 1200);
  }

  function animateCards() {
    document.querySelectorAll('.panel,.kpis article').forEach((card, index) => {
      card.style.animation = `rise .35s ease ${index * 25}ms both`;
    });
  }

  navLinks.forEach((link, index) => {
    const pageName = navOrder[index] || 'Overview';
    link.href = `#${pageName.toLowerCase()}`;
    link.addEventListener('click', (event) => {
      event.preventDefault();
      navLinks.forEach((item) => item.classList.remove('active'));
      link.classList.add('active');
      renderPage(pageName);
    });
  });

  bindActions();
  animateCards();
});
