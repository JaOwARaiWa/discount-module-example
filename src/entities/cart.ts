import * as fs from 'fs';
import * as path from 'path';
import { DiscountCampaigns, DiscountDetail, DiscountType } from "./discount";
import { Item, Items } from "./item";
import { FixedAmountDiscount } from '../campaigns/fixedAmount';
import { PercentageDiscount } from '../campaigns/percentage';
import { PercentageByCategoryDiscount } from '../campaigns/percentageByCategory';
import { PointsDiscount, maximumDiscountPercentage } from '../campaigns/points';
import { SpecialDiscount } from '../campaigns/special';

export interface CustomerCart {
    items: Items;
    totalAmount: number;
    discount: boolean;
    discountCampaigns?: DiscountCampaigns;
    discountDetail?: DiscountDetail;
};

export function getCustomerCart(userCartNumber: string): CustomerCart {
    const jsonFilePath = path.join(__dirname, '..', '..', 'carts', 'cart'+userCartNumber+'.json');
    const jsonData = fs.readFileSync(jsonFilePath, 'utf-8');
    const cartData = JSON.parse(jsonData);
    const itemsInCart: Items = cartData['items'].map((item: any) => ({
        name: item.name,
        price: item.price,
        category: item.category,
    }));

    const totalCartAmount: number = itemsInCart.reduce((sum, current) => sum + current.price, 0);

    const customerCart: CustomerCart = {
        items: itemsInCart,
        totalAmount: totalCartAmount,
        discount: cartData['discount'],
        discountCampaigns: undefined,
        discountDetail: undefined
    }

    if (cartData['discount'] === true) {
        customerCart.discountCampaigns = getDiscountCampaigns(cartData['discountCampaigns']);
        customerCart.discountDetail = calculateTotalDiscount(customerCart);
    }

    return customerCart
}

export function getDiscountCampaigns(campaigns: any[]): DiscountCampaigns {
    let discountCampaigns: DiscountCampaigns = [];

    campaigns.forEach(item => {
        switch (item.type) {
            case 'Coupon':
                switch (item.campaign) {
                    case 'Fixed Amount':
                        const fixedAmountDiscount: FixedAmountDiscount = {
                            campaign: item.campaign,
                            type: DiscountType.Coupon,
                            amount: item.amount
                        };
                        discountCampaigns.push(fixedAmountDiscount);
                        break;
                        
                    case 'Percentage Discount':
                        const percentageDiscount: PercentageDiscount = {
                            campaign: item.campaign,
                            type: DiscountType.Coupon,
                            percentage: item.percentage
                        };
                        discountCampaigns.push(percentageDiscount);
                        break;

                    default:
                        throw new Error(`Unknown discount campaign: ${item.campaign}`);
                }
                break;

            case 'On Top':
                switch (item.campaign) {
                    case 'Percentage Discount By Item Category':
                        const percentageByCategoryDiscount: PercentageByCategoryDiscount = {
                            campaign: item.campaign,
                            type: DiscountType.OnTop,
                            percentage: item.percentage,
                            category: item.category
                        };
                        discountCampaigns.push(percentageByCategoryDiscount);
                        break;

                    case 'Discount By Points':
                        const pointsDiscount: PointsDiscount = {
                            campaign: item.campaign,
                            type: DiscountType.OnTop,
                            max: item.max,
                            points: undefined
                        };

                        if (item['max'] === false) {
                            pointsDiscount.points = item.points
                        }

                        discountCampaigns.push(pointsDiscount);
                        break;
                    default:
                        throw new Error(`Unknown discount campaign: ${item.campaign}`);
                }
                break;
            
            case 'Seasonal':
                const specialDiscount: SpecialDiscount = {
                    campaign: item.campaign,
                    type: DiscountType.Seasonal,
                    threshold: item.threshold,
                    discount: item.discount,
                };
                discountCampaigns.push(specialDiscount);
                break;

            default:
                throw new Error(`Unknown discount type: ${item.type}`);
        }
    });

    return discountCampaigns;
}

export function calculateTotalDiscount(customerCartDetail: CustomerCart): DiscountDetail {
	let discountAmount: number = 0;
    let totalAmountAfterDiscount: number = customerCartDetail.totalAmount;

    let customerDiscountCampaigns: DiscountCampaigns = customerCartDetail.discountCampaigns.sort((previous, current) => {
        const typeOrder = { "Coupon": 1, "On Top": 2, "Seasonal": 3 };
        return typeOrder[previous.type] - typeOrder[current.type];
    });

    let coupon: number = 1
    let onTop: number = 1
    let seasonal: number = 1

    customerDiscountCampaigns.forEach(campaign => {
        switch (campaign.type) {
            case 'Coupon':
                if (coupon == 1) {
                    coupon = 0

                    switch (campaign.campaign) {
                        case 'Fixed Amount':
                            let fixedAmountCampaign = campaign as FixedAmountDiscount
                            totalAmountAfterDiscount -= fixedAmountCampaign.amount
                            break;
                            
                        case 'Percentage Discount':
                            let percentageDiscountCampaign = campaign as PercentageDiscount
                            totalAmountAfterDiscount -= (customerCartDetail.totalAmount * (percentageDiscountCampaign.percentage/100))
                            break;

                        default:
                            throw new Error(`Unknown discount campaign: ${campaign.campaign}`);
                    }
                    break;

                } else {
                    throw new Error(`You can use only one campaign per discount type: can not use your "${campaign.campaign}".`);
                }

            case 'On Top':
                if (onTop == 1) {
                    onTop = 0

                    switch (campaign.campaign) {
                        case 'Percentage Discount By Item Category':
                            let percentageDiscountByCategoryCampaign = campaign as PercentageByCategoryDiscount
                            let matchCategoryTotalPrice: number = customerCartDetail.items.reduce((sum, current) => {
                                if (current.category === percentageDiscountByCategoryCampaign.category) {
                                    return sum + current.price;
                                } else {
                                    return sum;
                                }
                            }, 0);

                            totalAmountAfterDiscount -= (matchCategoryTotalPrice * (percentageDiscountByCategoryCampaign.percentage/100))
                            break;
                            
                        case 'Discount By Points':
                            let pointsCampaign = campaign as PointsDiscount
                            let discountPerPoint: number = 0
                            let maximumDiscount: number = customerCartDetail.totalAmount * maximumDiscountPercentage

                            if (pointsCampaign.max === true) {
                                discountPerPoint = maximumDiscount
                        
                            } else {
                                discountPerPoint = pointsCampaign.points;

                                if (discountPerPoint > maximumDiscount) {
                                    discountPerPoint = maximumDiscount
                                }
                            }

                            totalAmountAfterDiscount -= discountPerPoint
                            break;

                        default:
                            throw new Error(`Unknown discount campaign: ${campaign.campaign}`);
                    }
                    break;

                } else {
                    throw new Error(`You can use only one campaign per discount type: can not use your "${campaign.campaign}".`);
                }
            
            case 'Seasonal':
                if (seasonal == 1) {
                    seasonal = 0

                    let specialDiscountCampaign = campaign as SpecialDiscount
                    const totalCampaignDiscount: number = Math.floor(totalAmountAfterDiscount / specialDiscountCampaign.threshold);
                    totalAmountAfterDiscount -= (totalCampaignDiscount * specialDiscountCampaign.discount)
                    break;

                } else {
                    throw new Error(`You can use only one campaign per discount type: can not use your "${campaign.campaign}".`);
                }

            default:
                throw new Error(`Unknown discount campaign: ${campaign.campaign}`);
            }
        })

    return { discountAmount: customerCartDetail.totalAmount - totalAmountAfterDiscount, totalAmountAfterDiscount: totalAmountAfterDiscount}
}
