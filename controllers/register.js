const handleRegister = (req, res, db, bcrypt) => {
    const {email, password, name} = req.body;
    if (!email || !password || !name) {
        return res.status(400).json('Must enter values for all fields!')
    }
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash,
            email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
                .returning('*') // Return all columns for this inserted row
                .insert({
                    email: loginEmail[0].email,
                    name: name,
                    joined: new Date()
                })
                .then(user => {
                    res.json(user[0]);
                })
            })
        .then(trx.commit)
        .catch(trx.rollback)
        })
        .catch(err => res.status(400).json('unable to register'));
    
};

export {handleRegister};