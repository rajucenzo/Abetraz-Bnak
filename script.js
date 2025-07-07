let accountBalance = parseFloat(localStorage.getItem('accountBalance')) || 10000;
document.getElementById('accountBalance').textContent = accountBalance.toFixed(2);

const investmentInput = document.getElementById('investmentAmount');
const directionSelect = document.getElementById('tradeDirection');
const timeSelect = document.getElementById('tradeTime');
const chartTypeSelect = document.getElementById('chartTypeSelect');
const tradeHistory = document.getElementById('tradeHistory');
const liveGraph = document.getElementById('liveGraph');

let chart;

function generateLineData() {
  let data = [];
  let value = 100;
  for (let i = 0; i < 100; i++) {
    value += (Math.random() - 0.5) * 5;
    data.push(value);
  }
  return data;
}

function generateCandlestickData() {
  let candles = [];
  let open = 100;
  for (let i = 0; i < 50; i++) {
    let high = open + Math.random() * 5;
    let low = open - Math.random() * 5;
    let close = low + Math.random() * (high - low);
    candles.push({ x: i, o: open, h: high, l: low, c: close });
    open = close;
  }
  return candles;
}

function initChart(type = 'line') {
  if (chart) chart.destroy();

  const ctx = liveGraph.getContext('2d');
  if (type === 'line') {
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({ length: 100 }, (_, i) => i),
        datasets: [{
          label: 'Live Price',
          data: generateLineData(),
          borderColor: '#00ff00',
          backgroundColor: 'transparent',
          tension: 0.3,
          pointRadius: 0,
          borderWidth: 2
        }]
      },
      options: { responsive: true, animation: false, plugins: { legend: { display: false } } }
    });
  } else {
    chart = new Chart(ctx, {
      type: 'candlestick',
      data: {
        datasets: [{
          label: 'Candlestick Data',
          data: generateCandlestickData(),
          borderColor: '#00ff00',
          color: { up: '#00ff00', down: '#ff0000', unchanged: '#999' }
        }]
      },
      options: { responsive: true, animation: false, plugins: { legend: { display: false } } }
    });
  }
}

function updateLineGraph() {
  const dataset = chart.data.datasets[0];
  const newValue = dataset.data[dataset.data.length - 1] + (Math.random() - 0.5) * 5;
  dataset.data.push(newValue);
  if (dataset.data.length > 100) dataset.data.shift();
  chart.update();
}

function updateCandlestickGraph() {
  const dataset = chart.data.datasets[0];
  const last = dataset.data[dataset.data.length - 1];
  const open = last.c;
  const high = open + Math.random() * 5;
  const low = open - Math.random() * 5;
  const close = low + Math.random() * (high - low);
  dataset.data.push({ x: dataset.data.length, o: open, h: high, l: low, c: close });
  if (dataset.data.length > 50) dataset.data.shift();
  chart.update();
}

function startChartUpdater() {
  setInterval(() => {
    const type = chart.config.type;
    if (type === 'line') updateLineGraph();
    else updateCandlestickGraph();
  }, 1000);
}

document.getElementById('tradeForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const investment = parseFloat(investmentInput.value);
  if (isNaN(investment) || investment <= 0 || investment > accountBalance) return alert('Invalid amount');
  const direction = directionSelect.value;
  const time = parseInt(timeSelect.value);

  accountBalance -= investment;
  localStorage.setItem('accountBalance', accountBalance.toFixed(2));
  document.getElementById('accountBalance').textContent = accountBalance.toFixed(2);

  const tradeItem = document.createElement('li');
  tradeItem.textContent = `${new Date().toLocaleTimeString()} - ${direction.toUpperCase()} $${investment}`;
  tradeHistory.prepend(tradeItem);

  // Simulate result later
  setTimeout(() => {
    const win = Math.random() > 0.5;
    const profit = win ? investment * 1.8 : 0;
    accountBalance += profit;
    localStorage.setItem('accountBalance', accountBalance.toFixed(2));
    document.getElementById('accountBalance').textContent = accountBalance.toFixed(2);

    const result = document.createElement('li');
    result.textContent = `${new Date().toLocaleTimeString()} - Result: ${win ? 'WIN +' + profit.toFixed(2) : 'LOSS'}`;
    tradeHistory.prepend(result);
  }, time * 1000);
});

chartTypeSelect.addEventListener('change', () => initChart(chartTypeSelect.value));

window.onload = () => {
  initChart('line');
  startChartUpdater();
};
