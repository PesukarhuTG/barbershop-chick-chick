// ============== SLIDER ============== 

//const btnLeft = document.querySelector('.slider__arrow_left');
//const btnRight = document.querySelector('.slider__arrow_right');

const addPreloader = (elem) => {
  elem.classList.add('preload');
};

const removePreloader = (elem) => {
  elem.classList.remove('preload');
};

const launchSlider = (elem) => {
  removePreloader(elem);
};

const initSlider = () => {
  const slider = document.querySelector('.slider');
  const sliderContainer = document.querySelector('.slider__container');

  sliderContainer.style.display = 'none';

  addPreloader(slider);
  console.log('загрузка прелоадера...');

  window.addEventListener('load', () => {
    launchSlider(slider);
    sliderContainer.style.display = '';
  });
};

window.addEventListener('DOMContentLoaded', initSlider);


