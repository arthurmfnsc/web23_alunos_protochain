import Transaction from "../src/lib/transaction";
import TransactionType from "../src/lib/transaction_type";

describe("Transaction tests", () => {

    test("Should be valid (REGULAR default)", () => {
        const tx = new Transaction({
            data: "tx"
        } as unknown as Transaction);
        expect(tx.isValid().isSucess()).toBeTruthy()
    })

    test("Should be valid (FEE)", () => {
        const tx = new Transaction({
            data: "tx", 
            type: TransactionType.FEE
        } as unknown as Transaction);
        expect(tx.isValid().isSucess()).toBeTruthy()
    })

    test("Should not be valid (invalid hash)", () => {
        const tx = new Transaction({
            data: "tx",
            type: TransactionType.REGULAR,
            timestamp: Date.now(),
            hash: "abc"
        } as unknown as Transaction);
        expect(tx.isValid().isSucess()).toBeFalsy()
    })

    test("Should not be valid (invalid data)", () => {
        const tx = new Transaction();
        expect(tx.isValid().isSucess()).toBeFalsy()
    })
})