import { useState } from "react";

export default function PhotoUpload({ setImageUrl }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadImage = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "legant_upload"); // ✅ your preset

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/de67mol0y/image/upload", // ✅ your cloud name
      {
        method: "POST",
        body: data
      }
    );

    const result = await res.json();
    console.log(result);

    if (result.secure_url) {
      setImageUrl(result.secure_url);
    } else {
      alert("Upload failed");
      console.error(result);
    }

    setLoading(false);
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={uploadImage}>
        {loading ? "Uploading..." : "Upload Photo"}
      </button>
    </div>
  );
}
