// Based on Easing Function Generator by Timothée Groleau
// http://www.timotheegroleau.com/Flash/experiments/easing_function_generator.htm

document.addEventListener('DOMContentLoaded', () => {
  const k_float = '<span class="keyword">float</span>';
  const k_number = '<span class="keyword">number</span>';
  const k_return = '<span class="keyword">return</span>';
  const k_function = '<span class="keyword">function</span>';
  const k_fn = '<span class="keyword">fn</span>';
  const k_colon = '<span class="op">:</span>';
  const k_arrow = '<span class="op">-></span>';
  const k_def = '<span class="keyword">def</span>';
  const k_f32 = '<span class="keyword">f32</span>';
  const languageList = [
    {label: 'C', fn: `${k_float} easing(${k_float} {x}) {\n  ${k_return} {expr};\n}`, x: 'x', tips: 'also C++, C# and Java'},
    {label: 'JavaScript', fn: `${k_function} easing({x}) {\n  ${k_return} {expr};\n}`},
    {label: 'TypeScript', fn: `${k_function} easing({x}: ${k_number}): ${k_number} {\n  ${k_return} {expr};\n}`},
    {label: 'PHP', fn: `${k_function} easing(${k_float} {x}): ${k_float} {\n  ${k_return} {expr};\n}`, x: '$x', tips: '7.0 or later'},
    {label: 'Python', fn: `${k_def} easing({x})${k_colon}\n  ${k_return} {expr}`},
    {label: 'PowerShell', fn: `${k_function} easing({x}) {\n  ${k_return} {expr}\n}`, x: '$x'},
    {label: 'CoffeeScript', fn: `easing = ({x}) ${k_arrow}\n  {expr}`},
    {label: 'Rust', fn: `${k_fn} easing({x}: ${k_f32}) ${k_arrow} ${k_f32} {\n  {expr}\n}`, suffix: '.'}
  ];
  const presetList = [
    {label: 'no easing', coefficients: [0, 0, 0, 0, 1]},
    {label: 'in-out cubic', coefficients: [0, 0, -2, 3, 0]},
    {label: 'in-out quintic', coefficients: [6, -15, 10, 0, 0]},
    {label: 'in quintic', coefficients: [1, 0, 0, 0, 0]},
    {label: 'in quartic', coefficients: [0, 1, 0, 0, 0]},
    {label: 'in cubic', coefficients: [0, 0, 1, 0, 0]},
    {label: 'in quadratic', coefficients: [0, 0, 0, 1, 0]},
    {label: 'out quintic', coefficients: [1, -5, 10, -10, 5]},
    {label: 'out quartic', coefficients: [0, -1, 4, -6, 4]},
    {label: 'out cubic', coefficients: [0, 0, 1, -3, 3]},
    {label: 'out-in cubic', coefficients: [0, 0, 4, -6, 3]},
    {label: 'out-in quartic', coefficients: [0, 0, 6, -9, 4]},
    {label: 'back in cubic', coefficients: [0, 0, 4, -3, 0]},
    {label: 'back in quartic', coefficients: [0, 2, 2, -3, 0]},
    {label: 'out back cubic', coefficients: [0, 0, 4, -9, 6]},
    {label: 'out back quartic', coefficients: [0, -2, 10, -15, 8]},
    {label: 'out elastic (small)', coefficients: [33, -106, 126, -67, 15]},
    {label: 'out elastic (big)', coefficients: [56, -175, 200, -100, 20]},
    {label: 'in elastic (small)', coefficients: [33, -59, 32, -5, 0]},
    {label: 'in elastic (big)', coefficients: [56, -105, 60, -10, 0]},
  ];
  const pointers = points => {
    for (let i = 1; i < 5; i++) {
      document.getElementById('cp-' + i).style.left = `${43 + points[i] * 14}%`;
    }
  };
  const code = coefficients => {
    const language = languageList[document.getElementById('language-picker').value] || {};
    const x = '<span class="var">' + (language.x || 'x') + '</span>';
    const fn = (language.fn || '{expr}').replace(/{x}/g, x);
    const suffix = language.suffix || '';
    const tips = language.tips || '';
    document.getElementById('language-tips').textContent = tips;
    let first = true, xs = '', cs = '';
    coefficients.forEach(c => {
      if (first) {
        if (c !== 0) {
          if (c === 1) {
            xs += `${x} `;
          } else if (c === -1) {
            xs += `-${x} `;
          } else {
            xs += `${x} * `;
            cs += `<span class="number">${c}${suffix}</span>`;
          }
          first = false;
        }
      } else {
        if (c !== 0) {
          xs = `${x} * (${xs}`;
          let sign = '+';
          if (c < 0) {
            sign = '-';
            c = -c;
          }
          cs += ` ${sign} <span class="number">${c}${suffix}</span>)`;
        } else {
          xs = `${x} * ${xs}`;
        }
      }
    });
    document.getElementById('code').innerHTML = fn.replace('{expr}', (xs.trim() + ' ' + cs.trim()).trim());
  };
  const plot = coefficients => {
    let d = 'M 16,384';
    for (let x = 0; x < 1; x += .01) {
      x = Math.min(Math.max(x, 0), 1);
      const y = x * (x * (x * (x * (x * coefficients[0] + coefficients[1]) + coefficients[2]) + coefficients[3]) + coefficients[4]);
      const px = x * 224 + 16;
      const py = (1 - y) * 224 + 160;
      d += ` L ${px},${py}`;
    }
    const ex = 224 + 16;
    const ey = (1 - coefficients.reduce((p, e) => p + e)) * 224 + 160;
    d += ` L ${ex},${ey}`;
    const svg = document.querySelector('#plot > .chart > svg');
    const curve = svg.querySelector('.curve');
    curve.setAttribute('d', d);
    const end = svg.querySelector('.end');
    end.setAttribute('cx', ex);
    end.setAttribute('cy', ey);
  };
  const round = x => {
    const c = 10000000000000;
    return Math.round(x * c) / c;
  }
  const reverseUpdate = coefficients => {
    const [a, b, c, d, e] = coefficients;
    const points = [
      0,
      e / 5,
      (d + 4 * e) / 10,
      (c + 6 * e + 3 * d) / 10,
      (b + 4 * e + 3 * d + 2 * c) / 5,
      1,
    ].map(round);
    points.forEach((point, i) => document.getElementById('pl-' + i).value = point);
    pointers(points);
    code(coefficients);
    plot(coefficients);
  };
  const update = points => {
    const e = 5 * (points[1] - points[0]);
    const d = 10 * (points[2] - points[0]) - 4 * e;
    const c = 10 * (points[3] - points[0]) + 30 * (points[1] - points[2]);
    const b = 5 * (points[4] + points[0]) - 20 * (points[3] + points[1]) + 30 * points[2];
    const a = points[5] - points[0] - b - c - d - e;
    const coefficients = [a, b, c, d, e].map(round);
    coefficients.forEach((coefficient, i) => document.getElementById('pc-' + i).value = coefficient);
    pointers(points);
    code(coefficients);
    plot(coefficients);
  };
  const getCoefficients = () => {
    let coefficients = [];
    for (let i = 0; i < 5; i++) {
      coefficients.push(parseFloat(document.getElementById('pc-' + i).value) || 0);
    }
    return coefficients;
  }
  const changeLanguage = () => {
    const coefficients = getCoefficients();
    code(coefficients);
  };
  const changePreset = el => {
    const {coefficients} = presetList[el.value] || {coefficients: [0, 0, 0, 0, 0]};
    for (let i = 0; i < 5; i++) {
      document.getElementById('pc-' + i).value = coefficients[i];
    }
    reverseUpdate(coefficients);
  };
  const fixUpValue = el => {
    if (el.value === '' || !/^\s*[\+\-]?\d*(|\.\d*)\s*$/.test(el.value)) {
      el.value = parseFloat(el.value) || 0;
    }
  };
  const changeCoefficient = el => {
    fixUpValue(el);
    const coefficients = getCoefficients();
    reverseUpdate(coefficients);
  };
  const changePoint = el => {
    let points = [0];
    fixUpValue(el);
    for (let i = 1; i < 5; i++) {
      points.push(parseFloat(document.getElementById('pl-' + i).value) || 0);
    }
    points.push(1);
    update(points);
  };
  const presets = document.getElementById('preset-picker');
  presetList.forEach(({label}, i) => {
    const opt = presets.appendChild(document.createElement('option'));
    opt.value = i;
    opt.textContent = label;
  });
  const languages = document.getElementById('language-picker');
  languageList.forEach(({label}, i) => {
    const opt = languages.appendChild(document.createElement('option'));
    opt.value = i;
    opt.textContent = label;
  });
  changePreset(presets);
  document.addEventListener('input', evt => {
    let el;
    el = evt.target.closest('#language-picker');
    if (el) {
      changeLanguage();
      return;
    }
    el = evt.target.closest('#preset-picker');
    if (el) {
      changePreset(el);
      return;
    }
    el = evt.target.closest('#coefficients input');
    if (el) {
      changeCoefficient(el);
      return;
    }
    el = evt.target.closest('#points input');
    if (el) {
      changePoint(el);
      return;
    }
  });
  const dragPointer = (el, evt) => {
    let dragging = true;
    const parent = el.closest('#pointers');
    const offset = evt.offsetX;
    const updatePointer = () => {
      const rect = parent.getBoundingClientRect();
      const left = el.getBoundingClientRect().left;
      let x = ((left - rect.x) * 100 / rect.width - 43) / 14;
      x = Math.round(x * 100) / 100;
      document.getElementById('pl-' + el.id.substring(3)).value = x;
      changePoint(el);
    };
    const mouseMovePointer = evt => {
      if (dragging) {
        evt.preventDefault();
        const left = evt.clientX - offset - parent.getBoundingClientRect().left;
        el.style.left = `${left}px`;
        updatePointer();
      }
    };
    const mouseUpPointer = () => {
      if (dragging) {
        dragging = false;
        document.removeEventListener('mousemove', mouseMovePointer, false);
        document.removeEventListener('mouseup', mouseUpPointer, false);
        document.body.classList.remove('dragging');
        updatePointer();
      }
    };
    document.body.classList.add('dragging');
    document.addEventListener('mousemove', mouseMovePointer, false);
    document.addEventListener('mouseup', mouseUpPointer, false);
  };
  document.addEventListener('mousedown', evt => {
    const el = evt.target.closest('.pointer');
    if (el) {
      evt.preventDefault();
      dragPointer(el, evt);
    }
  }, false);
  const ball = document.getElementById('ball');
  const moveBall = evt => {
    const offset = {x: evt.offsetX, y: evt.offsetY};
    const click = evt => {
      evt.preventDefault();
      evt.stopPropagation();
      document.removeEventListener('click', click);
      document.body.classList.add('bouncing');
      const coefficients = getCoefficients();
      const {left, top} = ball.getBoundingClientRect();
      const ex = evt.clientX - offset.x;
      const ey = evt.clientY - offset.y;
      const place = (x, y) => {
        ball.style.left = `${x}px`;
        ball.style.top = `${y}px`;
      };
      const duration = Math.max(10, Math.min(10000, parseInt(document.getElementById('duration').value) || 0));
      const start = performance.now();
      const update = now => {
        const t = (now - start) / duration;
        if (t >= 1) {
          place(ex, ey);
          document.body.classList.remove('bouncing');
          return;
        }
        const easing = t * (t * (t * (t * (t * coefficients[0] + coefficients[1]) + coefficients[2]) + coefficients[3]) + coefficients[4]);
        place(left + (ex - left) * easing, top + (ey - top) * easing);
        requestAnimationFrame(update);
      };
      update(start);
    };
    setTimeout(() => document.addEventListener('click', click), 10);
  };
  ball.addEventListener('click', evt => {
    evt.preventDefault();
    moveBall(evt);
  });
  (function(){
    const {width, height} = ball.getBoundingClientRect();
    const {right, bottom} = document.getElementById('motion').getBoundingClientRect();
    ball.style.left = `${right - width}px`;
    ball.style.top = `${bottom - height}px`;
  })();
});
