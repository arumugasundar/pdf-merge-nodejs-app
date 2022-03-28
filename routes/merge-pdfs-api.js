const express = require("express");
const https = require('https');
const fs = require('fs');
const PDFMerger = require('pdf-merger-js');

const router = express.Router();

router.post('/', async (req,res) => {

    const labels = req.body.labelUrl;
    let merger = new PDFMerger();
  
    for( let i in labels){
      const file = fs.createWriteStream('label.pdf');

      try{
        https.get(labels[i], async function(response) {response.pipe(file);});
      }catch(error) {console.log('Error in fetching pdfs from downloadable link', error);};

      try{
        merger.add('label.pdf');
      }catch(error) {console.log('Error in merging pdfs', error);};

    }

    await merger.save('mergedLabels.pdf').catch((error) => {
        console.log('Error in saving merged pdf', error);
    });
  
    let file = fs.createReadStream('mergedLabels.pdf');
    let stat = fs.statSync('mergedLabels.pdf');
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=label.pdf');
    file.pipe(res);
  
  });
  
  module.exports = router;