// src/App.js

import React from "react";
import SignupPage from "./components/Signup";
import Signin from "./components/Signin";
import "./App.css";

function App() {
  return (
    <div className="App">
      <SignupPage />
      {/* <Signin /> */}
    </div>
  );
}

export default App;
