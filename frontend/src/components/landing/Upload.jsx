import React, { useState } from "react";
import { format } from "date-fns";
import FileInput from "./Input";
import UploadButton from "./UploadButton";
import Popup from "../Popup";

const UploadForm = () => {
  const [fileNames, setFileNames] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // State for popup
  const [popup, setPopup] = useState({
    isOpen: false,
    message: "",
    type: "info",
  });

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setFileNames(Array.from(files).map((file) => file.name));
      setSelectedFiles(Array.from(files));
    } else {
      setFileNames([]);
      setSelectedFiles([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    // Check if userId exists
    if (!userId) {
      setPopup({
        isOpen: true,
        message: "Username not found. Please log in again.",
        type: "error",
      });
      return;
    }

    // Check if any files are selected
    if (selectedFiles.length === 0) {
      setPopup({
        isOpen: true,
        message: "Please choose at least one file to upload.",
        type: "warning",
      });
      return;
    }

    // File size check (1GB limit)
    for (let file of selectedFiles) {
      if (file.size > 1 * 1024 * 1024 * 1024) {
        // 1GB
        setPopup({
          isOpen: true,
          message: `File ${file.name} exceeds the 1GB limit.`,
          type: "error",
        });
        return;
      }
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("foto", file);
    });
    formData.append("userId", userId);

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://chronocam-web-backend.vercel.app/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
          body: formData, // Send formData with files and userId
        }
      );

      const data = await response.json();

      setPopup({
        isOpen: true,
        message: data.message,
        type: "success",
      });
    } catch (error) {
      setPopup({
        isOpen: true,
        message: "An error occurred during the upload.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form
        className="bg-white shadow rounded-lg p-8 mb-8"
        onSubmit={handleSubmit}
      >
        <FileInput fileNames={fileNames} handleFileChange={handleFileChange} />
        <UploadButton isLoading={isLoading} />
      </form>

      <Popup
        isOpen={popup.isOpen}
        message={popup.message}
        type={popup.type}
        onClose={() => setPopup({ ...popup, isOpen: false })}
      />
    </>
  );
};

export default UploadForm;
