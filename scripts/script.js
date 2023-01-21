const API_URL = 'https://tame-adjoining-paprika.glitch.me/';

// ============== SLIDER ============== 
const addPreloader = (elem) => {
  elem.classList.add('preload');
};

const removePreloader = (elem) => {
  elem.classList.remove('preload');
};

const launchSlider = () => {
  const sliderItems = document.querySelectorAll('.slider__item');
  const sliderList = document.querySelector('.slider__list');
  const btnPrev = document.querySelector('.slider__arrow_left');
  const btnNext = document.querySelector('.slider__arrow_right');

  let activeSlide = 1;
  let position = 0;

  const checkSlide = () => {
    const screenWidth = document.documentElement.offsetWidth > 560;

    if ((activeSlide + 2 === sliderItems.length && screenWidth) || activeSlide === sliderItems.length) {
      btnNext.style.display = 'none';
    } else {
      btnNext.style.display = '';
    }

    if (activeSlide === 1) {
      btnPrev.style.display = 'none';
    } else {
      btnPrev.style.display = '';
    }
  };

  checkSlide();

  const nextSlide = () => {
    sliderItems[activeSlide]?.classList.remove('slider__item_active');
    position = -sliderItems[0].clientWidth * activeSlide;

    sliderList.style.transform = `translateX(${position}px)`;
    activeSlide += 1;
    sliderItems[activeSlide]?.classList.add('slider__item_active');

    checkSlide();
  };

  const prevSlide = () => {
    sliderItems[activeSlide]?.classList.remove('slider__item_active');
    position = -sliderItems[0].clientWidth * (activeSlide - 2);

    sliderList.style.transform = `translateX(${position}px)`;
    activeSlide -=1;
    sliderItems[activeSlide]?.classList.add('slider__item_active');

    checkSlide();
  };

  btnPrev.addEventListener('click', prevSlide);
  btnNext.addEventListener('click', nextSlide);

  window.addEventListener('resize', () => {

    const screenWidth = document.documentElement.offsetWidth > 560;

    /* защита на случай, если в мобильном долистали до конца,
    затем ресайз на увеличение - чтобы развернутый слайдер отобразился адекватно */
    if (activeSlide + 2 > sliderItems.length && screenWidth) {
      activeSlide = sliderItems.length - 2;
      sliderItems[activeSlide]?.classList.add('slider__item_active');
    }

    position = -sliderItems[0].clientWidth * (activeSlide - 1);
    sliderList.style.transform = `translateX(${position}px)`;
    checkSlide();
  });
};

const initSlider = () => {
  const slider = document.querySelector('.slider');
  const sliderContainer = document.querySelector('.slider__container');

  sliderContainer.style.display = 'none';

  addPreloader(slider);

  window.addEventListener('load', () => {
    sliderContainer.style.display = '';
    removePreloader(slider);
    launchSlider();
  });
};

// отрисовка услуг со стоимостью (вариант через forEach)
const renderPrice = (elem, data) => {
  data.forEach(item => {
    const priceItem = document.createElement('li');
    priceItem.classList.add('price__item');
    
    priceItem.innerHTML = `
        <span class="price__item-title">${item.name}</span>
        <span class="price__item-sum">${item.price} руб</span>
    `;

    elem.append(priceItem);
  });
};

// отрисовка услуг в форме (вариант через map и возвращение массива)
const renderService = (elem, data) => {
  const labels = data.map(item => {
    const label = document.createElement('label');
    label.classList.add('radio');

    label.innerHTML = `
        <input class="radio-input" type="radio" name="service" value="${item.id}">
        <span class="radio-label">${item.name}</span>
    `;

    return label;
  });

  elem.append(...labels);
};

// получение списка услуг с сервера
const initService = () => {
  const priceList = document.querySelector('.price__list');
  const reserveFieldsetService = document.querySelector('.reserve__fieldset_service');
  
  priceList.textContent = '';
  addPreloader(priceList);

  reserveFieldsetService.innerHTML = '<legend class="reserve__legend">Услуга</legend>';
  addPreloader(reserveFieldsetService);

  fetch(`${API_URL}api`).then(res => res.json())
                .then(data => {
                  renderPrice(priceList, data);
                  removePreloader(priceList);
                  return data;
                })
                .then(data => {
                  renderService(reserveFieldsetService, data);
                  removePreloader(reserveFieldsetService);
                })
                .catch(err => err);
};

// * доп. функция: получает массив и disabled все элементы
const addDisabled = (arr) => {
  arr.forEach(elem => elem.disabled = true);
};

// * доп. функция: получает массив и ndisabled элементы
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
  const {fieldSpec, fieldDate, fieldMonth, fieldDay, fieldTime, btnReserve} = reserveForm;

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
};

const init = () => {
  initSlider();
  initService();
  initReserve();
};

window.addEventListener('DOMContentLoaded', init);


