import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useAuth } from '../Security/Auth';
import { useHistory, useLocation } from 'react-router-dom';
import { useForm } from "react-hook-form";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));


const LoginPage = () => {
    const classes = useStyles();
    const { register, errors, setError, handleSubmit, formState } = useForm({ mode: 'onChange', });
    const history = useHistory();
    const location = useLocation();
    const auth = useAuth();

    let { from } = location.state || { from: { pathname: "/" } };

    const onSubmit = data => {
        return auth.signin(data.email, data.password).then(response => {
            history.replace(from);
            return Promise.resolve(response)
        }).catch(error => {
            setError('password', {
                type: "manual",
                message: "Грешно потребителско име или парола"
            })
            return Promise.resolve(error)
        })
    };
    const onError = error => {

    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Вход
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit(onSubmit, onError)} noValidate>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        helperText={errors.email ? errors.email.message : undefined}
                        inputRef={register({
                            required: 'Email адреса е задължителен',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                message: "Невалиден email",
                            }
                        })}
                        error={errors.email ? true : false}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Парола"
                        type="password"
                        id="password"
                        helperText={errors.password ? errors.password.message : undefined}
                        inputRef={
                            register({
                                maxLength: { value: 20, message: 'Прекалено дълга' },
                                minLength: { value: 3, message: 'Прекалено къса' }
                            })
                        }
                        error={errors.password ? true : false}
                    />
                    <Button
                        type="submit"
                        disabled={(!formState.isValid && !errors.password) || formState.isSubmitting}
                        fullWidth
                        variant="contained"
                        className={classes.submit}
                    >
                        {formState.isSubmitting ? 'Зареждане...' : 'Влез'}
                    </Button>
                </form>
            </div>
        </Container>
    );
}

export default LoginPage