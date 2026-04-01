import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasket {
    items: HTMLElement[];
    total: number;
    disabled: boolean;
}

export class Basket extends Component<IBasket> {
    protected listElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;
    protected priceElement: HTMLElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        this.priceElement = ensureElement<HTMLElement>('.basket__price', this.container);

        this.buttonElement.addEventListener('click', () => {
            this.events.emit('basket:submit');
        });
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this.listElement.replaceChildren(...items);
        } else {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = 'Корзина пуста';
            this.listElement.replaceChildren(emptyMessage);
        }
    }

    set total(value: number) {
        this.priceElement.textContent = `${value} синапсов`;
    }

    set disabled(value: boolean) {
        this.buttonElement.disabled = value;
    }
}