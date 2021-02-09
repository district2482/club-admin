import React, { useEffect } from 'react';
import firebase from '../../../firebase'
import groupBy from 'lodash/groupBy'
import countBy from 'lodash/countBy'
import flatMap from 'lodash/flatMap'

export function useVotingPolls(clubId) {
    // initialize our default state
    const [error, setError] = React.useState(false)
    const [loading, setLoading] = React.useState(true)
    const [votingPolls, setVotingPolls] = React.useState([])

    // when the id attribute changes (including mount)
    // subscribe to the recipe document and update
    // our state when it changes.
    useEffect(
        () => {
            const unsubscribe = firebase.firestore().collection(`clubs/${clubId}/voting_polls`).onSnapshot(querySnapshot => {
                var votingPolls = [];
                querySnapshot.forEach(function (doc) {
                    votingPolls.push({ id: doc.id, ...doc.data() });
                });

                setLoading(false)
                setVotingPolls(votingPolls)
                // setRecipe(doc) }, err => { setError(err) } )
            }, err => { setError(err) })

            // returning the unsubscribe function will ensure that
            // we unsubscribe from document changes when our id
            // changes to a different value.
            return () => unsubscribe()
        },
        [clubId]
    )

    return {
        error,
        loading,
        votingPolls,
    }
}

export function useVotingCodes(clubId, pollId) {
    // initialize our default state
    const [error, setError] = React.useState(false)
    const [loading, setLoading] = React.useState(true)
    const [votingCodes, setVotingCodes] = React.useState([])

    // when the id attribute changes (including mount)
    // subscribe to the recipe document and update
    // our state when it changes.
    useEffect(
        () => {

            let unsubscribe;
            const fetchVotingCodes = async () => {
                unsubscribe = firebase.firestore().collection(`clubs/${clubId}/voting_codes`).where('pollId', '==', pollId)
                    .onSnapshot(
                        documentSnapshot => {
                            setVotingCodes(documentSnapshot.docs.map(it => ({ id: it.id, ...it.data() })))
                            setLoading(false)
                        },
                        err => {
                            setError(err)
                            setLoading(false)
                        }
                    )
            }

            fetchVotingCodes()
            return () => unsubscribe()
        },
        [clubId, pollId]
    )

    return {
        error,
        loading,
        votingCodes,
    }
}

export const useVotingPoll = (clubId, pollId) => {
    // initialize our default state
    const [error, setError] = React.useState(false)
    const [loading, setLoading] = React.useState(true)
    const [votingPoll, setVotingPoll] = React.useState({})

    useEffect(
        () => {
            let unsubscribe;
            const fetchPoll = async () => {
                unsubscribe = firebase.firestore().doc(`clubs/${clubId}/voting_polls/${pollId}`)
                    .onSnapshot(
                        documentSnapshot => {
                            if (!documentSnapshot.exists) {
                                setError('poll not found')
                                return
                            }

                            setVotingPoll({ id: documentSnapshot.id, ...documentSnapshot.data() })
                            setLoading(false)
                        },
                        err => {
                            setError(err)
                            setLoading(false)
                        }
                    )
            }

            fetchPoll()
            return () => unsubscribe()
        },
        [clubId, pollId]
    )

    return {
        error,
        loading,
        votingPoll,
    }
}

export const useVoteResults = (clubId, pollId) => {
    // initialize our default state
    const [error, setError] = React.useState(false)
    const [loading, setLoading] = React.useState(true)
    const [voteResults, setVoteResults] = React.useState({})


    useEffect(
        () => {
            let unsubscribe;
            const fetchVoteResults = async () => {
                const doc = await firebase.firestore().doc(`clubs/${clubId}/voting_polls/${pollId}`).get()
                const votingPoll = doc.data()

                unsubscribe = firebase.firestore().collection(`clubs/${clubId}/votes`).where('pollId', '==', pollId)
                    .onSnapshot(
                        querySnapshot => {
                            let votes = []
                            querySnapshot.forEach(function (doc) {
                                votes.push(doc.data())
                            });

                            const ballotResults = calculateResults(votingPoll, votes)
                            setVoteResults({
                                votingPoll: votingPoll,
                                voteMemberCount: votingPoll.voteMemberCount,
                                votesCount: votes.length,
                                ballots: ballotResults
                            })
                            setLoading(false)
                        },
                        err => {
                            setError(err)
                            setLoading(false)
                        }
                    )
            }

            fetchVoteResults()
            return () => unsubscribe()
        },
        [clubId, pollId]
    )

    return {
        error,
        loading,
        voteResults,
    }
}

function calculateResults(votingPoll, votes) {
    let ballotVotes = flatMap(votes, vote => vote.ballot)
    let byBallot = groupBy(ballotVotes, ballot => ballot.id)
    let voteResult = {}
    Object.keys(byBallot).forEach(ballotId => {
        let allVotesByBallot = flatMap(byBallot[ballotId], vote => vote.votes)
        voteResult[ballotId] = countBy(allVotesByBallot)
    })

    return votingPoll.ballots.map(ballot => {
        return {
            id: ballot.id,
            title: ballot.title,
            results: ballot.choices.map(choice => {
                const voteCount = voteResult[ballot.id] && voteResult[ballot.id][choice.value] ? voteResult[ballot.id][choice.value] : 0
                return { ...choice, voteCount }
            })
        }
    })
}

