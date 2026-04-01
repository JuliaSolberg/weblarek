import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class CatalogModel {
    private items: IProduct[];
    private selectedItem: IProduct | null;

    constructor(protected events: IEvents) {
        this.items = [];
        this.selectedItem = null;
    }

    setItems(items: IProduct[]): void {
        this.items = items;
        this.events.emit('catalog:changed');
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getProductById(id: string): IProduct | undefined {
        return this.items.find((item) => item.id === id);
    }

    setSelected(item: IProduct): void {
        this.selectedItem = item;
        this.events.emit('preview:changed', item);
    }

    getSelected(): IProduct | null {
        return this.selectedItem;
    }
}