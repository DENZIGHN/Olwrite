// Каталог тестов. Правится без знания HTML — новая запись здесь + новый файл
// в /data (см. js/quiz-engine.js KNOWN_QUIZZES) = новый тест на сайте.
window.TESTS_CATALOG = [
    {
        id: 'abvg',
        icon: 'letters',
        tag: 'Общий тест',
        tagClass: 'tag-general',
        title: 'АБВГ: тест по русскому языку',
        description: 'Орфография, морфология, синтаксис и пунктуация — от простых вопросов до сложных. Хорошая точка старта для любого класса.',
        questions: 20,
        minutes: '10–15'
    },
    {
        id: 'vpr-5',
        icon: 'grade',
        grade: 5,
        tag: 'ВПР · 5 класс',
        tagClass: 'tag-vpr',
        title: 'Готов ли ты к ВПР? 5 класс',
        description: 'Фонетика, части речи, безударные гласные, лексика и работа с текстом — по программе 5 класса.',
        questions: 16,
        minutes: '8–12'
    },
    {
        id: 'vpr-6',
        icon: 'grade',
        grade: 6,
        tag: 'ВПР · 6 класс',
        tagClass: 'tag-vpr',
        title: 'Готов ли ты к ВПР? 6 класс',
        description: 'Числительное, местоимение, словообразование, фразеологизмы и осложнённое предложение — по программе 6 класса.',
        questions: 16,
        minutes: '8–12'
    },
    {
        id: 'vpr-7',
        icon: 'grade',
        grade: 7,
        tag: 'ВПР · 7 класс',
        tagClass: 'tag-vpr',
        title: 'Готов ли ты к ВПР? 7 класс',
        description: 'Причастия и деепричастия, наречия, служебные части речи и сложная пунктуация — по программе 7 класса.',
        questions: 16,
        minutes: '8–12'
    }
];
