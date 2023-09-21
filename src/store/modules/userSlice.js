import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: { docs: [] },
  isUserLoaded: false,
};

export const UserSlice = createSlice({
  name: "Users",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users.docs = action.payload;
      state.isUserLoaded = true;
    },
    addUser: (state, action) => {
      state.users.docs = [...state.users.docs, action.payload];
    },
    updateUser: (state, action) => {
      for (const i in state.users.docs) {
        if (state.users.docs[i]._id === action.payload._id) {
          state.users.docs[i] = action.payload;
        }
      }
    },
    removeUser: (state, action) => {
      state.users.docs = state.users.docs.filter(
        (user) => user._id !== action.payload
      );
    },
  },
});

export const { setUsers, addUser, removeUser, updateUser } = UserSlice.actions;

export const selectUsers = (state) => {
  console.log("State.users", state.user.users);
  return state.user.users.docs;
};
export const isUserLoaded = (state) => state.Users.isUserLoaded;

export default UserSlice.reducer;
