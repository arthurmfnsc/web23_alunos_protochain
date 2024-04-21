import Block from "../src/lib/block";

describe("Block tests", () => {

    const exampleDifficulty = 0;
    const exampleMiner = "arthurmfnsc"
    let genesis: Block;

    beforeAll(() => {
        genesis = new Block(0, "", "Genesis Block");
    })

    test("Should be valid", () => {
        const block = new Block(1, genesis.getHash(), "block 2");
        block.mine(exampleDifficulty, exampleMiner);
        expect(block.isValid(genesis.getHash(), genesis.getIndex(), exampleDifficulty).isSucess()).toBeTruthy()
    })

    test("Should not be valid when invalid index", () => {
        const block = new Block(-1, genesis.getHash(), "block 2");
        expect(block.isValid(genesis.getHash(), genesis.getIndex(), exampleDifficulty).isSucess()).toBeFalsy()
    })

    test("Should not be valid when invalid previous index", () => {
        const block = new Block(2, genesis.getHash(), "block 2");
        expect(block.isValid(genesis.getHash(), genesis.getIndex(), exampleDifficulty).isSucess()).toBeFalsy()
    })

    test("Should not be valid when invalid previous hash", () => {
        const block = new Block(1, "", "block 2");
        expect(block.isValid(genesis.getHash(), genesis.getIndex(), exampleDifficulty).isSucess()).toBeFalsy()
    })
    
    test("Should not be valid when invalid data", () => {
        const block = new Block(1, genesis.getHash(), "");
        expect(block.isValid(genesis.getHash(), genesis.getIndex(), exampleDifficulty).isSucess()).toBeFalsy()
    })
    
    test("Should not be valid when no mined", () => {
        const block = new Block(1, genesis.getHash(), "block 2");
        expect(block.isValid(genesis.getHash(), genesis.getIndex(), exampleDifficulty).isSucess()).toBeFalsy()
    })


})