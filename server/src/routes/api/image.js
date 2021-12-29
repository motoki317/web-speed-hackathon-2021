import { promises as fs } from 'fs';
import path from 'path';

import Router from 'express-promise-router';
import httpErrors from 'http-errors';
import { v4 as uuidv4 } from 'uuid';

import { convertImage } from '../../converters/convert_image';
import { UPLOAD_PATH } from '../../paths';

const router = Router();

router.post('/images', async (req, res) => {
  if (req.session.userId === undefined) {
    throw new httpErrors.Unauthorized();
  }
  if (Buffer.isBuffer(req.body) === false) {
    throw new httpErrors.BadRequest();
  }

  const imageId = uuidv4();

  const converted = await convertImage(req.body);

  const filePath = path.resolve(UPLOAD_PATH, `./images/${imageId}.webp`);
  await fs.writeFile(filePath, converted);

  return res.status(200).type('application/json').send({ id: imageId });
});

export { router as imageRouter };
