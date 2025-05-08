import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  Collapse,
  CardHeader
} from '@mui/material';
import axios from 'axios';
import { user, itinerary } from '../../../../types/models.ts';
import Activity from './Activities.tsx';
import AddItinerary from './AddItinerary.tsx';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  PiPencil,
  PiTrashDuotone,
  PiCaretCircleDownBold
} from 'react-icons/pi';
import { useSnackbar } from 'notistack';
import { useMedia } from '../MediaQueryProvider.tsx';

interface ItineraryProps {
  user: user;
  partyId: number;
  partyName: string;
}

const Itinerary: React.FC<ItineraryProps> = ({ user, partyId, partyName }) => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [itineraryName, setItineraryName] = useState('');
  const [itineraryNotes, setItineraryNotes] = useState('');
  const [itinerary, setItinerary] = useState<itinerary | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const [editingItinerary, setEditingItinerary] = useState<any | null>(null);
  const [error, setError] = useState<string>('');

  // const location = useLocation();
  //delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  //state for email itinerary
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [emailToInvite, setEmailToInvite] = useState('');
  const { isMobile } = useMedia();
  const [expanded, setExpanded] = useState(true);

  //* Add Activity to Itinerary *//
  const addActivityToItinerary = async (
    itineraryId: string,
    activityData: any
  ) => {
    try {
      const response = await axios.post(
        `/api/itinerary/${itineraryId}/activity`,
        activityData
      );
      console.log('Activity added:', response.data);
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  //* Get Itinerary *//
  useEffect(() => {
    fetchItinerary(partyId);
  }, []);
 

  const fetchItinerary = async (partyId: number) => {
    try {
      const response = await axios.get(`/api/itinerary/party/${partyId}`);
      setItineraryName(response.data.name);
      setStartDate(response.data.begin);
      setEndDate(response.data.end);
      setItinerary({
        ...response.data,
        id: Number(response.data.id),
        creatorId: Number(response.data.creatorId)
      });
    } catch (error) {
      console.error(
        `Error occurred fetching party itinerary for party ${partyId}`
      );
    }
  };

  // * Edit Itinerary * //
  const handleEditClick = (itinerary: itinerary) => {
    console.log(itinerary);
    navigate('/itinerary');
    setEditingItinerary(itinerary);
    setItineraryName(itinerary.name);
    setItineraryNotes(itinerary.notes);
  };

  // * Handle delete of an itinerary, creator only *//
  const handleDelete = async (itineraryId: number, creatorId: number) => {
    setDeleteDialogOpen(true);
    try {
      const response = await axios.delete(`/api/itinerary/${itineraryId}`);
      console.log(`deleted ${itineraryId}`);
      setDeleteDialogOpen(false);
      setItinerary(null);
      enqueueSnackbar('Itinerary deleted successfully!', {
        variant: 'success'
      });
    } catch (err) {
      console.error('Error deleting itinerary:', err);
    }
  };

  //email itinerary axios request
  const handleSendInvite = async () => {
    try {
      await axios.post('/api/itinerary/sendInvite', {
        email: emailToInvite,
        itineraryName: itinerary?.name,
        viewCode: itinerary?.viewCode
      });
      enqueueSnackbar('Invite sent!', { variant: 'success' });
      setInviteDialogOpen(false);
      setEmailToInvite('');
    } catch (err) {
      console.error('Error sending invite:', err);
      enqueueSnackbar('Failed to send invite.', { variant: 'error' });
    }
  };

  return (
    <Container
      sx={{
        p: 0,
        px: 0
      }}
    >
      <Box
        // my={2}
        // // mx={2}
        // sx={{
        //   m: 0,
        //   backgroundColor: '#C2A4F8',
        //   padding: '16px',
        //   borderRadius: '8px',
        //   boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        // }}
      >
        {/* <Typography variant='h3'sx={{ mt: 3, mb: 2, textAlign: 'center' }}>Party Itinerary</Typography> */}
        {/* Show Itinerary or Button to create */}
        {itinerary ? (
          <Card
            sx={{
              width: isMobile ? 350 :' 512px',
              minWidth: 300,
              // maxWidth: 300,
              m: 0,
              position: 'relative',
              mb: 2,
              backgroundColor: '#C2A4F8',
              borderRadius: 4,
              padding: 2,
              boxShadow: 'none',
              border: '4px solid black',
              fontWeight: 700
            }}
          >
            <CardHeader
              title={itinerary.name}
              action={
                <IconButton
                  onClick={() => setExpanded(prev => !prev)}
                  aria-expanded={expanded}
                  aria-label='expand itinerary'
                >
                  <PiCaretCircleDownBold />
                </IconButton>
              }
            />
            <Collapse 
              in={expanded} 
              timeout={{
                enter: 500,    
                exit: 500,     
              }}
              easing={{
                enter: 'cubic-bezier(0.4, 0, 0.2, 1)',  
                exit: 'cubic-bezier(0.4, 0, 0.2, 1)',   
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                {/* <Typography variant='h3'>{itinerary.name}</Typography> */}
                <Typography variant='body1'>{itinerary.notes}</Typography>
                <Typography variant='body1'>
                  Begin: {dayjs(itinerary.begin).format('dddd, MMMM D, YYYY')}
                </Typography>
                <Typography variant='body1'>
                  End: {dayjs(itinerary.end).format('dddd, MMMM D, YYYY')}
                </Typography>
              </CardContent>
                <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center', 
                  gap: 1,
                  mt: 2
                }}
              >
              <Typography
                variant='caption'
                color='secondary'
                sx={{
                  display: 'inline-block',
                  backgroundColor: '#fff085',
                  color: 'black',
                  px: 2,
                  py: 1,
                   borderRadius: '8px',
                  // border: '4px solid black',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textAlign: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                }}
              >
                View Code: {itinerary.viewCode}
              </Typography>
              <Button
                variant='outlined'
                sx={{
                  display: 'inline-block',
                  backgroundColor: 'primary.main',
                  color: 'black',
                  px: 2,
                  py: 1,
                  borderRadius: '8px',
                  border: '4px solid black',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textAlign: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                }}
                onClick={() => setInviteDialogOpen(true)}
              >
                Share Itinerary
              </Button>
                </Box>
              <CardActions>
                <Tooltip title='Edit Itinerary'>
                  <IconButton onClick={() => handleEditClick(itinerary)}>
                    <PiPencil />
                  </IconButton>
                </Tooltip>
                {user.id === itinerary.creatorId && (
                  <Tooltip title='Delete Itinerary'>
                    <IconButton onClick={() => setDeleteDialogOpen(true)}>
                      <PiTrashDuotone />
                    </IconButton>
                  </Tooltip>
                )}
              </CardActions>
              {user && (
                <Activity
                  itineraryId={itinerary.id}
                  addActivity={addActivityToItinerary}
                  itineraryCreatorId={itinerary.creatorId}
                  user={user}
                  itineraryBegin={dayjs(itinerary.begin).format('YYYY-MM-DD')}
                  itineraryEnd={dayjs(itinerary.end).format('YYYY-MM-DD')}
                />
              )}
            </Collapse>
          </Card>
        ) : (
          <>
            <Typography variant='body1' sx={{ mt: 2 }}>
              Your Party's Shared Itinerary will display here once it is
              created.
            </Typography>
            {/* Button -> Modal -> redirect /itinerary */}
            <AddItinerary
              user={user}
              partyId={partyId}
              partyName={partyName}
              fetchItinerary={fetchItinerary}
            />
          </>
        )}
      </Box>
      <>
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Delete Itinerary?</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this itinerary?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              sx={{ color: 'black' }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleDelete(itinerary.id, user.id)}
              sx={{ color: 'black' }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={inviteDialogOpen}
          onClose={() => setInviteDialogOpen(false)}
        >
          <DialogTitle>Send Itinerary Invite</DialogTitle>
          <DialogContent>
            <TextField
              label="Recipient's Email"
              value={emailToInvite}
              InputLabelProps={{
                sx: {
                  top: -8,
                  color: 'black',
                  '&.Mui-focused': {
                    color: 'black'
                  }
                }
              }}
              onChange={e => setEmailToInvite(e.target.value)}
              fullWidth
              margin='normal'
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setInviteDialogOpen(false)}
              sx={{ color: 'black' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendInvite}
              variant='contained'
              color='primary'
              disabled={!emailToInvite}
            >
              Send Invite
            </Button>
          </DialogActions>
        </Dialog>
      </>
    </Container>
  );
};

export default Itinerary;
