const express = require("express");
const https = require('https');
const fs = require('fs');
const PDFMerger = require('pdf-merger-js');
const crypto = require('crypto');

const router = express.Router();

router.post('/', (req,res) => {
  const labels = req.body.labelUrl; /* array of pdf downloadable links */
  try{
    let merger = new PDFMerger(); /* variable used to merge and save pdfs */
    let count = 0; /* variable to keep track of number of responses collected from downloadable links */
    for(let i = 0;i<labels.length;i++){
        const fileName = crypto.randomUUID() + '.pdf'; /* randomized file name */
        const file = fs.createWriteStream(fileName,  {
          flags: "w",
          encoding: "utf8",
          mode: 0o666,
          autoClose: true,
          emitClose: true,
          start: 0
        });
        https.get(labels[i], (resp) => {
          resp.pipe(file); /* store the response from get request to the file */
          file.on('finish', () => { /* listening for file completion state */
            try{
              merger.add(fileName);  /* add the current file data into merger variable */
              fs.unlinkSync(fileName); /* delete the file after storing its content to merger */
              count += 1; /* incrementing number of collected response */
              if( count == labels.length){ /* check whether number of response collected is equal to number of labels */
                const mergedFileName = crypto.randomUUID() + '.pdf';
                merger.save(mergedFileName).then(() => { /* send response after saving the merged file */
                  try{
                    let stat = fs.statSync(mergedFileName);
                    res.setHeader('Content-Length', stat.size);
                    res.setHeader('Content-Type', 'application/pdf');
                    res.setHeader('Content-Disposition', 'attachment; filename=label.pdf');
                    res.download(mergedFileName, function(err) { /* callback to delete the file after sending response */
                      if (err) {
                        console.log(err);
                      }
                      console.log('file deleted');
                      fs.unlinkSync(mergedFileName);
                    });
                  }catch(err){
                    console.log("error in saving merged pdf");
                  }
                });
              }
            }catch(err){
              console.log("error in merging pdf");
            }
          });
        });
    }
  }catch(err){
    res.status(500).send({error:err.toString(),errorText:"Merged pdf not generated"});
  }
});
  
module.exports = router;