import { promises as fs } from 'fs';
import path from 'path';
import _ from 'lodash';
import { AudioContext } from 'web-audio-api';

import Router from 'express-promise-router';
import httpErrors from 'http-errors';
import { v4 as uuidv4 } from 'uuid';

import { convertSound } from '../../converters/convert_sound';
import { UPLOAD_PATH } from '../../paths';
import { extractMetadataFromSound } from '../../utils/extract_metadata_from_sound';

// 変換した音声の拡張子
const EXTENSION = 'mp3';

const router = Router();

/**
 * @param {ArrayBuffer} data
 * @returns {Promise<{ max: number, peaks: number[] }>}
 */
async function computeMetaData(data) {
  const audioCtx = new AudioContext();

  // 音声をデコードする
  /** @type {AudioBuffer} */
  const buffer = await new Promise((resolve, reject) => {
    audioCtx.decodeAudioData(data.slice(0), resolve, reject);
  });
  // 左の音声データの絶対値を取る
  /** @type {Array<number>} */
  const leftData = _.map(buffer.getChannelData(0), Math.abs);
  // 右の音声データの絶対値を取る
  /** @type {Array<number>} */
  const rightData = _.map(buffer.getChannelData(1), Math.abs);

  // 左右の音声データの平均を取る
  /** @type {Array<number>} */
  const normalized = _.map(_.zip(leftData, rightData), _.mean);
  // 100 個の chunk に分ける
  /** @type {Array<Array<number>>} */
  const chunks = _.chunk(normalized, Math.ceil(normalized.length / 100));
  // chunk ごとに平均を取る
  /** @type {Array<number>} */
  const peaks = _.map(_.map(chunks, _.mean), (n) => _.round(n, 3));
  // chunk の平均の中から最大値を取る
  /** @type {number} */
  const max = _.max(peaks);

  return { max, peaks };
}

router.post('/sounds', async (req, res) => {
  if (req.session.userId === undefined) {
    throw new httpErrors.Unauthorized();
  }
  if (Buffer.isBuffer(req.body) === false) {
    throw new httpErrors.BadRequest();
  }

  const soundId = uuidv4();

  const { artist, title } = await extractMetadataFromSound(req.body);

  const converted = await convertSound(req.body, {
    // 音声の拡張子を指定する
    extension: EXTENSION,
  });
  const metaData = computeMetaData(converted.buffer);

  const filePath = path.resolve(UPLOAD_PATH, `./sounds/${soundId}.${EXTENSION}`);
  await fs.writeFile(filePath, converted);

  const metaFilePath = path.resolve(UPLOAD_PATH, `./sounds/${soundId}.meta.json`)
  await fs.writeFile(metaFilePath, JSON.stringify(metaData))

  return res.status(200).type('application/json').send({ artist, id: soundId, title });
});

export { router as soundRouter, computeMetaData as computeSoundMeta };
