import { IFilter } from './IFilter';

export class QueryStringBuilder {
    private readonly filters: IFilter[];

    constructor(filters: IFilter[]) {
        this.filters = filters || [];
    }

    public build(): string {
        return this.filters.map(f => `${f.field}=${f.value}`).join('&');
    }

}