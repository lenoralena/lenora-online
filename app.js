const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());
app.set('view engine', 'ejs');


app.get('/', function (req, res) {
  let url = 'http://magicseaweed.com/api/3cebebb6ff6a9dfaf287b0c42d7be7c4/forecast/?spot_id=91&units=eu';
  request(url, function (err, response, body) {
    if (err || response.statusCode != 200) {
      console.log('error:', error);
    } else {
      let forecasts = JSON.parse(body);
      let data = [];
      for (let forecast of forecasts) {
  		data.push({
  			height: forecast.swell.components.combined.height * 10,
  			timestamp: timeformat(new Date(forecast.localTimestamp * 1000)),
  			direction: round5(forecast.swell.components.combined.direction),
  			windDirection: round5(forecast.wind.direction),
  			wave: `${forecast.swell.components.combined.height}${forecast.swell.unit} at ${forecast.swell.components.combined.period} seconds`,
  			wind: `${forecast.wind.speed} ${forecast.wind.unit}`,
  			rating: forecast.solidRating,
  			fdrating: forecast.fadedRating
  		  });
      }
      res.render('index', {forecast: data});

	}
  });
});


// Helpers
function round5(x)  {
  return (x % 5) >= 2.5 ? parseInt(x / 5) * 5 + 5 : parseInt(x / 5) * 5;
}

function timeformat(date) {
  let hours = date.getHours();
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let month = months[date.getMonth()];
  let day = date.getDate();
  let ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  let strTime = `${month} ${day} - ${hours} ${ampm}`;
  return strTime;
}

// Listeners
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});
