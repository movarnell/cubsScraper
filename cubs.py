# Run the installs for the following libraries: requests, beautifulsoup4, python-dateutil
import requests
from bs4 import BeautifulSoup
from dateutil.parser import parse
from dateutil.tz import gettz
from datetime import timedelta

def get_cubs_latest_game():
    # URL of the MLB Cubs scores page
    url = 'https://www.mlb.com/cubs/scores'

    # Send a GET request to the URL
    response = requests.get(url)
    if response.status_code != 200:
        print("Failed to retrieve the page")
        return

    # Parse the HTML content of the page
    soup = BeautifulSoup(response.content, 'html.parser')

    # Find the section that contains the latest game info
    latest_game_section = soup.find('div', class_='ScoresGamestyle__ExpandedScoresGameWrapper-sc-7t80if-0')

    if not latest_game_section:
        print("Could not find the latest game section")
        return

    # Extract teams and scores
    teams = latest_game_section.find_all('div', class_='teamstyle__NameWrapper-sc-1suh43a-2')
    scores = latest_game_section.find_all('div', class_='teamstyle__TeamLabel-sc-1suh43a-3')

    if not teams or not scores:
        print("Could not find teams or scores")
        return

    # validate that the team names include the Cubs
    cubs_team_found = False
    for team in teams:
        if 'Cubs' in team.text:
            cubs_team_found = True
            break

    if not cubs_team_found:
        print("Could not find the Cubs in the team names")
        return
    
    
    # Extract game time
    game_time_wrapper = latest_game_section.find('div', class_='StatusLayerstyle__StatusLayerValue-sc-1s2c2o8-2')
    if not game_time_wrapper:
        print("Could not find game time")
        print(latest_game_section.prettify())  # Print the section for debugging
        return

    game_time = game_time_wrapper.text.strip()
    game_time_dt = parse(game_time, tzinfos={"CT": gettz("America/Chicago")})
    game_time_dt -= timedelta(hours=1)
    game_time = game_time_dt.strftime('%I:%M%p')
    # Extract broadcast information
    broadcasts_wrapper = latest_game_section.find('div', class_='MediaLayoutstyle__GameInfoLabelWrapper-sc-1ag0uf4-1')
    if not broadcasts_wrapper:
        print("Could not find broadcasts")
        print(latest_game_section.prettify())  # Print the section for debugging
        return

    broadcasts = broadcasts_wrapper.text.strip()

    if len(teams) >= 2 and len(scores) >= 2:
        cubs_team = teams[0].text.strip()
        opponent_team = teams[1].text.strip()
        cubs_score = scores[0].text.strip()
        opponent_score = scores[1].text.strip()



        print(f"Latest Game: {cubs_team} vs {opponent_team}")
        print(f"Score: {cubs_team} {cubs_score} - {opponent_team} {opponent_score}")
        print(f"Game Time: {game_time}")
        print(f"Broadcasts: {broadcasts}")
    else:
        print("Failed to extract game details")

if __name__ == "__main__":
    get_cubs_latest_game()
