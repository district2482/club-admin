import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Link as RouterLink } from 'react-router-dom';
import { useParams } from "react-router-dom"
import { useVoteResults } from '../Hooks/Polls/polls'

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



const VotingPollResults = () => {
    const classes = useStyles();
    const { clubId, pollId } = useParams()
    const { voteResults, loading } = useVoteResults(clubId, pollId)

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography variant="h5" component="h2">Протокол от гласуване на {voteResults.votingPoll.title}</Typography>
                <Typography className={classes.pos} color="textSecondary">
                    {voteResults.votingPoll.description}
                </Typography>
                <Typography variant="subtitle2" component="p">Общо с право на глас: {voteResults.votingPoll.voteMemberCount}</Typography>
                <Typography variant="subtitle2" component="p">Гласували общо: {voteResults.votesCount}</Typography>

                {voteResults.ballots.map(ballot => (
                    <div key={ballot.id}>
                        <Box key={ballot.id} fontWeight="fontWeightMedium" textAlign="justify" m={0}>
                            {ballot.title}
                        </Box>
                        {ballot.results.map(result => (
                            <Box key={result.value} fontWeight="fontWeightRegular" textAlign="justify" m={1}>
                                {result.text}: {result.voteCount} {result.voteCount === 1 ? 'глас' : 'гласа'}
                            </Box>
                        ))}
                    </div>
                ))}
            </CardContent>
            <CardActions>
                <Button size="small" component={RouterLink} to={`/clubs/${clubId}/voting-polls`}>Към списъка</Button>
            </CardActions>
        </Card>
    );
}

export default VotingPollResults