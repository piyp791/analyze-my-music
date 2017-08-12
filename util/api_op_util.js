var conf = require('../config');
var SpotifyWebApi = require('spotify-web-api-node');
var SpotifyWebApi = require('../spotify-source/server');
var misc_util = require('./misc_op_util');
var http_util = require('./http_op_util');
var async= require('async')

var spotifyApi = new SpotifyWebApi(conf.spotify.credentials);


module.exports = {

	
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


	getTrackIdFromLastFM: function(query){

		console.log('get track id From LastFM function called');
		
	
		var host = conf.lastfm.apiHomeEndpoint;

		query = misc_util.encodeUrl(query)

		try{
			
			var songName = query
			var method = conf.lastfm.keyWordValueMapping.METHOD + '=' + conf.lastfm.keyWordValueMapping.SEARCH_TRACK_METHOD;
			//console.log('get info track method -->' + method)

			var apiKey = conf.lastfm.credentials.apikey;

			url = host + conf.urlOptions.urlParamDelimiter + 
			conf.lastfm.keyWordValueMapping.SEARCH_TRACK_METHOD + conf.urlOptions.paramDelimiter +  
			conf.lastfm.keyWordValueMapping.TRACK + '=' + songName + conf.urlOptions.paramDelimiter + 
			conf.lastfm.keyWordValueMapping.API_KEY + '=' + conf.lastfm.credentials.apikey + conf.urlOptions.paramDelimiter + 
			conf.lastfm.keyWordValueMapping.JSON_FORMAT;


			console.log('url-->' + url)
		}catch(ex){
			console.log('Preprocessing error-->' +ex)
			//throw new Error('Preprocessing Error Lastfm->' +ex)
		}

		return new Promise(function(resolve, reject){
			
			http_util.fetchHttpResponse(url).then(function(body){

				mbid = ''

				var results_ar = misc_util.buildString(body).results.trackmatches.track
				console.log('results array -->' + results_ar.length)
				for (var i=0;i<results_ar.length;i++){
					var result = results_ar[i]
					if(result.mbid != '' && result.mbid.length>0){
						mbid = result.mbid
						break
					}
				}
				if(mbid == ''){
					mbid = 'None'
				}
				console.log('mbid -->', mbid)
				resolve(mbid)
			})
			.catch(function(err){
				console.log('some error')
				resolve('None')
			});
		
		})

	},

	getTagsFromLastFM: function(trackID){

		//trackID = '985609ad-0cd2-4355-8ae9-b3e04442fca7'

		console.log('get genre from getTagsFromLastFM function called');

		var host = conf.lastfm.apiHomeEndpoint;

		try{
			
			var method = conf.lastfm.keyWordValueMapping.METHOD + '=' + conf.lastfm.keyWordValueMapping.GET_TRACK_INFO_METHOD;
			//console.log('get info track method -->' + method)

			var apiKey = conf.lastfm.credentials.apikey;

			url = host + conf.urlOptions.urlParamDelimiter + 
			conf.lastfm.keyWordValueMapping.GET_TRACK_INFO_METHOD + conf.urlOptions.paramDelimiter + 
			conf.lastfm.keyWordValueMapping.MBID + '=' + trackID + conf.urlOptions.paramDelimiter + 
			conf.lastfm.keyWordValueMapping.API_KEY + '=' + conf.lastfm.credentials.apikey + conf.urlOptions.paramDelimiter + 
			conf.lastfm.keyWordValueMapping.JSON_FORMAT;

			console.log('url-->' + url)
		}catch(ex){
			console.log('Preprocessing error-->' +ex)
			//throw new Error('Preprocessing Error Lastfm->' +ex)
		}

		return new Promise(function(resolve, reject){
		
			console.log('track id -->' +trackID)
			if(trackID!='None'){

				http_util.fetchHttpResponse(url).then(function(body){

				
					var toptags = misc_util.buildString(body).track.toptags.tag;
					resolve(toptags)

				});

			}else{
				console.log('resolved with None')
				resolve('None')
			}
			

		}, function(err){
			console.log('error while fetching tags -->' + err)
			reject('None')
		});

	}
}



