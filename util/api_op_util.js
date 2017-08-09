var conf = require('../config');
var SpotifyWebApi = require('spotify-web-api-node');
var SpotifyWebApi = require('../spotify-source/server');
var misc_util = require('./misc_op_util');
var http_util = require('./http_op_util');
var async= require('async')

var spotifyApi = new SpotifyWebApi(conf.spotify.credentials);


module.exports = {

	getGenreFromDeezer:function(metadata){

		console.log('get genre from getGenreFromDeezer function called')		
		
		try{
			//metadata = null
			var deezerGenreIdList = metadata.external_metadata.deezer.genres 
		}catch(ex){
			console.log(ex)
			//throw new Error('Error accessing deezer genre list from metadata' +ex.message)
		}
		
  		//console.log('deezer genre id list-->' +JSON.stringify(deezerGenreIdList));

		var genreList = "";

		return new Promise(function(resolve, reject){
			async.each(deezerGenreIdList, iterator, done); 
		
			//:-->TBD: separate these out of this module.
			function iterator(jsonId, callback){

				//console.log('iterator called with json id ' +JSON.stringify(jsonId))
				var genreId = jsonId.id
				var host = conf.deezer.apiHomeEndpoint + conf.deezer.genreEndPoint;  //-->TBD :split config file 
				var url = host + genreId;

				http_util.fetchHttpResponse(url).then(function(body){

					try{
						var genre_name = misc_util.buildString(body).name
						genreList+=genre_name
						//console.log('genre list-->' +genreList)
					}catch(ex){
						console.log('Deezer Error:: Some error occured while building genre string :' +ex.message)
					}
					
					callback();
				});
			}

			function done(err){
				if(err) reject(err)
				
				resolve(genreList)		
			}
		})
	},

	getGenreFromWikipedia:function(metadata, cb){

		console.log('get genre from getGenreFromWikipedia function called')
		try{
			var songName = metadata.title;
			var artistList = metadata.artists;

			//console.log('song name->' +songName + ' artist name' + JSON.stringify(artistList));

			artistNameStr = "";
			for(var i in artistList){
				artistNameStr = artistNameStr + "," + artistList[i].name;
			}

			artistNameStr = artistNameStr.substring(1);

			//console.log('artist name string --->' + artistNameStr)

			var pyScriptArgStr = songName + " " + artistNameStr

			//console.log('arguments to python script-->' +pyScriptArgStr)
	
		}catch(ex){
			console.log(ex)
			//throw new Error('Wikipedia data pre processing error')
		}
		
		var options = {
  			mode: 'text',
  			args: [pyScriptArgStr]
  			//args: ['Stairway to Heaven Led Zeppelin']
		};

		return new Promise(function(resolve, reject){
			misc_util.executePythonScript('wikipedia.py', options).then(function(results){
				resolve(results)
			});
		});
		
	
	},

	getMusicInfoFromSpotify: function(metadata){

		//console.log('get genre from getMusicInfoFromSpotify function called with parameters' + JSON.stringify(metadata));

		console.log('get genre from getMusicInfoFromSpotify function called');
		
		try{
			//var spotifyTrackId = metadata.external_metadata.spotify.track.id;
			var spotifyTrackId  = metadata
			console.log('spotify track id-->' +spotifyTrackId);
		}catch(ex){
			console.log(ex)
			//throw new Error('Error accessing spotify track id from matadata' +ex)
		}
		
		return new Promise(function(resolve, reject){

			// Retrieve an access token
			spotifyApi.clientCredentialsGrant()
			  .then(function(data) {
			    //console.log('The access token expires in ' + data.body['expires_in']);
			    //console.log('The access token is ' + data.body['access_token']);

			    // Save the access token so that it's used in future calls
			    spotifyApi.setAccessToken(data.body['access_token']);
			    
			    spotifyApi.getAudioFeaturesForTrack(spotifyTrackId)
			      .then(function(data) {
			        //console.log('spotify data-->' +JSON.stringify(data.body));
			        //cb(null, data.body)
			        resolve(data)

			    }, function(err) {
			        //done(err);
			        //cb(err, null)
			        reject(err)
			    });

			  }, function(err) {
			    console.log('Something went wrong when retrieving an access token', err.message);
			    //cb(err, null)
			    reject(err)
			});	
		})
	},



	getTrackIdFromSpotify: function(query){

		console.log('get track id FromSpotify function called');
		
	
		return new Promise(function(resolve, reject){

			// Retrieve an access token
			spotifyApi.clientCredentialsGrant()
			  .then(function(data) {
			    //console.log('The access token expires in ' + data.body['expires_in']);
			    //console.log('The access token is ' + data.body['access_token']);

			    // Save the access token so that it's used in future calls
			    spotifyApi.setAccessToken(data.body['access_token']);
			    
			    //spotifyApi.searchTracks('track:Alright artist:Kendrick Lamar')
			    spotifyApi.searchTracks(query)
  				.then(function(data) {
    				//console.log('query results', data.body);
    				resolve(data)
  				}, function(err) {
    				console.log('Something went wrong searcching for tracks!', err);
  				});

			  }, function(err) {
			    console.log('Something went wrong when retrieving an access token', err.message);
			    //cb(err, null)
			    reject(err)
			});	
		})
	},



	getTagsFromLastFM: function(metadata){

		console.log('get genre from getTagsFromLastFM function called');

		var host = conf.lastfm.apiHomeEndpoint;

		try{
			var songName = metadata.title;
			var artistList = metadata.artists;
			var artistNameStr = "";
			for(var i in artistList){
				artistNameStr = artistNameStr + "," + artistList[i].name;
			}

			artistNameStr = artistNameStr.substring(1);
			//console.log('artist name string --->' + artistNameStr)

			var method = conf.lastfm.keyWordValueMapping.METHOD + '=' + conf.lastfm.keyWordValueMapping.GET_TRACK_INFO_METHOD;
			//console.log('get info track method -->' + method)

			var apiKey = conf.lastfm.credentials.apikey;

			url = host + conf.urlOptions.urlParamDelimiter + 
			conf.lastfm.keyWordValueMapping.GET_TRACK_INFO_METHOD + conf.urlOptions.paramDelimiter + 
			conf.lastfm.keyWordValueMapping.ARTIST + '=' + artistNameStr + conf.urlOptions.paramDelimiter + 
			conf.lastfm.keyWordValueMapping.TRACK + '=' + songName + conf.urlOptions.paramDelimiter + 
			conf.lastfm.keyWordValueMapping.API_KEY + '=' + conf.lastfm.credentials.apikey + conf.urlOptions.paramDelimiter + 
			conf.lastfm.keyWordValueMapping.JSON_FORMAT;

			//console.log('url-->' + url)
		}catch(ex){
			console.log('Preprocessing error-->' +ex)
			//throw new Error('Preprocessing Error Lastfm->' +ex)
		}

		return new Promise(function(resolve, reject){
			
			http_util.fetchHttpResponse(url).then(function(body){

				var toptags = misc_util.buildString(body).track.toptags.tag;
				resolve(toptags)
			});
		
		})

	},

	getResults: function(){
		console.log('get results')
	}

}



