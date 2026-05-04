document.querySelectorAll('.panel,.kpis article').forEach((card, index) => {
  card.style.animation = `rise .35s ease ${index * 25}ms both`;
});
