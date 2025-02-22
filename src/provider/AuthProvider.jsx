import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import auth from "../firebase/firebase.init";
import axios from "axios";
import { toast } from "react-toastify";

export const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [packagePrice, setPackagePrice] = useState(0);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        if (currentUser?.email) {
          const user = { email: currentUser.email };

          axios
            .post(`${import.meta.env.VITE_API_URL}/auth/jwt-auth`, user, {
              withCredentials: true,
            })
            .then((response) => {})
            .catch((error) => {
              toast.success("user authenticated failed!");

              // console.log(error);
            });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    //component unmount , clean up
    return () => {
      unSubscribe();
    };
  }, []);

  const logoutUser = async () => {
    setLoading(true);
    try {
      // Send a logout request to the server
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );

      // Clear all accessible cookies on the client side
      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name =
          eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });

      toast.success("Logged out successfully!");

      // Clear authentication state
      await signOut(auth);
    } catch (error) {
      toast.error("An error occurred during logout.");
    } finally {
      setLoading(false);
    }
  };

  // const logoutUser = () => {
  //   setLoading(true);
  //   axios
  //     .post(`${link}/logout`, {}, { withCredentials: true })
  //     .then((response) => {
  //       toast.success("Logged out successfully!");
  //       // console.log(response);
  //     })
  //     .catch((error) => {
  //       toast.error("An error occurred during logout.");
  //       // console.log(error);
  //     });
  //   return signOut(auth);
  // };

  const googleSignIn = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const updateUserProfile = (displayName, photoURL) => {
    return updateProfile(auth.currentUser, { displayName, photoURL });
  };

  const authInfo = {
    user,
    loading,
    filteredMovies,
    setFilteredMovies,
    createUser,
    loginUser,
    logoutUser,
    googleSignIn,
    updateUserProfile,
    packagePrice,
    setPackagePrice,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
}

export default AuthProvider;
