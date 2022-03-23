export function getDataUrlFromFile(file: File) {
  return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
  });
}

export function getFilefromDataUrl(
  dataurl: string,
  filename: string,
  lastModified = Date.now()
) {
  return new Promise<File>((resolve) => {
    const arr = dataurl.split(",");
    console.log("getFilefromDataUrl > arr", arr);
    const mime = arr[0].match(/:(.*)/)![1];
    console.log("mime", mime);
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const file: File = new File([u8arr], filename, { type: mime });
    resolve(file);
  });
}

export function loadImage(src: string | ArrayBuffer | null) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.onerror = reject;
    img.src = src?.toString() ?? "";
  });
}

export function drawImageInCanvas(
  img: HTMLImageElement,
  maxWidthOrHeight: number
) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (img.width > maxWidthOrHeight || img.height > maxWidthOrHeight) {
    if (img.width > img.height) {
      canvas.width = maxWidthOrHeight;
      canvas.height = (img.height / img.width) * maxWidthOrHeight;
    } else {
      canvas.width = (img.width / img.height) * maxWidthOrHeight;
      canvas.height = maxWidthOrHeight;
    }
  } else {
    canvas.width = img.width;
    canvas.height = img.height;
  }
  ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas;
}

export const drawImageFromBytes = (data: string) => {
  /**
   * data.slice(2)
   * Remove prefix `0x` from hexString
   */
  const hexString = data.slice(2);
  const ints: number[] =
    hexString.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) ?? [];
  const arrayBufferView = new Uint8Array(ints);
  const blob = new Blob([arrayBufferView], { type: "image/jpeg" });
  const urlCreator = window.URL || window.webkitURL;
  const imageUrl = urlCreator.createObjectURL(blob);
  return imageUrl;
};
