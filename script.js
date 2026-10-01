const RATE = 4.15;
const eurInput = document.querySelector('#eur');
const sarInput = document.querySelector('#sar');
const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

function normalizeInput(value) {
  let normalized = '';

  for (const character of value) {
    const arabicIndex = arabicDigits.indexOf(character);
    const persianIndex = persianDigits.indexOf(character);

    if (arabicIndex !== -1) normalized += String(arabicIndex);
    else if (persianIndex !== -1) normalized += String(persianIndex);
    else if (character === '٫' || character === '،' || character === ',') normalized += '.';
    else if (character !== '٬') normalized += character;
  }

  normalized = normalized.replace(/[^0-9.]/g, '');
  const firstDot = normalized.indexOf('.');

  return firstDot === -1
    ? normalized
    : normalized.slice(0, firstDot + 1) + normalized.slice(firstDot + 1).replace(/\./g, '');
}

function format(value) {
  if (!Number.isFinite(value)) return '';
  return value.toFixed(4).replace(/0+$/, '').replace(/\.$/, '');
}

function convert(source, target, multiplier) {
  const original = source.value;
  const normalized = normalizeInput(original);

  if (original !== normalized) {
    const caret = source.selectionStart;
    source.value = normalized;
    if (caret !== null) {
      const newCaret = normalizeInput(original.slice(0, caret)).length;
      source.setSelectionRange(newCaret, newCaret);
    }
  }

  if (normalized === '') {
    target.value = '';
    return;
  }

  const value = Number.parseFloat(normalized);
  target.value = Number.isNaN(value) ? '' : format(value * multiplier);
}

function handleInput(event) {
  const source = event.currentTarget;
  const target = source === eurInput ? sarInput : eurInput;
  const multiplier = source === eurInput ? RATE : 1 / RATE;
  convert(source, target, multiplier);
}

function bindInput(input) {
  input.addEventListener('input', handleInput);
  input.addEventListener('keyup', handleInput);
  input.addEventListener('change', handleInput);
  input.addEventListener('paste', () => setTimeout(() => handleInput({ currentTarget: input }), 0));
}

bindInput(eurInput);
bindInput(sarInput);
