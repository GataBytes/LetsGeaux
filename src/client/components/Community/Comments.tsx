import React from 'react';
// import axios from 'axios';
import {
  Container,
  Typography,
  List,
  Card,
  Paper,
  Grid,
  Box,
  Button,

} from '@mui/material';
import Comment from './Comment.tsx'
import CommentForm from './CommentForm.tsx';
import { PiArrowBendDoubleUpLeftBold } from "react-icons/pi";
import { user } from '../../../../types/models.ts';

interface CommentsProps {
  user: user,
  commentSet: any,
  getAllComments: Function,
  endComments: Function,
  isCommenting: boolean,
  postId: string,
  editableComment: any;
  setEditableComment: Function,
  setCommentEditMode: Function,
  commentEditMode: boolean,
}

const Comments: React.FC<CommentsProps> = ({ user, commentSet, getAllComments, commentEditMode, endComments, postId, setEditableComment, setCommentEditMode }) => {
  return (
    <Container sx={{backgroundColor: "primary"}}>
      {commentSet.map((currentComment: any) => (
        <Box key={currentComment.id} sx={{ backgroundColor: 'primary' }}>
      <Comment
      currentComment={currentComment}
      user={user}
      getAllComments={getAllComments}
      setEditableComment={setEditableComment}
      setCommentEditMode={setCommentEditMode}
      commentEditMode={commentEditMode}
      />
          <Button title="Back to posts" sx={{ borderWidth: 4, color: 'black', mt: "4px", mb: "4px" }}  onClick={endComments}><PiArrowBendDoubleUpLeftBold /></Button>
      </Box>
      ))}

    </Container>


  )
}

export default Comments;