import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Modal,
  TextInput,
  Button,
  Radio,
  Label,
  FileInput,
  Alert,
} from "flowbite-react";
import { HiOutlineTrash } from "react-icons/hi";
import Webcam from "react-webcam";
import { useSelector } from "react-redux";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import { offices, categories } from "../reusable/constant.js";
import { format, parseISO } from "date-fns";

const ItemModal = ({ isOpen, onClose, onSave, itemToEdit }) => {
  const [files, setFiles] = useState([]);
  const [webcamImage, setWebcamImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    item: "",
    dateFound: "",
    location: "",
    description: "",
    imageUrls: [],
    category: "Other",
    status: "Available",
    claimantName: "",
    claimedDate: "",
    department: "SSO",
    userRef: currentUser?.id,
    foundByName: "",
    staffInvolved: "",
  });
  const webcamRef = useRef(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (itemToEdit) {
        setFormData({
          item: itemToEdit.item || "",
          dateFound: itemToEdit.dateFound
            ? format(parseISO(itemToEdit.dateFound), "yyyy-MM-dd'T'HH:mm")
            : "",
          location: itemToEdit.location || "",
          description: itemToEdit.description || "",
          imageUrls: itemToEdit.imageUrls || [],
          category: itemToEdit.category || "Other",
          status: itemToEdit.status || "Available",
          claimantName: itemToEdit.claimantName || "",
          claimedDate: itemToEdit.claimedDate || "",
          department: itemToEdit.department || "SSO",
          userRef: itemToEdit.userRef || currentUser?.id,
          foundByName: itemToEdit.foundByName || "",
          staffInvolved: itemToEdit.staffInvolved || "",
        });
      } else {
        resetForm();
      }
    }
  }, [isOpen, itemToEdit, currentUser]);

  const resetForm = () => {
    setFormData({
      item: "",
      dateFound: "",
      location: "",
      description: "",
      imageUrls: [],
      category: "Other",
      status: "Available",
      claimantName: "",
      claimedDate: "",
      department: "SSO",
      userRef: currentUser?.id,
      foundByName: "",
      staffInvolved: "",
    });
    setFiles([]);
    setWebcamImage(null);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const captureWebcamImage = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setWebcamImage(imageSrc);
  }, [webcamRef, setWebcamImage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRadioChange = (e) => {
    setFormData((prevData) => ({ ...prevData, department: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFormData = {
      ...formData,
      updatedAt: new Date().toISOString(),
    };

    try {
      await onSave(updatedFormData, itemToEdit?.id);
      setSuccessMessage(
        itemToEdit ? "Item updated successfully!" : "Item saved successfully!"
      );
      resetForm();
      onClose();
    } catch (error) {
      setErrorMessage("Failed to save item. Please try again.");
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleImageSubmit = async () => {
    if (files.length > 0 && files.length + formData.imageUrls.length <= 5) {
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      try {
        const urls = await Promise.all(promises);
        setFormData((prev) => ({
          ...prev,
          imageUrls: prev.imageUrls.concat(urls),
        }));
        setImageUploadError(false);
      } catch (err) {
        setImageUploadError(
          "Image upload failed: Each image must be less than 2MB."
        );
      }
    } else {
      setImageUploadError("You can only upload up to 5 images per item.");
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Upload error:", error.message);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              resolve(downloadURL);
            })
            .catch((error) => {
              console.error("Failed to get download URL:", error.message);
              reject(error);
            });
        }
      );
    });
  };

  const uploadWebcamImage = async () => {
    if (webcamImage && formData.imageUrls.length < 5) {
      const blob = await fetch(webcamImage).then((res) => res.blob());
      const file = new File([blob], "webcam.jpg", { type: "image/jpeg" });
      try {
        const url = await storeImage(file);
        setFormData((prev) => ({
          ...prev,
          imageUrls: [...prev.imageUrls, url],
        }));
        setWebcamImage(null);
        setImageUploadError(false);
      } catch (err) {
        setImageUploadError("Webcam image upload failed.");
      }
    } else {
      setImageUploadError("You can only upload up to 5 images per item.");
    }
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  return (
    <Modal show={isOpen} onClose={onClose} size="2xl">
      <Modal.Header>{itemToEdit ? "Edit Item" : "Add New Item"}</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="item"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Item Name
              </label>
              <input
                type="text"
                name="item"
                id="item"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                placeholder="Item Name"
                value={formData.item}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="foundByName"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Found By
              </label>
              <input
                type="text"
                name="foundByName"
                id="foundByName"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                placeholder="Found By"
                value={formData.foundByName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="staffInvolved"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Staff Involved
              </label>
              <input
                type="text"
                name="staffInvolved"
                id="staffInvolved"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                placeholder="Staff Involved"
                value={formData.staffInvolved}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="dateFound"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Date Found
              </label>
              <input
                type="datetime-local"
                name="dateFound"
                id="dateFound"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                value={formData.dateFound}
                onChange={handleChange}
                required
                disabled={!!itemToEdit}
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="location"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Location
              </label>
              <input
                type="text"
                name="location"
                id="location"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="category"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Category
              </label>
              <select
                name="category"
                id="category"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Description
              </label>
              <textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={handleChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                placeholder="Description"
                rows={4}
                required
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="department"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Office Stored
              </label>
              {itemToEdit ? (
                <TextInput
                  name="department"
                  id="department"
                  value={formData.department}
                  disabled
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                />
              ) : (
                <div className="flex flex-col">
                  {offices.map((office) => (
                    <div key={office} className="flex items-center mb-2">
                      <Radio
                        id={office}
                        name="department"
                        value={office}
                        checked={formData.department === office}
                        onChange={handleRadioChange}
                        className="mr-2"
                      />
                      <Label htmlFor={office}>{office}</Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="col-span-6">
              <label
                htmlFor="imageUrls"
                className="block mb-2 text-sm font-medium text.text-gray-900 dark:text-white"
              >
                Image URLs
              </label>
              <FileInput
                type="file"
                id="images"
                accept="image/*"
                multiple
                onChange={(e) => setFiles(Array.from(e.target.files))}
                disabled={formData.imageUrls.length >= 5}
              />
              <Button
                type="button"
                gradientDuoTone="pinkToOrange"
                onClick={handleImageSubmit}
                disabled={files.length === 0}
                className="mt-2"
              >
                Upload Images
              </Button>
              {imageUploadError && (
                <Alert color="failure" className="mt-2">
                  {imageUploadError}
                </Alert>
              )}
              {formData.imageUrls.length >= 5 && (
                <Alert color="warning" className="mt-2">
                  Number of images is already at the maximum.
                </Alert>
              )}

              {formData.imageUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {formData.imageUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Item ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white"
                      >
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <Button
                type="button"
                gradientDuoTone="pinkToOrange"
                onClick={() => setShowWebcam((prev) => !prev)}
                className="mt-4"
              >
                {showWebcam ? "Close Webcam" : "Open Webcam"}
              </Button>
              {showWebcam && (
                <div className="mt-4">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full h-64 border-2 border-gray-300 rounded-lg"
                  />
                  <div className="mt-2 flex space-x-2">
                    <Button
                      type="button"
                      gradientDuoTone="pinkToOrange"
                      onClick={captureWebcamImage}
                    >
                      Capture Image
                    </Button>
                    {webcamImage && (
                      <Button
                        type="button"
                        gradientDuoTone="pinkToOrange"
                        onClick={uploadWebcamImage}
                      >
                        Upload Webcam Image
                      </Button>
                    )}
                  </div>
                </div>
              )}
              {webcamImage && (
                <div className="mt-4">
                  <img
                    src={webcamImage}
                    alt="Captured"
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              gradientDuoTone="pinkToOrange"
              className="w-full sm:w-auto"
            >
              {itemToEdit ? "Save Changes" : "Save Item"}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ItemModal;
