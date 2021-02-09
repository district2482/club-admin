import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { useVotingPolls } from '../Hooks/Polls/polls';
import VotingPollCard from './VotingPollCard';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));


const VotingPollsView = () => {
    const classes = useStyles();
    let { clubId } = useParams();
    const { votingPolls, loading } = useVotingPolls(clubId)

    if (loading) {
        return <div>Loading...</div>
    }

    return (<div className={classes.root}>
        <Grid container spacing={3}>
            {votingPolls.map(poll => (
                <Grid key={poll.id} item xs={12}>
                    <VotingPollCard
                        clubId={clubId}
                        pollId={poll.id}
                        title={poll.title}
                        description={poll.description}
                        startTime={poll.startTime.toDate()}
                        endTime={poll.endTime.toDate()}
                    />
                </Grid>
            )
            )}
        </Grid>
    </div>)
}



export default VotingPollsView