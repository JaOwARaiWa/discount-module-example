export enum ItemCategory {
    Clothing = 'Clothing',
    Accessories = 'Accessories',
    Electronics = 'Electronics'
}

export interface Item {
    name: string;
    price: number;
    category: ItemCategory;
}

export type Items = Item[];
