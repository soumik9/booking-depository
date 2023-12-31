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
const BookModel_1 = __importDefault(require("../../models/BookModel"));
const ApiError_1 = __importDefault(require("../../../utils/errors/ApiError"));
const UpdateBook = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // finding the book
    const findBook = yield BookModel_1.default.findById(req.params.id);
    // checking user req is valid
    if ((findBook === null || findBook === void 0 ? void 0 : findBook.addedBy.toString()) !== ((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'You have not added this book!');
    }
    // updating specific book data
    const result = yield BookModel_1.default.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
    (0, SendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Book updated successfully!',
        data: result,
    });
}));
exports.default = UpdateBook;
