///////////////////////////////////////////////////////////////////////////////
////////// BEGINNING OF THE PROGRAM WHICH IS READ VIA NODE.JS /////////////////
///////////////////////////////////////////////////////////////////////////////

var fs = require('fs'), 
    filename = process.argv[2];

var reader = fs.readFileSync(filename, 'utf8');


///////////////////////////////////////////////////////////////////////////////
/////////////////////////////THE MAIN FUNCTIONS////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

//////////// LOOP THROUGH THE FILE AND PUSH INTO ARRAY ////////////

    var iteratingGames = function(content) {
        var games = []; // games array to hold all the games
        var regexs = /(.*\S) *(\d) ?, (.*\S) *(\d)/g;                            
        var i;                                     // for the data in the while loop
    	while ((i = regexs.exec(content)) !== null) {  // create a while loop to loop through file with regexs
            if (i.index === regexs.lastIndex) { 
                regexs.lastIndex++;
            }
            games.push({                 // push the data into the game array as an object
            	home: i[1],              // equals the home team or the first team 
                away: i[3],              // equals the away team or the second team
        		homeScore: Number(i[2]), // the score the first (home) team got
                awayScore: Number(i[4]), // the score the second (away) team got
            });
        }

        return games;
    };

    var game = iteratingGames(reader);

///////////////////////// ADDING THE RESULTS TOGETHER /////////////////////

   var addPoints = function(game) {
        var results = {};                   // The record of points each team scored
        for(var i = 0; i < game.length; i++) {
            var home = game[i].home;        // I didn't have to assign each to a variable.
            var away = game[i].away;        // However, I wanted to experiment. I could have
            var hscore = game[i].homeScore; // Simply assigned `games[i]` to a variable then
            var ascore = game[i].awayScore; // used the variable and the key.
             
            if(!results[home]) {            // Tried several times to put both `!results[home]`
                results[home] = 0;          // and `!results[away]` together  using various,                     
            }                               // methods, but they wouldn't add up the tie.
            if(!results[away]) {            // Breaking them apart solved the issue.
                results[away] = 0;           
            }                           
            if(hscore > ascore) {
                results[home] += 3;
            }
            if(hscore === ascore) {
                results[home] += 1;
                results[away] += 1;
                }
            if(hscore < ascore) {
                results[ascore] += 3;
            }

        }

        return results;
    
    };     

    var addingPoints = addPoints(game);    // variable created to access the below function.

////////////////////////// SORTING THE TEAMS' POINTS /////////////////////////


    var sortedArray = function(results) {       // sorting the results
        var sorted = [];                        // array placed in multidimentional array
         for(var keys in results) {             // looping over the results
             sorted.push([keys, results[keys]]) // pushing the results into the array
             sorted.sort().sort(function(a, b){return b[1] - a[1]});
         }                  // sorting the results in the array alphabetically,
                            // then sorting the points. This will achieve the result
                            // of putting the teams in alphabetical order before attempting
                            // to organize the points.
        return sorted;      // returning the array
    };

    var teamSorting = sortedArray(addingPoints);

////////////// TEAM POINTS FROM MULTIDIMENTIONAL ARRAY ///////////////////////


    var gettingPointsFromArray = function(searchingArray) {     // looping throught the points of the 
        var points = [];                                        // array to get the points in order to 
                                                                // add them to the results at the end in order.
        for(var i = 0; i < searchingArray.length; i++) {        // since the array is multidimensional, 
            for(var j = 1; j < searchingArray[i].length; j++) { // I had to go two layers deep with the loop.
                points.push(searchingArray[i][j]);              // when I get to the points, they are pushed 
            }                                                   // into the array.
        } 

        return points; // return the results of the points
    };

    var sortedPoints = gettingPointsFromArray(teamSorting);

////////////////////////////////// TEAM RANKING /////////////////////////////////
    

    var teamRanking = function(sortedPoints) {      // function will rank each team
        var ranks = sortedPoints.map(function(k) {  // first maps the multidimentional array
           return sortedPoints.indexOf(k) + 1;      // gets the ranking starting at one
        });

       return ranks; // returns the ranks in order 
                     // would be interesting to see 4 instead of 5 produced, since the team is 
                     // actually in fourth place not fifth, since two teams are tied in third place.
   };

    var ranking = teamRanking(sortedPoints);

////////////////////// MAKING PTS PLURAL OR SINGULAR //////////////////////////


    var pluralOrSingularPoints = function(pointsInserted) { // function to idetify whether points 
        var word = [];                                   // should be plural or singular based on number one.
        for(var i = 0; i < pointsInserted.length; i++) { // loops through the points
            if(pointsInserted[i] === 1) {                // if the result is one point, 
                word[i] = ' pt';                         // points is abbreviated to pt
            } else {                                     // if not,
                word[i] = ' pts';                        // the result stays with the abbreviation pts
            }
        }
        return word; // returns the word array
    };

    var pluralSingular = pluralOrSingularPoints(sortedPoints);

////////////////////////// PRINTING THE RESULTS ////////////////////////////// 

    var leaderboard = function (rank, sorting, word) {     // function to return and display outcomes
          var outcomes = '';                        // Outcome string holding all the teams in order
          for(var i = 0; i < sorting.length; i++) { // loops through all the lines 
            outcomes += rank[i] + '. ' + sorting[i].join(', ') + word[i] + '\n';
        }                   // provides the outcome for each team's rank, their name, and points.
        return outcomes;    // return the outcomes string
    };

    var resultboard = leaderboard(ranking, teamSorting, pluralSingular);

    console.log(resultboard);

///////////////////////////////////////////////////////////////////////////////
//////////////// END OF THE PROGRAM WHICH IS READ VIA NODE.JS /////////////////
///////////////////////////////////////////////////////////////////////////////
    
var writer = fs.writeFileSync('output.txt', resultboard, 'utf8');

///////////////////////////////////////////////////////////////////////////////

module.exports = {
    iteratingGames: iteratingGames,
    addPoints: addPoints, 
    teamRanking: teamRanking
};
 // These functions are exported into the mocha.js file for the tests.
