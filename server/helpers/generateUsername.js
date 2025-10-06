function generateUsername(email, firstName, lastName) {
    const first = (firstName || '').trim().toLowerCase();
    const last = (lastName || '').trim().toLowerCase();
    
    if (first && last) {
        return `${first}.${last}${Math.floor(Math.random() * 1000)}`;
    } else if (first) {
        return `${first}${Math.floor(Math.random() * 10000)}`;
    } else if (last) {
        return `${last}${Math.floor(Math.random() * 10000)}`;
    } else {
        return `${email.split('@')[0].toLowerCase()}${Math.floor(Math.random() * 1000)}`;
    }
}

module.exports = generateUsername;
