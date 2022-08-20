import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    isLoggedIn: false,
    email: null,
    userId: null,
    name: null,
    phone: null,
    refererId: null,
    userRole: 0,
    isActive: 0,
    profileStatus: 0,
    isProfileCompleted: 0,
    profilePhoto: null,
    resume: null,
    experience: null,
    exp: null,
    expoPushToken: null
}

const authSlice = createSlice({
    name: 'userAuth',
    initialState,
    reducers: {
        setLogin: (state, action) => {
            state.email = action.payload.email;
            state.isLoggedIn = action.payload.isLoggedIn;
            state.userId = action.payload.userId;
            state.phone = action.payload.phone;
            state.name = action.payload.name;
            state.refererId = action.payload.refererId;
            state.userRole = action.payload.userRole;
            state.isActive = action.payload.isActive;
            state.profileStatus = action.payload.profileStatus;
            state.isProfileCompleted = action.payload.isProfileCompleted;
            state.profilePhoto = action.payload.profilePhoto;
            state.resume = action.payload.resume;
            state.experience = action.payload.experience;
            state.exp = action.payload.exp;
            state.expoPushToken = action.payload.expoPushToken;
        },
        setLogout: (state) => {
            state.email = null;
            state.isLoggedIn = false;
            state.userId = null;
            state.phone = null;
            state.name = null;
            state.refererId = null;
            state.userRole = 0;
            state.isActive = 0;
            state.profileStatus = 0;
            state.isProfileCompleted = 0;
            state.profilePhoto = null;
            state.resume = null;
            state.experience = null;
            state.exp = null;
            state.expoPushToken = null;
        },
        completedProfile: (state, action) => {
            state.isProfileCompleted = action.payload.isProfileCompleted;
        },
        setIsActive: (state, action) => {
            state.isActive = action.payload.isActive;
        },
        setExpoPushToken: (state, action) => {
            state.expoPushToken = action.payload.expoPushToken;
        }
    }
});


export const { setLogin, setLogout, completedProfile, setIsActive, setExpoPushToken } = authSlice.actions;

export const selectIsLoggedIn = (state) => state.userAuth.isLoggedIn;
export const selectEmail = (state) => state.userAuth.email;
export const selectUserId = (state) => state.userAuth.userId;
export const selectName = (state) => state.userAuth.name;
export const selectPhone = (state) => state.userAuth.phone;
export const selectRefererId = (state) => state.userAuth.refererId;
export const selectUserRole = (state) => state.userAuth.userRole;
export const selectIsActive = (state) => state.userAuth.isActive;
export const selectProfileStatus = (state) => state.userAuth.profileStatus;
export const selectIsProfileCompleted = (state) => state.userAuth.isProfileCompleted;
export const selectProfilePhoto = (state) => state.userAuth.profilePhoto;
export const selectExpoPushToken = (state) => state.userAuth.expoPushToken;

export default authSlice.reducer;