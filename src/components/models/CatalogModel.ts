import { IProduct } from "../../types";

export class CatalogModel {
    private items: IProduct[];
    private selectedItem: IProduct | null;

    constructor() {
        this.items = [];
        this.selectedItem = null;
    }

    setItems(items: IProduct[]): void {
        this.items = items;
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getProductById(id: string): IProduct | undefined {
        return this.items.find((item) => item.id === id);
    }

    setSelected(item: IProduct): void {
        this.selectedItem = item;
    }

    getSelected(): IProduct | null {
        return this.selectedItem;
    }
}