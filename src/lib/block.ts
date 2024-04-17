import { SHA256 } from "crypto-js";

export default class Block {
    private index: number;
    private timeStamp: number;
    private hash: string;
    private previousHash: string;
    private data: string;

    constructor(index: number, previousHash: string, data: string) {
        this.index = index;
        this.timeStamp = Date.now();
        this.hash = this.getHash();
        this.previousHash = previousHash;
        this.data = data;
    }

    getHash(): string {
        return SHA256(this.index + this.data +this.timeStamp + this.previousHash).toString();
    }

    isValid(): boolean {
        if (this.index < 0) return false;
        if (!this.previousHash) return false;
        if (!this.data) return false;
        return true;
    }
}
