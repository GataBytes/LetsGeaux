import React, { useState } from 'react';
// import axios from 'axios';
import { Container, Typography, List, Card, Paper, Grid} from '@mui/material';
import Post from './Post.tsx';
import PostForm from './PostForm.tsx';
import { user } from '../../../../types/models.ts';

interface PostProps {
  user: user;
  postSet: [],
  getAllPosts: Function,
}

const Posts: React.FC<PostProps> = ({user, postSet, getAllPosts}) => {
  const [postEditMode, setPostEditMode] = useState(false);
  const [editablePost, setEditablePost] = useState(null);

  return (
    <Container sx={{ textAlign: "center" }}>
      <PostForm
      getAllPosts={getAllPosts}
      user={user}
      postEditMode={postEditMode}
      setPostEditMode={setPostEditMode}
      editablePost={editablePost}
      />
        {postSet.map((currentPost) => (
            <Post
            key={currentPost.id}
            currentPost={currentPost}
            user={user}
            getAllPosts={getAllPosts}
            setPostEditMode={setPostEditMode}
            editablePost={editablePost}
            setEditablePost={setEditablePost}
            postEditMode={postEditMode}
            />

        ))}

    </Container>
  )
}

export default Posts;