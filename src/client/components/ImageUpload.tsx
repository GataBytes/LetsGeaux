import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { Button, TextField, Typography, Box, Stack } from '@mui/material';
import ImageDisplay from './ImageDisplay';
import { useImageContext } from './ImageContext';
import { useMedia } from './MediaQueryProvider.tsx';
interface ImageUploadProps {
  userId: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ userId }) => {
  const [url, setImageUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [images, setPictures] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const { setImages } = useImageContext();
  const { isMobile } = useMedia(); 

  useEffect(() => {
    getAllImages();
  }, []);

  const handleUploadWidget = () => {
    // @ts-ignore
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dcrrsec0d',
        uploadPreset: 'LetsGeaux Profile',
        sources: ['local', 'url', 'google_drive'],
        multiple: false,
        folder: 'letsGeaux',
      },
      (error: any, result: any) => {
        if (!error && result.event === 'success') {
          console.log('Uploaded image:', result.info.secure_url);
          setImageUrl(result.info.secure_url);
        }
      }
    );

    widget.open();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url) {
      enqueueSnackbar('Please upload an image first.', { variant: 'warning' });
      return;
    }

    try {
      await axios.post('/api/image', {
        url,
        notes,
        userId,
      });

      enqueueSnackbar('Upload successful!', { variant: 'success' });
      setImageUrl('');
      setNotes('');
      // getAllImages(); // refresh images
    } catch (err) {
      console.error('Error submitting image & notes:', err);
    }
  };

  const getAllImages = async () => {
    try {
      const response = await axios.get(`/api/image/${userId}`);
      setPictures(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteImage = async (imageId: number) => {
    try {
      await axios.delete(`/api/images/${imageId}`);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      console.log(images)
    } catch (err) {
      console.error('Error deleting image:', err);
    }
  };

  return (
    // <Box sx={{ mx: 'auto', margin: 'auto', py: 4 }}>
      <Box
      sx={{
        width: '100%',
        maxWidth: isMobile ? '100%' : '100%',
        margin: 'auto',
        py: isMobile? 2 : 4,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {/* <Box align="center"
        sx={{
          border: '4px solid black',
          borderRadius: 4,
          padding: 2,
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
          mx: 'auto',
        }}
      > */}
       <Box
          align="center"
          sx={{
            border: isMobile? 'none' : '4px solid black',
            borderRadius: 4,
            p: 2,
            width: '100%',
            maxWidth: isMobile? '100%' : 400,
            boxSizing: 'border-box',
            backgroundColor: '#C2A4F8',
          }}
        >
        <Typography
          variant="h3"
          align='center'
          sx={{ py: 2 }}
          // sx={{ py: 4 }}
        >
          Upload A Trip Image
        </Typography>

        <Box spacing={2} alignItems="center">
          <Button
            variant="contained"
            sx={{ mt: 2, color: 'primary' }}
            onClick={handleUploadWidget}
          >
            Upload Image
          </Button>

          {url && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center'  }}>
              <img
                src={url}
                alt="Uploaded preview"
                style={{
                  width: '100%',
                  maxWidth: '260px',
                  marginTop: '10px',
                  borderRadius: '8px',
                  objectFit: 'contain',
                }}
                // style={{ width: '200px', marginTop: '10px', borderRadius: '8px' }}
              />
            </Box>
          )}

          <form onSubmit={handleSubmit} style={{ marginTop: '10px', width: '100%' }}>
            <TextField
              placeholder="Add some notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              multiline
              fullWidth
              variant="outlined"
              sx={{
                marginTop: 2,
                '& .MuiOutlinedInput-root': {
                  border: '4px solid black',
                  borderRadius: 4,
                },
                '& .MuiInputBase-input': {
                  padding: '10px',
                  fontWeight: 500,
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 2, color: 'primary' }}
            >
              Submit
            </Button>
          </form>

        </Box>
      </Box>
      {/* <ImageDisplay images={images} deleteImage={deleteImage} /> */}

    </Box>

  );
}


export default ImageUpload;