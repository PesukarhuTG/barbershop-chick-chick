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
  console.log('стр загрузилась, запуск слайдера...');
  removePreloader(elem);
  console.log('удаление прелоадера...');
};




const initSlider = () => {
  const slider = document.querySelector('.slider');

  addPreloader(slider);
  console.log('загрузка прелоадера...');

  window.addEventListener('load', launchSlider(slider));
};

initSlider();


