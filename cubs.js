// Import the required libraries
const axios = require("axios"); // For making HTTP requests
const cheerio = require("cheerio"); // For parsing HTML
const moment = require("moment-timezone"); // For handling dates and times

// Define an asynchronous function to get the latest game details
async function getCubsLatestGame() {
  // The URL of the page to scrape
  const url = "https://www.mlb.com/cubs/scores";

  try {
    // Send a GET request to the URL
    const response = await axios.get(url);

    // Load the HTML response into cheerio
    const $ = cheerio.load(response.data);

    // Select the section of the page that contains the latest game details
    const latestGameSection = $("div.ScoresGamestyle__ExpandedScoresGameWrapper-sc-7t80if-0");

    // Extract the team names from the latest game section
    const teams = latestGameSection
      .find("div.teamstyle__NameWrapper-sc-1suh43a-2")
      .map((i, element) => $(element).text().trim())
      .get();

    // Extract the scores from the latest game section
    const scores = latestGameSection
      .find("div.teamstyle__TeamLabel-sc-1suh43a-3")
      .map((i, element) => $(element).text().trim())
      .get();

    // Extract the game time from the latest game section
    const gameTimeWrapper = latestGameSection
      .find("div.StatusLayerstyle__StatusLayerValue-sc-1s2c2o8-2")
      .text()
      .trim();

    // Parse the game time, subtract one hour, and format it back into a string
    const gameDateTime = moment
      .tz(gameTimeWrapper, "h:mm A", "America/Chicago")
      .subtract(1, "hours")
      .format("h:mm A");

    // Extract the broadcast details from the latest game section
    const broadcastsWrapper = latestGameSection
      .find("div.MediaLayoutstyle__GameInfoLabelWrapper-sc-1ag0uf4-1")
      .text()
      .trim();

    // If there are at least two teams and two scores...
    if (teams.length >= 2 && scores.length >= 2) {
      // Print the game details
      console.log(`Latest Game: ${teams[0]} vs ${teams[1]}`);
      console.log(`Score: ${teams[0]} ${scores[0]} - ${teams[1]} ${scores[1]}`);
      console.log(`Game Time: ${gameDateTime}`);
      console.log(`Broadcasts: ${broadcastsWrapper}`);
    } else {
      // If there are not at least two teams and two scores, print an error message
      console.log("Failed to extract game details");
    }
  } catch (error) {
    // If an error occurred while making the HTTP request or parsing the HTML, print an error message
    console.error("Failed to retrieve the page", error);
  }
}

// Call the function to get the latest game details
getCubsLatestGame();