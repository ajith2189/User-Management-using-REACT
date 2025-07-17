import { createSlice } from "@reduxjs/toolkit";

// const userData = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: null,
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccessful: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      console.log("the state is",state.user);
      
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
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
    updateAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
  },
});

export default authSlice.reducer;
export const { loginSuccessful, logout, updateProfileImage,updateAccessToken } =
  authSlice.actions;
