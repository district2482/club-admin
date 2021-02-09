import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Copyright from '../Common/Copyright'
import RotaryLogo from './rotary-logo.svg';
import { Box, Link, Paper } from '@material-ui/core';
import { Link as RouteLink, useHistory } from 'react-router-dom';
import { useAuth } from '../Security/Auth';

const useStyles = makeStyles((theme) => ({
    '@global': {
        ul: {
            margin: 0,
            padding: 0,
            listStyle: 'none',
        },
    },
    appBar: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    toolbar: {
        flexWrap: 'wrap',
    },
    toolbarLogo: {
        width: '6rem',
        height: '4rem',
    },
    toolbarTitle: {
        flexGrow: 1,
        paddingLeft: '8px',
        color: theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[700]
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('md')]: {
            width: 655,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up('md')]: {
            marginTop: theme.spacing(3),
            marginBottom: theme.spacing(6),
            padding: theme.spacing(3),
        },
    },

    link: {
        margin: theme.spacing(1, 1.5),
    },
    footer: {
        borderTop: `1px solid ${theme.palette.divider}`,
        marginTop: theme.spacing(8),
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
        [theme.breakpoints.up('sm')]: {
            paddingTop: theme.spacing(6),
            paddingBottom: theme.spacing(6),
        },
    },
}));

const MainLayout = ({ children }) => {
    const classes = useStyles();
    const history = useHistory();
    const auth = useAuth()

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
                    <RouteLink to="/">
                        <img className={classes.toolbarLogo} src={RotaryLogo} alt={'Logo'} />
                    </RouteLink>

                    <Box flexGrow={1} display={{ xs: 'none', md: 'block' }} m={1}>
                        <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
                            Клуб Велико Търново
                        </Typography>
                    </Box>


                    {auth.user && auth.user.isAnonymous && <Button variant="outlined" className={classes.link} onClick={e => {
                        e.preventDefault()
                        history.push('/login')
                    }} disabled={auth.processing}>Вход</Button>}
                    {auth.user && !auth.user.isAnonymous && (
                        <>
                            <nav>
                                <Link
                                    variant="button"
                                    color="textPrimary"
                                    onClick={e => {
                                        e.preventDefault()
                                        history.push(`/clubs/${auth.user.clubId}/voting-polls`)
                                    }} href="#"
                                    className={classes.link}>Клубни Избори
                        </Link>
                            </nav>
                            <Button variant="outlined" className={classes.link} onClick={e => {
                                e.preventDefault()
                                auth.signout(() => {
                                    history.push('/')
                                })
                            }} disabled={auth.processing}>Изход</Button>
                        </>)}
                </Toolbar>
            </AppBar>

            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    {children}
                </Paper>
                <Copyright />
            </main>

        </React.Fragment>
    );
}

export default MainLayout