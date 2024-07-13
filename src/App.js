// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { SignUpProvider } from './context/SignUpContext';
import SignUpStep1 from './components/SignUpStep1';
import SignUpStep2 from './components/SignUpStep2';
import SignUpStep3 from './components/SignUpStep3';

const App = () => {
  return (
    <SignUpProvider>
      <Router>
        <Switch>
          <Route path="/signup-step1" component={SignUpStep1} />
          <Route path="/signup-step2" component={SignUpStep2} />
          <Route path="/signup-step3" component={SignUpStep3} />
        </Switch>
      </Router>
    </SignUpProvider>
  );
};

export default App;
