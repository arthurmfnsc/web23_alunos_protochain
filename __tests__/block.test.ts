import Block from "../src/lib/block";

describe("Block tests", () => {

    let genesis: Block;

    beforeAll(() => {
        genesis = new Block(0, "", "Genesis Block");
    })

    test("Should be valid", () => {
        const block = new Block(1, genesis.getHash(), "block 2");
        expect(block.isValid(genesis.getHash(), genesis.getIndex())).toBeTruthy()
    })

    test("Should not be valid when invalid previous hash", () => {
        const block = new Block(1, "", "block 2");
        expect(block.isValid(genesis.getHash(), genesis.getIndex())).toBeFalsy()
    })

    test("Should not be valid when invalid index", () => {
        const block = new Block(-1, genesis.getHash(), "block 2");
        expect(block.isValid(genesis.getHash(), genesis.getIndex())).toBeFalsy()
    })
})