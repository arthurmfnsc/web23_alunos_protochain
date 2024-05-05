import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import Block from '../lib/block';
import Blockchain from '../lib/blockchain';
import Transaction from "../lib/transaction";

/* c8 ignore next */
const PORT = parseInt(`${process.env.BLOCKCHAIN_PORT}`) || 3000;

const app = express();
app.use(express.json());

const blockchain = new Blockchain();

/* c8 ignore start */
if (process.argv.includes("--run")) {
    app.use(morgan("tiny"));

    app.listen(PORT, () => {
        console.log(`Blockchain server is running at ${PORT}!`)
    })
}
/* c8 ignore end */

app.get("/blocks/next", (req: Request, res: Response, next: NextFunction) => {
    res.json(blockchain.getNextBlock());
});

app.get("/blocks/:indexOrHash", (req: Request, res: Response, next: NextFunction) => {
    let block;
    if (/^[0-9]+$/.test(req.params.indexOrHash)) {
        block = blockchain.getBlocks()[parseInt(req.params.indexOrHash)];
    } else {
        block = blockchain.getBlock(req.params.indexOrHash);
    }

    if (!block) {
        return res.sendStatus(404);
    } else {
        res.json(block);
    }
});

app.get("/status", (req: Request, res: Response, next: NextFunction) => {
    res.json({
        mempool: blockchain.getMempool().length,
        blocks: blockchain.getBlocks().length,
        isValid: blockchain.isValid(),
        lastBlock: blockchain.getLastBlock()
    })
});

app.get("/transactions/:hash?", (req: Request, res: Response, next: NextFunction) => {
    if (req.params.hash) {
        res.json(blockchain.getTransaction(req.params.hash));
    }
    res.json({
        next: blockchain.getMempool().slice(0, Blockchain.TX_PER_BLOCK),
        total: blockchain.getMempool().length
    });
});

app.post("/blocks", (req: Request, res: Response, next: NextFunction) => {
    const block = new Block({
        index: req.body.index as number,
        previousHash: req.body.previousHash as string,
        miner: req.body.miner as string,
        nonce: req.body.nonce as number,
        data: req.body.data as string
    } as unknown as Block);

    const validation = blockchain.addBlock(block);

    if (validation.isSucess()) {
        res.status(201).json(block);
    } else {
        res.status(400).json(validation);
    }
});

app.post("/transactions", (req: Request, res: Response, next: NextFunction) => {
    if (req.body.hash === undefined) {
        return res.sendStatus(422);
    }

    const tx = new Transaction(req.body as Transaction);
    const validation = blockchain.addTransaction(tx);

    if (validation.isSucess()) {
        res.status(201).json(tx);
    } else {
        res.status(400).json(validation);
    }
});

export {
    app
};
