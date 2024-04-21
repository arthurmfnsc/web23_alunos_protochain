import Block from "./block";
import BlockInfo from "./block_info";
import Validation from "./validation";

export default class Blockchain {
    private readonly blocks: Block[];
    private nextIndex = 0;
    private static readonly DIFFICULTY_FACTOR = 5;
    static MAX_DIFFICULTY = 62;

    constructor() {
        this.blocks = [new Block(this.nextIndex, "", "Genesis Block")]
        this.nextIndex++;
    }

    getDifficulty(): number {
        return Math.ceil(this.blocks.length / Blockchain.DIFFICULTY_FACTOR);
    }

    getBlocks(): Block[] {
        return this.blocks;
    }

    getLastBlock(): Block {
        return this.blocks[this.blocks.length - 1];
    }

    addBlock(block: Block): Validation {
        const lastBlock = this.getLastBlock();
        const validation = block.isValid(lastBlock.getHash(), lastBlock.getIndex(), this.getDifficulty()); 

        if (!validation.isSucess()) {
            return new Validation(false, `Invalid block: ${validation.getMessage()}`);
        }

        this.blocks.push(block);
        this.nextIndex++;
        return new Validation();
    }

    getBlock(hash: string): Block | undefined {
        return this.blocks.find(b => b.getHash() === hash);
    }

    isValid(): Validation {
        for(let i = this.blocks.length - 1; i > 0; i--) {
            const currentBlock = this.blocks[i];
            const previousBlock = this.blocks[i - 1];
            const validation = currentBlock.isValid(previousBlock.getHash(), previousBlock.getIndex(), this.getDifficulty()); 
            if (!validation.isSucess()) {
                return new Validation(false, `Invalid block #${currentBlock.getIndex()}: ${validation.getMessage()}`); 
            }
        }
        return new Validation();
    }

    getFeePerTx(): number {
        return 1;
    }

    getNextBlock(): BlockInfo {
        const data = new Date().toString();
        const difficulty = this.getDifficulty();
        const previousHash = this.getLastBlock().getHash();
        const index = this.blocks.length;
        const feePerTx = this.getFeePerTx();
        const maxDifficulty = Blockchain.MAX_DIFFICULTY;
        return {
            data,
            difficulty,
            previousHash,
            index,
            feePerTx,
            maxDifficulty
        } as BlockInfo;
    }
}