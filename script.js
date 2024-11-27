// Подгрузка из cookie
function get_result_from_cookie() {
    let cookies = document.cookie.split('; ')
    console.log(cookies)
    for (let i = 0; i < cookies.length; i += 1) {
        let cookie = cookies[i].split('=')
        console.log(cookie)
        if (cookie[0] == 'pixel-result') {
            return cookie[1]
        }
    }
    return '0' * 450
}

// Флаги и дефолтные значения
var IS_CLICKED = false
var CURRENT_COLOR = getComputedStyle(document.documentElement).getPropertyValue('--current-color');
var CURRENT_COLORCODE = "1"
var DEFAULT_COLOR = getComputedStyle(document.documentElement).getPropertyValue('--default-color');
var FILL_MODE = false
var COLORS = ['rgb(62, 62, 62)', 'rgb(255, 102, 46)', 'rgb(26, 218, 84)', 'rgb(83, 15, 255)', 'rgb(255, 236, 26)', 'rgb(142, 229, 255)']

// Изменение флага "кнопка мыши опущена"
document.addEventListener('mousedown', function() {
    IS_CLICKED = true;
})

document.addEventListener('mouseup', function() {
    IS_CLICKED = false;
})

// Заполняем поле таким количеством клеток, сколько предусмотрено в grid-е
let field = document.querySelector('.field')
let temp_result = get_result_from_cookie()
console.log('temp-result', temp_result)

if (temp_result != '0') {
    for (let i = 0; i < 450; i+=1) {
        let cell = document.createElement('div')
        cell.classList.add('cell')
        // ID пригодится в качестве параметра точки отсчёта радиальной анимации заливки
        cell.setAttribute('id', `${i}`)
        cell.dataset.color = temp_result[i]
        cell.style.backgroundColor = COLORS[parseInt(temp_result[i])]
        field.appendChild(cell)
    }
} else {
    for (let i = 0; i < 450; i+=1) {
        let cell = document.createElement('div')
        cell.classList.add('cell')
        // ID пригодится в качестве параметра точки отсчёта радиальной анимации заливки
        cell.setAttribute('id', `${i}`)
        cell.dataset.color = '0'
        cell.style.backgroundColor = COLORS[0]
        field.appendChild(cell)
    }
}

// Каждой ячейке в рабочей области добавляем обработчики событий
// let cells = document.querySelectorAll('.cell')
// cells.forEach(cell => {
//     cell.addEventListener('mouseover', function() {
//         // Клетка будет закрашиваться при наведении на неё курсора мыши, если до этого кнопка мыши была зажата
//         if (IS_CLICKED) {
//             anime({
//                 targets: cell,
//                 background: CURRENT_COLOR,
//                 duration: 200,
//                 easing: 'linear'
//             })
//             cell.dataset.color = CURRENT_COLORCODE
//         }
//     })
    
//     cell.addEventListener('mousedown', function() {
//         // Если до этого была нажата кнопка "заливка", то значение флага меняется и условный оператор заходит в ветку с кодом заливки.
//         if (FILL_MODE) {
//             let cell_id = parseInt(cell.getAttribute('id'))
//             FILL_MODE = !FILL_MODE
//             anime({
//                 targets: '.cell',
//                 background: CURRENT_COLOR,
//                 easing: 'easeInOutQuad',
//                 duration: 500,
//                 delay: anime.stagger(50, {grid: [30, 15], from: cell_id}),
//             })
//             for (let i = 0; i < cells.length; i += 1) {
//                 cells[i].dataset.color = CURRENT_COLORCODE
//             }
//         } else {
//             // Если находимся не в режиме заливки, клетка просто закрасится
//             anime({
//                 targets: cell,
//                 background: CURRENT_COLOR,
//                 duration: 500,
//                 easing: 'easeInOutQuad'
//             })
//             cell.dataset.color = CURRENT_COLORCODE
//         }
//     })
// })

// // Выбор цвета
// let color_cells = document.querySelectorAll('.color-cell')
// color_cells.forEach(color_cell => {
//     color_cell.addEventListener('click', function() {
//         // Если вдруг был включен режим заливки, из него нужно выйти, если пользователь выбрал цвет.
//         FILL_MODE = false
//         // Значение цвета получаем непосредственно из значения свойства background у ячейки с цветом в палитре
//         // И сохраняем в глобальную переменную, чтобы в любой момент можно было получить текущий цвет для других задач.
//         CURRENT_COLOR = getComputedStyle(color_cell).backgroundColor;
//         CURRENT_COLORCODE = color_cell.dataset.colorcode

//         // Это интересный способ настроить передачу значения из JS в CSS. Теперь при наведении мыши на ячейку,
//         // любая ячейка будет получать значение CSS-переменной с цветом как значение свойства background
//         document.documentElement.style.cssText = `--current-color: ${CURRENT_COLOR}`
//         document.querySelector('.selected').classList.remove('selected')
//         color_cell.classList.add('selected')
//     })
// })

// // Отдельный обработчик для ластика и заливки, потому что это не color-cell, а tool-cell.
// document.querySelector('.eraser').addEventListener('click', function() {
//     // В CSS-переменной сохранён код цвета по умолчанию, чтобы избежать дублирования значений в CSS и в JS.
//     // В самом начале он подтягивается в DEFAULT_COLOR
//     CURRENT_COLOR = DEFAULT_COLOR
//     CURRENT_COLORCODE = "0"
//     // По сути, стёрка - то же самое, что и рисование, просто цвет совпадает с цветом фона
//     document.documentElement.style.cssText = `--current-color: ${CURRENT_COLOR}`

//     document.querySelector('.selected').classList.remove('selected')
//     this.classList.add('selected')
// })

// // Обработчик инструмента заливки.
// document.querySelector('.fill-tool').addEventListener('click', function() {
//     FILL_MODE = !FILL_MODE
//     document.querySelector('.selected').classList.remove('selected')
//     this.classList.add('selected')
// })

// // Сохранение в cookie каждую минуту
// setInterval(function() {
//     result = ''
//     let temp_cells = document.querySelectorAll('.cell')
//     for (let i = 0; i < temp_cells.length; i += 1) {
//         result += `${temp_cells[i].dataset.color}`
//     }
    
//     document.cookie = `pixel-result=${result};max-age=100000`
//     console.log(document.cookie)
    
// }, 60000)


// // Сохранение результата на компьютер в виде картинки с помощью dom-to-image
// document.querySelector('.save-tool').addEventListener('click', function() {
//     domtoimage.toJpeg(field, {quality: 2})
//     .then(function (dataUrl) {
//         var img = new Image();
//         img.src = dataUrl;
//         let link = document.createElement('a');
//         link.download = 'pixel.jpg';
//         link.href = dataUrl;
//         link.click();
//     })
//     .catch(function (error) {
//         console.error('oops, something went wrong!', error);
//     });
// })


