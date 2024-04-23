import BlockParams from "../block_params";
import Validation from "../validation";

export default class Block {
    private readonly index: number;
    private readonly timeStamp: number;
    private readonly previousHash: string;
    private readonly data: string;
    private hash: string;
    private nonce;
    private miner;

    constructor(params?: BlockParams) {
        this.index = params?.index || 0;
        this.timeStamp = Date.now();
        this.previousHash = params?.previousHash || "";
        this.miner = params?.miner || "";
        this.nonce = params?.nonce || 0;
        this.data = params?.data || "";
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
