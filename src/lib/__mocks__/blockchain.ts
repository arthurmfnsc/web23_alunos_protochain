import Block from "./block";
import Validation from "../validation";
import BlockInfo from "../block_info";

export default class Blockchain {
    private readonly blocks: Block[];
    private nextIndex = 0;
    
    constructor() {
        this.blocks = [new Block(this.nextIndex, "", "Genesis Block")]
        this.nextIndex++;
    }

    getBlocks(): Block[] {
        return this.blocks;
    }

    getLastBlock(): Block {
        return this.blocks[this.blocks.length - 1];
    }

    addBlock(block: Block): Validation {
        if (block.getIndex() < 0) {
            return new Validation(false, "Invalid mock block!");
        }

        this.blocks.push(block);
        this.nextIndex++;
        return new Validation();
    }

    getBlock(hash: string): Block | undefined {
        return this.blocks.find(b => b.getHash() === hash);
    }

    isValid(): Validation {
        return new Validation();
    }

    getFeePerTx(): number {
        return 1;
    }

    getNextBlock(): BlockInfo {
        return {
            data: new Date().toString(),
            difficulty: 0,
            previousHash: this.getLastBlock().getHash(),
            index: 1,
            feePerTx: this.getFeePerTx(),
            maxDifficulty: 62
        } as BlockInfo;
    }
}
