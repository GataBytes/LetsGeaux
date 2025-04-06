import React, {useState, useEffect} from 'react';
import axios from 'axios';
import SuggestionForm from './SuggestionForm';
import { Container, Card, Typography, Dialog, Grid, Avatar, Input, InputLabel, Button, SpeedDial, CircularProgress } from '@mui/material'
import Suggestion from './Suggestion';
import { user } from '../../../types/models.ts';

interface SuggestionsProps {
  user: user;
}
const Suggestions: React.FC<SuggestionsProps>= ({ user }) => {

  const [editableSuggestion, setEditableSuggestion] = useState({});
  const [suggestionSet, setSuggestionSet] = useState([]);
  const [suggestionEditMode, setSuggestionEditMode] = useState(false);

  const getAllSuggestions = () => {
    axios.get('/api/suggestions/search').then(({data}) => {
      console.log(data);
      setSuggestionSet(data);
    }).catch((err) => console.error('there was an issue', err));
  }

  useEffect(() => {
    getAllSuggestions();
  }, []);

  return (
    <Container>
      <h1>Suggested Excursions</h1>
    
      {suggestionSet.map((currentSuggestion) => (
        <Card key={currentSuggestion.id}>
          <Suggestion
          user={user}
          currentSuggestion={currentSuggestion}
          getAllSuggestions={getAllSuggestions}
          setSuggestionEditMode={setSuggestionEditMode}
          setSuggestionSet={setSuggestionSet}
          setEditableSuggestion={setEditableSuggestion}
          />
        </Card>
      ))}
      {/* <SuggestionForm
suggestionSet={suggestionSet}
suggestionEditMode={suggestionEditMode}
setSuggestionEditMode={setSuggestionEditMode}
getAllSuggestions={getAllSuggestions}
editableSuggestion={editableSuggestion}
/> */}
    </Container>
  )
}

export default Suggestions;
