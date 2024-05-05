import request from "supertest";
import Block from "../src/lib/block";
import { app } from "../src/server/blockchain_server";
import Transaction from "../src/lib/transaction";

jest.mock("../src/lib/block");
jest.mock("../src/lib/blockchain");

describe("Blockchain server tests", () => {
    test("GET /status - Should return status", async () => {
        const response = await request(app)
            .get("/status");
        
            expect(response.status).toEqual(200);
            expect(response.body.isValid.success).toBeTruthy();
    });

    test("GET /blocks/next - Should get next block info", async () => {
        const response = await request(app)
            .get("/blocks/next");
        
            expect(response.status).toEqual(200);
            expect(response.body.index).toEqual(1);
    });

    test("GET /blocks/:index - Should get genesis", async () => {
        const response = await request(app)
            .get("/blocks/0");
        
            expect(response.status).toEqual(200);
            expect(response.body.index).toEqual(0);
    });

    test("GET /blocks/:hash - Should get genesis", async () => {
        const response = await request(app)
            .get("/blocks/mockedhash");
        
            expect(response.status).toEqual(200);
            expect(response.body.hash).toEqual("mockedhash");
    });

    test("GET /blocks/:index - Should not get block", async () => {
        const response = await request(app)
            .get("/blocks/-1");
        
            expect(response.status).toEqual(404);
    });

    test("POST /blocks/ - Should add block", async () => {
        const block = new Block({
            index: 1
        } as unknown as Block);
        const response = await request(app)
            .post("/blocks")
            .send(block);

            expect(response.status).toEqual(201);
            expect(response.body.index).toEqual(1);
    });

    test("POST /blocks/ - Should not add block", async () => {
        const block = new Block({
            index: -1
        } as unknown as Block);
        const response = await request(app)
            .post("/blocks")
            .send(block);

            expect(response.status).toEqual(400);
            expect(response.body.success).toBeFalsy();
            expect(response.body.message).toEqual("Invalid mock block!");
    });

    test("GET /transactions/:hash - Should get transaction", async () => {
        const response = await request(app)
            .get("/transactions/mockedhash");
        
            expect(response.status).toEqual(200);
            expect(response.body.mempoolIndex).toEqual(0);
    });

    test("POST /transactions/ - Should add transaction", async () => {
        const transaction = new Transaction({
            data: "tx1"

        } as unknown as Transaction);
        const response = await request(app)
            .post("/transactions")
            .send(transaction);

            expect(response.status).toEqual(201);
    });
});