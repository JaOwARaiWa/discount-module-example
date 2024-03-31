export enum DiscountType {
    Coupon = 'Coupon',
    OnTop = 'On Top',
    Seasonal = 'Seasonal'
}

export interface Discount {
    campaign: string;
    type: DiscountType;
}

export type DiscountCampaigns = Discount[]

export interface DiscountDetail {
    discountAmount: number;
    totalAmountAfterDiscount: number;
}
