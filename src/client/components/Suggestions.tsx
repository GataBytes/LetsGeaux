import React, {useState, useEffect} from 'react';
import axios from 'axios';
// import SuggestionForm from './SuggestionForm';
import {
  Container,
  Card,
  // Typography,
  // Dialog,
  // Grid,
  // Avatar,
  // Input,
  // InputLabel,
  Button,
  // SpeedDial,
  // CircularProgress
  Box,
} from '@mui/material'
import Suggestion from './Suggestion';
import { user } from '../../../types/models.ts';

interface SuggestionsProps {
  user: user;
}
const Suggestions: React.FC<SuggestionsProps>= ({ user }) => {

  const [showingDb, setShowingDb] = useState(false);
  const [suggestionSet, setSuggestionSet] = useState([]);
  const [suggestionEditMode, setSuggestionEditMode] = useState(false);
  const [dbSuggestionSet, setDbSuggestionSet] = useState([]);
  const [sortedSuggestionSet, setSortedSuggestionSet] = useState([]);


// TECH-DEBT: Gotta make a way to  filter out duplicates between the database suggestions and API suggestions.
// Also- upsert so that no one gets to have more than one vote.


const getDbSuggestions = () => {
  axios.get('/api/suggestions').then(({data}) => {
    setDbSuggestionSet(data);
  })
}
const getAllSuggestions = () => {
  const setUpSuggestions = async () => {
    const suggs = await getDbSuggestions()
    const apis = await getApiSuggestions();
  }
  setUpSuggestions();
}
// taking the API suggestions and filtering out the ones we already have in the database
const sortSuggestionSet = (array: []) => {
  // create A clone.. may be superfluous..
  const fakeSet = dbSuggestionSet;
  // remove all values in that set that share the value of its title
  const sortSet = array.filter((sugg: any) => !Object.values(dbSuggestionSet).includes(sugg.title));
  // place the sorted set in state
  setSortedSuggestionSet(sortSet);

}

const showDbSuggestions = () => {
  setShowingDb(true);
}

const showInterestSuggestions = () => {
  setShowingDb(false);
}

const getApiSuggestions = (query = "Restaurants") => {
  axios.get(`/api/suggestions/search/${user.id}`).then(({data: searchData}) => {
    setSuggestionSet(searchData);
      sortSuggestionSet(searchData);
      })

    .catch((err) => console.error('there was an issue', err));
  }

  useEffect(() => {
    getAllSuggestions();
  }, []);

  return (
    <Container>
      <h1>Suggested Excursions</h1>
      {showingDb ? (
        <>
        <h2>user picks</h2>
      <Button sx={{ borderWidth: 4, color: "black" }} onClick={showInterestSuggestions}>Just for you</Button>
      {dbSuggestionSet.map((currentSuggestion: any) => (
        <Box
        sx={{
          border: "4px solid black",
          borderRadius: "4",
          p: 4, mb:
          "8px"
        }}
        key={currentSuggestion.id}
        >
          <Suggestion
          user={user}
          isDb={true}
          currentSuggestion={currentSuggestion}
          getAllSuggestions={getAllSuggestions}
          setSuggestionEditMode={setSuggestionEditMode}
          // setEditableSuggestion={setEditableSuggestion}
          />
        </Box>
      ))}
      </>
    ) : (
      <>
      <h2>You may enjoy:</h2>
      <Button sx={{ borderWidth: 4, color: "black" }} onClick={showDbSuggestions}>user picks</Button>
      {suggestionSet.map((currentSuggestion) => (
        <Box
        key={currentSuggestion.fsq_id}
        sx={{
          border: "4px solid black",
          borderRadius: 4,
          p: 4,
          mb: "8px"
        }}
        >
        <Suggestion
        user={user}
        currentSuggestion={currentSuggestion}
        isDb={false}
        getAllSuggestions={getAllSuggestions}
        setSuggestionEditMode={setSuggestionEditMode}
        setSuggestionSet={setSuggestionSet}
        // setEditableSuggestion={setEditableSuggestion}
        />
        </Box>
      ))}
    </>
    )}
    </Container>
  )
}

export default Suggestions;
