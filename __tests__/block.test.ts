import Block from "../src/lib/block";

describe("Block tests", () => {
    
    test("Should be valid", () => {
        const block = new Block(1, "abc");
        expect(block.isValid()).toBeTruthy()
    })

    test("Should not be valid when invalid hash", () => {
        const block = new Block(1, "");
        expect(block.isValid()).toBeFalsy()
    })

    test("Should not be valid when invalid index", () => {
        const block = new Block(-1, "abc");
        expect(block.isValid()).toBeFalsy()
    })
})