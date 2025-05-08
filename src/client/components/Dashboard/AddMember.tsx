import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { 
  TextField,
  Modal,
  Button,
  Typography,
  Fade,
  Backdrop,
  Box,
} from '@mui/material';
import Autocomplete, {createFilterOptions} from '@mui/material/Autocomplete';
import { user } from '../../../../types/models.ts'
// import { styled } from '@mui/material/styles';
 
const filter = createFilterOptions<user>();

interface AddMemberProps {
  user: user;
  partyId: number;
  partyName: string;
  getMembers: (param: number) => void;
}


const AddMember: React.FC<AddMemberProps> = ({user, partyId, partyName, getMembers}) => { 
  const [users, setUsers] =  useState<user[]>([]);
  const [member, setMember] = useState<user['username']>();
  const [userId, setUserId] = useState<user['id']>();
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedUser, setSelectedUser] = useState<user | null>(null);

  useEffect(() => {
    getUsers(); // ? DELETED partyId: number
  }, []);

  // * Modal: Add Member Confirmation * //
  const openModal = () => {
    setOpen(true);
  };
  const closeModal = () => {
    setOpen(false);
  };

  // * Fetch all Users with Let's Geaux Accounts * //
  const getUsers = async() => { // ? DELETED partyId: number
    try {
      const response = await axios.get('/api/users'); 
      setUsers(response.data);     
    } catch (error) {
      console.error('failed to get users for add Member search', error)
    };
  };
  // * Modal Button Click Handler * //
  const addMemberToParty = async(userId:number, partyId:number) => {
    try {
      await axios.post('/api/party/userParty', {userId, partyId}); 
      getMembers(partyId);
    } catch (error) {
      console.error('Could not create new userParty model', error);
    }
  }; 

  return ( 
    <React.Fragment>
      <Box 
        sx={{ width: '100%', maxWidth: 300, pt: 0 }}>
        <Typography variant='h6' sx={{ pb: 0, width: '100%'}}>
          Add a Let's Geaux user to this party
        </Typography>
        <Autocomplete
          id="user-search"
          freeSolo
          options={users}
          getOptionLabel={(user: user) => user.username}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
          value={selectedUser}
          onChange={(event, value: user | null) => {
            if (value) {
              setMember(value.username);
              setUserId(value.id);
              openModal();
              setSelectedUser(null);
              setInputValue('');
            }
          }}
          openOnFocus={false}
          filterOptions={(options, state) => 
            state.inputValue === '' ? [] : filter(options, state)
          }
          renderInput={(params) => 
            <TextField 
              {...params} 
              placeholder="Search Users" 
          />}
        />
      </Box>
      <Modal
        open={open}
        onClose={closeModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box 
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                if (userId && partyId) {
                  addMemberToParty(userId, partyId);
                  closeModal();
                }
              }
              if (event.key === 'Escape') {
                closeModal();
              }
            }}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              borderColor: 'secondary',
              p: 4,
              textAlign: 'center',
            }}
            >
            <Typography  variant="h6" component="h3">
              Would you like to add {member} to {partyName}?
            </Typography>
            <Box mt={2} display="flex" justifyContent="center" gap={2}>
              <Button
                variant="contained"
                onClick={() => {
                  if (userId && partyId) {
                    addMemberToParty(userId, partyId);
                    closeModal();
                  }
                }}
              >
                Confirm
              </Button>
              <Button variant="contained" onClick={closeModal}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </React.Fragment>
  ) 
};
export default AddMember;