import Validation from "../validation";

export default class Block {
    private readonly index: number;
    private readonly timeStamp: number;
    private readonly previousHash: string;
    private readonly data: string;
    private readonly hash: string;

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
        return this.hash || "mockedhash";
    }

    isValid(previousHash: string, previousIndex: number): Validation {
        if (!previousHash || previousIndex < 0 || this.index < 0) {
            return new Validation(false, "Invalid mock block!");
        }

        return new Validation();
    }
}
