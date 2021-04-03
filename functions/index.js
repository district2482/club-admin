const auth = require('./auth')
const vote = require('./voting_poll')
const mail = require('./mail')

exports.createToken = auth.createToken;
exports.registerVote = vote.registerVote;
exports.generateVotingCodes = vote.generateVotingCodes;
exports.sendEmail = mail.sendEmail;