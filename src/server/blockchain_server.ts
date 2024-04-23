import dotenv from "dotenv";
dotenv.config();

import express, {Request, Response, NextFunction} from 'express';
import morgan from 'morgan';
import Blockchain from '../lib/blockchain';
import Block from '../lib/block';
import BlockParams from '../lib/block_params';

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
        numberOfBlocks: blockchain.getBlocks().length,
        isValid: blockchain.isValid(),
        lastBlock: blockchain.getLastBlock()
    })
});

app.post("/blocks", (req: Request, res: Response, next: NextFunction) => {
    const block = new Block({
        index: req.body.index as number,
        previousHash: req.body.previousHash as string,
        miner: req.body.miner as string,
        nonce: req.body.nonce as number,
        data: req.body.data as string
    } as BlockParams);

    const validation = blockchain.addBlock(block);

    if (validation.isSucess()) {
        res.status(201).json(block);
    } else {
        res.status(400).json(validation);
    }
});

export {
    app
};
