import React, { useEffect } from 'react';
import axios from 'axios';
import { user } from '../../../../types/models.ts';
import {
  Container,
  Typography,
  List,
  Card,
  Paper,
  Grid,
  TextField,
  Button,
  IconButton,
  Input,
} from '@mui/material';
import { PiPencilLineBold } from "react-icons/pi";
import { PiNotePencilFill } from "react-icons/pi";
import { PiXFill } from "react-icons/pi";
import SendRounded from '@mui/icons-material/SendRounded';
import { useForm } from 'react-hook-form';

type FormFields = {
  body: String,
}

interface CommentFormProps {
  user: user;
  postId: string;
  getAllComments: Function;
  setCommentEditMode: Function;
  editableComment: any;
  commentEditMode: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({ user, postId, commentEditMode, setCommentEditMode, editableComment, getAllComments }) => {
  const form = useForm();
  const { register, handleSubmit, reset, setValue, setError, formState: { isSubmitting, errors } } = useForm<FormFields>({
    defaultValues: {
      body: '',
    }
  })

  useEffect(() => {
    if (commentEditMode) {
      setValue("body", editableComment.body);
    }
  }, [editableComment]);

  const abortEdit = () => {
    setCommentEditMode(false);
    reset();
  }
  const submitComment: SubmitHandler<FormFields> = (data: any) => {
    if (!commentEditMode) {

      const commentBody = {
        data: {
          userId: +user.id,
          postId: +postId,
          body: data.body,
          postName: user.username

        }
      }

      axios.post(`/api/comments`, commentBody)
        .then(() => {
          reset();
          getAllComments();
        })
        .catch((err) => console.error('unable to post comment', err))
    } else {
      const { id } = editableComment;
      const commsFix = {
        body: data.body,
      }
      axios.patch(`api/comments/${id}`, commsFix)
        .then(() => {
          reset();
          getAllComments();
          setCommentEditMode(false);
        })
        .catch((err) => console.error('could not change comment', err));
    }
  }
  return (
    <Container>
      <Grid sx={{ position: "relative" }}container spacing={3}>
        
        {/* <Typography>Leave a comment</Typography> */}
        <form onSubmit={handleSubmit(submitComment)}>
          <TextField
            cols="50"
            rows="5"
            {...register("body")}
            sx={{
              height: '50',
              width: '50',
              padding: '15px',
              textAlign: "center",
              '& .MuiOutlinedInput-root': {
          borderRadius: 4,
        }
            }}
            name="body"
            type="textarea"
            placeholder="Write a comment"
          />
          {commentEditMode ? (
            <Button title="Cancel Edit" sx={{ borderWidth: 4, color: 'black' }} onClick={abortEdit}><PiXFill/></Button>

          ) : (
            null
          )}
          {commentEditMode ? (
            <Button title="amend comment" sx={{
              borderWidth: 4,
              color: 'black',
              position: "absolute",
              bottom: 8,
              right: 8,
            }}  type="submit" disabled={isSubmitting}>{isSubmitting ? "changing.." : <PiNotePencilFill style={{ color: "black" }}/>}</Button>
          ) : (
            <IconButton title="post comment" sx={{
              borderWidth: 4,
              color: 'black',
              position: "absolute",
              bottom: 8,
              right: 8,
            }} type="submit" disabled={isSubmitting}>{isSubmitting ? "Sending.." : <SendRounded sx={{color: "#bbf451"}}/>}</IconButton>
          )
          }
        </form>
      </Grid>
    </Container>
  )
}

export default CommentForm;