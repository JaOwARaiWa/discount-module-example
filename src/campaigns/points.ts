import { Discount, DiscountType } from '../entities/discount';

export const maximumDiscountPercentage: number = 0.2

export interface PointsDiscount extends Discount {
    type: DiscountType.OnTop;
    max: boolean;
    points?: number;
}
