import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import {
  Container,
  Typography,
  List,
  Card,
  Paper,
  Grid,
  Box,
  Stack,
  Button,
  IconButton,
} from '@mui/material';
import { PiTrash } from 'react-icons/pi';
import { PiHeartStraightFill } from "react-icons/pi";
import { PiHeartBreakThin } from "react-icons/pi";
import { PiNotePencilFill } from "react-icons/pi";
import { user } from '../../../../types/models.ts';

interface CommentProps {
  user: user
  getAllComments: Function
  currentComment: any
  setEditableComment: Function
  setCommentEditMode: Function
  commentEditMode: boolean


}


const Comment: React.FC<CommentProps> = ({user, getAllComments, currentComment, setEditableComment, commentEditMode, setCommentEditMode}) => {
  const { body, postName, id } = currentComment;

  const [hasLiked, setHasLiked] = useState(false);
  const [currentLikes,setCurrentLikes] = useState(currentComment.likes);
  const [isCredentialed, setIsCredentialed] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  const handleVoteDeleteClick = () => {
    const { id: userId } = user;
    const { id: commentId } = currentComment;
    axios.delete(`api/vote/${userId}/${commentId}/comment`)
    .then(() => {
      const ballot = {
        data: {
          direction: "down",
        },
      }
      axios.patch(`api/comments/likes/${currentComment.id}`, ballot);
    })
    .then(() => {
      setHasLiked(false);
      getAllComments();
    }).catch((err) => console.error('unable to delete', err))

  }


useEffect(() => {
  if (isCredentialed && !commentEditMode) {
    setCanEdit(false);
  } else {
    setCanEdit(true);
  }
});



  useEffect(() => {
  commentCredentialCheck();
  checkVoteStatus();
  getAllComments();
}, []);

const userId = user.id


const commentCredentialCheck = () => {
  axios.get(`/api/comments/${currentComment.id}/${user.id}`).then(({data}) => {
    if (data) {
      setIsCredentialed(true);
    } else {
      setIsCredentialed(false);
    }
  }).catch((err) => console.error('unable to check credentials', err));
}


  const deleteComment = () => {
    console.log(currentComment, user)
    axios.delete(`/api/comments/${id}/${userId}`).then(() => {
      getAllComments();
    }).catch((err) => console.error('unable to delete', err))
  }

  const checkVoteStatus = async () => {
    try {

      const ballotChecker = await axios.get(`/api/vote/${userId}/${currentComment.id}/comment`)

        if (ballotChecker.data !== "no match") {
          setHasLiked(true);
         } else {
           setHasLiked(false);
         }
     } catch (err) {
       console.error('failed to check votes', err)
     }
     }

     const handleEditClick = () => {
        setEditableComment(currentComment);
        setCommentEditMode(true);
    }


  const handleVoteClick = () => {
    const { id } = user;
    const userId = id;
    const { id: commentId } = currentComment;
    const vote = {
      data:
      {
        userId: id,
        commentId,
        polarity: 1,
      }
    }
    axios.post(`api/vote/${userId}/${commentId}/comment`, vote)
    .then(() => {
      const ballot = {
        data: {
          direction: "up",
        },
      }
      axios.patch(`api/comments/likes/${currentComment.id}`, ballot);
    })
    .then(() => {
      setHasLiked(true);
      getAllComments();
    })
    .catch((err) => console.error('failed to place vote', err))
  }




  return (
    // MAKE SURE THE WRONG PEOPLE DON'T SEE THE EDIT BUTTON!!
    <Box sx={{
      position: 'relative',
      border: "4px solid black",
      borderRadius: 4,
      textAlign: "center",
      p: 4,
      mb: "8px"
      }}
      >
        <Typography>{body}</Typography>
        <Typography>By: {postName}</Typography>
              <Typography>On {dayjs(currentComment.createdAt).format('MMMM D, YYYY')} at {dayjs(currentComment.createdAt).format('hh:mm a')}</Typography>
        
        <Stack sx={{ borderRadius: 4, justifyContent: "center"}} display="flex" alignItems="flex-start" direction="row" gap={1}>
        {hasLiked ? (
          <Button title="Remove like" sx={{
            borderWidth: 4,
            color: '#bbf451',
            marginRight: "4px",
            backgroundColor: "black"
          }}
          size="medium"
          onClick={handleVoteDeleteClick}
          >
            <span style={{ color: '#bbf451' }}>{currentComment.likes}</span><PiHeartBreakThin />
            </Button>
        ) : (
          <Button title="Like comment" sx={{
            borderWidth: 4,
            color: 'black',
            marginRight: "4px"
          }}
          size="medium"
          onClick={handleVoteClick}
          >
            <span style={{ color: 'black' }}>{currentComment.likes}</span><PiHeartStraightFill />
            </Button>

)}
       {canEdit ? (
         null
        ) : (
          <Button
          title="Edit this comment"
          sx={{ borderWidth: 4, color: 'black' }}
          onClick={handleEditClick}
          >
            < PiNotePencilFill />
            </Button>
        )}
        {isCredentialed ? (
          <IconButton title="Delete comment" sx={{
            borderWidth: 4,
            color: 'black',
            p: '6px',
            position: 'absolute',
            bottom: 8,
            right: 8,
          }}
          size="medium"
          onClick={deleteComment}
          >
            <PiTrash style={{ padding: "5px 5px" }}/>
            </IconButton>
        ) : (
          null
        )}
        </Stack>

    </Box>
  )
}

export default Comment;