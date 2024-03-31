import { Discount, DiscountType } from '../entities/discount';

export interface FixedAmountDiscount extends Discount {
    type: DiscountType.Coupon;
    amount: number;
}
