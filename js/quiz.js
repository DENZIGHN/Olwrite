// ===== Quiz Data (from test.txt) =====
const quizQuestions = [
    // Level 1: Simple (1-10)
    {
        level: 'easy',
        question: 'Как правильно написать слово «ч...вство»?',
        options: ['А', 'У', 'Ю', 'Я'],
        correct: 1 // У (index 1)
    },
    {
        level: 'easy',
        question: 'Какая часть речи обозначает предмет и отвечает на вопросы «Кто? Что?»?',
        options: ['Глагол', 'Имя прилагательное', 'Имя существительное', 'Наречие'],
        correct: 2
    },
    {
        level: 'easy',
        question: 'В каком слове на месте пропуска пишется буква «О»?',
        options: ['С...бака', 'К...пуста', 'К...рандаш', 'М...шина'],
        correct: 0
    },
    {
        level: 'easy',
        question: 'Выберите слово, которое является антонимом к слову «горячий»:',
        options: ['Тёплый', 'Быстрый', 'Кипящий', 'Холодный'],
        correct: 3
    },
    {
        level: 'easy',
        question: 'Нужен ли мягкий знак в слове «мыш...»?',
        options: [
            'Да, так как это существительное женского рода 3-го склонения.',
            'Нет, так как это существительное мужского рода.',
            'Да, так как после шипящих всегда пишется «ь».',
            'Нет, это слово исключение.'
        ],
        correct: 0
    },
    {
        level: 'easy',
        question: 'Как правильно образовать множественное число от слова «ребёнок»?',
        options: ['Ребёнки', 'Ребята', 'Дети', 'Детки'],
        correct: 2
    },
    {
        level: 'easy',
        question: 'Какая приставка пишется в слове «...делать»?',
        options: ['з', 'с', 'ц', 'дз'],
        correct: 1
    },
    {
        level: 'easy',
        question: 'Укажите глагол:',
        options: ['Красота', 'Красивый', 'Красить', 'Красно'],
        correct: 2
    },
    {
        level: 'easy',
        question: 'Какое слово является проверочным для слова «в...дяной»?',
        options: ['Водитель', 'Воды', 'Провод', 'Завод'],
        correct: 1
    },
    {
        level: 'easy',
        question: 'В конце повествовательного предложения ставится:',
        options: ['Вопросительный знак', 'Восклицательный знак', 'Запятая', 'Точка'],
        correct: 3
    },
    // Level 2: Medium (11-15)
    {
        level: 'medium',
        question: 'В каком слове ударение падает на первый слог?',
        options: ['Звонит', 'Каталог', 'Торты', 'Договор'],
        correct: 2
    },
    {
        level: 'medium',
        question: 'Выберите правильный вариант употребления глагола:',
        options: ['Одеть пальто', 'Надеть пальто', 'Обуть пальто', 'Задеть пальто'],
        correct: 1
    },
    {
        level: 'medium',
        question: 'В каком слове пишется «НН»?',
        options: ['Деревя...ый', 'Кожа...ый', 'Серебря...ый', 'Лебеди...ый'],
        correct: 0
    },
    {
        level: 'medium',
        question: 'Как пишется слово «(не)годовать»?',
        options: [
            'Раздельно, так как «не» с глаголами пишется раздельно.',
            'Слитно, так как слово не употребляется без «не».',
            'Через дефис.',
            'Зависит от контекста в предложении.'
        ],
        correct: 1
    },
    {
        level: 'medium',
        question: 'Нужны ли запятые в предложении: «Он(1) кажется(2) совсем устал»?',
        options: [
            'Запятые не нужны.',
            'Нужна только запятая 1.',
            'Нужна только запятая 2.',
            'Нужны запятые 1 и 2.'
        ],
        correct: 3
    },
    // Level 3: Hard (16-20)
    {
        level: 'hard',
        question: 'Выберите предложение с грамматической ошибкой (неправильное построение с деепричастным оборотом):',
        options: [
            'Подъезжая к станции, я потерял шляпу.',
            'Открыв окно, он глубоко вздохнул.',
            'Читая книгу, мне стало скучно.',
            'Посмотрев фильм, мы легли спать.'
        ],
        correct: 2
    },
    {
        level: 'hard',
        question: 'Правильная форма родительного падежа: «В магазине нет ни (носки), ни (чулки).»',
        options: ['Носков, чулок', 'Носок, чулков', 'Носок, чулок', 'Носков, чулков'],
        correct: 0
    },
    {
        level: 'hard',
        question: 'В каком случае на месте пропуска пишется буква «Е»?',
        options: [
            'Пр...бывать в город на поезде.',
            'Пр...бывать в хорошем настроении.',
            'Пр...шить пуговицу.',
            'Пр...сесть на скамейку.'
        ],
        correct: 1
    },
    {
        level: 'hard',
        question: 'Выберите правильную форму повелительного наклонения глагола «ехать»:',
        options: ['Едь', 'Ехай', 'Езжай', 'Поезжай'],
        correct: 3
    },
    {
        level: 'hard',
        question: 'В каком из вариантов пишется «НН»?',
        options: [
            'Вяза...ый бабушкой свитер.',
            'Груже...ая баржа.',
            'Задача реше...а верно.',
            'Зва...ый ужин.'
        ],
        correct: 0
    }
];

const letters = ['A', 'B', 'C', 'D'];
const levelLabels = { easy: 'Простой', medium: 'Средний', hard: 'Сложный' };
const levelClasses = { easy: '', medium: 'medium', hard: 'hard' };

// ===== State =====
let currentQuestion = 0;
let answers = new Array(20).fill(-1);

// ===== DOM Elements =====
const quizStart = document.getElementById('quizStart');
const quizBody = document.getElementById('quizBody');
const quizResults = document.getElementById('quizResults');
const quizStartBtn = document.getElementById('quizStartBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const retryBtn = document.getElementById('retryBtn');
const progressFill = document.getElementById('progressFill');
const currentQEl = document.getElementById('currentQ');
const levelBadge = document.getElementById('levelBadge');
const questionText = document.getElementById('questionText');
const quizOptions = document.getElementById('quizOptions');

if (quizStartBtn) {
    // ===== Start Quiz =====
    quizStartBtn.addEventListener('click', () => {
        quizStart.style.display = 'none';
        quizBody.style.display = 'block';
        renderQuestion();
    });

    // ===== Navigation =====
    nextBtn.addEventListener('click', () => {
        if (currentQuestion < 19) {
            currentQuestion++;
            renderQuestion();
        } else {
            showResults();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentQuestion > 0) {
            currentQuestion--;
            renderQuestion();
        }
    });

    retryBtn.addEventListener('click', () => {
        currentQuestion = 0;
        answers = new Array(20).fill(-1);
        quizResults.style.display = 'none';
        quizBody.style.display = 'block';
        renderQuestion();
    });
}

// ===== Render Question =====
function renderQuestion() {
    const q = quizQuestions[currentQuestion];

    // Update progress
    progressFill.style.width = ((currentQuestion + 1) / 20 * 100) + '%';
    currentQEl.textContent = currentQuestion + 1;

    // Update level badge
    levelBadge.textContent = levelLabels[q.level];
    levelBadge.className = 'quiz-level-badge ' + levelClasses[q.level];

    // Update question text
    questionText.textContent = q.question;

    // Update options
    quizOptions.innerHTML = '';
    q.options.forEach((opt, idx) => {
        const optEl = document.createElement('div');
        optEl.className = 'quiz-option' + (answers[currentQuestion] === idx ? ' selected' : '');
        optEl.innerHTML = `
            <span class="quiz-option-letter">${letters[idx]}</span>
            <span class="quiz-option-text">${opt}</span>
        `;
        optEl.addEventListener('click', () => selectOption(idx));
        quizOptions.appendChild(optEl);
    });

    // Re-trigger animation
    const card = document.getElementById('questionCard');
    card.style.animation = 'none';
    card.offsetHeight; // force reflow
    card.style.animation = 'questionIn 0.4s ease-out';

    // Update buttons
    prevBtn.style.visibility = currentQuestion > 0 ? 'visible' : 'hidden';
    nextBtn.textContent = currentQuestion === 19 ? 'Завершить' : 'Далее';
    nextBtn.disabled = answers[currentQuestion] === -1;
}

// ===== Select Option =====
function selectOption(idx) {
    answers[currentQuestion] = idx;

    // Update UI
    document.querySelectorAll('.quiz-option').forEach((opt, i) => {
        opt.classList.toggle('selected', i === idx);
    });

    nextBtn.disabled = false;
}

// ===== Show Results =====
function showResults() {
    quizBody.style.display = 'none';
    quizResults.style.display = 'block';

    // Calculate score
    let score = 0;
    quizQuestions.forEach((q, i) => {
        if (answers[i] === q.correct) score++;
    });

    // Animate score counter
    const resultScoreEl = document.getElementById('resultScore');
    const progressCircle = document.getElementById('progressCircle');
    const resultTitle = document.getElementById('resultTitle');
    const resultSubtitle = document.getElementById('resultSubtitle');

    // Circumference = 2 * PI * r = 2 * 3.14159 * 88 ≈ 553
    const circumference = 553;
    const targetOffset = circumference - (score / 20) * circumference;

    // Animate circle
    progressCircle.style.transition = 'stroke-dashoffset 1.5s ease-out 0.3s';
    progressCircle.style.strokeDashoffset = targetOffset;

    // Animate counter
    let current = 0;
    const duration = 1500;
    const start = performance.now();

    function animateScore(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        current = Math.round(score * eased);
        resultScoreEl.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(animateScore);
        } else {
            resultScoreEl.textContent = score;
        }
    }

    requestAnimationFrame(animateScore);

    // Result messages
    if (score <= 9) {
        resultTitle.textContent = 'Хорошо, когда есть что улучшать!';
        resultSubtitle.textContent = 'Русский язык полон нюансов, и каждый может стать грамотнее. Давайте поработаем над этим вместе!';
    } else if (score <= 15) {
        resultTitle.textContent = 'Неплохой результат!';
        resultSubtitle.textContent = 'У вас есть хорошая база, но некоторые правила стоит повторить. Вместе мы доведём знания до совершенства!';
    } else if (score <= 19) {
        resultTitle.textContent = 'Супер, но это не твой предел!';
        resultSubtitle.textContent = 'Вы отлично знаете правила! Но совершенству нет предела — давайте покорять новые вершины!';
    } else {
        resultTitle.textContent = 'Впечатляет! Но чтобы вырасти, нужно превзойти самого себя!';
        resultSubtitle.textContent = 'Блестящий результат! Однако русский язык бесконечно глубок — всегда есть куда расти!';
    }

    // Scroll to top of results
    window.scrollTo({ top: quizResults.offsetTop - 100, behavior: 'smooth' });
}
