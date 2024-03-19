import { useEffect, useState } from "react";
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebase.js";

const Friend = ({ friendId, name, subtitle, userPicturePath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [firebaseUser, setFirebaseUser] = useState(null);
  const { _id: mongoUserId, friends: mongoUserFriends } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isFriend = mongoUserFriends.find((friend) => friend._id === friendId);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const patchFriend = async () => {
    try {
      // Update friends list in MongoDB
      const response = await fetch(`http://localhost:6001/users/${mongoUserId}/${friendId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      dispatch(setFriends({ friends: data }));

      // Update friends list in Firebase (if Firebase user is available)
      if (firebaseUser) {
        const q = query(
          collection(db, "users"),
          where("mongoid", "==", mongoUserId)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Assuming there is only one user that satisfies the query
          const userDocRef = querySnapshot.docs[0].ref;

          if (isFriend) {
            // Remove friend from the friends list in Firebase
            await updateDoc(userDocRef, {
              friends: arrayRemove(friendId),
            });
          } else {
            // Add friend to the friends list in Firebase
            await updateDoc(userDocRef, {
              friends: arrayUnion(friendId),
            });
          }
        }
      }
    } catch (error) {
      console.error('Error updating friends:', error);
      // Handle the error appropriately, e.g., display an error message to the user
    }
  };

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            navigate(0);
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      <IconButton
        onClick={() => patchFriend()}
        sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
      >
        {isFriend ? (
          <PersonRemoveOutlined sx={{ color: primaryDark }} />
        ) : (
          <PersonAddOutlined sx={{ color: primaryDark }} />
        )}
      </IconButton>
    </FlexBetween>
  );
};

export default Friend;
