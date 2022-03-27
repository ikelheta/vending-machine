"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const product_1 = require("../model/product");
const rxjs_1 = require("rxjs");
const product_2 = __importDefault(require("../db/product"));
class ProductController {
    static createProduct(body, sellerId) {
        const product = new product_1.Product(body);
        return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => product_2.default.create(Object.assign(Object.assign({}, product), { sellerId }))));
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------------
    static findProduct(id) {
        return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => product_2.default.findById(id)));
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------------
    static findAllProductPagination(pn) {
        return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => {
            return (0, rxjs_1.forkJoin)([
                this.allProduct(pn),
                this.productCount()
            ]);
        }), (0, rxjs_1.map)((m) => ({ data: m[0], colSize: m[1] })));
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------------
    static allProduct(pn) {
        return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => product_2.default.find({}).sort({ _id: -1 }).skip((pn - 1) * 10).limit(10)));
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------------
    static productCount() {
        return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => product_2.default.find({}).count()));
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------------
    static deleteProduct(id, sellerId) {
        return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => product_2.default.findOneAndDelete({ _id: id, sellerId })));
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------------
    static updateProduct(id, sellerId, data) {
        return (0, rxjs_1.of)(true).pipe((0, rxjs_1.mergeMap)(() => product_2.default.findOneAndUpdate({ _id: id, sellerId }, data, { new: true })));
    }
}
exports.ProductController = ProductController;
