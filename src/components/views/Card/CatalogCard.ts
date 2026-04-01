import { Card, ICard } from "./Card";
import { ensureElement } from "../../../utils/utils";
import { categoryMap, CDN_URL } from "../../../utils/constants";
import { IProduct } from "../../../types";

type CategoryKey = keyof typeof categoryMap;
export type TCatalogCard = ICard & Pick<IProduct, 'image' | 'category'>;
export interface ICardActions {
    onClick?: () => void;
}

export class CatalogCard extends Card<TCatalogCard> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);

        if (actions?.onClick) {
            this.container.addEventListener('click', actions.onClick);
        }
    }

    set category(value: string) {
        this.categoryElement.textContent = value;

        for (const key in categoryMap) {
            this.categoryElement.classList.toggle(
                categoryMap[key as CategoryKey],
                key === value
            );
        }
    }

    set image(value: string) {
        this.setImage(this.imageElement,
            `${CDN_URL}${value}`,
            this.titleElement.textContent || ''
        );
    }
}