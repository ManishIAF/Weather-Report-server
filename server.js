import express from "express";
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()
import https from 'https'

const app = express()

app.use(cors({origin:[process.env.URI,'http://localhost:3000']}))

app.get('/',(req,res)=>res.status(200).send('home'))

app.get('/api/weatherReport', (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).send('City name is required');
    }

    const unit = 'metric';

    const url = `${process.env.WEATHER_URI}?q=${city}&units=${unit}&appid=${process.env.WEATHER_API_KEY}`;

    https.get(url, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', async () => {
        try {
          const weatherData = JSON.parse(data);

          if (weatherData.cod === '200') {
            res.status(200).send(weatherData);
          } else {
            res.status(weatherData.cod).send(weatherData.message);
          }
        } catch (parseError) {
          res.status(500).send('Error parsing weather data');
        }
      });
    });
  } catch (error) {
    res.status(500).send('Server error');
  }
});


app.listen(8000,()=>{
    console.log(`server started at http://localhost:${8000}`);
})