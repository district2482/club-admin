import Survey from "material-survey/components/Survey"
import { Link, Typography } from "@material-ui/core";
import CompleteIcon from "@material-ui/icons/Check"
import { useParams } from "react-router-dom";
import { useVotingPoll } from "../Hooks/Polls/polls";
import { useState } from "react";
import { useConfirm } from 'material-ui-confirm';
import { polls } from "../../services";
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

const Warning = ({ title, onRetry }) => {
    return (
        <div>
            <Alert severity="warning">
                <AlertTitle>Warning</AlertTitle>
                {title}
                <Link
                    variant="button"
                    color="textPrimary"
                    onClick={e => {
                        e.preventDefault()
                        onRetry()
                    }} href="#" >ОПИТАЙ ОТНОВО.</Link>
            </Alert>

        </div>
    )
}

const VoteCompletedMessage = () => {
    return (
        <div>
            <Alert severity="success">
                Гласът ви е подаден успешно. Благодарим ви че гласувахте.
            </Alert>
        </div>
    )
}

const codeToErrorMessage = {
    bad_code: 'Кода за гласуване е невалиден ',
    server_error: 'Възникнала е грешка при обработката  ',
    code_was_already_used: 'Кода за гласуване е вече използван  ',
}

const VotingPoll = () => {
    const { clubId, pollId } = useParams()
    const { votingPoll, loading } = useVotingPoll(clubId, pollId)
    const [processing, setProcessing] = useState(false)
    const [completed, setCompleted] = useState(false)
    const [error, setError] = useState(null)

    const confirm = useConfirm();

    if (loading) {
        return <div>Loading...</div>
    }

    const votingQuestions = votingPoll.ballots.map(ballot => {
        return {
            name: ballot.id,
            title: ballot.title,
            type: ballot.type,
            choices: ballot.choices,
        }
    })

    const handleRetry = () => {
        setError(null)
    }

    if (processing) {
        return (
            <Typography component="h3" variant="subtitle2" align="center">
                Гласът ви се обработва. Моля изчакайте...
            </Typography>
        )
    }

    if (error && codeToErrorMessage[error]) {
        return (
            <Warning title={codeToErrorMessage[error]} onRetry={handleRetry} />
        )
    }

    if (completed) {
        return (<VoteCompletedMessage />)
    }

    return (
        <>
            <Typography component="h1" variant="h4" align="center">
                {votingPoll.title}
            </Typography>
            <Survey
                variant={'flat'}
                completeText={<>
                    <CompleteIcon style={{ marginRight: 4 }} />
                    Завърши
                </>}
                onFinish={answers => {
                    confirm({ title: 'Продължи с регистрацията на вота?', confirmationText: 'Продължи', cancellationText: 'Откажи', dialogProps: { disableBackdropClick: true } })
                        .then(() => {
                            const { pollVotingCode, ...rest } = answers
                            const vote = Object.keys(rest).map(it => ({ id: it, votes: rest[it] }))

                            setProcessing(true)
                            polls.vote(clubId, pollId, pollVotingCode, vote).then(response => {
                                if (response.data.status !== 'success') {
                                    setError(response.data.status)
                                } else {
                                    setCompleted(true)
                                }

                                setProcessing(false)
                            }).catch(err => {
                                setError('server_error')
                                setProcessing(false)
                            })
                        })
                        .catch(() => { /* ... */ });
                }}
                form={{
                    questions: [
                        ...votingQuestions,
                        {
                            name: "pollVotingCode",
                            title: "Въведете код за гласуване",
                            type: "text",
                            validators: [
                                {
                                    regex: "^\\d{7}$",
                                    text: "Моля въведете 7 цифрен код за гласуване",
                                    type: "regex"
                                }
                            ],
                            isRequired: true,

                        }
                    ]
                }}
            />
        </>

    );
}

export default VotingPoll;