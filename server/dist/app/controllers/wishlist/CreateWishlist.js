"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const http_status_1 = __importDefault(require("http-status"));
const SendResponse_1 = __importDefault(require("../../../utils/SendResponse"));
const ApiError_1 = __importDefault(require("../../../utils/errors/ApiError"));
const WishlistModel_1 = __importDefault(require("../../models/WishlistModel"));
const UserModel_1 = __importDefault(require("../../models/UserModel"));
const CreateWishlist = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // finding the wishlist
    const findWishlist = yield WishlistModel_1.default.findOne({ $and: [{ book: req.body.book, user: req.body.user }] });
    if (findWishlist)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Already added to wishlist!');
    // creating wishlist
    const result = yield WishlistModel_1.default.create(req.body);
    if (result._id) {
        yield UserModel_1.default.findByIdAndUpdate(req.body.user, { $push: { wishlists: result._id } });
    }
    else {
        yield WishlistModel_1.default.findByIdAndDelete(result._id);
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create wishlist!');
    }
    (0, SendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Book added to wishlist!',
    });
}));
exports.default = CreateWishlist;
