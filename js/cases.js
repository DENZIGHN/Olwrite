// Рендер мини-кейсов из data/cases.js.
// Работает и на homepage (#casesPreview, первые 3), и на cases.html (#casesGrid, все).
(function () {
    'use strict';
    if (!window.CASES) return;

    function esc(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function cardHtml(c) {
        return '<article class="case-card">' +
            '<div class="case-tags">' +
                '<span class="case-tag goal">' + esc(c.goal) + '</span>' +
                '<span class="case-tag grade">' + esc(c.grade) + '</span>' +
            '</div>' +
            '<div class="case-flow">' +
                '<div class="case-stage before">' +
                    '<span class="case-stage-label">Было</span>' +
                    '<p>' + esc(c.before) + '</p>' +
                '</div>' +
                '<div class="case-arrow" aria-hidden="true"></div>' +
                '<div class="case-stage after">' +
                    '<span class="case-stage-label">Стало</span>' +
                    '<p>' + esc(c.after) + '</p>' +
                '</div>' +
            '</div>' +
            '<div class="case-footer">' +
                '<div class="case-duration"><span class="case-meta-label">Срок</span>' + esc(c.duration) + '</div>' +
                '<div class="case-methods"><span class="case-meta-label">Методы</span>' +
                    '<div class="case-method-tags">' +
                        c.methods.map(m => '<span>' + esc(m) + '</span>').join('') +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</article>';
    }

    const preview = document.getElementById('casesPreview');
    if (preview) {
        preview.innerHTML = window.CASES.slice(0, 3).map(cardHtml).join('');
    }

    const grid = document.getElementById('casesGrid');
    if (grid) {
        grid.innerHTML = window.CASES.map(cardHtml).join('');
    }
})();
