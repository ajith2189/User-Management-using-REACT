import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../../utils/axios";
import { updateUser } from "../../features/users/usersSlice";
import Navbar from "../navbar/Navbar";
import UploadImage from "./UploadImage";
import { toast } from "sonner";

export default function EditUserProfile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast.error("Please fill out all fields");
      return;
    }

    try {
      setLoading(true);
      console.log("sending profile update req by user id : ", user?._id);
      
      const res = await axiosInstance.patch(`/user/update-profile`, {
        id: user?._id,
        ...formData,
      });

      dispatch(updateUser(res.data));
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Update profile error:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar name={user?.name} imageUrl={user?.profileImage} />
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Edit Profile</h2>
          <p style={styles.subtitle}>Update your personal details</p>
        </div>

        <UploadImage />

        {error && <p style={styles.errorText}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Your email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.buttonContainer}>
            <button type="submit" style={styles.submitButton} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "50px auto",
    padding: "30px",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  header: {
    marginBottom: "30px",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#6b7280",
    margin: "0",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
  },
  input: {
    padding: "12px",
    fontSize: "16px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "20px",
  },
  submitButton: {
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "500",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  errorText: {
    color: "#ef4444",
    fontSize: "14px",
    marginBottom: "16px",
    textAlign: "center",
  },
};
