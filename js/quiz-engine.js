// ===== Универсальный движок тестов =====
// Тест выбирается параметром URL: test.html?quiz=<id> (по умолчанию 'abvg').
// Данные тестов лежат в /data/quiz-<id>.js и регистрируются в window.QUIZZES.
// Новый тест = новый файл данных + строка в KNOWN_QUIZZES, код движка не меняется.

(function () {
    'use strict';

    // Реестр тестов (защита от подключения произвольных скриптов через URL)
    const KNOWN_QUIZZES = {
        'abvg': 'data/quiz-abvg.js'
        // 'vpr-5': 'data/quiz-vpr-5.js',  // Фаза 3 Roadmap
        // 'vpr-6': 'data/quiz-vpr-6.js',
        // 'vpr-7': 'data/quiz-vpr-7.js'
    };

    const letters = ['A', 'B', 'C', 'D'];
    const levelLabels = { easy: 'Простой', medium: 'Средний', hard: 'Сложный' };
    const levelClasses = { easy: '', medium: 'medium', hard: 'hard' };

    // ===== Состояние =====
    let quiz = null;
    let currentQuestion = 0;
    let answers = [];
    let instantMode = false;     // режим «разбор после каждого вопроса»
    let answerLocked = false;    // в instant-режиме ответ после выбора не меняется

    // ===== DOM =====
    const el = (id) => document.getElementById(id);
    const quizStart = el('quizStart');
    const quizBody = el('quizBody');
    const quizResults = el('quizResults');

    if (!quizStart) return; // не страница теста

    // ===== Определение и загрузка теста =====
    const params = new URLSearchParams(window.location.search);
    const quizId = KNOWN_QUIZZES[params.get('quiz')] ? params.get('quiz') : 'abvg';
    const storageKey = 'olwrite_quiz_progress_' + quizId;

    function loadQuizData(id, onReady) {
        if (window.QUIZZES && window.QUIZZES[id]) { onReady(); return; }
        const script = document.createElement('script');
        script.src = KNOWN_QUIZZES[id];
        script.onload = onReady;
        script.onerror = () => {
            quizStart.innerHTML = '<div class="quiz-start-card"><h2>Не удалось загрузить тест</h2>' +
                '<p>Проверьте подключение к интернету и обновите страницу.</p></div>';
        };
        document.head.appendChild(script);
    }

    // ===== localStorage =====
    function saveProgress() {
        try {
            localStorage.setItem(storageKey, JSON.stringify({
                current: currentQuestion,
                answers: answers,
                instantMode: instantMode,
                updated: Date.now()
            }));
        } catch (e) { /* приватный режим — работаем без сохранения */ }
    }

    function loadProgress() {
        try {
            const raw = localStorage.getItem(storageKey);
            if (!raw) return null;
            const data = JSON.parse(raw);
            if (!Array.isArray(data.answers) || data.answers.length !== quiz.questions.length) return null;
            return data;
        } catch (e) { return null; }
    }

    function clearProgress() {
        try { localStorage.removeItem(storageKey); } catch (e) { /* noop */ }
    }

    function saveResultToHistory(score) {
        try {
            const history = JSON.parse(localStorage.getItem('olwrite_results') || '[]');
            history.push({ quiz: quizId, score: score, total: quiz.questions.length, date: Date.now() });
            localStorage.setItem('olwrite_results', JSON.stringify(history.slice(-50)));
        } catch (e) { /* noop */ }
    }

    // ===== Инициализация =====
    loadQuizData(quizId, () => {
        quiz = window.QUIZZES[quizId];
        answers = new Array(quiz.questions.length).fill(-1);

        // Заполнить стартовый экран данными теста
        const titleEl = el('quizTitle');
        const descEl = el('quizDescription');
        if (titleEl) titleEl.textContent = quiz.title;
        if (descEl) descEl.textContent = quiz.description;

        const counts = { easy: 0, medium: 0, hard: 0 };
        quiz.questions.forEach(q => counts[q.level]++);
        if (el('countEasy')) el('countEasy').textContent = counts.easy;
        if (el('countMedium')) el('countMedium').textContent = counts.medium;
        if (el('countHard')) el('countHard').textContent = counts.hard;
        el('totalQ').textContent = quiz.questions.length;

        // Предложить продолжить незаконченный тест
        const saved = loadProgress();
        if (saved && saved.answers.some(a => a !== -1)) {
            el('quizResume').style.display = 'flex';
            el('resumeBtn').addEventListener('click', () => {
                answers = saved.answers;
                currentQuestion = Math.min(saved.current, quiz.questions.length - 1);
                instantMode = !!saved.instantMode;
                startQuiz(true);
            });
        }

        el('quizStartBtn').addEventListener('click', () => {
            instantMode = el('modeInstant').checked;
            clearProgress();
            answers = new Array(quiz.questions.length).fill(-1);
            currentQuestion = 0;
            startQuiz(false);
        });
    });

    function startQuiz(resumed) {
        quizStart.style.display = 'none';
        quizResults.style.display = 'none';
        quizBody.style.display = 'block';
        renderQuestion();
    }

    // ===== Вопрос =====
    function renderQuestion() {
        const q = quiz.questions[currentQuestion];
        const total = quiz.questions.length;
        answerLocked = instantMode && answers[currentQuestion] !== -1;

        el('progressFill').style.width = ((currentQuestion + 1) / total * 100) + '%';
        el('currentQ').textContent = currentQuestion + 1;

        const badge = el('levelBadge');
        badge.textContent = levelLabels[q.level];
        badge.className = 'quiz-level-badge ' + levelClasses[q.level];

        el('questionText').textContent = q.question;

        const optionsBox = el('quizOptions');
        optionsBox.innerHTML = '';
        q.options.forEach((opt, idx) => {
            const optEl = document.createElement('div');
            optEl.className = 'quiz-option';
            optEl.setAttribute('role', 'button');
            optEl.setAttribute('tabindex', '0');
            optEl.innerHTML =
                '<span class="quiz-option-letter">' + letters[idx] + '</span>' +
                '<span class="quiz-option-text">' + opt + '</span>';
            optEl.addEventListener('click', () => selectOption(idx));
            optEl.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectOption(idx); }
            });
            optionsBox.appendChild(optEl);
        });

        // Восстановить выбор (и, в instant-режиме, показанный разбор)
        el('quizExplanation').style.display = 'none';
        if (answers[currentQuestion] !== -1) {
            markSelection(answers[currentQuestion]);
            if (instantMode) revealAnswer(answers[currentQuestion], false);
        }

        // Перезапуск анимации карточки
        const card = el('questionCard');
        card.style.animation = 'none';
        void card.offsetHeight;
        card.style.animation = 'questionIn 0.4s ease-out';

        // Кнопки: в instant-режиме назад нельзя (ответы зафиксированы)
        el('prevBtn').style.visibility = (!instantMode && currentQuestion > 0) ? 'visible' : 'hidden';
        el('nextBtn').textContent = currentQuestion === total - 1 ? 'Завершить' : 'Далее';
        el('nextBtn').disabled = answers[currentQuestion] === -1;
    }

    function markSelection(idx) {
        document.querySelectorAll('.quiz-option').forEach((opt, i) => {
            opt.classList.toggle('selected', i === idx);
        });
    }

    function selectOption(idx) {
        if (answerLocked) return;

        answers[currentQuestion] = idx;
        markSelection(idx);
        el('nextBtn').disabled = false;
        saveProgress();

        if (instantMode) {
            answerLocked = true;
            revealAnswer(idx, true);
        }
    }

    // Мгновенный разбор (режим «после каждого вопроса»)
    function revealAnswer(chosen, animate) {
        const q = quiz.questions[currentQuestion];
        const options = document.querySelectorAll('.quiz-option');

        options.forEach((opt, i) => {
            opt.classList.add('locked');
            if (i === q.correct) opt.classList.add('is-correct');
            else if (i === chosen) opt.classList.add('is-wrong');
        });

        const box = el('quizExplanation');
        const ok = chosen === q.correct;
        box.className = 'quiz-explanation ' + (ok ? 'correct' : 'wrong') + (animate ? ' animate' : '');
        box.innerHTML =
            '<div class="quiz-explanation-verdict">' + (ok ? '✓ Верно!' : '✗ Неверно') + '</div>' +
            '<p>' + q.explanation + '</p>';
        box.style.display = 'block';
    }

    // ===== Навигация =====
    el('nextBtn').addEventListener('click', () => {
        if (currentQuestion < quiz.questions.length - 1) {
            currentQuestion++;
            saveProgress();
            renderQuestion();
        } else {
            showResults();
        }
    });

    el('prevBtn').addEventListener('click', () => {
        if (currentQuestion > 0) {
            currentQuestion--;
            renderQuestion();
        }
    });

    el('retryBtn').addEventListener('click', () => {
        clearProgress();
        answers = new Array(quiz.questions.length).fill(-1);
        currentQuestion = 0;
        quizResults.style.display = 'none';
        quizStart.style.display = 'block';
        el('quizResume').style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== Результаты =====
    function resultMessage(score, total) {
        // Пороги заданы для теста из 20 вопросов; масштабируются пропорционально
        const pct = score / total;
        if (score === total) return {
            title: 'Впечатляет! Но чтобы вырасти, нужно превзойти самого себя!',
            subtitle: 'Блестящий результат! Однако русский язык бесконечно глубок — всегда есть куда расти!'
        };
        if (pct >= 16 / 20) return {
            title: 'Супер, но это не твой предел!',
            subtitle: 'Вы отлично знаете правила! Но совершенству нет предела — давайте покорять новые вершины!'
        };
        if (pct >= 10 / 20) return {
            title: 'Неплохой результат!',
            subtitle: 'У вас есть хорошая база, но некоторые правила стоит повторить. Вместе мы доведём знания до совершенства!'
        };
        return {
            title: 'Хорошо, когда есть что улучшать!',
            subtitle: 'Русский язык полон нюансов, и каждый может стать грамотнее. Давайте поработаем над этим вместе!'
        };
    }

    function showResults() {
        quizBody.style.display = 'none';
        quizResults.style.display = 'block';

        const total = quiz.questions.length;
        let score = 0;
        quiz.questions.forEach((q, i) => { if (answers[i] === q.correct) score++; });

        clearProgress();
        saveResultToHistory(score);

        el('resultTotal').textContent = 'из ' + total;

        // Круговая диаграмма (длина окружности r=88 ≈ 553)
        const circumference = 553;
        const progressCircle = el('progressCircle');
        progressCircle.style.transition = 'none';
        progressCircle.style.strokeDashoffset = circumference;
        void progressCircle.getBoundingClientRect();
        progressCircle.style.transition = 'stroke-dashoffset 1.5s ease-out 0.3s';
        progressCircle.style.strokeDashoffset = circumference - (score / total) * circumference;

        // Анимированный счётчик
        const scoreEl = el('resultScore');
        const duration = 1500;
        const start = performance.now();
        (function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            scoreEl.textContent = Math.round(score * eased);
            if (progress < 1) requestAnimationFrame(tick);
            else scoreEl.textContent = score;
        })(start);

        const msg = resultMessage(score, total);
        el('resultTitle').textContent = msg.title;
        el('resultSubtitle').textContent = msg.subtitle;

        renderReview();
        window.scrollTo({ top: quizResults.offsetTop - 100, behavior: 'smooth' });
    }

    // ===== Разбор ответов =====
    function renderReview() {
        const box = el('quizReview');
        box.innerHTML = '<h3 class="quiz-review-title">Разбор ответов</h3>';

        quiz.questions.forEach((q, i) => {
            const chosen = answers[i];
            const ok = chosen === q.correct;

            const item = document.createElement('div');
            item.className = 'review-item ' + (ok ? 'correct' : 'wrong') + (ok ? '' : ' open');

            let answersHtml =
                '<div class="review-answer wrong-answer' + (ok ? ' hidden' : '') + '">' +
                    'Ваш ответ: ' + (chosen >= 0
                        ? '<strong>' + letters[chosen] + '.</strong> ' + escapeHtml(q.options[chosen])
                        : '<strong>—</strong> (нет ответа)') +
                '</div>' +
                '<div class="review-answer correct-answer">' +
                    (ok ? 'Ваш ответ: ' : 'Правильный ответ: ') +
                    '<strong>' + letters[q.correct] + '.</strong> ' + escapeHtml(q.options[q.correct]) +
                '</div>';

            item.innerHTML =
                '<button class="review-item-head" type="button" aria-expanded="' + (!ok) + '">' +
                    '<span class="review-status">' + (ok ? '✓' : '✗') + '</span>' +
                    '<span class="review-q-num">Вопрос ' + (i + 1) + '</span>' +
                    '<span class="review-q-text">' + escapeHtml(q.question) + '</span>' +
                    '<span class="review-chevron"></span>' +
                '</button>' +
                '<div class="review-item-body">' +
                    answersHtml +
                    '<p class="review-explanation">' + q.explanation + '</p>' +
                '</div>';

            item.querySelector('.review-item-head').addEventListener('click', () => {
                item.classList.toggle('open');
                item.querySelector('.review-item-head')
                    .setAttribute('aria-expanded', item.classList.contains('open'));
            });

            box.appendChild(item);
        });
    }

    function escapeHtml(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
})();
