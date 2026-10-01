'use strict';

const DEFAULT_RATE = 4.2419;
const eurInput = document.querySelector('#eur-amount');
const sarInput = document.querySelector('#sar-amount');
const rateInput = document.querySelector('#rate-input');
const rateDisplay = document.querySelector('#rate-display');
const rateStatus = document.querySelector('#rate-status');
const updatedAt = document.querySelector('#updated-at');
const toast = document.querySelector('#toast');
let rate = DEFAULT_RATE;
let direction = 'eur-to-sar';
let toastTimer;

function validAmount(value) { return Number.isFinite(value) && value >= 0; }
function formatAmount(value, currency) {
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value) + ' ' + currency;
}
function renderRate() {
  rateDisplay.textContent = direction === 'eur-to-sar'
    ? `1 EUR = ${rate.toFixed(4)} SAR`
    : `1 SAR = ${(1 / rate).toFixed(6)} EUR`;
}
function convertFrom(source) {
  const input = source === 'eur' ? eurInput : sarInput;
  const output = source === 'eur' ? sarInput : eurInput;
  const amount = Number(input.value);
  if (!validAmount(amount)) { output.value = ''; return; }
  output.value = (source === 'eur' ? amount * rate : amount / rate).toFixed(2);
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2300);
}
function setRate(nextRate, label) {
  if (!Number.isFinite(nextRate) || nextRate <= 0) return;
  rate = nextRate;
  rateInput.value = rate.toFixed(4);
  rateStatus.textContent = label;
  renderRate();
  convertFrom(direction === 'eur-to-sar' ? 'eur' : 'sar');
}
eurInput.addEventListener('input', () => convertFrom('eur'));
sarInput.addEventListener('input', () => convertFrom('sar'));
rateInput.addEventListener('input', () => {
  const customRate = Number(rateInput.value);
  if (Number.isFinite(customRate) && customRate > 0) {
    rate = customRate;
    rateStatus.textContent = 'Custom rate';
    renderRate();
    convertFrom(direction === 'eur-to-sar' ? 'eur' : 'sar');
  }
});
document.querySelector('#swap-button').addEventListener('click', () => {
  direction = direction === 'eur-to-sar' ? 'sar-to-eur' : 'eur-to-sar';
  [eurInput.value, sarInput.value] = [sarInput.value, eurInput.value];
  renderRate();
  showToast(direction === 'eur-to-sar' ? 'Conversion direction: EUR to SAR' : 'Conversion direction: SAR to EUR');
});
document.querySelector('#reset-rate').addEventListener('click', () => {
  setRate(DEFAULT_RATE, 'Indicative rate');
  updatedAt.textContent = 'Using indicative rate';
});
document.querySelector('#refresh-rate').addEventListener('click', async (event) => {
  const button = event.currentTarget;
  button.disabled = true;
  button.classList.add('loading');
  rateStatus.textContent = 'Updating…';
  try {
    const response = await fetch('https://api.frankfurter.app/latest?from=EUR&to=SAR', { cache: 'no-store' });
    if (!response.ok) throw new Error('Rate service unavailable');
    const data = await response.json();
    const liveRate = Number(data?.rates?.SAR);
    if (!Number.isFinite(liveRate) || liveRate <= 0) throw new Error('Rate not available');
    setRate(liveRate, 'Latest reference rate');
    const timestamp = data.date ? new Date(`${data.date}T00:00:00`).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }) : 'just now';
    updatedAt.textContent = `Reference data dated ${timestamp}`;
    showToast('Latest reference rate loaded');
  } catch (error) {
    rateStatus.textContent = 'Custom rate';
    updatedAt.textContent = 'Live rate unavailable; showing current rate';
    showToast('Could not fetch a live rate. Your current rate is unchanged.');
  } finally {
    button.disabled = false;
    button.classList.remove('loading');
  }
});
renderRate();
convertFrom('eur');
