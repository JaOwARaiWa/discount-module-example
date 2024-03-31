import { Discount, DiscountType } from '../entities/discount';

export interface SpecialDiscount extends Discount {
    type: DiscountType.Seasonal;
    threshold: number;
    discount: number;
}
