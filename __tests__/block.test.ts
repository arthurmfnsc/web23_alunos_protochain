import Block from "../src/lib/block";

describe("Block tests", () => {
    
    test("Should be valid", () => {
        const block = new Block(1, "abc", "block 2");
        expect(block.isValid()).toBeTruthy()
    })

    test("Should not be valid when invalid previous hash", () => {
        const block = new Block(1, "", "block 2");
        expect(block.isValid()).toBeFalsy()
    })

    test("Should not be valid when invalid index", () => {
        const block = new Block(-1, "abc", "block 2");
        expect(block.isValid()).toBeFalsy()
    })
})