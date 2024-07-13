// src/components/FileUpload.jsx
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { uploadFile } from "../redux/filesSlice";

const FileUpload = () => {
  const dispatch = useDispatch();
  const { files, error, status } = useSelector((state) => state.files);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const fileSizeInBytes = selectedFile.size;
    const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

    if (fileSizeInMB > 1) {
      setErrorMessage(
        "Размер файла превышает 1 мб. Пожалуйста, выберите файл с меньшим размером."
      );
      return;
    }

    if (files.length < 20 && selectedFile) {
      dispatch(uploadFile(selectedFile))
        .then(() => {
          console.log("upload success");
          setSelectedFile(null);
          setErrorMessage("");

          const fileInput = document.getElementById("fileInput");
          if (fileInput) {
            fileInput.value = "";
          }
        })
        .catch((error) => {
          console.error("upload error:", error);
        });
    } else if (files.length >= 20) {
      setErrorMessage(
        "Извините, достигнуто максимальное количество файлов (20)."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          id="fileInput"
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt"
          required
        />
        {errorMessage && <div className="error">{errorMessage}</div>}
      </div>
      <button
        type="submit"
        disabled={files.length >= 20 || status === "loading" || !selectedFile}
      >
        {status === "Loading" ? "Uploading..." : "Upload"}
      </button>
      {error && (
        <div className="error">
          <p>Не удалось загрузить файл: {error}</p>
        </div>
      )}
    </form>
  );
};

export default FileUpload;
