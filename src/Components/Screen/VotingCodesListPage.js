import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useVotingCodes } from '../Hooks/Polls/polls';
import { polls } from '../../services';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';


const useStyles = makeStyles({
    root: {
        width: '100%',
        overflowX: 'auto',
    },
    table: {
        minWidth: 200,
    },
});


const VotingCodesListPage = () => {
    let { clubId, pollId } = useParams();
    const [processing, setProcessing] = useState(false)
    const { votingCodes, loading } = useVotingCodes(clubId, pollId)
    const classes = useStyles();

    if (loading) {
        return <div>Loading...</div>
    }

    if (votingCodes.length === 0) {
        return (
            <span>
                Няма изгенериране кодове за този poll. Изгенерирай кодове?
                <Button size="small" disabled={processing} onClick={() => {
                    setProcessing(true)
                    polls.generateVotingCodes(clubId, pollId).then(response => {
                        setProcessing(false)
                    }).catch(error => {
                        setProcessing(false)
                    })
                }}>{processing ? 'Обработване...' : 'ДА'}
                </Button>
            </span>)
    }



    return <div>
        <Button size="small" component={RouterLink} to={`/clubs/${clubId}/voting-polls`}>КЪМ СПИСЪКА</Button>
        <Paper className={classes.root}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="left">Код</TableCell>
                        <TableCell align="left">Използван</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {votingCodes.map(row => (
                        <TableRow key={row.code}>
                            <TableCell align="left">{row.code}</TableCell>
                            <TableCell align="left">{row.usedOn ? 'Да' : 'Не'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    </div>
}

export default VotingCodesListPage