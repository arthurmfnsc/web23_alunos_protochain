import Block from "../src/lib/block";
import BlockParams from "../src/lib/block_params";
import Blockchain from "../src/lib/blockchain";

jest.mock("../src/lib/block");

describe("Blockchain tests", () => {
    
    test("Should has genesis block", () => {
        const blockchain = new Blockchain();
        expect(blockchain.getBlocks().length).toEqual(1);
    })

    test("Should be valid (genesis)", () => {
        const blockchain = new Blockchain();
        expect(blockchain.isValid().isSucess()).toBeTruthy();
    })

    test("Should be valid (two blocks)", () => {
        const blockchain = new Blockchain();
        blockchain.addBlock(new Block({
            index: 1, 
            previousHash: blockchain.getBlocks()[0].getHash(), 
            data: "Block 2"
        } as BlockParams));
        expect(blockchain.isValid().isSucess()).toBeTruthy();
    })

    test("Should add block", () => {
        const blockchain = new Blockchain();
        const result = blockchain.addBlock(new Block({
            index: 1, 
            previousHash: blockchain.getBlocks()[0].getHash(), 
            data: "Block 2"
        } as BlockParams));
        expect(result).toBeTruthy();
    })

    test("Should not add block", () => {
        const blockchain = new Blockchain();
        const result = blockchain.addBlock(new Block({
            index: -1, 
            previousHash: blockchain.getBlocks()[0].getHash(), 
            data: "Block 2"
        } as BlockParams));
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

    test("Should get next block info", () => {
        const blockchain = new Blockchain();
        const info = blockchain.getNextBlock();
        expect(info.index).toEqual(1);
    })
})