import React, { useState, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  toolbarMenu:{
    flexGrow: 1, 
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.1)', // Adjust the scale factor as needed
    }, 
  }
}));

function Header() {
  const classes = useStyles();
  const [authenticated, setAuthenticated] = useState(false);

  const checkAuthentication = () => {
    const isUserAuthenticated = localStorage.getItem('access_token') !== null;
    setAuthenticated(isUserAuthenticated);
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  // Use a custom hook to listen for authentication changes
  const useAuthenticationListener = () => {
    useEffect(() => {
      window.addEventListener('storage', checkAuthentication);

      return () => {
        window.removeEventListener('storage', checkAuthentication);
      };
    }, []);
  };

  useAuthenticationListener();

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar
        position="static"
        color="default"
        elevation={0}
        className={classes.appBar}
      >
        <Toolbar className={classes.toolbar}>
            <Typography
                variant="h6"
                color="inherit"
                noWrap
                className={classes.toolbarTitle}
            >
                <Link
                component={NavLink}
                to="/"
                underline="none"
                color="textPrimary"
                >
                Quiz Me
                </Link>
            </Typography>
            <Typography
                variant="subtitle2"
                color="inherit"
                noWrap
                className={classes.toolbarMenu}
            >
                <Link
                component={NavLink}
                to="/user"
                underline="none"
                color="textPrimary"
                >
                Your Quizzes
                </Link>
            </Typography>
            <nav>
                {!authenticated && (
                <Link
                    color="textPrimary"
                    href="#"
                    className={classes.link}
                    component={NavLink}
                    to="/register"
                >
                    Register
                </Link>
                )}
            </nav>
            {!authenticated && (
                <Button
                href="#"
                color="primary"
                variant="outlined"
                className={classes.link}
                component={NavLink}
                to="/login"
                >
                Login
                </Button>
            )}
            {authenticated && (
                <Button
                href="#"
                color="primary"
                variant="outlined"
                className={classes.link}
                component={NavLink}
                to="/logout"
                >
                Logout
                </Button>
            )}
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}

export default Header;