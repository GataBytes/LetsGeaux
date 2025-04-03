import React from 'react';
import { user } from '../../../types/models.ts';

interface HomeProps {
  user: user;
}

const Home: React.FC<HomeProps> = ({user}) => {
  return (
    <div>
    <h1>HELLOOOOOOOOOO, {user.username}!!!</h1>
    </div>
  )
}

export default Home;