const auth = require('./auth')
const vote = require('./voting_poll')

exports.createToken = auth.createToken;
exports.registerVote = vote.registerVote;
exports.generateVotingCodes = vote.generateVotingCodes;