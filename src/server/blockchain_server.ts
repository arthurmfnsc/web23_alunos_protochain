import express, {Request, Response, NextFunction} from 'express';
import morgan from 'morgan';
import Blockchain from '../lib/blockchain';
import Block from '../lib/block';

const PORT = 3000;

const app = express();
app.use(express.json())

const blockchain = new Blockchain();

if (process.argv.includes("--run")) {
    app.use(morgan("tiny"));

    app.listen(PORT, () => {
        console.log(`Blockchain server is running at ${PORT}!`)
    })
}

app.get("/blocks/next", (req: Request, res: Response, next: NextFunction) => {
    res.json(blockchain.getNextBlock())
})

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

app.post("/blocks", (req: Request, res: Response, next: NextFunction) => {
    const block = new Block(req.body.index as number, req.body.previousHash as string, req.body.data as string);
    const validation = blockchain.addBlock(block);

    if (validation.isSucess()) {
        res.status(201).json(block);
    } else {
        res.status(400).json(validation);
    }
});

app.get("/status", (req: Request, res: Response, next: NextFunction) => {
    res.json({
        numberOfBlocks: blockchain.getBlocks().length,
        isValid: blockchain.isValid(),
        lastBlock: blockchain.getLastBlock()
    })
})

export {
    app
};
