import { Discount, DiscountType } from '../entities/discount';
import { ItemCategory } from '../entities/item';

export interface PercentageByCategoryDiscount extends Discount {
    type: DiscountType.OnTop;
    percentage: number;
    category: ItemCategory;
}
