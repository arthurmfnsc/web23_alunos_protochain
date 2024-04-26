import Validation from "../validation";
import Transaction from "./transaction";

export default class Block {
    private readonly index: number;
    private readonly timeStamp: number;
    private readonly previousHash: string;
    private readonly transactions: Transaction[];
    private hash: string;
    private nonce: number;
    private miner: string;

    constructor(block?: Block) {
        this.index = block?.index || 0;
        this.timeStamp = Date.now();
        this.previousHash = block?.previousHash || "";
        this.miner = block?.miner || "";
        this.nonce = block?.nonce || 0;
        this.transactions = block?.transactions 
            ? block?.transactions.map(tx => new Transaction(tx)) : [] as Transaction[];
        this.hash = this.getHash();
    }

    getIndex(): number {
        return this.index;
    }

    getHash(): string {
        return this.hash || "mockedhash";
    }

    isValid(previousHash: string, previousIndex: number): Validation {
        if (!previousHash || previousIndex < 0 || this.index < 0) {
            return new Validation(false, "Invalid mock block!");
        }

        return new Validation();
    }
}
