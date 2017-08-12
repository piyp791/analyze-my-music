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
  var trackInfo = {}
  var spotifyTrackIDInfo = await (api_util.getTrackIdFromSpotify(query));
  //console.log('spotify track ID info for query ' +query + ' -->' +JSON.stringify(spotifyTrackIDInfo))
  var spotifyTrackID = spotifyTrackIDInfo.body.tracks.items[0].id
  //console.log('spotify track id info-->' +JSON.stringify(spotifyTrackID));

  var spotifyTrackInfo = await (api_util.getMusicInfoFromSpotify(spotifyTrackID));
  //console.log('spotify music info -->' +JSON.stringify(spotifyTrackInfo));
  trackInfo.spotifyInfo = spotifyTrackInfo

  var lastFMTrackIDInfo = await (api_util.getTrackIdFromLastFM(query));
  console.log('track id info ->' + lastFMTrackIDInfo)

  var lastfmTags = await (api_util.getTagsFromLastFM(lastFMTrackIDInfo));

  var tags = []
  for(var i=0;i< lastfmTags.length;i++){
    console.log('tags -->' +lastfmTags[i].name)
    if(lastfmTags[i].name && lastfmTags[i].name!=undefined && misc_util.filterTags(lastfmTags[i].name) == 'True'){
      tags.push(lastfmTags[i].name)  
    }
    
  }

  trackInfo.tags = tags      
  //console.log('track info -->' +JSON.stringify(trackInfo));
  return trackInfo

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

                var counter = 0
                totalQuery = queryArr.length

                processedQuery = 0
                queryArr.forEach(function(query, err){
                  console.log('Processing query -->' + query)
                   getGenreInfo(query).then(function(genreObj){
                   
                    spotifyObj = misc_util.extractInfo(genreObj.spotifyInfo.body)
                    tagObj = genreObj.tags


                    var finalObj = {}
                    finalObj.genreInfo = spotifyObj
                    finalObj.tagInfo = tagObj

                    //console.log('genre object-->' + JSON.stringify(spotifyObj))
                    //console.log('tags-->' + tagObj)
                    results[query] = finalObj
                    counter+=1
                    console.log('*****************processed ************ ' + counter)

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

                    console.log('Something went wrong with getting genreinfo for ' + query + ' -->' +err)
                   
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