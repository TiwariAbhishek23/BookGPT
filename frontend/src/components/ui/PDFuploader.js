"use client";
import { useState } from "react";

export default function PDFUploader({ onUpload }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first!");

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file_uploaded", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/upload-pdf/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Upload successful!");
        onUpload(data.text);
      } else {
        setMessage("Upload failed!");
      }
    } catch (error) {
      setMessage("Error uploading file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4 bg-white shadow-lg rounded-lg">
      <div className="flex items-center space-x-2">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="p-2 border border-red-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleUpload}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {loading ? "Uploading..." : "Upload PDF"}
        </button>
      </div>

      {message && <p className="text-sm text-gray-600">{message}</p>}
    </div>
  );
}
