import Block from "./block";
import BlockInfo from "./block_info";
import Transaction from "./transaction";
import TransactionSearch from "./transaction_search";
import TransactionType from "./transaction_type";
import Validation from "./validation";

export default class Blockchain {
    private readonly blocks: Block[];
    private mempool: Transaction[];
    private nextIndex = 0;
    private static readonly DIFFICULTY_FACTOR = 5;
    private static readonly MAX_DIFFICULTY = 62;
    static readonly TX_PER_BLOCK = 2;

    constructor() {
        this.mempool = [];
        this.blocks = [
            new Block({
                index: this.nextIndex,
                previousHash: "",
                transactions: [new Transaction({
                    type: TransactionType.FEE,
                    data: new Date().toString()
                } as unknown as Transaction)] as Transaction[]
            } as unknown as Block)
        ]
        this.nextIndex++;
    }

    
    getBlock(hash: string): Block | undefined {
        return this.blocks.find(b => b.getHash() === hash);
    }
    
    getBlocks(): Block[] {
        return this.blocks;
    }

    getDifficulty(): number {
        return Math.ceil(this.blocks.length / Blockchain.DIFFICULTY_FACTOR);
    }

    getLastBlock(): Block {
        return this.blocks[this.blocks.length - 1];
    }

    getMempool(): Transaction[] {
        return this.mempool;
    }

    getTransaction(hash: string): TransactionSearch {
        const mempoolIndex = this.mempool.findIndex(tx => tx.getHash() === hash);

        if (mempoolIndex !== -1) {
            return {
                mempoolIndex,
                transaction: this.mempool[mempoolIndex]
            } as TransactionSearch
        }

        const blockIndex = this.blocks.findIndex(b => b.getTransactions().some(tx => tx.getHash() === hash));
        
        if (blockIndex !== -1) {
            return {
                blockIndex,
                transaction: this.blocks[blockIndex].getTransactions().find(tx => tx.getHash() === hash)
            } as TransactionSearch
        }

        return {
            blockIndex: -1,
            mempoolIndex: -1
        } as TransactionSearch
    }

    addBlock(block: Block): Validation {
        const lastBlock = this.getLastBlock();
        const validation = block.isValid(lastBlock.getHash(), lastBlock.getIndex(), this.getDifficulty()); 

        if (!validation.isSucess()) {
            return new Validation(false, `Invalid block: ${validation.getMessage()}`);
        }

        const txs = block.getTransactions().filter(tx => tx.getType() !== TransactionType.FEE).map(tx => tx.getHash());
        const newMempool = this.mempool.filter(tx => !txs.includes(tx.getHash()));
        
        if (newMempool.length + txs.length !== this.mempool.length) {
            return new Validation(false, "Invalid tx in block: mempool!");
        }
        
        this.mempool = newMempool;

        this.blocks.push(block);
        this.nextIndex++;
        return new Validation(true, block.getHash());
    }

    addTransaction(transaction: Transaction): Validation {
        const validation = transaction.isValid();
        
        if (!validation.isSucess()) {
            return new Validation(false, `Invalid tx: ${validation.getMessage()}`)
        }
        
        if (this.blocks.some(b => b.getTransactions().some(tx => tx.getHash() === transaction.getHash()))) {
            return new Validation(false, "Duplicated tx in blockchain!");
        }

        if (this.mempool.some(tx => tx.getHash() === transaction.getHash())) {
            return new Validation(false, "Duplicated tx in mempool!");
        }

        this.mempool.push(transaction);
        return new Validation(true, transaction.getHash())
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

    getNextBlock(): BlockInfo | null {
        if (!this.mempool || !this.mempool.length) {
            return null;
        }

        const transactions = this.mempool.slice(0, Blockchain.TX_PER_BLOCK);
        const difficulty = this.getDifficulty();
        const previousHash = this.getLastBlock().getHash();
        const index = this.blocks.length;
        const feePerTx = this.getFeePerTx();
        const maxDifficulty = Blockchain.MAX_DIFFICULTY;
        return {
            transactions,
            difficulty,
            previousHash,
            index,
            feePerTx,
            maxDifficulty
        } as BlockInfo;
    }
}