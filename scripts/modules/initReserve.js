import { addPreloader, removePreloader } from './util.js';
import { API_URL } from './const.js';

// * доп. функция: получает массив и disabled все элементы
const addDisabled = (arr) => {
  arr.forEach(elem => elem.disabled = true);
};

// * доп. функция: получает массив иndisabled элементы
const removeDisabled = (arr) => {
  arr.forEach(elem => elem.disabled = false);
};

// отрисовка списка специалистов
const renderSpec = (elem, data) => {
  const labels = data.map(item => {
    const label = document.createElement('label');
    label.classList.add('radio');

    label.innerHTML = `
        <input class="radio-input" type="radio" name="spec" value="${item.id}">
        <span class="radio-label radio__label_spec" style="--bg-image: url(${API_URL}${item.img})">${item.name}</span>
    `;
    return label;
  });
  elem.append(...labels);
};

// отрисовка месяцев работы выбранного специалиста
const renderMonth = (elem, data) => {
  const labels = data.map(month => {
    const label = document.createElement('label');
    label.classList.add('radio');

    label.innerHTML = `
        <input class="radio-input" type="radio" name="month" value="${month}">
        <span class="radio-label">${new Intl.DateTimeFormat('ru-RU', {month: 'long'}).format(new Date(month))}</span>
    `;
    return label;
  });
  elem.append(...labels);
};

// отрисовка дней работы специалиста в выбранном месяце
const renderDay = (elem, data, month) => {
  const labels = data.map(day => {
    const label = document.createElement('label');
    label.classList.add('radio');

    label.innerHTML = `
        <input class="radio-input" type="radio" name="day" value="${day}">
        <span class="radio-label">${new Intl.DateTimeFormat('ru-RU', {
          month: 'long',
          day: 'numeric'
        }).format(new Date(`${month}/${day}`))}</span>
    `;
    return label;
  });
  elem.append(...labels);
};

// отрисовка времени работы специалиста в выбранный день
const renderTime = (elem, data) => {
  const labels = data.map(time => {
    const label = document.createElement('label');
    label.classList.add('radio');

    label.innerHTML = `
        <input class="radio-input" type="radio" name="time" value="${time}">
        <span class="radio-label">${time}</span>
    `;
    return label;
  });
  elem.append(...labels);
};

// получение данных формы в зависимости от клика пользователя

const initReserve = () => {
  const reserveForm = document.querySelector('.reserve__form');
  const {fieldService, fieldSpec, fieldDate, fieldMonth, fieldDay, fieldTime, btnReserve} = reserveForm;

  // disabled инпуты, пока не выбрана конкретная услуга
  addDisabled([fieldSpec, fieldDate, fieldMonth, fieldDay, fieldTime, btnReserve]);

  reserveForm.addEventListener('change', async (e) => {
    const target = e.target;

    if (target.name === 'service') {
      addDisabled([fieldSpec, fieldDate, fieldMonth, fieldDay, fieldTime, btnReserve]);
      fieldSpec.innerHTML = '<legend class="reserve__legend">Специалист</legend>';
      addPreloader(fieldSpec);

      const resp = await fetch(`${API_URL}api?service=${target.value}`);
      const data = await resp.json();

      await renderSpec(fieldSpec, data);
      removePreloader(fieldSpec);
      removeDisabled([fieldSpec]);
    }

    if (target.name === 'spec') {
      addDisabled([fieldDate, fieldMonth, fieldDay, fieldTime, btnReserve]);
      addPreloader(fieldMonth);

      const resp = await fetch(`${API_URL}api?spec=${target.value}`);
      const data = await resp.json();

      fieldMonth.textContent = '';
      await renderMonth(fieldMonth, data);
      removePreloader(fieldMonth);
      removeDisabled([fieldDate, fieldMonth]);
    }

    if (target.name === 'month') {
      addDisabled([fieldDay, fieldTime, btnReserve]);
      addPreloader(fieldDay);

      const resp = await fetch(`${API_URL}api?spec=${reserveForm.spec.value}&month=${target.value}`);
      const data = await resp.json();

      fieldDay.textContent = '';
      await renderDay(fieldDay, data, target.value);
      removePreloader(fieldDay);
      removeDisabled([fieldDay]);
    }

    if (target.name === 'day') {
      addDisabled([fieldTime, btnReserve]);
      addPreloader(fieldTime);

      const resp = await fetch(
        `${API_URL}api?spec=${reserveForm.spec.value}&month=${reserveForm.month.value}&day=${target.value}`
        );
      const data = await resp.json();

      fieldTime.textContent = '';
      await renderTime(fieldTime, data);
      removePreloader(fieldTime);
      removeDisabled([fieldTime]);
    }

    if (target.name === 'time') {
      removeDisabled([btnReserve]);
    }
  });

  reserveForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(reserveForm); // класс-хранилище для данных из формы (warn: у checkbox есть особенности!)
    const json = JSON.stringify(Object.fromEntries(formData));

    const res = await fetch(`${API_URL}api/order`, {
      method: 'POST',
      body: json,
    });

    const answer = await res.json();

    addDisabled([fieldService, fieldSpec, fieldDate, fieldMonth, fieldDay, fieldTime, btnReserve]);

    const message = document.createElement('p');
    message.classList.add('reserve__message');
    message.innerHTML = `
      Ваша запись №${answer.id} успешно зарегистрирована.<br>
      Ждём Вас <b>${new Intl.DateTimeFormat('ru-RU', {month: 'long', day: 'numeric'}).format(new Date(`${answer.month}/${answer.day}`))}</b><br>
      время записи: ${answer.time}`;

    reserveForm.append(message);
    reserveForm.reset();
  });
};

export default initReserve;