import React from 'react';
import InputFace from './InputFace';

const styles = {
  container: {
    position: "relative",
    margin:"0 auto",
    padding: "20px"
  }
};

const App = () => (
  <div style={styles.container}>
    <InputFace faceUrl='http://localhost:3000/face/'></InputFace>
  </div>
);

export default App;
