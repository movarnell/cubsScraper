// Run the installs for the following libraries: axios, cheerio, moment
// npm install axios cheerio moment

const axios = require("axios");
const cheerio = require("cheerio");
const moment = require("moment-timezone");

async function getCubsLatestGame() {
  const url = "https://www.mlb.com/cubs/scores";

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const latestGameSection = $(
      "div.ScoresGamestyle__ExpandedScoresGameWrapper-sc-7t80if-0"
    );

    const teams = latestGameSection
      .find("div.teamstyle__NameWrapper-sc-1suh43a-2")
      .map((i, element) => $(element).text().trim())
      .get();
    const scores = latestGameSection
      .find("div.teamstyle__TeamLabel-sc-1suh43a-3")
      .map((i, element) => $(element).text().trim())
      .get();

    const gameTimeWrapper = latestGameSection
      .find("div.StatusLayerstyle__StatusLayerValue-sc-1s2c2o8-2")
      .text()
      .trim();
    const gameDateTime = moment
      .tz(gameTimeWrapper, "h:mm A", "America/Chicago")
      .subtract(1, "hours")
      .format("h:mm A");

    const broadcastsWrapper = latestGameSection
      .find("div.MediaLayoutstyle__GameInfoLabelWrapper-sc-1ag0uf4-1")
      .text()
      .trim();

    if (teams.length >= 2 && scores.length >= 2) {
      console.log(`Latest Game: ${teams[0]} vs ${teams[1]}`);
      console.log(`Score: ${teams[0]} ${scores[0]} - ${teams[1]} ${scores[1]}`);
      console.log(`Game Time: ${gameDateTime}`);
      console.log(`Broadcasts: ${broadcastsWrapper}`);
    } else {
      console.log("Failed to extract game details");
    }
  } catch (error) {
    console.error("Failed to retrieve the page", error);
  }
}

getCubsLatestGame();
