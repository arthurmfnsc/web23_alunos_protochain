import Block from "../src/lib/block";
import Blockchain from "../src/lib/blockchain";

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
        blockchain.addBlock(new Block(1, blockchain.getBlocks()[0].getHash(), "Block 2"));
        expect(blockchain.isValid().isSucess()).toBeTruthy();
    })

    test("Should add block", () => {
        const blockchain = new Blockchain();
        const result = blockchain.addBlock(new Block(1, blockchain.getBlocks()[0].getHash(), "Block 2"));
        expect(result).toBeTruthy();
    })

    test("Should not add block", () => {
        const blockchain = new Blockchain();
        const result = blockchain.addBlock(new Block(-1, blockchain.getBlocks()[0].getHash(), "Block 2"));
        expect(result.isSucess()).toBeFalsy();
    })

    test("Should get block", () => {
        const blockchain = new Blockchain();
        expect(blockchain.getBlock(blockchain.getBlocks()[0].getHash())).toBeTruthy();
    })

    test("Should not get block", () => {
        const blockchain = new Blockchain();
        expect(blockchain.getBlock("abc")).toBeFalsy();
    })
})