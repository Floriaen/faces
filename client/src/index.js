import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";
import ReactDOM from 'react-dom';
import App from './components/App';

const defaultTheme = createMuiTheme({
  palette: {
    type: 'dark'
  },
});

ReactDOM.render(  
  <ThemeProvider theme={defaultTheme}>
    <CssBaseline />
    <App/>
  </ThemeProvider>,
  document.getElementById('root')
);