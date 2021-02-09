import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

const VotingPollCard = ({ clubId, pollId, title, description, startTime, endTime }) => {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography variant="h5" component="h2">{title}</Typography>
                <Typography className={classes.pos} color="textSecondary">
                    В периода от {asTimeString(startTime)} до {asTimeString(endTime)} часа на {asDateString(startTime)}
                </Typography>
                <Typography variant="body2" component="p">{description}<br /></Typography>
            </CardContent>
            <CardActions>
                <Button size="small" component={RouterLink} to={`/clubs/${clubId}/voting-polls/${pollId}`}>Резултати</Button>
                <Button size="small" component={RouterLink} to={`/clubs/${clubId}/voting-codes/${pollId}`}>Кодове</Button>
                <Button size="small" component={RouterLink} to={`/clubs/${clubId}/vote/${pollId}`}>Форма за Гласуване</Button>
            </CardActions>
        </Card>
    );
}

const asDateString = (datetime) => {
    return datetime.getFullYear() + "-" + (datetime.getMonth() + 1) + "-" + appendLeadingZeroes(datetime.getDate())
}

const asTimeString = (datetime) => {
    return appendLeadingZeroes(datetime.getHours()) + ":" + appendLeadingZeroes(datetime.getMinutes())
}

function appendLeadingZeroes(n) {
    if (n <= 9) {
        return "0" + n;
    }
    return n
}

export default VotingPollCard