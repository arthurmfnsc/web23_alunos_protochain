import Block from "../src/lib/block";
import BlockInfo from "../src/lib/block_info";
import BlockParams from "../src/lib/block_params";

describe("Block tests", () => {

    const exampleDifficulty = 0;
    const exampleMiner = "arthurmfnsc"
    let genesis: Block;

    beforeAll(() => {
        genesis = new Block({
            index: 0, 
            previousHash: "", 
            data: "Genesis Block"
        } as BlockParams);
    })

    test("Should be valid", () => {
        const block = new Block({
            index: 1, 
            previousHash: genesis.getHash(), 
            data: "block 2"
        } as BlockParams);
        block.mine(exampleDifficulty, exampleMiner);
        expect(block.isValid(genesis.getHash(), genesis.getIndex(), exampleDifficulty).isSucess()).toBeTruthy()
    })

    test("Should not be valid when invalid index", () => {
        const block = new Block({
            index: -1, 
            previousHash: genesis.getHash(), 
            data: "block 2"
        } as BlockParams);
        expect(block.isValid(genesis.getHash(), genesis.getIndex(), exampleDifficulty).isSucess()).toBeFalsy()
    })

    test("Should not be valid when invalid previous index", () => {
        const block = new Block({
            index: 2, 
            previousHash: genesis.getHash(), 
            data: "block 2"
        } as BlockParams);
        expect(block.isValid(genesis.getHash(), genesis.getIndex(), exampleDifficulty).isSucess()).toBeFalsy()
    })

    test("Should not be valid when invalid previous hash", () => {
        const block = new Block({
            index: 1, 
            data: "block 2"
        } as BlockParams);
        expect(block.isValid(genesis.getHash(), genesis.getIndex(), exampleDifficulty).isSucess()).toBeFalsy()
    })
    
    test("Should not be valid when invalid data", () => {
        const block = new Block({
            index: 1, 
            previousHash: genesis.getHash(), 
            data: ""
        } as BlockParams);
        expect(block.isValid(genesis.getHash(), genesis.getIndex(), exampleDifficulty).isSucess()).toBeFalsy()
    })
    
    test("Should not be valid when no mined", () => {
        const block = new Block({
            index: 1, 
            previousHash: genesis.getHash(), 
            data: "block 2"
        } as BlockParams);
        expect(block.isValid(genesis.getHash(), genesis.getIndex(), exampleDifficulty).isSucess()).toBeFalsy()
    })
    
    test("Should create from block info", () => {
        const block = Block.fromBlockInfo({
            data: "Block 2",
            difficulty: exampleDifficulty,
            feePerTx: 1,
            index: 1,
            maxDifficulty: 62,
            previousHash: genesis.getHash()
        } as BlockInfo);
        block.mine(exampleDifficulty, exampleMiner);
        expect(block.isValid(genesis.getHash(), genesis.getIndex(), exampleDifficulty).isSucess()).toBeTruthy()
    })
})