/*
  Tema - Página básica, usada como padrão, pronta para adicionar conteúdo 
  Responsivo - Funciona com vários tamanhos diferentes de tela (mobile, desktop, ...)

*/


/*      Coloca o dia de hoje na data de CheckIn da NavBar      */ 
const dateInput = document.getElementById('date');
dateInput.value = formatDate(); // Usa a timezone do visitante

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}
function formatDate(date = new Date()) {
  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
  ].join('-');
}
