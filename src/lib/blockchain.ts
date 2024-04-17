import Block from "./block";

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

    addBlock(block: Block): boolean {
        const lastBlock = this.getLastBlock();
        if (!block.isValid(lastBlock.getHash(), lastBlock.getIndex())) return false;
        this.blocks.push(block);
        this.nextIndex++;
        return true;
    }

    isValid(): boolean {
        for(let i = this.blocks.length - 1; i > 0; i--) {
            const currentBlock = this.blocks[i];
            const previousBlock = this.blocks[i - 1];
            if (!currentBlock.isValid(previousBlock.getHash(), previousBlock.getIndex())) return false; 
        }
        return true;
    }
}