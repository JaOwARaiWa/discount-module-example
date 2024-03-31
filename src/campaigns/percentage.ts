import { Discount, DiscountType } from '../entities/discount';

export interface PercentageDiscount extends Discount {
    type: DiscountType.Coupon;
    percentage: number;
}
