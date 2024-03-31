import { expect } from 'chai';
import { CustomerCart, getCustomerCart } from '../src/entities/cart';

describe('Discount Module', () => {
    it('Use Only "Fixed Amount"', () => {
		const customerCart1: CustomerCart = getCustomerCart("1")
        console.log(customerCart1)
        expect(customerCart1.discountDetail.totalAmountAfterDiscount).to.deep.equal(550);
    });

    it('use Only "Percentage Discount"', () => {
		const customerCart2: CustomerCart = getCustomerCart("2")
        console.log(customerCart2)
        expect(customerCart2.discountDetail.totalAmountAfterDiscount).to.deep.equal(540);
    });

    it('use Only "Percentage Discount By Item Category"', () => {
		const customerCart3: CustomerCart = getCustomerCart("3")
        console.log(customerCart3)
        expect(customerCart3.discountDetail.totalAmountAfterDiscount).to.deep.equal(2382.5);
    });

    it('use Only "Discount By Points"', () => {
		const customerCart4: CustomerCart = getCustomerCart("4")
        console.log(customerCart4)
        expect(customerCart4.discountDetail.totalAmountAfterDiscount).to.deep.equal(762);
    });

    it('use Only "Discount By Points", but maximum discount', () => {
		const customerCart8: CustomerCart = getCustomerCart("8")
        console.log(customerCart8)
        expect(customerCart8.discountDetail.totalAmountAfterDiscount).to.deep.equal(664);
    });

    it('use Only "Special Campaign"', () => {
		const customerCart5: CustomerCart = getCustomerCart("5")
        console.log(customerCart5)
        expect(customerCart5.discountDetail.totalAmountAfterDiscount).to.deep.equal(750);
    });

    it('Not any discount use.', () => {
		const customerCart7: CustomerCart = getCustomerCart("7")
        console.log(customerCart7)
        expect(customerCart7.discountDetail).to.deep.equal(undefined);
    });

    it('Use 2 discount types: Coupon and On Top.', () => {
		const customerCart9: CustomerCart = getCustomerCart("9")
        console.log(customerCart9)
        expect(customerCart9.discountDetail.totalAmountAfterDiscount).to.deep.equal(497.5);
    });

    it('Use all discount types.', () => {
		const customerCart10: CustomerCart = getCustomerCart("10")
        console.log(customerCart10)
        expect(customerCart10.discountDetail.totalAmountAfterDiscount).to.deep.equal(457.5);
    });

    it('Can not use same discount type in cart.', () => {
        expect(() => getCustomerCart("6")).to.throw('You can use only one campaign per discount type: can not use your "Percentage Discount".');
    });
});
