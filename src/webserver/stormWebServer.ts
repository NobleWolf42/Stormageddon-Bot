import * as http from 'http';
import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
const myDir = import.meta.dirname;

function runWebServer(port: number) {
    const app = express.default();

    const myLimit = typeof process.argv[2] != 'undefined' ? process.argv[2] : '1000kb';

    console.log('Using limit: ', myLimit);

    app.use(bodyParser.json({ limit: myLimit }));

    app.get('/status', (_req: express.Request, res: express.Response) => {
        return res.sendStatus(200);
    });

    app.get('/', (_req: express.Request, res: express.Response) => {
        return res.sendFile(path.join(myDir, 'index.html'));
    });

    http.createServer(app).listen(port);
    console.log('PORT: ', port);
}

//#region Exports
export { runWebServer };
//#endregion
