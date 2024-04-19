import Block from "./block";
import Validation from "../validation";

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
}
