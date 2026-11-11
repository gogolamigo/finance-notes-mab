(function () {
  'use strict';
  const lessons = [...window.FINANCE_LESSONS].sort((a, b) => a.order - b.order);
  const home = document.getElementById('home-view');
  const lessonView = document.getElementById('lesson-view');
  const grid = document.getElementById('lesson-grid');
  const search = document.getElementById('lesson-search');
  const filters = document.getElementById('category-filters');
  const resultCount = document.getElementById('result-count');
  const emptyState = document.getElementById('empty-state');
  const continuation = document.getElementById('notebook-continuation');
  let currentCategory = '全部';
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money = value => 'NT$' + new Intl.NumberFormat('en-US', {maximumFractionDigits:2}).format(value);
  const pad = value => String(value).padStart(2, '0');
  const validSource = url => { try { const parsed = new URL(url); return parsed.protocol === 'https:' ? parsed.href : '#'; } catch { return '#'; } };
  const sections = [['intuition','核心直覺'],['formula','公式與符號'],['example','自編例子'],['mistakes','常見誤解'],['quiz','自我檢核'],['sources','參考來源']];

  document.querySelectorAll('[data-lesson-count]').forEach(el => {el.textContent = lessons.length;});
  ['全部', ...new Set(lessons.map(lesson => lesson.category))].forEach(category => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'filter'; button.textContent = category;
    button.setAttribute('aria-pressed', String(category === currentCategory));
    button.addEventListener('click', () => {
      currentCategory = category;
      filters.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      renderCards();
    });
    filters.append(button);
  });

  function renderCards() {
    const query = search.value.trim().toLocaleLowerCase();
    const visible = lessons.filter(lesson => (currentCategory === '全部' || lesson.category === currentCategory) &&
      [lesson.title, lesson.subtitle, lesson.summary, lesson.category].join(' ').toLocaleLowerCase().includes(query));
    grid.innerHTML = visible.map(lesson => `<a class="lesson-card" href="#lesson/${escape(lesson.id)}" aria-label="閱讀：${escape(lesson.title)}"><div class="card-top"><span class="card-number">${pad(lesson.order)}</span><span class="category-tag">${escape(lesson.category)}</span></div><h3>${escape(lesson.title)}</h3><p>${escape(lesson.summary)}</p><div class="card-bottom"><span>觀念・例子・自我檢核</span><span class="card-arrow" aria-hidden="true">↗</span></div></a>`).join('');
    resultCount.textContent = query || currentCategory !== '全部' ? `找到 ${visible.length} 篇筆記，共 ${lessons.length} 篇` : `全部 ${lessons.length} 篇筆記`;
    emptyState.hidden = visible.length !== 0;
    continuation.hidden = query !== '' || currentCategory !== '全部';
  }
  search.addEventListener('input', renderCards);
  document.getElementById('reset-search').addEventListener('click', () => {
    search.value = ''; currentCategory = '全部';
    filters.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item.textContent === '全部')));
    renderCards(); search.focus();
  });

  function sectionHeading(index) {
    return `<h2><span class="section-number">${pad(index + 1)}</span>${sections[index][1]}</h2>`;
  }

  function calculatorMarkup() {
    return `<div class="calculator"><h3>換一組數字，試著算算看</h3><p>單筆本金、固定年利率，每年複利一次。</p><div class="calculator-fields"><label>本金（NT$）<input id="calc-principal" type="number" min="0" max="100000000" step="any" value="10000" inputmode="decimal" aria-describedby="calc-error"></label><label>年利率（%）<input id="calc-rate" type="number" min="-50" max="50" step="any" value="5" inputmode="decimal" aria-describedby="calc-error"></label><label>年數<input id="calc-years" type="number" min="0" max="50" step="1" value="2" inputmode="numeric" aria-describedby="calc-error"></label></div><p class="calc-error" id="calc-error" role="status" aria-live="polite" hidden></p><div class="calc-output" id="calc-output" aria-live="polite"><div><span>期末預估金額</span><strong id="calc-future"></strong></div><div><span id="calc-interest-label">累積收益</span><strong id="calc-interest"></strong></div></div><p class="calc-assumption">範圍：本金 0～1 億元；年利率 −50%～50%；年數 0～50 整數。利息留存，無額外投入或提領，忽略稅費；數值是計算假設。</p></div>`;
  }

  function renderLesson(lesson) {
    const index = lessons.indexOf(lesson);
    const previous = lessons[index - 1];
    const next = lessons[index + 1];
    document.title = `${lesson.title}｜金融概念小教室`;
    lessonView.innerHTML = `<div class="shell article-shell"><a class="back-link" href="#library">← 返回概念筆記</a><div class="article-layout"><aside class="article-sidebar" aria-label="本篇章節"><p class="eyebrow">IN THIS NOTE</p><nav class="toc">${sections.map(([id,label],i) => `<button type="button" data-scroll="section-${id}">${pad(i+1)} &nbsp; ${label}</button>`).join('')}</nav><p class="sidebar-note">讀懂一個觀念，<br>也練習說清楚為什麼。</p></aside><article class="article"><header><div class="article-kicker"><span>NOTE ${pad(lesson.order)}</span><span class="category-tag">${escape(lesson.category)}</span></div><h1 tabindex="-1" id="lesson-heading">${escape(lesson.title)}</h1><p class="article-subtitle">${escape(lesson.subtitle)}</p></header><div class="question-box"><small>先想一個問題</small><p>${escape(lesson.question)}</p></div>
      <section class="article-section" id="section-intuition">${sectionHeading(0)}${lesson.intro.map(p=>`<p>${escape(p)}</p>`).join('')}<div class="takeaway"><strong>帶走這個觀念：</strong>${escape(lesson.takeaway)}</div></section>
      <section class="article-section" id="section-formula">${sectionHeading(1)}<div class="formula-box"><p class="formula">${escape(lesson.formula.expression)}</p><dl class="symbol-list">${lesson.formula.symbols.map(s=>`<div><dt>${escape(s.symbol)}</dt><dd>${escape(s.meaning)}</dd></div>`).join('')}</dl></div><div class="assumptions"><h3>使用前，先確認假設</h3><ul>${lesson.formula.assumptions.map(a=>`<li>${escape(a)}</li>`).join('')}</ul></div></section>
      <section class="article-section" id="section-example">${sectionHeading(2)}<p>${escape(lesson.example.intro)}</p><div class="table-wrap" tabindex="0" role="region" aria-label="${escape(lesson.title)}自編例子表格"><table><thead><tr>${lesson.example.headers.map(h=>`<th scope="col">${escape(h)}</th>`).join('')}</tr></thead><tbody>${lesson.example.rows.map(row=>`<tr>${row.map(cell=>`<td>${escape(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="example-conclusion">${escape(lesson.example.conclusion)}</p><p class="example-note">${escape(lesson.example.note)}</p>${lesson.interactive === 'compound' ? calculatorMarkup() : ''}</section>
      <section class="article-section" id="section-mistakes">${sectionHeading(3)}<div class="mistake-list">${lesson.mistakes.map((m,i)=>`<div class="mistake"><h3><span>${i+1}.</span>${escape(m.myth)}</h3><p>${escape(m.fact)}</p></div>`).join('')}</div></section>
      <section class="article-section" id="section-quiz">${sectionHeading(4)}<form class="quiz-panel" id="quiz-form"><fieldset><legend>${escape(lesson.quiz.question)}</legend><div class="quiz-options">${lesson.quiz.options.map((option,i)=>`<label class="quiz-option"><input type="radio" name="quiz-answer" value="${i}"><span class="option-letter">${'ABCD'[i]}.</span><span>${escape(option.text)}</span></label>`).join('')}</div></fieldset><div class="quiz-controls"><button class="button primary" type="submit" id="quiz-submit" disabled>確認答案 <span aria-hidden="true">↗</span></button><button class="button secondary" type="button" id="quiz-reset" hidden>重新作答</button><span class="quiz-hint" id="quiz-hint">先選擇一個答案，再查看解析。</span></div><p class="quiz-status" id="quiz-status" role="status" aria-live="polite" hidden></p><div class="answer-details" id="answer-details" hidden></div></form></section>
      <section class="article-section" id="section-sources">${sectionHeading(5)}<ul class="source-list">${lesson.sources.map(source=>`<li><a href="${escape(validSource(source.url))}" target="_blank" rel="noopener noreferrer">${escape(source.publisher)} — ${escape(source.title)} ↗</a><small>${escape(source.supports)}</small></li>`).join('')}</ul></section>
      <nav class="article-pagination" aria-label="其他筆記">${previous ? `<a href="#lesson/${escape(previous.id)}"><small>← 上一篇</small><strong>${escape(previous.title)}</strong></a>` : '<a href="#library"><small>← 概念清單</small><strong>查看全部筆記</strong></a>'}${next ? `<a href="#lesson/${escape(next.id)}"><small>下一篇 →</small><strong>${escape(next.title)}</strong></a>` : '<a href="#library"><small>回到概念清單 ↗</small><strong>查看全部筆記</strong></a>'}</nav></article></div></div>`;
    lessonView.querySelectorAll('[data-scroll]').forEach(button => button.addEventListener('click', () => {
      const target = document.getElementById(button.dataset.scroll); target.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',block:'start'});
    }));
    wireQuiz(lesson.quiz);
    if (lesson.interactive === 'compound') wireCalculator();
  }

  function wireQuiz(quiz) {
    const form = document.getElementById('quiz-form');
    const submit = document.getElementById('quiz-submit');
    const reset = document.getElementById('quiz-reset');
    const status = document.getElementById('quiz-status');
    const details = document.getElementById('answer-details');
    const hint = document.getElementById('quiz-hint');
    let answered = false;
    form.addEventListener('change', () => { if (!answered) submit.disabled = !form.querySelector('input:checked'); });
    form.addEventListener('submit', event => {
      event.preventDefault();
      const selected = form.querySelector('input:checked');
      if (!selected || answered) return;
      answered = true;
      const correct = Number(selected.value) === quiz.answer;
      status.className = `quiz-status ${correct ? 'correct' : 'incorrect'}`;
      status.textContent = correct ? `答對了！正確答案是 ${'ABCD'[quiz.answer]}。` : `再想一下：正確答案是 ${'ABCD'[quiz.answer]}。你選了 ${'ABCD'[Number(selected.value)]}。`;
      details.innerHTML = quiz.options.map((option,i)=>`<div class="answer-detail ${i===quiz.answer ? 'correct' : ''}"><strong>${'ABCD'[i]}${i===quiz.answer ? '・正確' : ''}</strong>${escape(option.explanation)}</div>`).join('');
      status.hidden = false; details.hidden = false; reset.hidden = false; hint.hidden = true;
      submit.disabled = true; form.querySelectorAll('input').forEach(input=>{input.disabled=true;});
    });
    reset.addEventListener('click', () => {
      form.reset(); answered = false; submit.disabled = true;
      form.querySelectorAll('input').forEach(input=>{input.disabled=false;});
      status.hidden = true; details.hidden = true; details.textContent = ''; reset.hidden = true; hint.hidden = false;
      form.querySelector('input').focus();
    });
  }

  function wireCalculator() {
    const fields = [document.getElementById('calc-principal'),document.getElementById('calc-rate'),document.getElementById('calc-years')];
    const error = document.getElementById('calc-error');
    const output = document.getElementById('calc-output');
    const update = () => {
      fields.forEach(field=>field.setAttribute('aria-invalid','false'));
      try {
        if (fields.some(field=>field.value.trim()==='')) throw new Error('請完整填寫本金、年利率與年數。');
        const [principal,ratePercent,years] = fields.map(field=>Number(field.value));
        const result = window.FinanceMath.compound({principal,ratePercent,years});
        document.getElementById('calc-future').textContent = money(result.futureValue);
        document.getElementById('calc-interest').textContent = money(Math.abs(result.interest));
        document.getElementById('calc-interest-label').textContent = result.interest < 0 ? '累積損失' : '累積收益';
        output.classList.toggle('loss',result.interest < 0);
        output.hidden = false; error.hidden = true; error.textContent = '';
      } catch (problem) {
        output.hidden = true; error.hidden = false; error.textContent = problem.message;
        fields.forEach(field=> { if (field.value.trim()==='' || !field.validity.valid) field.setAttribute('aria-invalid','true'); });
      }
    };
    fields.forEach(field=>field.addEventListener('input',update)); update();
  }

  function route() {
    const hash = window.location.hash;
    if (hash.startsWith('#lesson/')) {
      const id = hash.slice('#lesson/'.length);
      const lesson = lessons.find(item=>item.id===id);
      home.hidden = true; lessonView.hidden = false;
      if (lesson) renderLesson(lesson);
      else {
        document.title = '找不到這篇筆記｜金融概念小教室';
        lessonView.innerHTML = '<div class="shell not-found"><p class="eyebrow">NOTE NOT FOUND</p><h1>找不到這篇筆記</h1><p>這個連結可能已變更，可以從概念清單重新開始。</p><a class="button primary" href="#library">返回概念筆記 ↗</a></div>';
      }
      window.scrollTo({top:0,behavior:'instant'});
      if (lesson) document.getElementById('lesson-heading').focus({preventScroll:true});
    } else {
      home.hidden = false; lessonView.hidden = true;
      document.title = '金融概念小教室｜把金融，想明白。';
      requestAnimationFrame(() => {
        const target = ['#library','#method','#about','#main'].includes(hash) ? document.querySelector(hash) : null;
        if (target) target.scrollIntoView({block:'start',behavior:'instant'});
        else window.scrollTo({top:0,behavior:'instant'});
      });
    }
  }
  renderCards(); route();
  window.addEventListener('hashchange',route);
}());
