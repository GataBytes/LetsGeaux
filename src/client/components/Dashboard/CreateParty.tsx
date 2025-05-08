import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button, 
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import FilledInput from '@mui/material/FilledInput';
import Divider from '@mui/material/Divider';
import { user } from '../../../../types/models.ts'
interface partyProps {
  user: user;
  onPartyCreated: () => void;
}

const CreateParty: React.FC<partyProps> = ({user, onPartyCreated}) => {
  const userId = user.id;
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = useState<string>('')
  const [emails, setEmails] = React.useState<string[]>([])
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [partySuccess, setPartySuccess] = useState(false);
  const [partyName, setPartyName] = useState<string>(''); 
  const [partyId, setPartyId] = useState<number>(null); 

  // * Input Modal: partyName and eVite * //
  const openModal = () => {
    setOpen(true);
  }; 
  const closeModal = () => {
    setOpen(false);
  };

  //* Create new Travel Party*//
  const createParty = async (partyName:string) => {
    const name = partyName
    setPartyName(name)
    try {
      let response = await axios.post('/api/party', {name} );
      const id = (response.data.id);
      // onPartyCreated();
      setPartyId(id);
      setPartySuccess(true);
      // setTimeout(() => closeModal(), 10000)
      setTimeout(() => setPartySuccess(false), 10000)
      await addUserToParty(userId, id, partyName);
      onPartyCreated();
    } catch (error) {
      console.error('failed to create new party');
    };
  };

  //* Add Current User to Party *//
  const addUserToParty = async(userId:number, partyId:number, partyName: string) => {
    try {
      await axios.post('/api/party/userParty', {userId, partyId});
      // console.log(`Success at Create.tsx ${partyName}`, response.data)
    } catch (error) {
      console.error('Could not create new userParty model', error);
    }
  }; 

  // //* Send E-Vite *//
  const sendEmail = async(emailList: string[], partyName:string, userId: number, partyId: number) => {
    try {
      await axios.post('/api/party/sendInvite', { emails: emailList, partyName: partyName, userId: userId, partyId: partyId });
      setInviteSuccess(true);
      setInputValue('');
      setEmails([]);
      setTimeout(() => closeModal(), 2000)
      setTimeout(() => setInviteSuccess(false), 2000)
    } catch (error) {
        console.error('could not send email', error)
    }
  };

  return (
    <React.Fragment>
      <Button variant='contained' onClick={openModal}>
        Create a Travel Party!
      </Button>
      <Dialog
        open={open}
        onClose={closeModal}
        slotProps={{
          paper: {
            sx: { width: 500 },
            component: 'form',
            onSubmit: (e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const formJson = Object.fromEntries((formData as any).entries());
              const partyName = (formJson.party);
              createParty(partyName);
            }
          }
        }}
      >
        <DialogTitle variant='body1' sx={{mt: 1, mb: 0, pb: 1}}>Name Your Party</DialogTitle>
        <DialogContent>
          <DialogContentText variant='body2' sx={{mt: 0, pt: 0, mb:3}}>
            Choose a name for your travel party!
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin='dense'
            id='name'
            name='party'
            label='Party Name'
            type='string'
            fullWidth
            variant='standard'
            slotProps={{
              root: {
                sx: {
                  // '& .MuiInputLabel-root': {
                  //   color: '#8257E5'
                  // },
                  '& .MuiInputLabel-root.Mui-focused': {
                    
                    color: '#612BDE',
                    size: 'large'
                  },
                },
              },
            }}
          
          />
          <DialogActions>
            <Button variant='contained' type='submit'>Create</Button>
          </DialogActions>
          {partySuccess && (
            <Typography sx={{ mt: 1, color: 'green' }}>
              Party Created!
            </Typography>
          )}
          <Divider/>
        {/* Evite */}
          <Typography variant='subtitle1' sx={{ mt: 2 }}>
            Invite your friends to join your travel party
          </Typography>
          <FilledInput
            id='email'
            placeholder='Enter email to invite (separate multiples with commas!)'
            type='text'
            fullWidth
            value={inputValue}
            onChange={(event) => {
              const raw = event.target.value;
              setInputValue(raw);
              const parsedEmails = raw.split(',').map(email => email.trim()).filter(email => email.length > 0);
              setEmails(parsedEmails)
            }} 
          />
          <Button 
            sx={{ mt: 1 }}
            variant='contained'
            onClick={() => sendEmail(emails, partyName, userId, partyId)} disabled={emails.length === 0}
            >
            Invite
          </Button>
          {inviteSuccess && (
            <Typography sx={{ mt: 1, color: 'green' }}>
              Invite sent successfully!
            </Typography>
          )}
          <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
            You can also invite friends later from your party dashboard.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={closeModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
};

export default CreateParty
