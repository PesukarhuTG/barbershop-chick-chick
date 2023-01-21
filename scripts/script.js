const API_URL = 'https://tame-adjoining-paprika.glitch.me/api';

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

// отрисовка услуг в форме (вариант через map и отрисовку массива)
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

  fetch(API_URL).then(res => res.json())
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

const init = () => {
  initSlider();
  initService();

};

window.addEventListener('DOMContentLoaded', init);


