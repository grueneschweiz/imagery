import {MarkColor, MarkColorActive, MarkWidth} from "../Constants";

export function getMarkColor(active) {
    if (active) {
        return MarkColorActive;
    }

    return MarkColor;
}

export function getMarkLineWidth(previewDims, imageDims) {
    const previewLen = Math.max(previewDims.width, previewDims.height);
    const imageLen = Math.max(imageDims.width, imageDims.height);

    const lenRatio = imageLen / previewLen;
    return MarkWidth * lenRatio;
}
