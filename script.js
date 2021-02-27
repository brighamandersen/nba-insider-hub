console.log('hello');

const base_url = 'https://www.balldontlie.io/api/v1';

fetch(base_url + '/teams')
  .then((response) => response.json())
  .then((json) => {
    let teamsData = json.data;
    console.log('teamsData', teamsData);

    let teamsHtml = '';
    for (let i = 0; i < teamsData.length; i++) {
      teamsHtml +=
        '<li>' +
        teamsData[i].full_name +
        '  (' +
        teamsData[i].conference +
        ' Conference, ' +
        teamsData[i].division +
        ' Division)</li>';
    }
    // document.getElementById('teams').innerHTML = teamsHtml;
  });

const searchPlayer = () => {
  event.preventDefault();
  const searchedName = document.getElementById('player-search').value;
  const playerResult = document.getElementById('player-result');

  playerResult.innerHTML = '';
  fetch(base_url + '/players?search=' + searchedName)
    .then((response) => response.json())
    .then((json) => {
      let playerData = json.data;
      console.log('playerData', playerData);

      if (playerData.length === 0) {
        playerResult.innerHTML = 'No player found.';
      } else {
        let playerHtml = '';
        for (let i = 0; i < playerData.length; i++) {
          playerHtml += '<div>';
          playerHtml += '<ul>';
          playerHtml +=
            '<li>' +
            playerData[i].first_name +
            ' ' +
            playerData[i].last_name +
            ' (' +
            playerData[i].team.abbreviation +
            ')';
          ('</li>');
          playerHtml += '</ul>';
          playerHtml += '</div>';
        }

        playerResult.innerHTML = playerHtml;
      }
    });
};
