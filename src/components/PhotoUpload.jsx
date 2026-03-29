import { useState } from "react";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function PhotoUpload({ setImageUrl }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadImage = async () => {
    if (!file) return;

    setLoading(true);

    const storageRef = ref(storage, "orders/" + Date.now() + file.name);

    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    setImageUrl(url);
    setLoading(false);
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={uploadImage}>
        {loading ? "Uploading..." : "Upload Photo"}
      </button>
    </div>
  );
}
