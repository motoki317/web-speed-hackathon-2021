import images from '../seeds/images.json';
import fs from 'fs';
import path from "path";
import {PUBLIC_PATH} from "./paths";
import sizeOf from 'image-size';

const newImages = images.map((image) => {
    const imageData = fs.readFileSync(path.resolve(PUBLIC_PATH, 'images', image.id + '.jpg'))
    const { width, height } = sizeOf(imageData)
    return {
        ...image,
        width,
        height,
    }
})

console.log(JSON.stringify(newImages, null, 2))
