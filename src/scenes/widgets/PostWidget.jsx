import React, { useState } from "react";
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Button,
  Input,
  Typography,
  useTheme,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  videoPath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [newComment, setNewComment] = useState(""); // Store the new comment
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`http://localhost:6001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const addComment = async () => {
    const response = await fetch(`http://localhost:6001/posts/${postId}/comments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId, comment: newComment }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
    setNewComment(""); // Clear the comment input field
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {videoPath ? ( // Check if there's a video
        <video
          controls
          width="100%"
          height="auto"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
        >
          <source src={`http://localhost:6001/assets/${videoPath}`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : picturePath ? ( // If no video, check for an image
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:6001/assets/${picturePath}`}
        />
      ) : null}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <div key={`${comment.userId}-${i}`}>
              <FlexBetween>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={`http://localhost:6001/assets/${comment.userPicturePath}`}
                    alt="User"
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      margin: "8px",
                    }}
                  />
                  
                    <Typography variant="body1" sx={{ color: main }}>
                      <strong>{comment.firstName} {comment.lastName}</strong>: {comment.comment}
                    </Typography>
                    <Typography >
                      
                    </Typography>
                </div>
              </FlexBetween>
              <Divider />
            </div>
          ))}
          <Divider />
          {/* Comment input field and submit button */}
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <Button
            onClick={addComment}
            sx={{
              color: palette.background.alt,
              backgroundColor: palette.primary.main,
              borderRadius: "3rem",
              alignItems:"flex-end"
            }}
          >
            Add Comment
          </Button>
        </Box>
      )}  
    </WidgetWrapper>
  );
};

export default PostWidget;
