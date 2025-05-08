
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useForm, Controller } from 'react-hook-form';
// import { error } from 'console';
import { user } from '../../../types/models.ts';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

type currentSuggestion = {
  title: string
  location: string
  address: string
  description: string
  image: string
  link: string
  /*latitude, longitude,*/
}

type FormFields = {
  itinerary: any;
  title: string;
  description: string;
  time: Dayjs;
  date: Dayjs | null;
  location: string;
  image: string;
  phone: string;
  address: string;
};

type SuggestionToActivityFormProps = {
  user: user
  currentSuggestion: currentSuggestion
  handleCloseClick: Function
  displaySuccessSnack: Function
};

const SuggestionToActivityForm: React.FC<SuggestionToActivityFormProps> = ({ currentSuggestion, user, handleCloseClick, displaySuccessSnack }) => {

  const [itineraryList, setItineraryList] = useState([]);
  const [hasItineraries, setHasItineraries] = useState(false);
  const [chosenItinerary, setChosenItinerary] = useState({});
  const [isWarning, setIsWarning] = useState(false);


  const {
    title,
    location,
    address,
    description,
    image,
    link,
    /*latitude, longitude,*/
  } = currentSuggestion;
  const { register, handleSubmit, setValue, control, formState: { errors, isSubmitting } } = useForm<FormFields>({
    defaultValues: {
      itinerary: "",
      title: "",
      description,
      time: null,
      date: null,
      location: title,
      image,
      phone: link,
      address,
    },
  });

  // This useEffect is meant to set values to the legal itinerary array
  // If there are no legal itineraries, we must not let them fill out the form.
  useEffect(() => {
    getItineraries();
  }, []);

  // useEffect(() => {
  //   if (currentSuggestion) {
  //     resetField({
  //       date: currentSuggestion.date ? dayjs(currentSuggestion.date) :
  //     null })
  //   }
  // }, [currentSuggestion, resetField]);


  //  Use setState at the end of an axios request to get the list if Itinerary Id's that we'll use in a drop-down
  // for the user to choose from when creating this activity

  const getItineraries = () => {
    const { id } = user;
    axios.get(`api/suggestions/check/${id}`).then(({ data }) => {
      console.log(data);
      if (data.length) {
        setHasItineraries(true);
        setItineraryList(data);
      } else {
        setHasItineraries(false);
      }
    })
      .catch((err) => console.error('there was an issue with the itineraries', err));
  }// Now, I just need to get this form to render somewhere so I can see if this function works...


  const postActivity: SubmitHandler<FormFields> = async (formValues: FormFields) => {

    const { itinerary, title, description, time, date, location, image, phone, address } = formValues;
    const { id } = user;
    // all of these qualities are pulled directly from req.body in the activity request handle

    const parsedDate = dayjs(date, 'MMMM D, YYYY')
    console.log('an attempt to parse the date:', parsedDate)
    const activityData = {
      itineraryId: itinerary.id,
      name: title,
      description,
      time,
      date: parsedDate.toISOString(),
      location,
      image,
      phone,
      address,
      userId: +id,
    };


    // console.log('try to stringify:', dayjs(activityData.date).format('MMMM D, YYYY'))
    activityData.date = dayjs(activityData.date).format('MMMM D, YYYY')
    console.log('goin in', activityData)
    console.log('is this the location?', location)
    try {
      // suggAct = suggestion-activity
      const suggAct = await axios.post('/api/activity', activityData);
      // console.log('Activity posted successfully:', suggAct); // Log successful response
      handleCloseClick();
      displaySuccessSnack('success');
    } catch (error) {
      console.error('Failed to post activity:', error); // Log any errors
    }
  };
  const touchItinerary = (itinerary: object) => {
    setChosenItinerary(itinerary);
  }


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>

      <Container sx={{ backgroundColor: "#A78BFA" }}>
        <Grid container spacing={4}>
          <form className="activity-form" onSubmit={handleSubmit(postActivity)}>
            {/* itinerary Id */}
            <FormControl
              fullWidth
              // name="itinerary"
              //  {...register('itinerary', { required: 'Must select itinerary' })}
              label="Itinerary"
              defaultValue=""
            //  variant="outlined"
            >
              <InputLabel id="itinerary-dropdown-label">Select an itinerary</InputLabel>
              <Controller
                name="itinerary"
                rules={{ required: 'Must select itinerary' }}
                // variant="outlined"
                control={control}
                defaultValue={''}
                render={(field) => (
                  <Select
                    // onChange={onChange}
                    labelId="itinerary-label"
                    {...field}
                    // name="itinerary"
                    {...register('itinerary', { required: 'Must select itinerary' })}
                    defaultValue=""
                  // control={control}
                  // name={name}
                  //  error={!!errors.itinerary}
                  //  placeholder='Select an itinerary'
                  //  helperText={errors.itinerary?.message}
                  // {/**Maybe the register stuff goes in here? */}
                  >
                    {itineraryList.map((itinerary: any) => (
                      <MenuItem
                        value={itinerary}
                        key={itinerary.fsq_id}
                        onClick={() => touchItinerary(itinerary)}
                      >
                        {/* <Typography>{itinerary.name}: </Typography> */}
                        <Typography>
                          <b>
                            {itinerary.name}
                          </b>
                          : {dayjs(itinerary.begin).format('MMMM D, YYYY')} - {dayjs(itinerary.end).format('MMMM D, YYYY')}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>

            {/* Title */}
            <TextField
              {...register('title', { required: 'Event must have a title' })}
              name="title"
              label="Title"
              variant="outlined"
              fullWidth
              error={!!errors.title}
              helperText={errors.title?.message}
            />

            {/* Description */}
            <TextField
              {...register('description')}
              title="description"
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
            />

            {/* Time */}
            {/* <TextField
              {...register('time', { required: 'Must specify time' })}
              name="time"
              label="Time"
              variant="outlined"
              fullWidth
              error={!!errors.time}
              helperText={errors.time?.message}
            /> */}
            <Controller
              name="time"
              rules={{ required: 'Must specify time' }}
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <MobileTimePicker
                  label="Choose a time"
                  value={value ?? null}
                  onChange={onChange}
                  slotProps={{
                    actionBar: {
                      actions: ['cancel', 'accept'],
                      sx: {
                        '& .MuiButton-root': {
                          color: 'black',
                        },
                      },
                    },
                    textField: {
                      fullWidth: true,
                      margin: 'normal',
                      error: !!error,
                      helperText: error?.message,
                    }
                  }}

                />
              )}
            />


            {/* Date */}
            {/* <TextField */}
            {/* <InputLabel id="date-label" > Choose a date</InputLabel> */}
            <Controller
              name="date"
              rules={{ required: 'Must specify date' }}
              control={control}
              // defaultValue={null}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <DatePicker
                  label="Choose a date"
                  value={value ?? null}
                  onChange={onChange}
                  minDate={dayjs(chosenItinerary.begin)}
                  maxDate={dayjs(chosenItinerary.end)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: 'normal',
                      error: !!error,
                      helperText: error?.message
                    }

                    //   {...params}
                    //   fullWidth
                    //   margin="normal"
                    //   error={!!error}
                    //   helperText={error ? error.message : ""}
                    // />
                  }}

                />
              )}
            />
            {/* name="date" */}
            {/* variant="outlined" */}
            {/* fullWidth */}
            {/* type="date" */}
            {/* // InputLabelProps={{ shrink: true }} */}
            {/* error={!!errors.date} */}
            {/* helperText={errors.date?.message} */}
            {/* /> */}

            {/* Location */}
            <TextField
              name="location"
              {...register('location', { required: 'Must enter a location' })}
              label="Location"
              variant="outlined"
              fullWidth
              type="text"
              error={!!errors.location}
              helperText={errors.location?.message}
            />

            {/* Image URL */}
            <TextField
              {...register('image')}
              name="image"
              label="Image URL"
              variant="outlined"
              fullWidth
            />

            {/* Phone Number */}
            <TextField
              {...register('phone')}
              name="phone"
              label="phone/link"
              variant="outlined"
              fullWidth
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />

            {/* Address */}
            <TextField
              {...register('address')}
              name="address"
              label="Address"
              variant="outlined"
              fullWidth
            />

            {/* Submit Button */}
            <Button
              // disabled={isSubmitting}
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
        </Grid>
      </Container>
    </LocalizationProvider>
  );
};

export default SuggestionToActivityForm;
