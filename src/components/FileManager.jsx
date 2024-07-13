import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteFile, fetchFiles, uploadFile } from "../redux/filesSlice";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CircularProgress from "@mui/material/CircularProgress";
import "./FileManager.css";

const FileManager = () => {
  const dispatch = useDispatch();
  const { files, status, error } = useSelector((state) => state.files);
  const [loadingDelete, setLoadingDelete] = useState(null);
  const [imageUrls, setImageUrls] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loadingUpload, setLoadingUpload] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchFiles());
    }
  }, [dispatch, status]);

  useEffect(() => {
    files.forEach((file) => {
      if (isImage(file.mimeType) && !imageUrls[file.id]) {
        fetchImageBlob(file);
      }
    });
  }, [files]);

  const handleDelete = async (id) => {
    setLoadingDelete(id);
    try {
      await dispatch(deleteFile(id)).unwrap();
    } catch (error) {
      console.error("Удалить ошибку: ", error);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    const fileSizeInBytes = selectedFile.size;
    const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

    if (fileSizeInMB > 1) {
      setErrorMessage(
        "Размер файла превышает 1 МБ. Выберите файл меньшего размера."
      );
      return;
    }

    setLoadingUpload(true);
    try {
      await dispatch(uploadFile(selectedFile)).unwrap();
      setSelectedFile(null);
      setErrorMessage("");
      const fileInput = document.getElementById("fileInput");
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingUpload(false);
    }
  };

  const handleDownload = (file) => {
    const token = localStorage.getItem("token");

    fetch(file.url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const downloadUrl = URL.createObjectURL(
          new Blob([blob], { type: file.mimeType })
        );
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(downloadUrl);
      })
      .catch((error) => {
        console.error("download error: ", error);
      });
  };

  const fetchImageBlob = (file) => {
    const token = localStorage.getItem("token");

    fetch(file.url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        setImageUrls((prevUrls) => ({
          ...prevUrls,
          [file.id]: URL.createObjectURL(blob),
        }));
      })
      .catch((error) => {
        console.error("fetch error: ", error);
      });
  };

  const isImage = (mimeType) => {
    const imageMimeTypes = [
      "image/jpg",
      "image/jpeg",
      "image/webp",
      "image/png",
      "image/svg",
      "image/svg+xml",
    ];
    return imageMimeTypes.includes(mimeType);
  };

  const renderFilePreview = (file) => {
    if (isImage(file.mimeType) && imageUrls[file.id]) {
      return (
        <img
          onClick={() => handleDownload(file)}
          src={imageUrls[file.id]}
          alt={file.name}
          style={{ width: "100px", height: "100px" }}
        />
      );
    } else {
      return (
        <span onClick={() => handleDownload(file)} className="document-icon">
          📄
        </span>
      );
    }
  };

  const renderSkeletons = (count) => {
    return Array(count)
      .fill()
      .map((_, index) => (
        <li key={`skeleton-${index}`}>
          <div>
            <Skeleton width={100} height={100} />
            <p>
              <Skeleton width={100} />
            </p>
          </div>
          <button>
            <Skeleton width={50} />
          </button>
        </li>
      ));
  };

  return (
    <div>
      <form onSubmit={handleUpload}>
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
        <button type="submit" disabled={loadingUpload || !selectedFile}>
          {loadingUpload ? "Загружается..." : "Загрузить"}
        </button>
        {error && (
          <div className="error">
            <p>Не удалось выполнить операцию с файлом: {error}</p>
          </div>
        )}
      </form>
      <p>Загружены файлы: {files ? files.length : 0}/20</p>

      <ul>
        {status === "loading" && renderSkeletons(files.length || 1)}
        {status === "succeeded" &&
          (files.length > 0 ? (
            files.map((file) => (
              <li key={file.id} className="file-item">
                {loadingDelete === file.id && (
                  <div className="overlay">
                    <CircularProgress size={40} />
                  </div>
                )}
                {renderFilePreview(file)}
                <p>
                  {file.name}
                  {"." + file.mimeType}
                </p>
                <button onClick={() => handleDelete(file.id)}>Удалить</button>
              </li>
            ))
          ) : (
            <p>Ни один файл еще не загружен.</p>
          ))}
      </ul>
    </div>
  );
};

export default FileManager;
