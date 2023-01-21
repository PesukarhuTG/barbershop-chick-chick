import { addPreloader, removePreloader } from './util.js';
import { API_URL } from './const.js';

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

export default initService;