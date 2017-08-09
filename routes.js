var conf = require('./config');
var api_util = require('./util/api_op_util');
var file_util = require('./util/file_op_util');
var misc_util = require('./util/misc_op_util');
var http = require('http');
//var trackInfoDto = require('./models/trackCompleteInfo_dto');
//var extractInfo_util = require('./util/extractInfo_op_util');

var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs')); // adds Async() versions that return promises 

var async = require('asyncawait/async');
var await = require('asyncawait/await');
var busboy = require('connect-busboy'); //middleware for form/file upload
var path = require('path');     //used for file path
var fs = require('fs-extra');       //File System - for file manipulation


var path = require('path');
var _ = require('lodash'); 

var getGenreInfo = async (function(query){

  console.log("getting genre info for query: " + query)
  
  //Get info from spotify
  var spotifyTrackIDInfo = await (api_util.getTrackIdFromSpotify(query));
  var spotifyTrackID = spotifyTrackIDInfo.body.tracks.items[0].id
  console.log('spotify track id info-->' +JSON.stringify(spotifyTrackID));

  var spotifyTrackInfo = await (api_util.getMusicInfoFromSpotify(spotifyTrackID));
  //console.log('spotify music info -->' +JSON.stringify(spotifyTrackInfo));

  return spotifyTrackInfo;

});


module.exports = function(app) {

    app.post('/upload', function(req, res) {

      var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {

          if(!filename){
            res.send('No files were uploaded.');
            return;
          }
          console.log("fieldname-->" +fieldname);
          console.log("file->" +file)

          //Path where file will be uploaded
          var uploadFilePath = __dirname+ conf.fileUpload.uploadFolder + filename
          fstream = fs.createWriteStream(uploadFilePath);
          file.pipe(fstream);
          fstream.on('close', function () {    
              console.log("Upload Finished of " + filename);      
          
              results = {}

              var lineReader = require('readline').createInterface({
                input: require('fs').createReadStream(uploadFilePath)
              });

             
              queryArr = []
              lineReader.on('line', function (line) {
                console.log('Line from file:', line);

                if(line.length > 0){
                  queryArr.push(line)

                } 
              }).
              on('close', function(err){

                //send the results back to the 
                totalQuery = queryArr.length

                processedQuery = 0
                queryArr.forEach(function(query, err){
                  console.log('Processing query -->' + query)
                   getGenreInfo(query).then(function(genreObj){
                   
                    genreObj = misc_util.extractInfo(genreObj.body)
                    console.log('genre object-->' + JSON.stringify(genreObj))
                    results[query] = genreObj


                    processedQuery ++
                    if(totalQuery == processedQuery){
                      console.log('Processing done')

                      //send the results to the front end
                      console.log('results--> %j'+ results)
                      res.render('home.ejs', {response : results});  

                    }
                    
                  })
                  .catch(function(err){

                    processedQuery ++
                    if(totalQuery == processedQuery){
                      console.log('Processing done')

                      //send the results to the front end
                      console.log('results--> %j'+ results)
                      res.render('home.ejs', {response : results});  

                    }

                    console.log('Something went wrong -->'+ err)
                   
                  })

                })

              })
          });
         });

      });

    app.get('/result', function(req, res){
      var response = req.query.resObj
      console.log('redirected to /result with response object--->' +response)
      res.render('home.ejs', {response : JSON.parse(response)});  
    });
  }