import classNames from 'classnames';
import React from 'react';

import {getImagePath} from "../../../utils/get_path";

/**
 * @typedef {object} Props
 * @property {model.Image} image
 * @property {string} importance
 */

/**
 * アスペクト比を維持したまま、要素のコンテンツボックス全体を埋めるように画像を拡大縮小します
 * @type {React.VFC<Props>}
 */
const CoveredImage = ({ image, importance }) => {
  const [containerSize, setContainerSize] = React.useState({ height: 0, width: 0 });
  /** @type {React.RefCallback<HTMLDivElement>} */
  const callbackRef = React.useCallback((el) => {
    setContainerSize({
      height: el?.clientHeight ?? 0,
      width: el?.clientWidth ?? 0,
    });
  }, []);

  const containerRatio = containerSize.height / containerSize.width;
  const imageRatio = image.height / image.width;

  return (
    <div ref={callbackRef} className="relative w-full h-full overflow-hidden">
      <img
        alt={image.alt}
        className={classNames('absolute left-1/2 top-1/2 max-w-none transform -translate-x-1/2 -translate-y-1/2', {
          'w-auto h-full': containerRatio > imageRatio,
          'w-full h-auto': containerRatio <= imageRatio,
        })}
        src={getImagePath(image.id)}
        width={image.width}
        height={image.height}
        importance={importance}
      />
    </div>
  );
};

export { CoveredImage };
