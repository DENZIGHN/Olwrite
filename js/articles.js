// Рендер статей из data/articles.js:
//  - список карточек с фильтром по категориям (articles.html)
//  - полная страница одной статьи (article.html?id=...)
(function () {
    'use strict';

    if (!window.ARTICLES) return;
    const DATA = window.ARTICLES;

    // Набор SVG-иконок (ключ → разметка). Держим отдельно от данных.
    const ICONS = {
        book: '<path d="M8 12H40V36C40 37.1 39.1 38 38 38H10C8.9 38 8 37.1 8 36V12Z" stroke="currentColor" stroke-width="2"/><path d="M8 12L24 6L40 12" stroke="currentColor" stroke-width="2"/><path d="M16 20H32M16 26H28M16 32H24" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
        grid: '<rect x="8" y="8" width="32" height="32" rx="4" stroke="currentColor" stroke-width="2"/><path d="M16 16H32M16 24H32M16 32H24" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
        clock: '<circle cx="24" cy="24" r="16" stroke="currentColor" stroke-width="2"/><path d="M24 16V24L30 28" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
        bulb: '<path d="M12 8H36L40 16H8L12 8Z" stroke="currentColor" stroke-width="2"/><path d="M8 16V38C8 39.1 8.9 40 10 40H38C39.1 40 40 39.1 40 38V16" stroke="currentColor" stroke-width="2"/><path d="M20 24H28" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
        doc: '<path d="M14 8H34C35.1 8 36 8.9 36 10V38C36 39.1 35.1 40 34 40H14C12.9 40 12 39.1 12 38V10C12 8.9 12.9 8 14 8Z" stroke="currentColor" stroke-width="2"/><path d="M18 16H30M18 22H30M18 28H26" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
        hex: '<path d="M24 8L38 16V32L24 40L10 32V16L24 8Z" stroke="currentColor" stroke-width="2"/><path d="M24 8V40" stroke="currentColor" stroke-width="2"/><path d="M10 16L38 32M38 16L10 32" stroke="currentColor" stroke-width="2" opacity="0.3"/>',
        pencil: '<path d="M30 10L38 18L18 38L10 40L12 32L30 10Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M26 14L34 22" stroke="currentColor" stroke-width="2"/>',
        shirt: '<path d="M18 8L24 12L30 8L38 14L34 20L30 18V40H18V18L14 20L10 14L18 8Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
        phone: '<path d="M14 8H34C35.1 8 36 8.9 36 10V38C36 39.1 35.1 40 34 40H14C12.9 40 12 39.1 12 38V10C12 8.9 12.9 8 14 8Z" stroke="currentColor" stroke-width="2"/><circle cx="24" cy="34" r="2" fill="currentColor"/><path d="M20 12H28" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
        globe: '<circle cx="24" cy="24" r="16" stroke="currentColor" stroke-width="2"/><path d="M8 24H40" stroke="currentColor" stroke-width="2"/><path d="M24 8C28.4 8 32 15.2 32 24C32 32.8 28.4 40 24 40C19.6 40 16 32.8 16 24C16 15.2 19.6 8 24 8Z" stroke="currentColor" stroke-width="2"/>',
        award: '<circle cx="24" cy="20" r="12" stroke="currentColor" stroke-width="2"/><path d="M18 30L14 42L24 37L34 42L30 30" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
        columns: '<path d="M12 14H36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M16 14V10M32 14V10M20 14V38M28 14V38M16 38H32" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
    };

    function iconSvg(key) {
        return '<svg viewBox="0 0 48 48" fill="none">' + (ICONS[key] || ICONS.doc) + '</svg>';
    }

    function catById(id) {
        return DATA.categories.find(c => c.id === id) || { tag: '', tagClass: '', short: '' };
    }

    function escapeHtml(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // ================= Список карточек (articles.html) =================
    const grid = document.getElementById('articlesGrid');
    if (grid) {
        renderFilterBar();
    }

    function renderFilterBar() {
        const bar = document.getElementById('filterBar');
        if (!bar) return;

        // Начальная категория: из URL (если валидна) либо «все»
        const urlCat = new URLSearchParams(window.location.search).get('category');
        const validCat = DATA.categories.some(c => c.id === urlCat);
        const initial = validCat ? urlCat : 'all';

        let html = '<button class="filter-btn' + (initial === 'all' ? ' active' : '') +
            '" data-category="all">Все</button>';
        DATA.categories.forEach(c => {
            html += '<button class="filter-btn' + (initial === c.id ? ' active' : '') +
                '" data-category="' + c.id + '">' + c.label + '</button>';
        });
        bar.innerHTML = html;

        bar.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderCards(btn.getAttribute('data-category'));
            });
        });

        // Единственный начальный рендер — уже с учётом категории из URL
        renderCards(initial);
    }

    function renderCards(category) {
        const items = DATA.items.filter(a => category === 'all' || a.category === category);
        const empty = document.getElementById('articlesEmpty');

        grid.innerHTML = items.map(a => {
            const c = catById(a.category);
            const isTemplate = a.type === 'template';
            return '' +
                '<a class="article-card" href="article.html?id=' + a.id + '">' +
                    '<div class="article-card-image">' +
                        '<div class="article-placeholder-icon">' + iconSvg(a.icon) + '</div>' +
                        (isTemplate ? '<span class="article-badge">Шаблон</span>' : '') +
                    '</div>' +
                    '<div class="article-card-body">' +
                        '<span class="article-tag ' + c.tagClass + '">' + c.tag + '</span>' +
                        '<h3>' + escapeHtml(a.title) + '</h3>' +
                        '<p>' + escapeHtml(a.excerpt) + '</p>' +
                        '<div class="article-meta">' +
                            '<span class="article-date">' + a.date + '</span>' +
                            '<span class="article-read">' + a.readTime + '</span>' +
                        '</div>' +
                    '</div>' +
                '</a>';
        }).join('');

        if (empty) empty.style.display = items.length === 0 ? 'block' : 'none';
    }

    // ================= Полная статья (article.html) =================
    const articleRoot = document.getElementById('articleRoot');
    if (articleRoot) {
        const id = new URLSearchParams(window.location.search).get('id');
        const article = DATA.items.find(a => a.id === id);

        if (!article) {
            articleRoot.innerHTML =
                '<div class="container"><div class="article-notfound">' +
                '<h1>Статья не найдена</h1>' +
                '<p>Возможно, ссылка устарела. Вернитесь к списку материалов.</p>' +
                '<a href="articles.html" class="btn btn-primary">Все статьи</a>' +
                '</div></div>';
            return;
        }

        document.title = article.title + ' | Olwrite.ru';
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', article.excerpt);

        articleRoot.innerHTML = renderArticle(article);
        wireDownloadGate(article);
        renderRelated(article);
    }

    function renderArticle(a) {
        const c = catById(a.category);
        let html = '<div class="container article-container">';

        // Хлебные крошки
        html += '<nav class="breadcrumbs">' +
            '<a href="index.html">Главная</a><span>/</span>' +
            '<a href="articles.html">Статьи</a><span>/</span>' +
            '<a href="articles.html?category=' + a.category + '">' + c.short + '</a>' +
        '</nav>';

        // Шапка
        html += '<header class="article-header">' +
            '<span class="article-tag ' + c.tagClass + '">' + c.tag + '</span>' +
            '<h1>' + escapeHtml(a.title) + '</h1>' +
            '<div class="article-header-meta">' +
                '<span>' + a.date + '</span><span>·</span><span>' + a.readTime + '</span>' +
            '</div>' +
        '</header>';

        // Кнопка скачивания (для шаблонов)
        if (a.type === 'template' && a.download) {
            html += renderDownload(a.download);
        }

        // Тело
        html += '<div class="article-body">';
        (a.body || []).forEach(block => { html += renderBlock(block); });
        html += '</div>';

        // CTA
        html += '<div class="article-cta">' +
            '<h3>Хотите разобрать тему на занятии?</h3>' +
            '<p>Запишитесь на бесплатную консультацию — обсудим ваши цели и составим план.</p>' +
            '<a href="contacts.html?subject=consult" class="btn btn-primary">Записаться</a>' +
        '</div>';

        // Блок «Читайте также»
        html += '<div class="article-related" id="articleRelated"></div>';

        html += '</div>';
        return html;
    }

    function renderBlock(b) {
        switch (b.t) {
            case 'p': return '<p>' + b.text + '</p>';
            case 'h2': return '<h2>' + escapeHtml(b.text) + '</h2>';
            case 'h3': return '<h3>' + escapeHtml(b.text) + '</h3>';
            case 'list': return '<ul class="article-list">' + b.items.map(i => '<li>' + i + '</li>').join('') + '</ul>';
            case 'ol': return '<ol class="article-ol">' + b.items.map(i => '<li>' + i + '</li>').join('') + '</ol>';
            case 'quote': return '<blockquote class="article-quote"><p>' + escapeHtml(b.text) + '</p>' +
                (b.author ? '<cite>' + escapeHtml(b.author) + '</cite>' : '') + '</blockquote>';
            case 'callout': return '<div class="article-callout">' + b.text + '</div>';
            case 'mistake': return '<div class="article-mistake">' +
                '<div class="mistake-row wrong"><span class="mistake-mark">✗</span><span>' + escapeHtml(b.wrong) + '</span></div>' +
                '<div class="mistake-row right"><span class="mistake-mark">✓</span><span>' + escapeHtml(b.right) + '</span></div>' +
                '<div class="mistake-rule"><strong>Правило:</strong> ' + escapeHtml(b.rule) + '</div>' +
            '</div>';
            default: return '';
        }
    }

    function renderDownload(d) {
        const request = d.access === 'request';
        return '<div class="article-download ' + (request ? 'request' : 'free') + '" id="articleDownload">' +
            '<div class="download-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M12 3V15M12 15L8 11M12 15L16 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 17V19C4 20.1 4.9 21 6 21H18C19.1 21 20 20.1 20 19V17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></div>' +
            '<div class="download-info"><strong>' + escapeHtml(d.label) + '</strong><span>' + escapeHtml(d.note) + '</span></div>' +
            '<a href="' + d.file + '" class="btn ' + (request ? 'btn-outline' : 'btn-primary') + '" id="downloadBtn"' +
                (request ? '' : ' download') + '>' + (request ? 'Оставить заявку' : 'Скачать') + '</a>' +
        '</div>';
    }

    // Свободные файлы, отмеченные заглушкой '#', пока не подгружены — предупреждаем
    function wireDownloadGate(a) {
        if (!a.download || a.download.access !== 'free' || a.download.file !== '#') return;
        const btn = document.getElementById('downloadBtn');
        if (!btn) return;
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const info = document.querySelector('#articleDownload .download-info span');
            if (info) info.textContent = 'Файл готовится к публикации. Напишите мне — пришлю материал лично.';
        });
    }

    function renderRelated(a) {
        const box = document.getElementById('articleRelated');
        if (!box) return;
        const related = DATA.items.filter(x => x.category === a.category && x.id !== a.id).slice(0, 3);
        if (related.length === 0) return;

        box.innerHTML = '<h3 class="related-title">Читайте также</h3>' +
            '<div class="related-grid">' +
            related.map(r => {
                const c = catById(r.category);
                return '<a class="related-card" href="article.html?id=' + r.id + '">' +
                    '<span class="article-tag ' + c.tagClass + '">' + c.tag + '</span>' +
                    '<h4>' + escapeHtml(r.title) + '</h4>' +
                    '<span class="related-read">' + r.readTime + '</span>' +
                '</a>';
            }).join('') +
            '</div>';
    }
})();
