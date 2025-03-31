const fs = require('fs');
const readline = require('readline');

const AIRPORTS_FILE = 'airports.dat'; // Предполагается, что файл находится в той же директории

// --- Разбор аргументов ---
const args = process.argv.slice(2);
if (args.length !== 1) {
    console.error('Использование: node index.js <номер_колонки>');
    process.exit(1);
}

const columnNumber = parseInt(args[0], 10);
if (isNaN(columnNumber) || columnNumber < 1) {
    console.error('Ошибка: Номер колонки должен быть положительным целым числом.');
    process.exit(1);
}
// Индекс колонки внутренне начинается с 0
const columnIndex = columnNumber - 1;

console.log(`Поиск по колонке ${columnNumber}...`);

// --- Структура данных (Заглушка) ---
// TODO: Реализовать Trie или другой подходящий индекс здесь
let airportIndex = null;

// --- Чтение файла и индексация (Заглушка) ---
async function buildIndex() {
    console.log('Построение индекса из', AIRPORTS_FILE);
    const startTime = performance.now();
    // TODO: Реализовать эффективное чтение файла и построение индекса
    //       с использованием потоков и выбранной структуры данных (Trie).
    //       Необходимо соблюдать ограничение по памяти (7 МБ).
    console.log("Построение индекса еще не реализовано.");
    airportIndex = {}; // Заглушка
    const endTime = performance.now();
    console.log(`Индекс построен за ${(endTime - startTime).toFixed(2)} мс.`);
}

// --- Функция поиска (Заглушка) ---
function searchAirports(prefix) {
    // TODO: Реализовать логику поиска с использованием индекса
    console.log(`Поиск по префиксу "${prefix}"...`);
    const startTime = performance.now();

    const results = [];
    // TODO:
    // 1. Использовать airportIndex для поиска смещений строк по префиксу.
    // 2. Прочитать полные строки из AIRPORTS_FILE, используя смещения.
    // 3. Извлечь значение колонки из полных строк.
    // 4. Отсортировать результаты (лексикографически/численно).
    // 5. Форматировать вывод: "<ЗначениеКолонки>[<ПолнаяСтрока>]"

    console.log("Функциональность поиска еще не реализована.");

    const endTime = performance.now();
    console.log(`Найдено ${results.length} результатов за ${(endTime - startTime).toFixed(2)} мс.`);
    results.forEach(result => console.log(result));
}


// --- Основная логика приложения ---
async function run() {
    try {
        // Проверить, существует ли airports.dat
        if (!fs.existsSync(AIRPORTS_FILE)) {
            console.error(`Ошибка: Файл не найден - ${AIRPORTS_FILE}`);
            process.exit(1);
        }

        await buildIndex();

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: 'Введите префикс для поиска (или !quit для выхода): '
        });

        rl.prompt();

        rl.on('line', (line) => {
            const input = line.trim();
            if (input.toLowerCase() === '!quit') {
                console.log('Выход...');
                rl.close();
                process.exit(0);
            }

            if (input) {
                searchAirports(input);
            } else {
                console.log("Пожалуйста, введите поисковый запрос.");
            }
            rl.prompt();
        }).on('close', () => {
            console.log('Ввод закрыт. Выход.');
            process.exit(0);
        });

    } catch (error) {
        console.error('Произошла ошибка:', error);
        process.exit(1);
    }
}

run(); 