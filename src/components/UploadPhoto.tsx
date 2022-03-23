import { ChangeEventHandler, MouseEventHandler, useState } from "react";
import imageCompression from "../utils/imageCompression";
import contract, { Feed } from "../klaytn/KlaystagramContract";

const MAX_IMAGE_SIZE = 30000; // 30KB
const MAX_IMAGE_SIZE_MB = 0.03; // 30KB

export default function UploadPhoto() {
  const [file, setFile] = useState<File | null>();

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      compressImage(file).then((compressed) => setFile(compressed));
    } else {
      setFile(file);
    }
  };

  const compressImage = async (imageFile: File) => {
    const compressedFile = await imageCompression(
      imageFile,
      MAX_IMAGE_SIZE_MB,
      1024
    );
    return compressedFile;
  };

  const handleUploadButtonClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (file) {
      contract.uploadPhoto(file);
    }
  };

  return (
    <div>
      <label>피드 이미지</label>
      <input type={"file"} onChange={handleFileChange} />
      <button onClick={handleUploadButtonClick}>업로드</button>
    </div>
  );
}
