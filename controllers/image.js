import fetch from "node-fetch";

const returnClarifaiRequestOptions = (imageUrl) => {
    const PAT = process.env.PAT;
    const USER_ID = process.env.USER_ID;       
    const APP_ID = process.env.APP_ID;
    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": imageUrl
                    }
                }
            }
        ]
    });
  
    return {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };
  }

const handleApiCall = (req, res) => {
    fetch("https://api.clarifai.com/v2/models/" 
        + 'face-detection' 
        + "/outputs", 
        returnClarifaiRequestOptions(req.body.input))
        .then(response => response.text())
        .then(result => {
            res.json(result);
        })
        .catch(err => res.status(500).json('Unable to communicate with Clarifai API'));
};

const handleEntries = (req, res, db) => {
    const {id} = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('unable to get entries'))
};

export {handleEntries, handleApiCall};

