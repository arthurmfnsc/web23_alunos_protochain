import Block from "../src/lib/block";
import BlockInfo from "../src/lib/block_info";
import Transaction from "../src/lib/transaction";
import TransactionType from "../src/lib/transaction_type";

jest.mock("../src/lib/transaction");

describe("Block tests", () => {

    const exampleDifficulty = 0;
    const exampleMiner = "arthurmfnsc"
    let genesis: Block;

    beforeAll(() => {
        genesis = new Block({
            transactions: [new Transaction({
                data: "Genesis block"
            } as unknown as Transaction)]
        } as unknown as Block);
    })

    test("Should be valid", () => {
        const block = new Block({
            index: 1,
            previousHash: genesis.getHash(),
            transactions: [new Transaction({
                data: "tx"
            } as unknown as Transaction)]
        } as unknown as Block);
        block.mine(exampleDifficulty, exampleMiner);
        expect(block.isValid(genesis.getHash(), genesis.getIndex(), exampleDifficulty).isSucess()).toBeTruthy()
    })

    test("Should not be valid when invalid index", () => {
        const block = new Block({
            index: -1,
            previousHash: genesis.getHash(),
            transactions: [new Transaction({
                data: "tx"
            } as unknown as Transaction)]
        } as unknown as Block);
        expect(block.isValid(genesis.getHash(), genesis.getIndex(), exampleDifficulty).isSucess()).toBeFalsy()
    })

    test("Should not be valid when invalid previous index", () => {
        const block = new Block({
            index: 2,
            previousHash: genesis.getHash(),
            transactions: [new Transaction({
                data: "tx"
            } as unknown as Transaction)]
        } as unknown as Block);
        expect(block.isValid(genesis.getHash(), genesis.getIndex(), exampleDifficulty).isSucess()).toBeFalsy()
    })

    test("Should not be valid when invalid previous hash", () => {
        const block = new Block({
            index: 1,
            transactions: [new Transaction({
                data: "tx"
            } as unknown as Transaction)]
        } as unknown as Block);
        expect(block.isValid(genesis.getHash(), genesis.getIndex(), exampleDifficulty).isSucess()).toBeFalsy()
    })
    
    test("Should not be valid when invalid data", () => {
        const block = new Block({
            index: 1,
            previousHash: genesis.getHash(),
            transactions: [new Transaction({
                data: ""
            } as unknown as Transaction)]
        } as unknown as Block);
        expect(block.isValid(genesis.getHash(), genesis.getIndex(), exampleDifficulty).isSucess()).toBeFalsy()
    })
    
    test("Should not be valid when no mined", () => {
        const block = new Block({
            index: 1,
            previousHash: genesis.getHash(),
            transactions: [new Transaction({
                data: "tx"
            } as unknown as Transaction)]
        } as unknown as Block);
        expect(block.isValid(genesis.getHash(), genesis.getIndex(), exampleDifficulty).isSucess()).toBeFalsy()
    })
    
    test("Should not be valid when 2 fee", () => {
        const block = new Block({
            index: 1,
            previousHash: genesis.getHash(),
            transactions: [
                new Transaction({
                    data: "fee1",
                    type: TransactionType.FEE
                } as unknown as Transaction),
                new Transaction({
                    data: "fee2",
                    type: TransactionType.FEE
                } as unknown as Transaction)
            ]
        } as unknown as Block);
        block.mine(exampleDifficulty, exampleMiner);
        expect(block.isValid(genesis.getHash(), genesis.getIndex(), exampleDifficulty).isSucess()).toBeFalsy()
    })

    test("Should create from block info", () => {
        const block = Block.fromBlockInfo({
            transactions: [new Transaction({
                data: "tx"
            } as unknown as Transaction)],
            difficulty: exampleDifficulty,
            feePerTx: 1,
            index: 1,
            maxDifficulty: 62,
            previousHash: genesis.getHash()
        } as unknown as BlockInfo);
        block.mine(exampleDifficulty, exampleMiner);
        expect(block.isValid(genesis.getHash(), genesis.getIndex(), exampleDifficulty).isSucess()).toBeTruthy()
    })
})