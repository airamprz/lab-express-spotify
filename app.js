require('dotenv').config();

const express = require('express');
const router = express.Router();
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

console.log(process.env.CLIENT_ID);

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use('/', router);

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
router.get('/', (req, res) => {
    res.render('index');
});

router.get('/artist-search', (req, res) => {
    const artistName = req.query.artistName;
    spotifyApi.searchArtists(artistName)
        .then(data => {
            const artists = data.body.artists.items;
            res.render('artist-search-results', { artists });
        })
        .catch(error => console.log('Error searching for the artist', error));
});

app.get('/albums/:artistId', (req, res, next) => {
    const artistId = req.params.artistId;
    spotifyApi.getArtistAlbums(artistId)
        .then(data => {
            const albums = data.body.items;
            res.render('albums', { albums });
        })
        .catch(error => console.log('Error fetching albums of the artist', error));
});

app.get('/tracks/:albumId', (req, res, next) => {
    const albumId = req.params.albumId;
    spotifyApi.getAlbumTracks(albumId)
        .then(data => {
            const tracks = data.body.items;
            res.render('tracks', { tracks });
        })
        .catch(error => console.log('Error fetching tracks of the album', error));
});

module.exports = router;


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
