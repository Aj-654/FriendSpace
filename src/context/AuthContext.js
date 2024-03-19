import React, { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import ChatPage from "scenes/chat/components/chatpage";
import HomePage from "scenes/homePage";
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch additional user data from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName, // Make sure this is set when creating a user
          photoURL: user.photoURL,
          ...userData, // Include additional user data from Firestore
        });
      } else {
        // User is logged out
        setCurrentUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      
      {children}
      
    </AuthContext.Provider>
  );
};
