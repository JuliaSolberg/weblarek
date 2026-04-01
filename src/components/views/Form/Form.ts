import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component"; 
import { IEvents } from "../../base/Events";

export class Form<T> extends Component<T> {
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(protected events: IEvents, container: HTMLFormElement) {
        super(container);

        this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);

        this.container.addEventListener('input', (event: Event) => {
            const target = event.target as HTMLInputElement;
            const field = target.name;
            const value = target.value;

            this.events.emit(`${(this.container as HTMLFormElement).name}.${field}:change`, {
                field,
                value
            });
        });

        this.container.addEventListener('submit', (event: Event) => {
            event.preventDefault();
            this.events.emit(`${(this.container as HTMLFormElement).name}:submit`);
        });
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errors(value: string) {
        this.errorsElement.textContent = value;
    }

    render(data?: Partial<T> | undefined): HTMLElement {
        super.render(data);
        return this.container;
    }
}