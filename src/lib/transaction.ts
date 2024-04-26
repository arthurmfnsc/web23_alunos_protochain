import { SHA256 } from "crypto-js";
import TransactionType from "./transaction_type";
import Validation from "./validation";

export default class Transaction {
    private type: TransactionType;
    private timestamp: number;
    private hash: string;
    private data: string;
    
    constructor(transaction?: Transaction) {
        this.type = transaction?.type || TransactionType.REGULAR;
        this.timestamp = transaction?.timestamp || Date.now();
        this.data = transaction?.data || "";
        this.hash = transaction?.hash || this.getHash();
    }
    
    getType(): TransactionType {
        return this.type;
    }

    getHash(): string {
        return SHA256(this.type + this.data +this.timestamp).toString();
    }

    isValid(): Validation {
        if (this.hash != this.getHash()) {
            return new Validation(false, "Invalid hash!");
        }

        if (!this.data) {
            return new Validation(false, "Invalid data!");
        }

        return new Validation();
    }
}