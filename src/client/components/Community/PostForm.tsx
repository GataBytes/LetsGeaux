import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  List,
  Card,
  Paper,
  Grid,
  Input,
  Button,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { user } from '../../../../types/models.ts';


interface PostFormProps {
  user: user,
  getAllPosts: Function
}

type FormFields = {
  body: String,
}


const PostForm: React.FC<PostFormProps>= ({ user, getAllPosts }) => {
  const [postEditMode, setPostEditMode] = useState(false);
  const form = useForm();
  const { register, handleSubmit, setValue, setError, formState: { isSubmitting, errors } } = useForm<FormFields>({
    defaultValues: {
      body: ''
    }
  })
  const submitForm: SubmitHandler<FormFields> = (data:any) => {
    const { id, username } = user;
    // console.log(user.username)
    const postBody = {

        data: {
          userId: +id,
          body: data.body,
          postName: username
        }
      }

    axios.post('/api/posts', postBody)
    .then(() => {
      getAllPosts();
    })
    .catch((err) => console.error("couldn't make post", err));
  }
  return (
    <Container>
      <Grid container spacing={3}>
        <Typography>Write a post!</Typography>
        <form onSubmit={handleSubmit(submitForm)} >
      <textarea
      rows="10"
      cols="100"
      {...register("body", {
        required: "You haven't written anything yet!",
        minLength: 1,
        message: "You haven't written anything yet!",
      })}
      name="body"
      type="textarea"
      placeholder="let geaux!"
      />
      {errors.body && <div>{errors.body.message}</div>}
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Send Post"}</Button>
        </form>
      </Grid>
    </Container>
  )
}

export default PostForm;