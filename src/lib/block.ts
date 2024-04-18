import { SHA256 } from "crypto-js";
import Validation from "./validation";

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

    isValid(previousHash: string, previousIndex: number): Validation {
        if (previousIndex != this.index - 1) return new Validation(false, "Invalid previous index!");
        if (this.index < 0) return new Validation(false, "Invalid index!");
        if (this.previousHash != previousHash) return new Validation(false, "Invalid previous hash!");
        if (!this.data) return new Validation(false, "Invalid data!");
        return new Validation();
    }
}
