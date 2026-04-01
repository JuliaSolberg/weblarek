import './scss/styles.scss';
import { ensureElement, cloneTemplate } from './utils/utils';
import { CatalogModel } from './components/models/CatalogModel';
import { BasketModel } from './components/models/BasketModel';
import { BuyerModel } from './components/models/BuyerModel';
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/api/WebLarekApi';
import { API_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { Gallery } from './components/views/Gallery';
import { CatalogCard } from './components/views/Card/CatalogCard';
import { Modal } from './components/views/Modal';
import { PreviewCard } from './components/views/Card/PreviewCard';
import { Header } from './components/views/Header';
import { Basket } from './components/views/Basket';
import { BasketCard } from './components/views/Card/BasketCard';
import { OrderForm } from './components/views/Form/OrderForm';
import { ContactsForm } from './components/views/Form/ContactsForm';
import { Success } from './components/views/Success';
import { IProduct } from './types';

const events = new EventEmitter();

const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

const baseApi = new Api(API_URL);
const webLarek = new WebLarekApi(baseApi);

// Находим контейнер каталога
const galleryContainer = ensureElement<HTMLElement>('.gallery', document.body);
// Находим template карточки каталога
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog', document.body);
// Создаем компонент каталога
const gallery = new Gallery(galleryContainer);

const modalContainer = ensureElement<HTMLElement>('#modal-container', document.body);
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview', document.body);

const headerContainer = ensureElement<HTMLElement>('.header', document.body);
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket', document.body);
const basketCardTemplate = ensureElement<HTMLTemplateElement>('#card-basket', document.body);

const orderTemplate = ensureElement<HTMLTemplateElement>('#order', document.body);
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts', document.body);

const successTemplate = ensureElement<HTMLTemplateElement>('#success', document.body);

const modal = new Modal(events, modalContainer);

const header = new Header(events, headerContainer);
const basket = new Basket(events, cloneTemplate<HTMLElement>(basketTemplate));
header.render({ counter: 0 });
basket.render({
    items: [],
    total: 0,
    disabled: true
});

const orderForm = new OrderForm(events, cloneTemplate<HTMLFormElement>(orderTemplate));
const contactsForm = new ContactsForm(events, cloneTemplate<HTMLFormElement>(contactsTemplate));

const success = new Success(cloneTemplate<HTMLElement>(successTemplate), {
    onClick: () => {
        modal.close();
    }
});

const previewCard = new PreviewCard(cloneTemplate<HTMLElement>(cardPreviewTemplate), {
    onClick: () => {
        events.emit('preview:click');
        }
});

//Обработчик изменения каталога
events.on('catalog:changed', () => {
    const cards = catalogModel.getItems().map((item) => {
        const card= new CatalogCard(cloneTemplate<HTMLElement>(cardCatalogTemplate), {
            onClick: () => {
                events.emit<IProduct>('card:select', item)
            }
        });
        return card.render(item);
    });
    gallery.render({catalog: cards});
});

// выбор карточки товара
events.on<IProduct>('card:select', (item) => {
    catalogModel.setSelected(item);
});

//изменение выбранного товара
events.on('preview:changed', () => {
    const selectedItem = catalogModel.getSelected();
    if (!selectedItem) { return; }
    const isInBasket = basketModel.hasProduct(selectedItem.id);
    const isAvailable = selectedItem.price !== null;
    const buttonText =!isAvailable ? 'Недоступно' : isInBasket ? 'Удалить из корзины' : 'Купить';
    const previewElement = previewCard.render({
        title: selectedItem.title,
        price: selectedItem.price,
        image: selectedItem.image,
        category: selectedItem.category,
        description: selectedItem.description,
        buttonText,
        disabled: !isAvailable
    });
    modal.render({
        content: previewElement
    });
});

//Клик по кнопке в preview
events.on('preview:click', () => {
    const selectedItem = catalogModel.getSelected();
    if (!selectedItem) { return; }
    if (basketModel.hasProduct(selectedItem.id)) {
        basketModel.removeProduct(selectedItem.id);
    } else {
        basketModel.addProduct(selectedItem);
    }
    modal.close();
});

// изменение корзины
events.on('basket:changed', () => {
    const items = basketModel.getItems();
    header.render({
        counter: basketModel.getCount()
    });
    const basketItems = items.map((item, index) => {
        const basketCard = new BasketCard(cloneTemplate<HTMLElement>(basketCardTemplate), {
            onClick: () => {
                events.emit<IProduct>('basket:item-delete', item);
            }
        });
        return basketCard.render({
            title: item.title,
            price: item.price,
            index: index + 1
        });
    });
    basket.render({
        items: basketItems,
        total: basketModel.getTotal(),
        disabled: basketModel.getCount() === 0
    });
});

// удаление товара из корзины
events.on<IProduct>('basket:item-delete', (item) => {
    basketModel.removeProduct(item.id);
});

//открытие корзины
events.on('basket:open', () => {
    modal.render({
        content: basket.render()
    });
});

// переход к первой форме заказа
events.on('basket:submit', () => {
    const orderFormElement = orderForm.render();
    modal.render({
        content: orderFormElement
    });
});

// изменение оплаты
events.on('order.payment:change', (data: { field: string; value: string}) => {
    buyerModel.setData({
        payment: data.value as 'online' | 'cash'
    });
});

// изменение адреса
events.on('order.address:change', (data: { field: string; value: string}) => {
    buyerModel.setData({
        address: data.value
    });
});

// изменение email
events.on('contacts.email:change', (data: { field: string; value: string}) => {
    buyerModel.setData({
        email: data.value
    });
});

// изменение телефона
events.on('contacts.phone:change', (data: { field: string; value: string}) => {
    buyerModel.setData({
        phone: data.value
    });
});

// изменение данных покупателя
events.on('buyer:changed', () => {
    const buyerData = buyerModel.getData();
    const errors = buyerModel.validate();
    const orderErrors = [errors.payment, errors.address].filter(Boolean).join('; ');
    orderForm.render({
        payment: buyerData.payment,
        address: buyerData.address
    });
    orderForm.valid = !errors.payment && !errors.address;
    orderForm.errors = orderErrors;

    const contactsErrors = [errors.email, errors.phone].filter(Boolean).join('; ');
    contactsForm.render({
        email: buyerData.email,
        phone: buyerData.phone
    });
    contactsForm.valid = !errors.email && !errors.phone;
    contactsForm.errors = contactsErrors;
});

// переход ко второй форме
events.on('order:submit', () => {
    const contactsFormElement = contactsForm.render();
    modal.render({
        content: contactsFormElement
    });
});

// отправка заказа
events.on('contacts:submit', () => {
    const buyerData = buyerModel.getData();
    const basketItems = basketModel.getItems();

    const order = {
        payment: buyerData.payment,
        email: buyerData.email,
        phone: buyerData.phone,
        address: buyerData.address,
        total: basketModel.getTotal(),
        items: basketItems.map((item) => item.id)
    };

    webLarek.postOrder(order)
            .then((result) => {
                const successElement = success.render({
                    total: result.total
                });
                basketModel.clear();
                buyerModel.clear();
                modal.render({
                    content: successElement
                });
            })
            .catch((err) => {
                console.error('Ошибка оформления заказа: ', err);
            })
});

// загрузка товаров
webLarek.getProducts()
        .then((products) => {
            catalogModel.setItems(products);
            console.log('Каталог товаров с сервера: ', catalogModel.getItems());
        })
        .catch((err) => {
            console.error('Ошибка получения данных: ', err);
        })