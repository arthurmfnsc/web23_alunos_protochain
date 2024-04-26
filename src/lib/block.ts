import { SHA256 } from "crypto-js";
import BlockInfo from "./block_info";
import Transaction from "./transaction";
import TransactionType from "./transaction_type";
import Validation from "./validation";

export default class Block {
    private readonly index: number;
    private readonly timestamp: number;
    private readonly previousHash: string;
    private readonly transactions: Transaction[];
    private hash: string;
    private nonce: number;
    private miner: string;

    constructor(block?: Block) {
        this.index = block?.index || 0;
        this.timestamp = Date.now();
        this.previousHash = block?.previousHash || "";
        this.miner = block?.miner || "";
        this.nonce = block?.nonce || 0;
        this.transactions = block?.transactions 
            ? block.transactions.map(tx => new Transaction(tx)) : [] as Transaction[];
        this.hash = this.getHash();
    }

    getIndex(): number {
        return this.index;
    }

    getHash(): string {
        const txs = this.transactions && this.transactions.length 
            ? this.transactions.map(tx => tx.getHash()).reduce((a, b) => a + b) : "";
        return SHA256(this.index + txs +this.timestamp + this.previousHash + this.nonce + this.miner).toString();
    }

    mine(difficulty: number, miner: string) {
        this.miner = miner;

        const prefix = new Array(difficulty + 1).join("0");

        do {
            this.nonce++;
            this.hash = this.getHash();
        } while(!this.getHash().startsWith(prefix));
    }

    isValid(previousHash: string, previousIndex: number, difficulty: number): Validation {
        if (this.transactions && this.transactions.length) {
            if (this.transactions.filter(tx => tx.getType() === TransactionType.FEE).length > 1) {
                return new Validation(false, "Too many fees!");
            }

            const validations = this.transactions.map(tx => tx.isValid());
            const erros = validations.filter(v => !v.isSucess()).map(v => v.getMessage());
            if (validations.filter(v => !v.isSucess()).length > 0) {
                return new Validation(false, `Invalid block due to tx: ${erros.reduce((a, b) => a + b)}`);
            }
        }

        if (this.index < 0) {
            return new Validation(false, "Invalid index!");
        }

        if (previousIndex !== this.index - 1) {
            return new Validation(false, "Invalid previous index!");
        }

        if (this.previousHash !== previousHash) {
            return new Validation(false, "Invalid previous hash!");
        }

        if (!this.nonce || !this.miner) {
            return new Validation(false, "No mined!");
        }

        const prefix = new Array(difficulty + 1).join("0");

        if (!this.getHash().startsWith(prefix)) {
            return new Validation(false, "Invalid hash!");
        }

        return new Validation();
    }

    static fromBlockInfo(blockInfo: BlockInfo): Block {
        return new Block({
            index: blockInfo.index,
            previousHash: blockInfo.previousHash,
            transactions: blockInfo.transactions
        } as unknown as Block);
    }
}
