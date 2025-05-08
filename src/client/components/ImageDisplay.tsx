import React, { useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Box,
  Slider,
  Switch,
  FormControlLabel,
  Modal,
  IconButton
} from '@mui/material';
import { useImageContext } from './ImageContext';
import axios from 'axios'
import { PiTrash } from 'react-icons/pi';

interface Image {
  id: number;
  url: string;
  notes: string;
}

interface ImageDisplayProps {
  userId: number;
}

const chunkArray = (arr: Image[], size: number): Image[][] => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
};

const ImageDisplay: React.FC<ImageDisplayProps> = ({ userId }) => {
  const { images, getAllImages } = useImageContext();
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [autoFlip, setAutoFlip] = useState(true);
  const [flipInterval, setFlipInterval] = useState(7000);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  const imageChunks = chunkArray(images, 2);
  const { setImages } = useImageContext();
  useEffect(() => {
    getAllImages(userId);
  }, [userId]);

  useEffect(() => {
    if (!autoFlip || imageChunks.length <= 1) return;

    const interval = setInterval(() => {
      handleNext();
    }, flipInterval);

    return () => clearInterval(interval);
  }, [autoFlip, flipInterval, imageChunks.length]);

  const handleNext = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentChunkIndex((prev) => (prev + 1) % imageChunks.length);
      setIsFlipping(false);
    }, 300);
  };

  const handlePrev = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentChunkIndex((prev) =>
        (prev - 1 + imageChunks.length) % imageChunks.length
      );
      setIsFlipping(false);
    }, 300);
  };

  const openConfirm = (image: Image) => {
    setSelectedImage(image);
    setConfirmOpen(true);
  };
  const deleteImage = async (imageId: number) => {
    try {
      await axios.delete(`/api/image/${imageId}`);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      console.log(images)
    } catch (err) {
      console.error('Error deleting image:', err);
    }
  };
  const handleConfirmDelete = async () => {
    if (selectedImage) {
      try {
        await deleteImage(selectedImage.id);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
    setConfirmOpen(false);
    setSelectedImage(null);
  };

  return (
    <Box p={2} border='4px solid black' sx={{ borderRadius: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Uploaded Images
      </Typography>

      <Box
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent="center"
        alignItems="center"
        gap={2}
        flexWrap="wrap"
        mt={2}
      >
        <Button
          variant="contained"
          onClick={handlePrev}
          disabled={imageChunks.length <= 1}

        >
          Previous
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={imageChunks.length <= 1}

        >
          Next
        </Button>
        <FormControlLabel
          control={
            <Switch
              checked={autoFlip}
              onChange={(e) => setAutoFlip(e.target.checked)}
            />
          }
          label="Auto Flip"
          sx={{ whiteSpace: 'nowrap' }}
        />
        <Box width={{ xs: '100%', sm: 200 }}>
          <Typography variant="caption">Speed (ms)</Typography>
          <Slider
            value={flipInterval}
            onChange={(_, value) => setFlipInterval(value as number)}
            step={800}
            min={1000}
            max={10000}
            disabled={!autoFlip}
          />
        </Box>
      </Box>

      {images.length === 0 ? (
        <Typography align="center" sx={{ mt: 2 }}>
          No images uploaded yet.
        </Typography>
      ) : (
        <Box
          className={isFlipping ? 'flip-animation' : ''}
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            justifyContent: 'center',
            mt: 3,
            transition: 'transform 0.3s',
          }}
        >
          {imageChunks[currentChunkIndex]?.map((image) => (
            <Box
              key={image.id}
              sx={{
                border: '4px solid black',
                borderRadius: 2,
                p: 1,
                maxWidth: 200,
                width: '100%',
                textAlign: 'center',
                backgroundColor: 'white',
                position: 'relative',
                pb: 5
              }}
            >
              <img
                src={image.url}
                alt="Uploaded"
                style={{
                  width: '100%',
                  borderRadius: '4px',
                  objectFit: 'cover',
                }}
              />
              <Typography variant="body2" sx={{ fontWeight: 500, mt: 1 }}>
                Notes: {image.notes}
              </Typography>
              <Box>
                <IconButton
                  onClick={() => openConfirm(image)}
                  variant="contained"
                  color="black"
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                  }}
                >
                  <PiTrash />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* Modal */}
      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            Delete Image
          </Typography>
          <Typography>
            Are you sure you want to delete{' '}
            {selectedImage?.notes ? `"${selectedImage.notes}"` : 'this image'}?
            This action cannot be undone.
          </Typography>
          <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
            <Button color='black' onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button variant="contained" color="black" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ImageDisplay;