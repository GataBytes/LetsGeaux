import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ProfileIcon from '@mui/icons-material/AccountCircle';
import AlertIcon from '@mui/icons-material/AddAlert';
import LogoutIcon from '@mui/icons-material/LogoutSharp';
import MapIcon from '@mui/icons-material/MapOutlined';
import TipsIcon  from '@mui/icons-material/TipsAndUpdates';
import ChatIcon  from '@mui/icons-material/TryOutlined';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import EventIcon from '@mui/icons-material/Event';

const drawerWidth = 240;

type Anchor = 'left';


const NavDrawer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [Auth, setAuth] = useState<boolean>(true)

  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end'
  }));

  const theme = useTheme();

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleLogout = async () => {
    try {
      
      await axios.post('/logout')
          setOpen(false);
          setAuth(false);
          navigate('/logout');
        
    } catch (error) {
      
    
        console.error('Error logging out at client', error);
      };
  };

  return (
    <Box sx={{ display: 'flex' }}>
     
      
          <IconButton
            color='inherit'
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            edge='start'
            sx={[
              {
                mr: 2
              },
              open && { display: 'none' }
            ]}
          >
            <MenuIcon />
          </IconButton>
        
        
      
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box'
          }
        }}
        variant='persistent'
        anchor='left'
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {/* suggestions */}
          <ListItem key={'suggestions'} disablePadding>
              <ListItemButton component={Link}to='/suggestions' onClick={handleDrawerClose}>
                <ListItemIcon>
                  <TipsIcon />
                </ListItemIcon>
                <ListItemText primary={'Suggestions'} />
              </ListItemButton>
            </ListItem>
          {/* maps */}
          <ListItem key={'maps'} disablePadding>
              <ListItemButton component={Link}to='/maps' onClick={handleDrawerClose}>
                <ListItemIcon>
                  <MapIcon />
                </ListItemIcon>
                <ListItemText primary={'Maps'} />
              </ListItemButton>
            </ListItem>
            {/* calendar
            <ListItem key={'calendar'} disablePadding>
              <ListItemButton component={Link}to='/calendar' onClick={handleDrawerClose}>
                <ListItemIcon>
                  <EventIcon />
                </ListItemIcon>
                <ListItemText primary={'Calendar'} />
              </ListItemButton>
            </ListItem> */}
            {/* itinerary */}
            <ListItem key={'itinerary'} disablePadding>
              <ListItemButton component={Link}to='/itinerary' onClick={handleDrawerClose}>
                <ListItemIcon>
                  <TravelExploreIcon />
                </ListItemIcon>
                <ListItemText primary={'Itinerary'} />
              </ListItemButton>
            </ListItem>
          {/* chat */}
          <ListItem key={'chat'} disablePadding>
              <ListItemButton component={Link}to='/chatbot' onClick={handleDrawerClose}>
                <ListItemIcon>
                  <ChatIcon />
                </ListItemIcon>
                <ListItemText primary={`Gata AI Chat`} /> 
              </ListItemButton>
            </ListItem>
            {/* Budget Buddy */}
            <ListItem key={'BudgetBuddy'} disablePadding>
              <ListItemButton component={Link} to="/budgetbuddy" onClick={handleDrawerClose}>
                <ListItemIcon>💰</ListItemIcon>
                <ListItemText primary="Budget Buddy" />
              </ListItemButton>
            </ListItem>
              {/* Route Choices  */}
            <ListItem key={'RouteChoices'} disablePadding>
              <ListItemButton component={Link} to="/routechoices" onClick={handleDrawerClose}>
                <ListItemIcon>💰</ListItemIcon>
                <ListItemText primary="Route Choices" />
              </ListItemButton>
            </ListItem>
          {/* logout */}
          <ListItem key={'logout'} disablePadding>
              <ListItemButton component={Link} to='/logout' onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary={'Logout'} />
              </ListItemButton>
            </ListItem>
            

        </List>
      </Drawer>
    </Box>
  );
};

export default NavDrawer;

