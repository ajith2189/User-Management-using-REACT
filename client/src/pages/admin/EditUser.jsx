import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../utils/axios";
import { 
  updateUser, 
  clearSelectedUser, 
  selectSelectedUser, 
  selectUserById 
} from "../../features/users/usersSlice"; // Adjust path as needed

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get data from Redux store
  const selectedUser = useSelector(selectSelectedUser);
  const userFromStore = useSelector(state => selectUserById(state, id));
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const initializeUserData = async () => {
      try {
        // Priority: selectedUser > userFromStore > API call
        let userData = null;
        
        if (selectedUser && selectedUser._id === id) {
          userData = selectedUser;
        } else if (userFromStore) {
          userData = userFromStore;
        } else {
          // Fallback to API call if user data not in store
          setLoading(true);
          const res = await axiosInstance.get(`/admin/update/${id}`);
          userData = res.data;
        }
        
        if (userData) {
          setFormData({
            name: userData.name || "",
            email: userData.email || "",
          });
          setError("");
        }
      } catch (err) {
        setError("Failed to fetch user data. Please try again.");
        console.error("Fetch user error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      initializeUserData();
    }

    // Cleanup: Clear selected user when component unmounts
    return () => {
      dispatch(clearSelectedUser());
    };
  }, [id, selectedUser, userFromStore, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      alert("Please fill out all fields");
      return;
    }

    try {
      console.log("Admin is trying to edit user with ID:", id);
      
      const res = await axiosInstance.patch(`/admin/update/${id}`, formData);
      
      console.log("User updated successfully:", res.data);
      
      // Update Redux store
      dispatch(updateUser({ 
        id: id, 
        userData: formData 
      }));
      
      alert("User updated successfully!");
      navigate("/admin/dashboard");
      
    } catch (error) {
      console.error("Update user error:", error);
      alert("Failed to update user. Please try again.");
    }
  };

  const handleCancel = () => {
    dispatch(clearSelectedUser());
    navigate("/admin/dashboard");
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>{error}</p>
          <button onClick={handleCancel} style={styles.button}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Edit User Details</h2>
        <p style={styles.subtitle}>Update user information</p>
      </div>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter user name"
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
            placeholder="Enter user email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        
        <div style={styles.buttonContainer}>
          <button type="submit" style={styles.submitButton}>
            Save Changes
          </button>
          <button 
            type="button" 
            onClick={handleCancel} 
            style={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '30px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  header: {
    marginBottom: '30px',
    textAlign: 'center',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#6b7280',
    margin: '0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  buttonContainer: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
  },
  submitButton: {
    flex: 1,
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '500',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  cancelButton: {
    flex: 1,
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '500',
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px',
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '3px solid #e5e7eb',
    borderTop: '3px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
  },
  errorContainer: {
    textAlign: 'center',
    padding: '40px',
  },
  errorText: {
    color: '#ef4444',
    fontSize: '16px',
    marginBottom: '20px',
  },
  button: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};

// Add CSS for spinner animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);