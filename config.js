module.exports = {


	app:{
		port:3000
	},

	fileUpload:{
		limits: { fileSize: 1 * 1024 * 1024 },
		uploadFolder: '/public/uploads/'
	},

	spotify:{
		credentials:{
			
			clientId : 'aeda8e473342414b8c919fddf52f24c3',
			clientSecret : 'f132559b2e5e4a6c9bcc383aafc7a2e5',
			redirectUri : 'http://localhost:3000/callback/'
		}
	},

	lastfm:{
		credentials:{

			apikey: '625a1295c0bde1bd445b4885d67b60ac'
		},

		keyWordValueMapping:{

			METHOD: 'method',
			GET_TRACK_INFO_METHOD: 'method=track.getInfo',
			SEARCH_TRACK_METHOD: 'method=track.search',
			ARTIST: 'artist',
			TRACK: 'track',
			API_KEY:'api_key',
			JSON_FORMAT:'format=json',
			MBID: 'mbid'
		},

		apiHomeEndpoint: 'http://ws.audioscrobbler.com/2.0/'
		
	},

	urlOptions:{

		urlParamDelimiter:'?',
		paramDelimiter:'&'
	}
	
}