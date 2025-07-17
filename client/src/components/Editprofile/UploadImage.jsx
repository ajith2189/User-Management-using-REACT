import React, { useRef, useState } from "react";
import { FiCamera } from "react-icons/fi";
import noProfile from "../../assets/noprofile.png";
import { useSelector, useDispatch } from "react-redux";
import { updateProfileImage } from "../../features/auth/authSlice"; // Import the action
import axiosInstance from "../../utils/axios";
import { toast } from "sonner";

export default function UploadImage() {
  const [imageUrl, setImageUrl] = useState(null);
  const fileInputRef = useRef();
  
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const handleChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!user || !user.email) {
      toast.error("User not found. Please login again.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "userManagement");

    try {
      console.log("Uploading image to Cloudinary...");
      
      // Upload to Cloudinary
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dlgrbt3t2/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadImage = await res.json();
      const imageUrl = uploadImage.secure_url;

      console.log("Image uploaded successfully:", imageUrl);
      setImageUrl(imageUrl);

      // Save image URL in DB
      const response = await axiosInstance.post("/user/upload-image", {
        email: user.email,
        profileImage: imageUrl,
      });

      console.log("image is saving :", response.data);

      // Update Redux store with new image URL
      dispatch(updateProfileImage(imageUrl));

      toast.success("Profile image updated!");
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Image upload failed. Try again.");
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>

      <div
        className="relative group w-24 h-24 cursor-pointer"
        onClick={handleClick}
      >
        {/* Profile image - shows local imageUrl first, then user.profileImage, then default */}
        <img
          src={imageUrl || user?.profileImage || noProfile}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
        />

        {/* Hover overlay text */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Edit Profile
        </div>

        {/* Camera icon bottom-right */}
        <div className="absolute bottom-0 right-0 bg-white border border-gray-300 rounded-full p-1 shadow-sm">
          <FiCamera className="text-gray-600 text-sm" />
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleChange}
          className="hidden"
        />
      </div>
    </div>
  );
}