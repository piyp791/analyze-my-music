# analyze-my-music

An Node JS based web application to visualize musical preferences using [Spotofy's API](https://developer.spotify.com/web-api/get-audio-features/) in terms of attributes like tempo, energy, valence, danceability etc 
along with genre tags obtained from [LastFM's API](https://www.last.fm/api/show/track.getInfo).

## Project setup

1. Download the project.
2. Run the 
``npm install`` command in the command line to install the dependencies.
3. Create a Spotify application using instructions from [this](https://developer.spotify.com/documentation/general/guides/app-settings/#register-your-app) link.
4. Get the client ID and client scret that you would need for accessing the Spotify endpoints.
5. Modify the ```config.js``` file and enter your Spotify client ID and client secret.
3. Open the URL ``localhost:3000`` in the browser.
4. Upload a text file with the music library details i.e. song names along with the artist names.
Sample text files are present in the /sample_subject_preferences folder.

## Screnshots



![results visualization](./images/results1.png)

![results visualization](./images/results2.png)

![results visualization](./images/results3.png)

![results visualization](./images/results4.png)

![songs genre tags](./images/results5.png)

## Future work

1. Exporting playlists directly from spotify and using it for analysis instead of manually entering details.
2. Exporting results to a PDF document.
3. Fetching related artists and songs using the the Spotify API.
4. Extending the playlist export service to other music straming services such as Google play music.

    
