import { IBuyer, TBuyerErrors } from "../../types";
import { IEvents } from "../base/Events";

export class BuyerModel {
    private buyer: IBuyer;

    constructor(protected events: IEvents) {
        this.buyer = {
            payment: '',
            email: '',
            phone: '',
            address: ''
        };
    }

    setData(data: Partial<IBuyer>): void {
        this.buyer = {
            ...this.buyer,
            ...data
        };

        this.events.emit('buyer:changed', this.buyer);
    }

    getData(): IBuyer {
        return this.buyer;
    }

    clear(): void {
        this.buyer = {
            payment: '',
            email: '',
            phone: '',
            address: ''
        };

        this.events.emit('buyer:changed', this.buyer);
    }

    validate(): TBuyerErrors {
        const errors: TBuyerErrors = {};

        if (!this.buyer.payment) {
            errors.payment = 'Не выбран вид оплаты';
        }

        if (!this.buyer.email) {
            errors.email = 'Необходимо указать email';
        }

        if (!this.buyer.phone) {
            errors.phone = 'Необходимо указать телефон';
        }

        if (!this.buyer.address) {
            errors.address = 'Необходимо указать адрес доставки';
        }

        return errors;
    }
}