"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepositeController = void 0;
const rxjs_1 = require("rxjs");
const user_1 = __importDefault(require("../db/user"));
const product_1 = __importDefault(require("../db/product"));
const rxjs_2 = require("rxjs");
class DepositeController {
    static addCoinsToAccount(id, coins) {
        return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => user_1.default.findByIdAndUpdate(id, { $inc: { deposit: coins } }, { new: true })));
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------------- 
    static purchaseProduct(productId, amount, buyerId) {
        return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => {
            return (0, rxjs_1.forkJoin)([
                this.findProduct(productId),
                this.findUser(buyerId)
            ]);
        }), (0, rxjs_1.mergeMap)((m) => {
            if (m[0].cost * amount > m[1].deposit) {
                return (0, rxjs_2.throwError)(() => 1);
            }
            if (m[0].amountAvailable < amount) {
                return (0, rxjs_2.throwError)(() => 2);
            }
            else {
                return (0, rxjs_1.of)(m);
            }
        }), (0, rxjs_1.mergeMap)((m) => {
            let cost = m[0].cost * amount;
            return (0, rxjs_1.forkJoin)([
                this.calculatePurchaseProduct(productId),
                this.calculatePurchaseBuyer(buyerId, cost),
                this.calculatePurchaseSeller(m[0].sellerId, cost)
            ]);
        }), (0, rxjs_1.map)((m) => ({ product: m[0].productName, amount, remainedDeposit: m[1].deposit })));
    }
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    static resetDeposit(id) {
        return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => user_1.default.findByIdAndUpdate(id, { deposit: 0 }, { new: true })));
    }
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    static calculatePurchaseProduct(id) {
        return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => product_1.default.findByIdAndUpdate(id, { $inc: { amountAvailable: -1 } }, { new: true })));
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------------- 
    static calculatePurchaseBuyer(id, cost) {
        return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => user_1.default.findByIdAndUpdate(id, { $inc: { deposit: -cost } }, { new: true })));
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------------- 
    static calculatePurchaseSeller(sellerId, amount) {
        return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => user_1.default.findByIdAndUpdate({ _id: sellerId }, { $inc: { deposit: amount } }, { new: true })));
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------------- 
    //----------------------------------------------------------------------------------------------------------------------------------------------------- 
    static findProduct(id) {
        return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => product_1.default.findById(id)));
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------------- 
    static findUser(id) {
        return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => user_1.default.findById(id).select(["-password"])));
    }
}
exports.DepositeController = DepositeController;
