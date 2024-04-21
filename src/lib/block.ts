import { SHA256 } from "crypto-js";
import Validation from "./validation";

export default class Block {
    private readonly index: number;
    private readonly timeStamp: number;
    private readonly previousHash: string;
    private readonly data: string;
    private hash: string;
    private nonce = 0;
    private miner = "";

    constructor(index: number, previousHash: string, data: string) {
        this.index = index;
        this.timeStamp = Date.now();
        this.previousHash = previousHash;
        this.data = data;
        this.hash = this.getHash();
    }

    getIndex(): number {
        return this.index;
    }

    getHash(): string {
        return SHA256(this.index + this.data +this.timeStamp + this.previousHash + this.nonce + this.miner).toString();
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
        if (this.index < 0) {
            return new Validation(false, "Invalid index!");
        }

        if (previousIndex !== this.index - 1) {
            return new Validation(false, "Invalid previous index!");
        }

        if (this.previousHash !== previousHash) {
            return new Validation(false, "Invalid previous hash!");
        }

        if (!this.data) {
            return new Validation(false, "Invalid data!");
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
}
