const bcrypt = require('bcrypt')

async function hashPassword(password) { // updated
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    return hash
}

var args = process.argv.slice(2);

switch (args[0]) {
    case '-hashPassword':
        if (!args[1] || args[1].length <= 3) {
            console.log('password is not specified or too short')
        } else {
            hashPassword(args[1]).then(result => {
                console.log(result);
            })
        }
        break;
    default:
        console.log('Sorry, that is not something I know how to do.');
        console.log('Usage: node club-admin-cli [-hashPassword] arg')
}

