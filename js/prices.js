// Рендер прайс-листа и FAQ из файлов данных /data/prices.js и /data/faq.js
(function () {
    'use strict';

    // ===== Прайс =====
    const pricesGrid = document.getElementById('pricesGrid');
    if (pricesGrid && window.PRICES) {
        document.getElementById('pricesUpdated').textContent =
            'Цены действительны на ' + window.PRICES.updated;
        document.getElementById('pricesDisclaimer').textContent = window.PRICES.disclaimer;

        window.PRICES.packages.forEach(pkg => {
            const card = document.createElement('div');
            card.className = 'price-card' + (pkg.featured ? ' featured' : '');
            card.innerHTML =
                (pkg.featured ? '<span class="price-badge">Популярный выбор</span>' : '') +
                '<h3>' + pkg.name + '</h3>' +
                '<div class="price-amount">' + pkg.price + '</div>' +
                '<div class="price-unit">' + pkg.unit + '</div>' +
                '<ul class="price-features">' +
                    pkg.features.map(f => '<li>' + f + '</li>').join('') +
                '</ul>' +
                '<a href="contacts.html?subject=' + pkg.subject + '" class="btn ' +
                    (pkg.featured ? 'btn-primary' : 'btn-outline') + ' btn-full">Записаться</a>';
            pricesGrid.appendChild(card);
        });
    }

    // ===== FAQ =====
    const faqList = document.getElementById('faqList');
    if (faqList && window.FAQ) {
        window.FAQ.forEach(item => {
            const faqItem = document.createElement('div');
            faqItem.className = 'faq-item';
            faqItem.innerHTML =
                '<button class="faq-question" type="button" aria-expanded="false">' +
                    '<span>' + item.q + '</span>' +
                    '<span class="faq-chevron"></span>' +
                '</button>' +
                '<div class="faq-answer"><p>' + item.a + '</p></div>';

            faqItem.querySelector('.faq-question').addEventListener('click', () => {
                const isOpen = faqItem.classList.toggle('open');
                faqItem.querySelector('.faq-question').setAttribute('aria-expanded', isOpen);
            });

            faqList.appendChild(faqItem);
        });
    }
})();
