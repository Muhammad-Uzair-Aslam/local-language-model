import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
export type User={
    email:string|null,
    name:string|null,
    photoUrl:string|null,
    uid:string
}
export type authState={
    isLoading:boolean
    user:User| null
}
let initialState={
    isLoading: false,
    user: null,
};

// export const signUpUser = createAsyncThunk<
//   {name: string; email: string},
//   {name: string; email: string; password: string}
// >('user/signUp', async ({name, email, password}, {rejectWithValue}) => {
//   try {
//     const userCredential = await auth().createUserWithEmailAndPassword(
//       email,
//       password,
//     );
//     const user = userCredential.user;
//     await firestore().collection('users').doc(user.uid).set({
//       name,
//       email,
//       password,
//       createdAt: firestore.FieldValue.serverTimestamp(),
//     });

//     return {name, email};
//   } catch (error: any) {
//     return rejectWithValue(error.message || 'Failed to sign up');
//   }
// });

// export const signInUser = createAsyncThunk<
//   {name: string; email: string},
//   {email: string; password: string}
// >('user/signIn', async ({email, password}, {rejectWithValue}) => {
//   try {
//     const userCredential = await auth().signInWithEmailAndPassword(
//       email,
//       password,
//     );
//     const user = userCredential.user;
    
//     const userDoc = await firestore().collection('users').doc(user.uid).get();
//     const userData = userDoc.data();
//     const name = userData?.name || user.displayName || 'User';
//     return {name, email};
//   } catch (error: any) {
//     return rejectWithValue(error.message || 'Failed to sign in');
//   }
// });
const authSlice= createSlice({
    name:'authSlice',
    initialState,
    reducers:{
          setLoading: (state, action) => {
            state.isLoading = action.payload;
          },
          setUser: (state, action) => {
            state.user = action.payload;
          },
          logout: (state) => {
            state.user = null;
            state.isLoading = false;
          },
    },
})
export const {setLoading,setUser,logout}=authSlice.actions
export default authSlice.reducer