// Каталог тестов + история результатов (из localStorage, см. js/quiz-engine.js)
(function () {
    'use strict';

    function renderIcon(t) {
        if (t.icon === 'letters') {
            return '<div class="test-icon-letters"><span>А</span><span>Б</span><span>В</span><span>Г</span></div>';
        }
        return '<div class="test-icon-grade">' + t.grade + '<small>класс</small></div>';
    }

    function renderCatalog() {
        const grid = document.getElementById('testsGrid');
        if (!grid || !window.TESTS_CATALOG) return;

        grid.innerHTML = window.TESTS_CATALOG.map(t =>
            '<a href="test.html?quiz=' + t.id + '" class="test-card">' +
                '<div class="test-card-icon">' + renderIcon(t) + '</div>' +
                '<div class="test-card-body">' +
                    '<span class="test-card-tag ' + t.tagClass + '">' + t.tag + '</span>' +
                    '<h3>' + t.title + '</h3>' +
                    '<p>' + t.description + '</p>' +
                    '<div class="test-card-meta">' +
                        '<span>' + t.questions + ' вопросов</span>' +
                        '<span>~' + t.minutes + ' мин</span>' +
                    '</div>' +
                '</div>' +
                '<span class="test-card-arrow" aria-hidden="true"></span>' +
            '</a>'
        ).join('');
    }

    function renderHistory() {
        const box = document.getElementById('resultsHistory');
        const section = document.getElementById('resultsHistorySection');
        if (!box) return;

        let history = [];
        try {
            history = JSON.parse(localStorage.getItem('olwrite_results') || '[]');
        } catch (e) { /* приватный режим — истории нет */ }

        if (!history.length) {
            if (section) section.style.display = 'none';
            return;
        }

        if (section) section.style.display = 'block';

        const recent = history.slice(-10).reverse();
        box.innerHTML = recent.map(item => {
            const pct = item.total ? Math.round((item.score / item.total) * 100) : 0;
            const scoreClass = pct >= 80 ? 'good' : pct >= 50 ? 'mid' : 'low';
            const dateStr = new Date(item.date).toLocaleDateString('ru-RU', {
                day: 'numeric', month: 'long', year: 'numeric'
            });
            return '<a href="test.html?quiz=' + (item.quiz || 'abvg') + '" class="history-item">' +
                '<div class="history-item-info">' +
                    '<span class="history-item-title">' + (item.title || item.quiz) + '</span>' +
                    '<span class="history-item-date">' + dateStr + '</span>' +
                '</div>' +
                '<div class="history-item-score ' + scoreClass + '">' + item.score + '/' + item.total + '</div>' +
            '</a>';
        }).join('');
    }

    renderCatalog();
    renderHistory();
})();
