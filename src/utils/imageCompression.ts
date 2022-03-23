import {
  drawImageInCanvas,
  getDataUrlFromFile,
  getFilefromDataUrl,
  loadImage,
} from "./imageUtils";

async function imageCompression(
  file: File,
  maxSizeMB = Number.POSITIVE_INFINITY,
  maxWidthOrHeight: number
) {
  // console.log("before compress", file);
  const maxSizeByte = maxSizeMB * 1024 * 1024;
  const quality = 0.9;

  const dataUrl = await getDataUrlFromFile(file);
  // console.log("dataUrl", dataUrl);
  const img = await loadImage(dataUrl);
  // console.log("img", img);
  const canvas = drawImageInCanvas(img, maxWidthOrHeight);
  // console.log("canvas", canvas);

  let compressedFile: File = await getFilefromDataUrl(
    canvas.toDataURL(file.type, quality),
    file.name,
    file.lastModified
  );
  while (compressedFile.size > maxSizeByte) {
    canvas.width *= 0.9;
    canvas.height *= 0.9;

    const ctx = canvas.getContext("2d");
    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

    compressedFile = await getFilefromDataUrl(
      canvas.toDataURL(file.type, quality),
      file.name,
      file.lastModified
    );
  }

  // console.log("compressedFile", compressedFile);

  return compressedFile;
}

imageCompression.drawImageInCanvas = drawImageInCanvas;
imageCompression.getDataUrlFromFile = getDataUrlFromFile;
imageCompression.getFilefromDataUrl = getFilefromDataUrl;
imageCompression.loadImage = loadImage;

export default imageCompression;
