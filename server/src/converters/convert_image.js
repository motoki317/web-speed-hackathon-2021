/**
 * @param {Buffer} buffer
 * @returns {Promise<Uint8Array>}
 */
async function convertImage(buffer) {
  // Pure ESM modules
  const imagemin = (await import('imagemin')).default;
  const imageminWebp = (await import('imagemin-webp')).default;
  return imagemin.buffer(buffer, {
    plugins: [imageminWebp()]
  }).then((b) => Uint8Array.from(b))
}

export {convertImage};
