import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Container, Box, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Scorecard from './components/Scorecard';
import ControlPanel from './components/ControlPanel';
import RunCount from './components/RunCount';

const AppContainer = styled(Container)`
  height: 1080px;
  width: 1920px !important;
  max-width: 1920px !important;
  padding: 20px;
  background-color: #f5f5f5;
`;

const DisplayContainer = styled(Container)`
  height: 1080px;
  width: 1920px !important;
  max-width: 1920px !important;
  padding: 20px;
  background-color: #f5f5f5;
`;

const TransparentBox = styled(Box)`
  background-color: #f5f5f5;
`;

function App() {
  const [matchData, setMatchData] = useState(() => {
    const savedData = localStorage.getItem('matchData');
    return savedData ? JSON.parse(savedData) : {
      team1: { name: '', shortName: '', players: [] },
      team2: { name: '', shortName: '', players: [] },
      totalOvers: 50,
      currentInnings: 1,
      inningsStarted: false,
      batting: {
        team: '',
        score: 0,
        wickets: 0,
        overs: 0,
        balls: 0,
        extras: 0,
        striker: { name: '', runs: 0, balls: 0 },
        nonStriker: { name: '', runs: 0, balls: 0 },
        originalStriker: null,
        originalNonStriker: null
      },
      bowling: {
        bowler: { 
          name: '', 
          overs: 0, 
          runs: 0, 
          wickets: 0,
          balls: 0,
          thisOver: []
        }
      }
    };
  });

  // Save to localStorage whenever matchData changes
  useEffect(() => {
    localStorage.setItem('matchData', JSON.stringify(matchData));
  }, [matchData]);

  // Poll for updates in display view
  useEffect(() => {
    if (window.location.pathname === '/display') {
      const interval = setInterval(() => {
        const savedData = localStorage.getItem('matchData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          if (JSON.stringify(parsedData) !== JSON.stringify(matchData)) {
            setMatchData(parsedData);
          }
        }
      }, 100); // Check every 100ms

      return () => clearInterval(interval);
    }
  }, [matchData]);

  const resetMatch = () => {
    const newMatchData = {
      team1: { name: '', shortName: '', players: [] },
      team2: { name: '', shortName: '', players: [] },
      totalOvers: 50,
      currentInnings: 1,
      inningsStarted: false,
      batting: {
        team: '',
        score: 0,
        wickets: 0,
        overs: 0,
        balls: 0,
        extras: 0,
        striker: { name: '', runs: 0, balls: 0 },
        nonStriker: { name: '', runs: 0, balls: 0 },
        originalStriker: null,
        originalNonStriker: null
      },
      bowling: {
        bowler: { 
          name: '', 
          overs: 0, 
          runs: 0, 
          wickets: 0,
          balls: 0,
          thisOver: []
        }
      }
    };
    setMatchData(newMatchData);
    localStorage.setItem('matchData', JSON.stringify(newMatchData));
  };

  const MainView = () => (
    <AppContainer>
      <Box mb={4}>
        <Scorecard matchData={matchData} />
      </Box>
      <Box mb={4}>
        <ControlPanel matchData={matchData} setMatchData={setMatchData} />
      </Box>
      <Box>
        <RunCount matchData={matchData} setMatchData={setMatchData} />
      </Box>
      {matchData.matchResult && (
        <Box mt={4} display="flex" justifyContent="center">
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={resetMatch}
          >
            Start New Match
          </Button>
        </Box>
      )}
    </AppContainer>
  );

  const DisplayView = () => (
    <DisplayContainer>
      <TransparentBox mb={4}>
        <Scorecard matchData={matchData} />
      </TransparentBox>
    </DisplayContainer>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainView />} />
        <Route path="/display" element={<DisplayView />} />
      </Routes>
    </Router>
  );
}

export default App;
