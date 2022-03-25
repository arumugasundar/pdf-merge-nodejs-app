const express = require('express');
const app = express();
const MERGE_PDFS_API = require('./routes/merge-pdfs-api');

app.use(express.json({limit: '20mb'}));
app.use(express.urlencoded({ extended: false, limit: '20mb' }));

app.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers","*");
    res.setHeader("Access-Control-Allow-Methods","GET, POST, PATCH, PUT, DELETE, OPTIONS")
    next();
});

app.use('/api/merge-pdfs',MERGE_PDFS_API);

module.exports = app;