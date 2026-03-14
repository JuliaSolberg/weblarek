import { IApi, IProduct, IProductsResponse, IOrderRequest, IOrderResponse } from "../../types";

export class WebLarekApi {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    getProducts(): Promise<IProduct[]> {
        return this.api.get<IProductsResponse>('/product/').then((response) => response.items);
    }

    postOrder(order: IOrderRequest): Promise<IOrderResponse> {
        return this.api.post('/order/', order);
    }
}