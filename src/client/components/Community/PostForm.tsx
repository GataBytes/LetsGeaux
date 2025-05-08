import React, { useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  List,
  Card,
  Box,
  Grid,
  TextField,
  IconButton,
  Button,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { PiPencilLineBold } from "react-icons/pi";
import { PiNotePencilFill } from "react-icons/pi";
import { PiXFill } from "react-icons/pi";
import SendRounded from '@mui/icons-material/SendRounded';
import { user } from '../../../../types/models.ts';


interface PostFormProps {
  user: user,
  getAllPosts: Function
  editablePost: any
  postEditMode: boolean
  setPostEditMode: Function
  postCredentialCheck: Function
}

type FormFields = {
  body: String,
  title: String,
}


const PostForm: React.FC<PostFormProps> = ({ user, getAllPosts, editablePost, postEditMode, setPostEditMode }) => {
  const form = useForm();
  const { register, handleSubmit, reset, setValue, setError, formState: { isSubmitting, errors } } = useForm<FormFields>({
    defaultValues: {
      body: ''
    }
  })

  useEffect(() => {
    if (postEditMode) {
      setValue("title", editablePost.title)
      setValue("body", editablePost.body)
    }
  }, [editablePost]);

  const abortEdit = () => {
    setPostEditMode(false);
    reset();
  }


  const submitForm: SubmitHandler<FormFields> = (data: any) => {
    if (!postEditMode) {
      const { id, username } = user;
      const postBody = {
        data: {
          userId: +id,
          body: data.body,
          postName: username,
          title: data.title,
        }
      }
      axios.post('/api/posts', postBody)
        .then(() => {
          reset();
          getAllPosts();
        })
        .catch((err) => console.error("couldn't make post", err));
    } else {
      const { id } = editablePost;
      const patchwork = {

        body: data.body,
        title: data.title,
      }
      axios.patch(`/api/posts/${id}`, patchwork)
        .then(() => {
          reset();
          getAllPosts();
          setPostEditMode(false);
        })
        .catch((err) => {
          console.error('could not patch form', err);
        })
    }
  }



  return (
    <Container sx={{ textAlign: "center" }}>
      <Grid sx={{ position: "relative", textAlign: "center" }} container spacing={3}>
        <form onSubmit={handleSubmit(submitForm)} >

          <TextField
            sx={{
              mb: '10px',
              mt: '5px',
              height: '30%',
              width: '75%',
              padding: '1',
              textAlign: "center",
              position: "relative",
              '& .MuiOutlinedInput-root': {
                borderRadius: 4,
              }
            }}
            variant="outlined"{...register("title")}
            size='small'
            name="title"
            type="text"
            placeholder="Title Post here"
          >
          </TextField>
          <TextField
            sx={{
              mb: '5px',
              mt: '10px',
              height: '30%',
              width: '100%',
              padding: '1',
              textAlign: "center",
              position: "relative",
              '& .MuiOutlinedInput-root': {
                borderRadius: 4,
              }
            }}
            rows="4"
          cols="100"
          {...register("body", {
            required: "You haven't written anything yet!",
            minLength: 1,
            message: "You haven't written anything yet!",
          })}
          name="body"
          placeholder="Write a post"
      />
          {errors.body && <div>{errors.body.message}</div>}
          {postEditMode ? (
            <Button title="Cancel Edit" sx={{
              borderWidth: 4,
              color: 'black',
              p: '4px'
            }}
              onClick={abortEdit}><PiXFill /></Button>
          ) : (
            null
          )}
          {postEditMode ? (
            <IconButton title="Amend post" sx={{
              borderWidth: 4,
              color: 'black',
              position: "absolute",
              bottom: 8,
              right: 4,
              p: '4px'
            }}
              type="submit" disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : <SendRounded sx={{
                color: "#bbf451",

              }} />}
            </IconButton>

          ) : (
            <IconButton title="Send post" sx={{
              borderWidth: 4,
              color: 'black',
              position: "absolute",
              bottom: 8,
              right: 4,
              p: '4px'
            }}
              type="submit" disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : <SendRounded sx={{
                color: "#bbf451",
              }} />}
            </IconButton>
          )}
        </form>
      </Grid>
    </Container>
  )
}

export default PostForm;