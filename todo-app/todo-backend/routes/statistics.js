const express = require('express');
const router = express.Router();
const redis = require('../redis')

/* GET index data. */
router.get('/', async (req, res) => {

    let added_todos = await redis.getAsync("added_todos") || 0;
    added_todos = Number(added_todos);

    res.send({
        added_todos
    });
});

module.exports = router;