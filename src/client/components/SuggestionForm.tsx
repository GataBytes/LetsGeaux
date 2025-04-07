import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

import {
  Container,
  Box,
  Button,
  Card,
  Typography,
  FormControl,
  Grid,
  Input,
  InputLabel,
} from '@mui/material';

type FormFields = {
  title: string,
  description: string,
  time: string,
  date: Date,
  location: string,
  image: string,
  phoneNum: string,
  address: string,

}
const inputKeys: string[] = ['title', 'description', 'time', 'date', 'location', 'image', 'phoneNum', 'address',]
const SuggestionForm = ({suggestionEditMode, currentSuggestion, suggestionSet, getAllSuggestions, editableSuggestion, setSuggestionEditMode}) => {
  const [chosenTitle, setChosenTitle] = useState("");
  const [chosenDescription, setChosenDescription] = useState("");
  const [chosenTime, setChosenTime] = useState("");
  const [chosenDate, setChosenDate] = useState(null);
  const [chosenLocation, setChosenLocation] = useState("");
  const [chosenImage, setChosenImage] = useState("");
  const [chosenPhone, setChosenPhone] = useState("");
  const [chosenAddress, setChosenAddress] = useState("");


  const { register, handleSubmit, setValue, setError, formState: { errors, isSubmitting } } = useForm<FormFields>({
    defaultValues: {
      title: chosenTitle,
      description: chosenDescription,
      time: chosenTime,
      date: chosenDate,
      location: chosenLocation,
      image: chosenImage,
      phoneNum: chosenPhone,
      address: chosenAddress,
    }
  });
  useEffect(() => {
    if (suggestionEditMode === true) {
      const { name, description, time, date, location, image, phone, address } = editableSuggestion;
       setValue('title', name);
       setValue('description', description);
       setValue('time', time);
      setValue('date', date);
       setValue('location', location);
      setValue('image', image);
      setValue('phoneNum', phone);
      setValue('address', address);
    }
  }, [suggestionEditMode])
const submitForm =  () => {
  return suggestionEditMode ? postSuggestion : postSuggestion
};


  const postSuggestion: SubmitHandler<FormFields> = (formValues) => {
    const { title, description, time, date, location, image, phoneNum, address } = formValues
    const details = {

      data: {

        name: title,
        description,
        time,
        date,
        location,
        image,
        phone: phoneNum,
        address,
      }
    }
    axios.post("/api/suggestion", details).then(() => {
      getAllSuggestions();
    }).catch((err) => {
      console.error('failed to post suggestion', err);
    });
  }
  return (
    <Container>
        <Grid container spacing={4}>
          <form className="suggestion-form" onSubmit={handleSubmit(postSuggestion)}>
            {errors.title && <span className="text-red-500">{errors.title.message}</span>}
            <Input {...register("title", { required: "event must have title" })} type="text" placeholder='name'></Input>
            <Input {...register("description")} type="text" placeholder='description'></Input>
            {errors.title && <span className="text-red-500">{errors.time.message}</span>}
            <Input {...register("time", { required: "must specify time" })} type="text" placeholder='time'></Input>
            {errors.title && <span className="text-red-500">{errors.date.message}</span>}
            <Input {...register("date", { required: "must specify date" })} type="date" placeholder='date'></Input>
            <Input {...register("location")} type="text" placeholder='location'></Input>
            <Input {...register("image")} type="text" placeholder="Add url"></Input>
            <Input {...register("phoneNum")} type="text" placeholder='contact number'></Input>
            <Input {...register("address")} type="text" placeholder='address'></Input>
            <Button disabled={isSubmitting} type="submit">{isSubmitting ? "submitting" : "Submit"}</Button>
          </form>
        </Grid>
    </Container>
  )
}

export default SuggestionForm;
