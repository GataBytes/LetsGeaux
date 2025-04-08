import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import StreetcarIcon from '@mui/icons-material/DirectionsSubwayTwoTone';
import Link from '@mui/material/Link';

import NavDrawer from './NavDrawer';

const MainAppBar: React.FC= () => {
  const handleOpenUserMenu = () => {}; // nav instructions to user preferences?
  const handleCloseUserMenu = () => {};
  let anchorElUser; // this has something to do with the preferences nav 
  
  return(
    <AppBar position='static' sx={{ background: 'purple'}} >
      <Container maxWidth='xl' sx={{ sm: 'block' }}>
        <Toolbar disableGutters >
          <NavDrawer/>
          <StreetcarIcon sx={{ color:'black', display: { xs: 'none', 'md': 'flex', sm:'block'}, mr: 1}} />
          <Typography 
            component = 'a'
            variant='h6'
            noWrap
            href='/'
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex', sm:'block'},
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'white',
              textDecoration: 'none'
            }}
            
          >
            Let's Geaux
          </Typography>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open Preferences">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Gata" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {/* {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                </MenuItem>
              ))} */}
            </Menu>
          </Box>
        </Toolbar>
        
      </Container>
    </AppBar>
  )
}

export default MainAppBar;