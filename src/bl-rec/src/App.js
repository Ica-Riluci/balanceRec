import React from 'react';
import logo from './logo.svg';
import AddRec from './AddRec';
import QueryRec from './QueryRec';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import './App.css';

function App() {
  return (
    <div className="App">
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='add-rec'>
            添加新的账目
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <AddRec />
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='query-rec'>
            查询账目
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <QueryRec />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}

export default App;
