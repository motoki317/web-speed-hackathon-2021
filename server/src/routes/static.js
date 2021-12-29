import history from 'connect-history-api-fallback';
import Router from 'express-promise-router';
import serveStatic from 'serve-static';
import expressStaticGzip from "express-static-gzip";
import path from 'path';
import fs from 'fs';

import { CLIENT_DIST_PATH, PUBLIC_PATH, UPLOAD_PATH } from '../paths';
import compression from "compression";
import { computeSoundMeta } from "./api/sound";

const router = Router();

// SPA 対応のため、ファイルが存在しないときに index.html を返す
router.use(history());

router.use(serveStatic(UPLOAD_PATH));
router.use(compression() /* compress image/svg+xml */, serveStatic(PUBLIC_PATH));
router.use('/', expressStaticGzip(CLIENT_DIST_PATH, { enableBrotli: true, orderPreference: ['br', 'gzip'] }));

const genPublicSoundMetas = async () => {
    console.log('generating sound public metas')

    const mp3Regex = /^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.mp3$/

    for (const file of fs.readdirSync(path.resolve(PUBLIC_PATH, 'sounds'))) {
        const regRes = mp3Regex.exec(file)
        if (regRes === null) {
            console.log(`skipping file ${file}`)
            continue
        }

        const soundId = regRes[1];

        const soundData = fs.readFileSync(path.resolve(PUBLIC_PATH, 'sounds', file))

        const metaData = await computeSoundMeta(soundData.buffer)

        const metaFilePath = path.resolve(PUBLIC_PATH, `./sounds/${soundId}.meta.json`)
        fs.writeFileSync(metaFilePath, JSON.stringify(metaData))

        console.log(`finished for sound ${soundId}`)
    }

    console.log('finished generating sound public metas')
};

export { router as staticRouter, genPublicSoundMetas };
