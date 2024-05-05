import Block from "../src/lib/block";
import Blockchain from "../src/lib/blockchain";
import Transaction from "../src/lib/transaction";
import TransactionType from "../src/lib/transaction_type";

jest.mock("../src/lib/block");
jest.mock("../src/lib/transaction");

describe("Blockchain tests", () => {
    
    test("Should has genesis block", () => {
        const blockchain = new Blockchain();
        expect(blockchain.getBlocks().length).toEqual(1);
    })

    test("Should be valid (genesis)", () => {
        const blockchain = new Blockchain();
        expect(blockchain.isValid().isSucess()).toBeTruthy();
    })

    test.skip("Should be valid (two blocks)", () => {
        const blockchain = new Blockchain();
        blockchain.addBlock(new Block({
            index: 1,
            previousHash: blockchain.getBlocks()[0].getHash(),
            transactions: [new Transaction({
                data: "Block 2"
            } as unknown as Transaction)]
        } as unknown as Block));
        expect(blockchain.isValid().isSucess()).toBeTruthy();
    })

    test.skip("Should add block", () => {
        const blockchain = new Blockchain();
        const result = blockchain.addBlock(new Block({
            index: 1,
            previousHash: blockchain.getBlocks()[0].getHash(),
            transactions: [new Transaction({
                data: "Block 2"
            } as unknown as Transaction)]
        } as unknown as Block));
        expect(result).toBeTruthy();
    })

    test("Should not add block", () => {
        const blockchain = new Blockchain();
        const result = blockchain.addBlock(new Block({
            index: -1,
            previousHash: blockchain.getBlocks()[0].getHash(),
            transactions: [new Transaction({
                data: "Block 2"
            } as unknown as Transaction)]
        } as unknown as Block));
        expect(result.isSucess()).toBeFalsy();
    })

    test("Should get block", () => {
        const blockchain = new Blockchain();
        expect(blockchain.getBlock(blockchain.getBlocks()[0].getHash())).toBeTruthy();
    })

    test("Should not get block", () => {
        const blockchain = new Blockchain();
        expect(blockchain.getBlock("invalid")).toBeFalsy();
    })

    test.skip("Should get next block info", () => {
        const blockchain = new Blockchain();
        const tx = new Transaction();
        blockchain.addTransaction(tx)
        const info = blockchain.getNextBlock();
        expect(info? info.index : 0).toEqual(1);
    })

    test("Should not get next block info", () => {
        const blockchain = new Blockchain();
        const info = blockchain.getNextBlock();
        expect(info).toBeNull();
    })
})