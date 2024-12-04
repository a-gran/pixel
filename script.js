// Функция для загрузки результата из cookie
function get_result_from_cookie() {
    // Получаем все cookie в виде строки, разделяем их на массив пар "ключ=значение"
    let cookies = document.cookie.split('; ')
    console.log(cookies) // Логируем полученные cookie для проверки
    // Перебираем все cookie
    for (let i = 0; i < cookies.length; i += 1) {
        // Разделяем каждую пару "ключ=значение" на отдельные элементы
        let cookie = cookies[i].split('=')
        console.log(cookie) // Логируем текущую пару для проверки
        // Если текущий cookie имеет ключ 'pixel-result', возвращаем его значение
        if (cookie[0] == 'pixel-result') return cookie[1]
    }
    // Если cookie не найден, возвращаем строку из 450 нулей
    return '0' * 450
}

// Глобальные переменные для хранения состояния
let IS_CLICKED = false // Флаг: нажата ли кнопка мыши
// Текущий цвет кисти из CSS-переменной
let CURRENT_COLOR = getComputedStyle(document.documentElement).getPropertyValue('--current-color')
let CURRENT_COLORCODE = "1" // Код текущего цвета (число как строка)
// Цвет по умолчанию из CSS-переменной
let DEFAULT_COLOR = getComputedStyle(document.documentElement).getPropertyValue('--default-color')
let FILL_MODE = false // Флаг: активен ли режим заливки
// Массив доступных цветов (как строковые значения RGB)
let COLORS = ['rgb(62, 62, 62)', 'rgb(255, 102, 46)', 
              'rgb(26, 218, 84)', 'rgb(83, 15, 255)', 
              'rgb(255, 236, 26)', 'rgb(142, 229, 255)']

// Обработка событий мыши для изменения флага IS_CLICKED
document.addEventListener('mousedown', () => IS_CLICKED = true) // Устанавливаем true при нажатии кнопки мыши
document.addEventListener('mouseup', () => IS_CLICKED = false) // Устанавливаем false при отпускании кнопки мыши

// Создаём игровое поле
let field = document.querySelector('.field') // Получаем элемент поля из DOM
let temp_result = get_result_from_cookie() // Получаем сохранённое состояние из cookie
console.log('temp-result', temp_result) // Логируем состояние для проверки

// Если в cookie есть данные, восстанавливаем их
if (temp_result != '0') {
    for (let i = 0; i < 450; i += 1) {
        let cell = document.createElement('div') // Создаём новый элемент div для клетки
        cell.classList.add('cell') // Добавляем класс cell
        cell.setAttribute('id', `${i}`) // Устанавливаем уникальный ID для клетки
        cell.dataset.color = temp_result[i] // Сохраняем код цвета клетки в data-атрибут
        cell.style.backgroundColor = COLORS[parseInt(temp_result[i])] // Устанавливаем цвет клетки из массива COLORS
        field.appendChild(cell) // Добавляем клетку в поле
    }
} else {
    // Если данных нет, создаём клетки с цветом по умолчанию
    for (let i = 0; i < 450; i += 1) {
        let cell = document.createElement('div') // Создаём новый элемент div
        cell.classList.add('cell') // Добавляем класс cell
        cell.setAttribute('id', `${i}`) // Устанавливаем уникальный ID
        cell.dataset.color = '0' // Устанавливаем код цвета по умолчанию
        cell.style.backgroundColor = COLORS[0] // Цвет по умолчанию — первый цвет из массива
        field.appendChild(cell) // Добавляем клетку в поле
    }
}

// Добавляем обработчики событий для клеток
let cells = document.querySelectorAll('.cell') // Получаем все клетки из DOM
cells.forEach(cell => {
    // При наведении на клетку
    cell.addEventListener('mouseover', () => {
        // Если кнопка мыши зажата, закрашиваем клетку
        if (IS_CLICKED) {
            anime({ // Анимация закрашивания
                targets: cell, // Целевая клетка
                background: CURRENT_COLOR, // Устанавливаем цвет из CURRENT_COLOR
                duration: 200, // Длительность анимации
                easing: 'linear' // Линейное ускорение
            })
            cell.dataset.color = CURRENT_COLORCODE // Сохраняем код цвета клетки
        }
    })
    
    // При нажатии на клетку
    cell.addEventListener('mousedown', () => {
        if (FILL_MODE) {
            // Если активен режим заливки
            let cell_id = parseInt(cell.getAttribute('id')) // Получаем ID клетки
            FILL_MODE = !FILL_MODE // Деактивируем режим заливки
            anime({ // Анимация заливки
                targets: '.cell', // Все клетки
                background: CURRENT_COLOR, // Устанавливаем цвет из CURRENT_COLOR
                easing: 'easeInOutQuad', // Плавное ускорение
                duration: 500, // Длительность анимации
                delay: anime.stagger(50, {grid: [30, 15], from: cell_id}), // Задержка анимации
            })
            cells.forEach(cell => cell.dataset.color = CURRENT_COLORCODE) // Обновляем код цвета для всех клеток
        } else {
            // Если режим заливки не активен, закрашиваем только текущую клетку
            anime({
                targets: cell, // Текущая клетка
                background: CURRENT_COLOR, // Цвет из CURRENT_COLOR
                duration: 500, // Длительность анимации
                easing: 'easeInOutQuad' // Плавное ускорение
            })
            cell.dataset.color = CURRENT_COLORCODE // Обновляем код цвета клетки
        }
    })
})

// Обработчики для выбора цвета
let color_cells = document.querySelectorAll('.color-cell') // Получаем элементы цветовой палитры
color_cells.forEach(color_cell => {
    color_cell.addEventListener('click', () => {
        FILL_MODE = false // Деактивируем режим заливки
        CURRENT_COLOR = getComputedStyle(color_cell).backgroundColor; // Устанавливаем цвет из выбранной ячейки
        CURRENT_COLORCODE = color_cell.dataset.colorcode // Код цвета из data-атрибута
        document.documentElement.style.cssText = `--current-color: ${CURRENT_COLOR}` // Обновляем CSS-переменную
        document.querySelector('.selected').classList.remove('selected') // Убираем выделение с предыдущей ячейки
        color_cell.classList.add('selected') // Добавляем выделение текущей ячейке
    })
})

// Обработчик для ластика
document.querySelector('.eraser').addEventListener('click', () => {
    CURRENT_COLOR = DEFAULT_COLOR // Устанавливаем цвет по умолчанию
    CURRENT_COLORCODE = "0" // Код цвета для ластика    
    document.documentElement.style.cssText = `--current-color: ${CURRENT_COLOR}` // Обновляем CSS-переменную
    document.querySelector('.selected').classList.remove('selected') // Убираем выделение с других инструментов
    this.classList.add('selected') // Выделяем инструмент ластика
})

// Обработчик для инструмента заливки
document.querySelector('.fill-tool').addEventListener('click', () => {
    FILL_MODE = !FILL_MODE // Переключаем режим заливки
    document.querySelector('.selected').classList.remove('selected') // Убираем выделение с других инструментов
    this.classList.add('selected') // Выделяем инструмент заливки
})

// Сохранение состояния поля в cookie каждую минуту
setInterval(() => {
    let result = '' // Строка для хранения результата
    let temp_cells = document.querySelectorAll('.cell') // Получаем все клетки
    temp_cells.forEach(cell => result += `${cell.dataset.color}`) // Добавляем код цвета каждой клетки
    document.cookie = `pixel-result=${result};max-age=100000` // Сохраняем в cookie
    console.log(document.cookie) // Логируем для проверки
}, 60000)

// Обработчик для сохранения поля в изображение
document.querySelector('.save-tool').addEventListener('click', () => {
    domtoimage.toJpeg(field, {quality: 2}) // Генерируем изображение поля
    .then((dataUrl) => {
        let link = document.createElement('a') // Создаём ссылку для скачивания
        link.download = 'pixel.jpg' // Имя файла
        link.href = dataUrl // Устанавливаем URL изображения
        link.click() // Инициируем скачивание
    }).catch((error) => console.error('oops, something went wrong!', error)) // Обрабатываем ошибку
})
