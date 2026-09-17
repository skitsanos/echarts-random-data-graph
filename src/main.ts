import { createReadings, summarize } from './data';
import { createChart, setChartOption } from './chart';
import './styles.css';

const chart = createChart(getElement<HTMLDivElement>('chart'));
let days = 90;

function render(): void {
  const readings = createReadings(days);
  const summary = summarize(readings);
  setChartOption(chart, readings);
  getElement('latest-value').textContent = summary.latest.value.toFixed(2);
  getElement('latest-date').textContent = `As of ${new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(summary.latest.date)}`;
  getElement('average-value').textContent = summary.average.toFixed(2);
  getElement('range-value').textContent = `${summary.minimum.toFixed(1)} — ${summary.maximum.toFixed(1)}`;
  getElement('range-detail').textContent = `${(summary.maximum - summary.minimum).toFixed(1)} unit spread`;
  getElement('volatility-value').textContent = summary.volatility.toFixed(2);
  getElement('sample-size').textContent = `${days} points`;
}

document.querySelectorAll<HTMLButtonElement>('[data-days]').forEach((button) => {
  button.addEventListener('click', () => {
    days = Number(button.dataset.days);
    document.querySelectorAll('[data-days]').forEach((item) => item.classList.toggle('is-active', item === button));
    render();
  });
});

getElement<HTMLButtonElement>('refresh-button').addEventListener('click', (event) => {
  const button = event.currentTarget as HTMLButtonElement;
  button.classList.add('is-refreshing');
  window.setTimeout(() => button.classList.remove('is-refreshing'), 650);
  render();
});

window.addEventListener('resize', () => chart.resize());
render();

function getElement<T extends HTMLElement = HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing element #${id}`);
  return element as T;
}
