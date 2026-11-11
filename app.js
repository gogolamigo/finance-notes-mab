(function () {
  'use strict';
  const lessons = Array.isArray(window.FINANCE_LESSONS) ? [...window.FINANCE_LESSONS].sort((a, b) => a.order - b.order) : [];
  const calculateCompound = window.FINANCE_MATH?.calculateCompound;
  const home = document.getElementById('home-view');
  const lessonView = document.getElementById('lesson-view');
  const grid = document.getElementById('lesson-grid');
  const count = document.getElementById('results-count');
  const search = document.getElementById('search');
  const empty = document.getElementById('empty-state');
  const comingSoon = document.getElementById('coming-soon');
  let category = '全部';

  function el(tag, cls, str) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (str !== undefined && str !== null) node.textContent = String(str);
    return node;
  }
  function add(parent, ...nodes) { nodes.forEach(n => parent.append(n)); return parent; }
  function link(label, href, cls) { const node = el('a', cls, label); node.href = href; return node; }
  function formatMoney(value) {
    return 'NT$' + new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, minimumFractionDigits: Number.isInteger(value) ? 0 : 2 }).format(value);
  }
  function formatSignedMoney(value) {
    const eps = Math.abs(value) < 1e-8 ? 0 : value;
    return (eps > 0 ? '＋' : eps < 0 ? '−' : '') + formatMoney(Math.abs(eps));
  }
  function createSection(parent, index, title, id) {
    const section = el('section', 'lesson-section');
    section.id = id;
    const h = el('h2');
    add(h, el('span', '', String(index).padStart(2, '0')), el('span', '', title));
    section.append(h); parent.append(section); return section;
  }
  function renderCards() {
    const query = search.value.trim().toLocaleLowerCase('zh-Hant');
    const selected = lessons.filter(item => (category === '全部' || item.category === category) &&
      [item.title, item.summary, item.category, item.subtitle].join(' ').toLocaleLowerCase('zh-Hant').includes(query));
    grid.replaceChildren();
    selected.forEach(item => {
      const card = link('', '#lesson/' + item.id, 'lesson-card');
      const head = el('div', 'card-head');
      add(head, el('span', 'card-number', String(item.order).padStart(2, '0')), el('span', 'card-category', item.category));
      const bottom = el('div', 'card-bottom'); add(bottom, el('span', '', '觀念・例子・自我檢核'), el('span', '', '↗'));
      add(card, head, el('h3', '', item.title), el('p', '', item.summary), bottom);
      grid.append(card);
    });
    count.textContent = category === '全部' && !query ? '全部 ' + selected.length + ' 篇筆記' : '符合條件：' + selected.length + ' 篇筆記';
    empty.hidden = selected.length !== 0;
    comingSoon.hidden = category !== '全部' || Boolean(query);
    const heroCount = document.querySelector('.hero-meta strong');
    if (heroCount) heroCount.textContent = String(lessons.length);
  }
  function renderQuiz(target, quiz) {
    const box = el('div', 'quiz-box');
    add(box, el('p', 'quiz-question', quiz.question));
    const fieldset = el('fieldset', 'quiz-choices');
    const options = [];
    quiz.options.forEach((option, i) => {
      const label = el('label', 'quiz-choice');
      const input = document.createElement('input');
      input.type = 'radio'; input.name = 'lesson-quiz'; input.value = String(i);
      label.append(input, document.createTextNode(String.fromCharCode(65+i) + '. ' + option.text));
      fieldset.append(label);
      options.push(input);
    });
    box.append(fieldset);
    const actions = el('div', 'quiz-actions');
    const check = el('button', 'btn primary', '確認答案 ↗'); check.type = 'button';
    const reset = el('button', 'btn secondary', '重新作答'); reset.type = 'button';
    add(actions, check, reset);
    const status = el('p', 'quiz-message', '先選擇一個答案，再查看解析。');
    status.setAttribute('role', 'status');
    const feedback = el('div', 'quiz-feedback'); feedback.hidden = true;
    add(box, actions, status, feedback); target.append(box);
    check.addEventListener('click', () => {
      const index = options.findIndex(n => n.checked);
      if (index < 0) { status.textContent = '請先選擇一個答案。'; return; }
      const isCorrect = index === quiz.answer;
      status.textContent = isCorrect ? '答對了。' : '這題還可以再確認一次。';
      feedback.replaceChildren();
      feedback.append(el('strong', '', '正確答案：' + String.fromCharCode(65+quiz.answer)));
      quiz.options.forEach((o, j) => {
        const item = el('div', 'quiz-explanation'); add(item, el('b', '', String.fromCharCode(65+j) + '. '), document.createTextNode(o.explanation)); feedback.append(item);
      });
      feedback.hidden = false;
      options.forEach(n => n.disabled = true);
      check.disabled = true;
    });
    reset.addEventListener('click', () => {
      options.forEach(n => { n.disabled = false; n.checked = false; });
      check.disabled = false; status.textContent = '先選擇一個答案，再查看解析。'; feedback.hidden = true;
      feedback.replaceChildren();
    });
  }
  function renderCalculator(target) {
    const form = el('form', 'compound-calculator');
    form.noValidate = true;
    add(form, el('h3', '', '試算一下｜單筆複利'), el('p', '', '這是教學試算，不需要登入，也不儲存輸入資料。'));
    const fields = el('div', 'calc-fields');
    const inputs = {};
    for (const [name, title, init] of [['principal','本金（NT$）','10000'], ['rate','年利率（%）','5'], ['years','年數','2']]) {
      const label = el('label', '', title); const input = document.createElement('input');
      input.type = 'number'; input.step = name === 'years' ? '1' : 'any'; input.value = init;
      input.name = name; input.inputMode = 'decimal'; label.append(input); fields.append(label); inputs[name] = input;
    }
    const output = el('div', 'calc-output'); output.setAttribute('role','status'); output.setAttribute('aria-live','polite');
    form.append(fields, output); target.append(form);
    function calculate() {
      const result = calculateCompound(inputs.principal.value, inputs.rate.value, inputs.years.value);
      output.replaceChildren();
      if (!result.ok) { output.className = 'calc-output calc-error'; output.textContent = result.error; return; }
      output.className = 'calc-output';
      add(output, document.createTextNode('期末估算金額：'), el('strong', '', formatMoney(result.finalValue)), el('div', '', '相較本金：' + formatSignedMoney(result.difference)));
    }
    form.addEventListener('submit', e => e.preventDefault());
    Object.values(inputs).forEach(n => n.addEventListener('input', calculate));
    calculate();
  }
  function renderLesson(data) {
    const article = document.getElementById('lesson-article');
    const toc = document.getElementById('lesson-toc');
    article.replaceChildren(); toc.replaceChildren();
    const header = el('header', 'lesson-header');
    const badge = el('div', 'lesson-index');
    add(badge, el('span', '', 'NOTE ' + String(data.order).padStart(2,'0')), el('span', '', data.category));
    add(header, badge, el('h1', '', data.title), el('p', 'lesson-subtitle', data.subtitle));
    const lead = el('div','lead-question'); add(lead, el('small', '', '先想一個問題'), el('p', '', data.question)); header.append(lead); article.append(header);
    const names = [['核心直覺','intuitive'],['公式與符號','formula'],['自編例子','example'],['常見誤解','mistakes'],['自我檢核','quiz'],['參考來源','sources']];
    names.forEach(([name, id], index) => toc.append(link(String(index + 1).padStart(2, '0') + '　' + name, '#section-' + id)));
    const intuitive = createSection(article, 1, names[0][0], 'section-intuitive');
    data.intro.forEach(p => intuitive.append(el('p','',p)));
    const takeaway = el('div','takeaway'); add(takeaway, el('strong', '', '帶走這個觀念：'), document.createTextNode(data.takeaway)); intuitive.append(takeaway);
    const formula = createSection(article, 2, names[1][0], 'section-formula');
    formula.append(el('div','formula-box', data.formula.expression));
    const symbols = el('div','symbol-list');
    data.formula.symbols.forEach(s => { const item=el('div','symbol-item'); add(item,el('b','',s.symbol),el('span','',s.meaning));symbols.append(item); });
    formula.append(symbols);
    const assumptions=el('div','assumptions');assumptions.append(el('strong','','使用前，先確認假設'));
    const ul=el('ul');data.formula.assumptions.forEach(x=>ul.append(el('li','',x)));assumptions.append(ul);formula.append(assumptions);
    const example = createSection(article, 3, names[2][0], 'section-example');
    example.append(el('p','',data.example.intro));
    const scroll=el('div','table-scroll');const table=el('table','lesson-table');const thead=el('thead');const hrow=el('tr');
    data.example.headers.forEach(x=>hrow.append(el('th','',x)));thead.append(hrow);
    const tbody=el('tbody');data.example.rows.forEach(row=>{const tr=el('tr');row.forEach(x=>tr.append(el('td','',x)));tbody.append(tr);});
    add(table,thead,tbody);scroll.append(table);example.append(scroll);
    add(example,el('p','',data.example.conclusion),el('p','example-note',data.example.note));
    if (data.interactive === 'compound') renderCalculator(example);
    const myths = createSection(article, 4, names[3][0], 'section-mistakes');
    data.mistakes.forEach((m,i)=>{const item=el('div','myth');add(item,el('b','',String(i+1)+'. '+m.myth),el('p','',m.fact));myths.append(item);});
    const quiz = createSection(article, 5, names[4][0], 'section-quiz');renderQuiz(quiz,data.quiz);
    const source = createSection(article, 6, names[5][0], 'section-sources');
    const sourceList=el('ul','source-list');data.sources.forEach(s=>{
      const li=el('li');const a=link(s.publisher+' — '+s.title+' ↗',s.url);a.target='_blank';a.rel='noopener noreferrer';
      add(li,a,el('p','',s.supports));sourceList.append(li);
    });source.append(sourceList);
    const nav=el('nav','lesson-next-prev');nav.setAttribute('aria-label','前後篇導覽');
    const pos=lessons.findIndex(x=>x.id===data.id);const prev=lessons[pos-1];const next=lessons[pos+1];
    nav.append(prev ? add(link('', '#lesson/'+prev.id),el('small','','← 上一篇'),el('span','',prev.title)) : el('span'));
    nav.append(next ? add(link('', '#lesson/'+next.id),el('small','','下一篇 →'),el('span','',next.title)) : el('span'));
    article.append(nav);
    document.title = data.title + '｜金融概念小教室';
  }
  function onRoute() {
    const hash = decodeURIComponent(location.hash.slice(1));
    if (hash.startsWith('lesson/')) {
      home.hidden=true;lessonView.hidden=false;
      const item=lessons.find(x=>x.id===hash.slice(7));
      if (item) renderLesson(item);
      else {
        const article=document.getElementById('lesson-article');article.replaceChildren();
        const div=el('div','not-found');add(div,el('h1','','找不到這篇筆記'),el('p','','這個連結可能已失效，請回到概念清單選擇文章。'),link('返回概念筆記 ↗','#notebook','btn primary'));article.append(div);
        document.getElementById('lesson-toc').replaceChildren();document.title='找不到筆記｜金融概念小教室';
      }
      window.scrollTo({top:0,behavior:'instant'});
    } else {
      lessonView.hidden=true;home.hidden=false;document.title='金融概念小教室｜把金融，想明白。';
      const id=hash||'home';
      requestAnimationFrame(()=>{ const target=document.getElementById(id);if(target && id!=='home')target.scrollIntoView({behavior:'instant',block:'start'});else if(id==='home')window.scrollTo({top:0,behavior:'instant'}); });
    }
  }
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    category=button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
    renderCards();
  }));
  search.addEventListener('input',renderCards);
  document.getElementById('reset-filter').addEventListener('click',()=>{
    category='全部';search.value='';document.querySelectorAll('[data-filter]').forEach(b=>{const active=b.dataset.filter==='全部';b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});renderCards();search.focus();
  });
  renderCards();onRoute();window.addEventListener('hashchange',onRoute);
})();
