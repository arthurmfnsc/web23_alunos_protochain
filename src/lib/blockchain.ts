import Block from "./block";
import Validation from "./validation";

export default class Blockchain {
    private blocks: Block[];
    private nextIndex: number = 0;
    
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
        const lastBlock = this.getLastBlock();
        const validation = block.isValid(lastBlock.getHash(), lastBlock.getIndex()); 
        if (!validation.isSucess()) return new Validation(false, `Invalid block: ${validation.getMessage()}`);
        this.blocks.push(block);
        this.nextIndex++;
        return new Validation();
    }

    isValid(): Validation {
        for(let i = this.blocks.length - 1; i > 0; i--) {
            const currentBlock = this.blocks[i];
            const previousBlock = this.blocks[i - 1];
            const validation = currentBlock.isValid(previousBlock.getHash(), previousBlock.getIndex()); 
            if (!validation.isSucess()) return new Validation(false, `Invalid block #${currentBlock.getIndex()}: ${validation.getMessage()}`); 
        }
        return new Validation();
    }
}