import TransactionType from "../transaction_type";
import Validation from "../validation";

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
        return "mockedhash";
    }

    isValid(): Validation {
        if (!this.data) {
            return new Validation(false, "Invalid mock transaction!");
        }

        return new Validation();
    }
}
