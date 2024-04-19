import request from "supertest";
import {app} from "../src/server/blockchain_server"
import Block from "../src/lib/block";

jest.mock("../src/lib/block");
jest.mock("../src/lib/blockchain");

describe("Blockchain server tests", () => {
    test("GET /status - Should return status", async () => {
        const response = await request(app)
            .get("/status");
        
            expect(response.status).toEqual(200);
            expect(response.body.isValid.success).toBeTruthy();
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
        const block = new Block(1, "", "");
        const response = await request(app)
            .post("/blocks")
            .send(block);

            expect(response.status).toEqual(201);
            expect(response.body.index).toEqual(1);
    });

    test("POST /blocks/ - Should not add block", async () => {
        const block = new Block(-1, "", "");
        const response = await request(app)
            .post("/blocks")
            .send(block);

            expect(response.status).toEqual(400);
            expect(response.body.success).toBeFalsy();
            expect(response.body.message).toEqual("Invalid mock block!");
    });
});