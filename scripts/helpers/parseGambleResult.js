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
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseGambleResult = parseGambleResult;
const connection_1 = require("./connection");
function parseGambleResult(txSignature) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const txDetails = yield connection_1.connection.getParsedTransaction(txSignature, {
            commitment: 'confirmed',
            maxSupportedTransactionVersion: 0,
        });
        if (!txDetails)
            return 'unknown';
        const logs = ((_a = txDetails.meta) === null || _a === void 0 ? void 0 : _a.logMessages) || [];
        if (logs.some((log) => log.includes('You won!')))
            return 'win';
        if (logs.some((log) => log.includes('You lost!')))
            return 'lose';
        return 'unknown';
    });
}
