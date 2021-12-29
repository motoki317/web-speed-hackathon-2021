import history from 'connect-history-api-fallback';
import Router from 'express-promise-router';
import serveStatic from 'serve-static';
import expressStaticGzip from "express-static-gzip";

import { CLIENT_DIST_PATH, PUBLIC_PATH, UPLOAD_PATH } from '../paths';
import compression from "compression";

const router = Router();

// SPA 対応のため、ファイルが存在しないときに index.html を返す
router.use(history());

router.use(serveStatic(UPLOAD_PATH));
router.use(compression() /* compress image/svg+xml */, serveStatic(PUBLIC_PATH));
router.use('/', expressStaticGzip(CLIENT_DIST_PATH, { enableBrotli: true }));

export { router as staticRouter };
