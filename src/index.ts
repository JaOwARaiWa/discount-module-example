import { log } from "console"
import { CustomerCart, getCustomerCart } from "./entities/cart"

function main() {
    console.log(getCustomerCart("1"));
    console.log(getCustomerCart("2"));
    console.log(getCustomerCart("3"));
    console.log(getCustomerCart("4"));
    console.log(getCustomerCart("5"));
    // console.log(getCustomerCart("6")); Throw error for using more than 1 campaign in discount type [No error handler at this moment.]
    console.log(getCustomerCart("7"));
    console.log(getCustomerCart("8"));
    console.log(getCustomerCart("9"));
    console.log(getCustomerCart("10"));
}

main()