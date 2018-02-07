require("dotenv").config();

var keys = require("./keys.js");

var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var inputRequest = process.argv[2];

var inquirer = require("inquirer");

// --------------------------------------------------------
// Original action prompt
// --------------------------------------------------------

inquirer.prompt([
	{
		type: 'list',
		name: 'userOption',
		message: 'What Liri application would you like to run?',
		choices: ['my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says']
	}

]).then(function(inquirerResponse) {

	var inputRequest = inquirerResponse.userOption;

	if (inputRequest === "my-tweets") {
		
		myTweets();

	}


	else if (inputRequest === "spotify-this-song") {

		spotifySearch();

	}

	else if (inputRequest === "movie-this") {

		movieSearch();

	}

	else if (inputRequest === "do-what-it-says") {

		doThis();
	}

	else {
		console.log("You did not enter a valid input")
	}

});

// --------------------------------------------------------
// Functions to prompt NPM commands
// --------------------------------------------------------


// Pulling most recent tweets
function myTweets(user) {

	var userQuery = "";

	if (user === undefined) {

		inquirer.prompt([
				{
				type: 'input', 
				name: 'twitterUsername',
				message: 'What username would you like to search?'
				}
		]).then(function(inquirerResponse) {

			userQuery = inquirerResponse.twitterUsername; 

			if (userQuery) {
				var twitterParams = {screen_name: userQuery};

				console.log("RECENT TWEETS FROM " + twitterParams.screen_name);
				fs.appendFile("log.txt", "RECENT TWEETS FROM" + twitterParams.screen_name + "\n", function(error) {});
				console.log("-------------");
				fs.appendFile("log.txt", "-------------\n", function(error) {});

				client.get('statuses/user_timeline', twitterParams, function(error, tweets, response) {
					if (!error) {

						twitterDisplay(tweets)
					  
					}

					else {
						console.log(error)
					}

				})
			}

			else {
				var twitterParams = {screen_name: 'bootcamp123123'};

				console.log("DEFAULT TWEETS FROM " + twitterParams.screen_name);
				fs.appendFile("log.txt", "RECENT TWEETS FROM" + twitterParams.screen_name + "\n", function(error) {});
				console.log("-------------");
				fs.appendFile("log.txt", "-------------\n", function(error) {});

				client.get('statuses/user_timeline', twitterParams, function(error, tweets, response) {
					if (!error) {

						twitterDisplay(tweets)
					}

					else {
						console.log(error)
					}
				})
			}


		})
	}

	else {

		userQuery = user;

		var twitterParams = {screen_name: userQuery};

		console.log("DO-WHAT-IT-SAYS RECENT TWEETS FROM " + twitterParams.screen_name);
		fs.appendFile("log.txt", "RECENT TWEETS FROM " + twitterParams.screen_name + "\n", function(error) {});
		console.log("-------------");
		fs.appendFile("log.txt", "-------------\n", function(error) {});

		client.get('statuses/user_timeline', twitterParams, function(error, tweets, response) {
			if (!error) {

				twitterDisplay(tweets)
			  
			}

			else {
				console.log(error)
			}

		})

	}

}

// Making a spotify search, either using default search or user input
function spotifySearch(song) {

	var userQuery = "";

	if (song === undefined) {

		inquirer.prompt([
			{
			type: 'input', 
			name: 'songSearch',
			message: 'What song would you like to search?'
			}

		]).then(function(inquirerResponse) {

			userQuery= inquirerResponse.songSearch;

			if (userQuery) {
				spotify.search({ type: 'track', query: userQuery, limit: 1 }, function(error, data) {

					if (!error) { 

						var songData = data.tracks.items[0];

						console.log("SPOTIFY SEARCH");
			    		fs.appendFile("log.txt", "SPOTIFY SEARCH\n", function(error) {});
						console.log("-------------");
						fs.appendFile("log.txt", "-------------\n", function(error) {});

						songDisplay(songData)

					}

					else {
						console.log('Error occurred: ' + error);
					}
				 
				})
			}

			else {

				spotify.request('https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE')
					.then(function(data) {

				    	console.log("DEFAULT SPOTIFY SEARCH");
						fs.appendFile("log.txt", "DEFAULT SPOTIFY SEARCH\n", function(error) {});
						console.log("-------------");
						fs.appendFile("log.txt", "-------------\n", function(error) {});

						songDisplay(data)

				  	})

				  	.catch(function(err) {
		    			console.error('Error occurred: ' + err); 
		 			});
			}

		})
	}

	else {

		userQuery = song

		spotify.search({ type: 'track', query: userQuery, limit: 1 }, function(error, data) {

			if (!error) { 
				var songData = data.tracks.items[0];

				console.log("DO-WHAT-IT-SAYS SPOTIFY SEARCH");
	    		fs.appendFile("log.txt", "DO-WHAT-IT-SAYS SPOTIFY SEARCH\n", function(error) {});
				console.log("-------------");
				fs.appendFile("log.txt", "-------------\n", function(error) {});

				songDisplay(songData)

			}

			else {
				console.log('Error occurred: ' + error);
			}
		})

	}
}

// Making a movie search, either using default search or user input
function movieSearch(movie) {

	var userQuery = ""

	if (movie === undefined) {
		inquirer.prompt([

		{
		type: 'input', 
		name: 'movieSearch',
		message: 'What movie would you like to search?'
		}

		]).then(function(inquirerResponse) {

		userQuery= inquirerResponse.movieSearch;

			if (userQuery) {

				request("http://www.omdbapi.com/?t=" + userQuery + "&y=&plot=short&apikey=trilogy", function(error, response, body) {

					if (!error && response.statusCode === 200) {

						console.log("MOVIE SEARCH");
					  	fs.appendFile("log.txt", "MOVIE SEARCH\n", function(error) {});
					  	console.log("-------------");
					  	fs.appendFile("log.txt", "-------------\n", function(error) {});

						movieDisplay(JSON.parse(body))
					}

					else {
					  	console.log(error)
					}
				})
			}

			else {

				var defaultQuery = "Mr. Nobody"

				request("http://www.omdbapi.com/?t=" + defaultQuery + "&y=&plot=short&apikey=trilogy", function(error, response, body) {

				  	if (!error && response.statusCode === 200) {

				  		console.log("DEFAULT MOVIE SEARCH");
					  	fs.appendFile("log.txt", "DEFAULT MOVIE SEARCH\n", function(error) {});
					  	console.log("-------------");
					  	fs.appendFile("log.txt", "-------------\n", function(error) {});

				  		movieDisplay(JSON.parse(body))

					}

					else {
					  	console.log(error)
					}

				});

			}

		})
	}

	else {
		userQuery = movie

		request("http://www.omdbapi.com/?t=" + userQuery + "&y=&plot=short&apikey=trilogy", function(error, response, body) {

			if (!error && response.statusCode === 200) {

				console.log("DO-WHAT-IT-SAYS MOVIE SEARCH");
			  	fs.appendFile("log.txt", "DO-WHAT-IT-SAYS MOVIE SEARCH\n", function(error) {});
			  	console.log("-------------");
			  	fs.appendFile("log.txt", "-------------\n", function(error) {});

			  	movieDisplay(JSON.parse(body))

			}

			else {
			  	console.log(error)
			}
		})
	}
	
}

// Pulling an action from a text file and running the appropriate function
function doThis() {

	fs.readFile("random.txt", "utf-8", function(error, data) {

		if (!error) {
			var dataArr = data.split(",")

			if (dataArr[0] === 'my-tweets') {
				myTweets()
			}

			else if (dataArr[0] === 'spotify-this-song') {
				spotifySearch(dataArr[1])

			}

			else if (dataArr[0] === 'movie-this') {
				movieSearch(dataArr[1])
			}

			else {
				console.log("Not a valid option")
			}

		}

		else {
			console.log(error)
		}

	})

}

// --------------------------------------------------------
// DISPLAY FUNCTIONS FOR MOVIE, SONG, AND TWITTER SEARCH
// --------------------------------------------------------


function movieDisplay(search) {

	console.log("Title: " + search.Title);
	fs.appendFile("log.txt", "Title: " + search.Title + "\n", function(error) {});
	console.log("Year released: " + search.Year);
	fs.appendFile("log.txt", "Year released: " + search.Year + "\n", function(error) {});
	console.log("IMDB rating: " + search.imdbRating);
	fs.appendFile("log.txt", "IMDB rating: " + search.imdbRating + "\n", function(error) {});
	console.log("Rotten Tomatoes rating: " + search.Ratings[1].Value);
	fs.appendFile("log.txt", "Rotten Tomatoes rating: " + search.Ratings[1].Value + "\n", function(error) {});
	console.log("Produced in: " + search.Country);
	fs.appendFile("log.txt", "Produced in: " + search.Country + "\n", function(error) {});
	console.log("Language: " + search.Language);
	fs.appendFile("log.txt", "Language: " + search.Language + "\n", function(error) {});
	console.log("Plot: ");
	fs.appendFile("log.txt", "Plot:\n", function(error) {});
	console.log(search.Plot);
	fs.appendFile("log.txt", search.Plot + "\n", function(error) {});

	console.log("Actors:"); 
	fs.appendFile("log.txt", "Actors:\n", function(error) {});

	var actors = search.Actors.split(',');

	for (var i=0; i<actors.length; i++) {
		console.log("* " + actors[i])
		fs.appendFile("log.txt", "* " + actors[i] + "\n", function(error) {});
	}

	console.log("-------------");
	fs.appendFile("log.txt", "-------------\n", function(error) {});

}

function songDisplay(search) {

	console.log("Artist(s):");
	fs.appendFile("log.txt", "Artist(s):\n", function(error) {});

	for (var i=0; i < search.artists.length; i ++) {
		console.log("* " + search.artists[i].name)
		fs.appendFile("log.txt", "* " + search.artists[i].name + "\n", function(error) {});
	}

	console.log("Song: " + search.name);
	fs.appendFile("log.txt", "Song: " + search.name + "\n", function(error) {});
	console.log("Album: " + search.album.name);
	fs.appendFile("log.txt", "Album: " + search.album.name + "\n", function(error) {});
	console.log("Preview URL: " + search.preview_url); 
	fs.appendFile("log.txt", "Preview URL: " + search.preview_url + "\n", function(error) {});
	console.log("-------------");
	fs.appendFile("log.txt", "-------------\n", function(error) {});

}

function twitterDisplay(tweets) {

	if (tweets.length < 20) {

	  	for (var i=0; i < tweets.length; i++) {
		    console.log(tweets[i].text);
		    fs.appendFile("log.txt", tweets[i].text + "\n", function(error) {});
		    console.log(tweets[i].created_at);
		    fs.appendFile("log.txt", tweets[i].created_at + "\n", function(error) {});
		    console.log("-------------");
		    fs.appendFile("log.txt", "-------------\n", function(error) {});
		}

	}

	else {

		for (var i=0; i < 20; i++) {
		    console.log(tweets[i].text);
		    fs.appendFile("log.txt", tweets[i].text + "\n", function(error) {});
		    console.log(tweets[i].created_at);
		    fs.appendFile("log.txt", tweets[i].created_at + "\n", function(error) {});
		    console.log("-------------");
		    fs.appendFile("log.txt", "-------------\n", function(error) {});
		}
	}

} 



