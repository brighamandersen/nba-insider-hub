const base_url = 'https://www.balldontlie.io/api/v1';

const teamData = fetch(base_url + '/teams')
  .then((response) => response.json())
  .then((json) => {
    let teamData = json.data;
    let teamsHtml = '<table class="table table-bordered table-hover">';
    teamsHtml += '<thead class="table-light custom-table-header">';
    teamsHtml += '<tr>';
    teamsHtml += '<th>Team Name</th>';
    teamsHtml += '<th>Conference</th>';
    teamsHtml += '<th>Division</th>';
    teamsHtml += '</tr>';
    teamsHtml += '</thead>';
    for (let i = 0; i < teamData.length; i++) {
      teamsHtml += '<tr>';
      teamsHtml += '<td><b>' + teamData[i].full_name + '</b></td>';
      teamsHtml += '<td>' + teamData[i].conference + '</td>';
      teamsHtml += '<td>' + teamData[i].division + '</td>';
      teamsHtml += '</tr>';
    }
    teamsHtml += '</table>';
    document.getElementById('teams').innerHTML = teamsHtml;
  });

async function searchPlayer() {
  event.preventDefault();
  const searchedName = document.getElementById('player-search').value;
  const playerResults = document.getElementById('player-results');
  playerResults.innerHTML = '';

  // Get API data
  const playerBioData = await fetch(
    base_url + '/players?search=' + searchedName
  )
    .then((response) => response.json())
    .then((json) => json.data);
  const playerIds = playerBioData.map((player) => player.id);
  const playerStatsData = await fetch(
    base_url + '/season_averages?player_ids[]=' + playerIds
  )
    .then((response) => response.json())
    .then((json) => json.data);
  let playerHtml = '';

  if (playerIds.length === 0) {
    playerResults.innerHTML = 'No player found.';
    return;
  }

  for (let i = 0; i < playerIds.length; i++) {
    if (
      playerBioData[i].position !== '' &&
      playerBioData[i].height_feet !== null &&
      playerBioData[i].height_inches !== null &&
      playerBioData[i].weight_pounds !== null
    ) {
      playerHtml += '<div id="accordion' + i + '">';
      playerHtml += '<div class="card">';
      playerHtml += '<div class="card-header" id="heading' + i + '">';
      playerHtml += '<h5 class="mb-0">';
      playerHtml +=
        '<button class="btn btn-link" data-toggle="collapse" data-target="#collapse' +
        i +
        '">';
      playerHtml +=
        playerBioData[i].first_name +
        ' ' +
        playerBioData[i].last_name +
        ' (' +
        playerBioData[i].team.abbreviation +
        ')';
      playerHtml += '</button>';
      playerHtml += '</h5>';
      playerHtml += '</div>';

      playerHtml +=
        '<div id="collapse' +
        i +
        '" class="collapse" data-parent="#accordion' +
        i +
        '">';
      playerHtml += '<div class="card-body">';
      playerHtml += '<div class="container">';
      playerHtml += '<div class="row">';

      playerHtml += '<div class="col-sm p-2">';
      playerHtml += '<h5>Details</h5>';
      playerHtml += '<li>Position:  ' + playerBioData[i].position + '</li>';
      playerHtml +=
        '<li>Height:  ' +
        playerBioData[i].height_feet +
        "'" +
        playerBioData[i].height_inches +
        '"</li>';
      playerHtml +=
        '<li>Weight:  ' + playerBioData[i].weight_pounds + ' lbs</li>';
      playerHtml += '</div>';

      for (let j = 0; j < playerStatsData.length; j++) {
        if (playerStatsData[j]['player_id'] === playerIds[i]) {
          playerHtml += '<div class="col-sm p-2">';
          playerHtml += '<h5>' + playerStatsData[0].season + ' Regular Season Averages</h5>';

          playerHtml += '<table class="table table-sm">';
          playerHtml +=
            '<tr><td>Points</td><td>' + playerStatsData[j].pts + '</td></tr>';
          playerHtml +=
            '<tr><td>Assists</td><td>' + playerStatsData[j].ast + '</td></tr>';
          playerHtml +=
            '<tr><td>Rebounds</td><td>' + playerStatsData[j].reb + '</td></tr>';
          playerHtml +=
            '<tr><td>Blocks</td><td>' + playerStatsData[j].blk + '</td></tr>';
          playerHtml +=
            '<tr><td>Steals</td><td>' + playerStatsData[j].stl + '</td></tr>';
          playerHtml +=
            '<tr><td>FG</td><td>' +
            convertToPercentage(playerStatsData[j].fg_pct) +
            ' %</td></tr>';
          playerHtml +=
            '<tr><td>3PT</td><td>' +
            convertToPercentage(playerStatsData[j].fg3_pct) +
            ' %</td></tr>';
          playerHtml +=
            '<tr><td>FT</td><td>' +
            convertToPercentage(playerStatsData[j].ft_pct) +
            ' %</td></tr>';
          playerHtml += '</table>';
          playerHtml += '</div>';
        }
      }
      playerHtml += '</div>';
      playerHtml += '</div>';
      playerHtml += '</div>';
      playerHtml += '</div>';
      playerHtml += '</div>';
      playerHtml += '</div>';
    }
  }
  playerResults.innerHTML = playerHtml;
}

const convertToPercentage = (num) => (num * 100).toFixed(2);
