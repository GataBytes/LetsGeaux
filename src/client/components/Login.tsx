import React from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  CssBaseline,
  GlobalStyles,
} from '@mui/material';
import { PiGoogleLogoBold } from 'react-icons/pi';
import Logo from '../theme/cropedLogo.png';

const Login: React.FC = () => {
  return (
    <>
      <CssBaseline />
      <GlobalStyles
        styles={{
          html: {
            margin: 0,
            padding: 0,
            height: '100%',
          },
          body: {
            margin: 0,
            padding: 0,
            height: '100%',
          },
          '#root': {
            height: '100%',
          },
        }}
      />

      <Box
        minHeight="100vh"
        width="100vw"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        bgcolor="#f0f0f0"
        textAlign="center"
        p={2}
        sx={{ overflowY: 'auto' }}
      >
        {/* Logo and Welcome Message */}
        <Box mb={4}>
          <img
            src={Logo}
            alt="Let's Geaux Logo"
            style={{
              height: 'auto',
              maxHeight: 100,
              maxWidth: '80%',
              marginBottom: 16,
            }}
          />
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}
          >
            Welcome to Let's Geaux!
          </Typography>

          <Typography

            sx={{
              maxWidth: 600,
              mx: 'auto',

              lineHeight: 1.5,
              textAlign: 'left',
            }}
          >
            Planning a trip to New Orleans? Let's Geaux helps you discover the
            best of the city based on your interests. Build and share custom
            itineraries, use our built-in map to plan, and keep your budget on track with an easy-to-use planner.
            A friendly AI assistant and a
            vibrant community are there to offer suggestions and insider tips.
            Come start a plan with Let's Geaux!
          </Typography>
        </Box>

        {/* Login Card */}
        <Card
          sx={{
            border: '4px solid black',
            borderRadius: 4,
            padding: 2,
            maxWidth: 300,
            backgroundColor: '#c4a1ff',
            mt: { xs: 4, sm: 2 },
          }}
        >
          <PiGoogleLogoBold size={40} style={{ marginBottom: 16 }} />

          <Typography variant="h5" gutterBottom>
            Sign in with your Google Account
          </Typography>

          <Button
            variant="contained"
            color="primary"
            href="/auth/google"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login with Google
          </Button>
        </Card>
      </Box>
    </>
  );
};

export default Login;