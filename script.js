const historyDisplay = document.getElementById('historyDisplay');
const currentDisplay = document.getElementById('currentDisplay');
const buttons = Array.from(document.querySelectorAll('.btn'));

let current = '';
let history = [];

function formatNumber(numStr) {
  const [intPart, decPart] = numStr.split(',');
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return decPart ? `${formattedInt},${decPart}` : formattedInt;
}

function updateDisplays() {
  currentDisplay.value = formatNumber(current.replace(/\./g, ',')) || '0';

  historyDisplay.innerHTML = history
    .slice(-5)
    .map(h => `${h.expr} = <strong>${h.result}</strong>`)
    .join('<br>');
}

function append(value) {
  // Impede duplicação de operadores
  if (/[+\-*/]$/.test(current) && /[+\-*/]/.test(value)) return;

  // Substitui vírgula por ponto para cálculo
  if (value === ',') {
    if (!current || /[+\-*/]$/.test(current)) {
      current += '0.';
    } else if (!current.includes('.')) {
      current += '.';
    }
  } else {
    current += value;
  }

  updateDisplays();
}

function clearAll() {
  current = '';
  history = [];
  updateDisplays();
}

function deleteLast() {
  current = current.slice(0, -1);
  updateDisplays();
}

function calculate() {
  try {
    const sanitized = current.replace(/\./g, '').replace(/,/g, '.');
    const resultNum = Function(`return (${sanitized})`)();
    if (isNaN(resultNum)) throw new Error();

    const formattedResult = formatNumber(resultNum.toFixed(6).replace('.', ',').replace(/,?0+$/, ''));
    history.push({ expr: formatNumber(current.replace(/\./g, ',')), result: formattedResult });
    current = formattedResult.replace(/\./g, '').replace(/,/g, '.');
  } catch {
    current = 'Erro';
  }

  updateDisplays();
}

buttons.forEach(btn => {
  const action = btn.dataset.action;
  const val = btn.textContent;

  btn.addEventListener('click', () => {
    if (!action) {
      append(val);
    } else {
      switch (action) {
        case 'clear':
          clearAll();
          break;
        case 'delete':
          deleteLast();
          break;
        case 'operator':
          append(val);
          break;
        case 'equals':
          calculate();
          break;
      }
    }
  });
});

updateDisplays();
