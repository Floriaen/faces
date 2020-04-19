import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { fade, makeStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';

import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';

// for search bar, see https://material-ui.com/components/app-bar/

const useStyles = makeStyles((theme) => ({
  content: {
    height: '100%'
  },
  outlineLess: {
    outline:0,
    display: 'block'
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%'
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`
  }
}));

function InputFace(props) {

  const [imageSource, setImageSource] = useState(undefined);
  const [imageTitle, setImageTitle] = useState('');
  const classes = useStyles(); // 

  const handleChange = (event) => {
    let {value} = event.target;
    if (value) {
      value = value.trim();
    }
    if (value !== imageSource) {
      if (value.length > 0) {
        setImageSource(props.faceUrl + value);
        setImageTitle(value);
      } else {
        setImageSource(undefined);
        setImageTitle('');
      }
    }
  };

  return (
    <Card className={classes.content}>
      <CardActions>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Search…"
            fullWidth
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            onKeyUp={handleChange}
            inputProps={{ 'aria-label': 'search' }}
          />
        </div>
      </CardActions>
      <CardActionArea>
        <CardMedia 
          image={imageSource}
          title={imageTitle}
          component="img"
        />
      </CardActionArea>
    </Card>
  );
};

InputFace.propTypes =  {
  faceUrl: PropTypes.string.isRequired,
};

export default InputFace;
