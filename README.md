# liri_node_app
Liri Node Application for HW8 UMN Bootcamp

A Node.js application that runs in command line and can be used to access information through Twitter, Spotify, or IMDB.

### Using Liri Node Application

This application is run through your command line interface. Once you are in the proper directory, simply call the liri.js Javascript file using node.

```
node liri.js
```
Once the application is running, you will be prompted for what command you would like the application to complete.

![Menu image](/images/menu_image.jpeg)

*my-tweets* will return, at most, the 20 most recent tweets by the app author.

*spotify-this-song* will return a prompt for what song to search. Once the user inputs a song, the app will return the song artist, name, album and a preview link. If no song is entered on the prompt, the app will return a default search value.

*movie-this* will return a prompt for what movie to search, and once a movie is entered, will return the the movie title, year, IMDB rating, Rotten Tomatoes rating, country of production, language, plot and actors. If no movie is entered on the prompt, the app will return a default search value.

*do-what-it-says* takes the text within the random.txt files, and returns the desired action (i.e. my-tweets, spotify-this-song, and movie-this) with the text values.

All commands return search results in the command line and in the log.txt file. 

