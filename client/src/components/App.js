import React from 'react';
import InputFace from './InputFace';

const styles = {
  container: {
    position: "relative",
    margin:"0 auto",
    padding: "20px"
  }
};

// Use /api/face/ in production (proxied by nginx), localhost:3000/face/ in dev
const API_URL = process.env.NODE_ENV === 'production'
  ? '/api/face/'
  : 'http://localhost:3000/face/';

const App = () => (
  <div style={styles.container}>
    <InputFace faceUrl={API_URL}></InputFace>
  </div>
);

export default App;
