import { createSlice } from '@reduxjs/toolkit';

const userData = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: userData?.user || null,
  token: userData?.user?.token || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccessful: (state, action) => {
  state.user = action.payload.user;
  state.token = action.payload.token; 
  localStorage.setItem("user", JSON.stringify(action.payload));
},

    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
    },
    // update profile image
    updateProfileImage: (state, action) => {
      if (state.user) {
        state.user.profileImage = action.payload;
        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData) {
          userData.user.profileImage = action.payload;
          localStorage.setItem("user", JSON.stringify(userData));
        }
      }
    },
  },
});

export default authSlice.reducer;
export const { loginSuccessful, logout, updateProfileImage } = authSlice.actions;