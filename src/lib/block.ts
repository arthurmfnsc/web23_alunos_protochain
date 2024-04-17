import { SHA256 } from "crypto-js";

export default class Block {
    private index: number;
    private timeStamp: number;
    private previousHash: string;
    private data: string;

    constructor(index: number, previousHash: string, data: string) {
        this.index = index;
        this.timeStamp = Date.now();
        this.previousHash = previousHash;
        this.data = data;
    }

    getIndex(): number {
        return this.index;
    }

    getHash(): string {
        return SHA256(this.index + this.data +this.timeStamp + this.previousHash).toString();
    }

    isValid(previousHash: string, previousIndex: number): boolean {
        if (previousIndex != this.index - 1) return false;
        if (this.index < 0) return false;
        if (this.previousHash != previousHash) return false;
        if (!this.data) return false;
        return true;
    }
}
