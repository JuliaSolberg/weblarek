import { IProduct } from "../../types";

export class BasketModel {
    private items: IProduct[];

    constructor() {
        this.items = [];
    }

    getItems(): IProduct[] {
        return this.items;
    }

    addProduct(item: IProduct): void {
        this.items.push(item);
    }

    removeProduct(id: string): void {
        this.items = this.items.filter((item) => item.id !== id);
    }

    clear(): void {
        this.items = [];
    }

    getTotal(): number {
        return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
    }

    getCount(): number {
        return this.items.length;
    }

    hasProduct(id: string): boolean {
        return this.items.some((item) => item.id === id);
    }
}