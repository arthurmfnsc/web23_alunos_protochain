import BlockInfo from "../block_info";
import TransactionSearch from "../transaction_search";
import TransactionType from "../transaction_type";
import Validation from "../validation";
import Block from "./block";
import Transaction from "./transaction";

export default class Blockchain {
    private readonly blocks: Block[];
    private mempool: Transaction[];
    private nextIndex = 0;
    
    constructor() {
        this.mempool = []
        this.blocks = [new Block({
            index: this.nextIndex,
            previousHash: "",
            transactions: [new Transaction({
                data: "tx1",
                type: TransactionType.FEE
            } as unknown as Transaction)]
        } as unknown as Block)]
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

    addTransaction(transaction: Transaction): Validation {
        const validation = transaction.isValid()
        
        if (!validation.isSucess()) {
            return validation;    
        }
        
        this.mempool.push(transaction);
        return new Validation();
    }

    getTransaction(hash: string): TransactionSearch {
        return {
            mempoolIndex: 0,
            transaction: {
                hash
            }
        } as unknown as TransactionSearch;
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
            transactions: [new Transaction({
                data: new Date().toString()
            } as unknown as Transaction)],
            difficulty: 0,
            previousHash: this.getLastBlock().getHash(),
            index: 1,
            feePerTx: this.getFeePerTx(),
            maxDifficulty: 62
        } as unknown as BlockInfo;
    }
}
