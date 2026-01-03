const pesos = document.querySelectorAll('#listaPesos li');
const indicador = document.getElementById('pesoSeleccionado');

pesos.forEach(p => {
  p.addEventListener('click', () => {
    pesos.forEach(x => x.classList.remove('seleccionado'));
    p.classList.add('seleccionado');
    indicador.textContent = p.dataset.peso + ' kg';
  });
});
