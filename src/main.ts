import './scss/styles.scss';
import { CatalogModel } from './components/models/CatalogModel';
import { BasketModel } from './components/models/BasketModel';
import { BuyerModel } from './components/models/BuyerModel';
import { apiProducts } from './utils/data';
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/api/WebLarekApi';
import { API_URL } from './utils/constants';

// Проверка CatalogModel
const catalogModel = new CatalogModel();
catalogModel.setItems(apiProducts.items);
console.log('Массив товаров из каталога: ', catalogModel.getItems());

const firstItem = apiProducts.items[0];
console.log('Первый товар по id: ', catalogModel.getProductById(firstItem.id));

catalogModel.setSelected(firstItem);
console.log('Выбранный товар: ', catalogModel.getSelected());

// Проверка BasketModel
const basketModel = new BasketModel();
console.log('Пустая корзина: ', basketModel.getItems());

basketModel.addProduct(apiProducts.items[0]);
basketModel.addProduct(apiProducts.items[1]);

console.log('Корзина после добавления двух товаров: ', basketModel.getItems());
console.log('Количество товаров в корзине: ', basketModel.getCount());
console.log('Общая стоимость товаров в корзине: ', basketModel.getTotal());
console.log('Есть ли первый товар в корзине: ', basketModel.hasProduct(apiProducts.items[0].id));
console.log('Есть ли третий товар в корзине: ', basketModel.hasProduct(apiProducts.items[2].id));

basketModel.removeProduct(apiProducts.items[0].id);
console.log('Корзина после удаления первого товара: ', basketModel.getItems());

basketModel.clear();
console.log('Корзина после очистки: ', basketModel.getItems());

// Проверка BuyerModel
const buyerModel = new BuyerModel();

console.log('Начальные данные покупателя: ', buyerModel.getData());
console.log('Ошибки валидации пустого покупателя: ', buyerModel.validate());

buyerModel.setData({ address: 'Moscow never sleeps' });
console.log('После добавления адреса покупателя: ', buyerModel.getData());
console.log('Ошибки валидации после добавления адреса покупателя: ', buyerModel.validate());

buyerModel.setData({ email: 'email@email.com', phone: '12345678', payment: 'cash' });
console.log('После добавления всех данных покупателя: ', buyerModel.getData());
console.log('Ошибки валидации правильно заполненного покупателя: ', buyerModel.validate());

buyerModel.clear();
console.log('Данные покупателя после очистки: ', buyerModel.getData());


// получение данных с сервера
const baseApi = new Api(API_URL);
const webLarek = new WebLarekApi(baseApi);

webLarek.getProducts()
        .then((products) => {
            catalogModel.setItems(products);
            console.log('Каталог товаров с сервера: ', catalogModel.getItems());
        })
        .catch((err) => {
            console.error('Ошибка получения данных: ', err);
        })