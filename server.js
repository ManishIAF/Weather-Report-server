import express from "express";
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()
import https from 'https'

const app = express()

app.use(cors({origin:process.env.URI}))

app.get('/',(req,res)=>res.status(200).send('home'))

app.get('/api/weatherReport',(req,res)=>{
    try {
    
        const {city} = req.query

        if(!city) return res.status(404).send('city name is required')

        const unit = "metric";

        const url = `${process.env.WEATHER_URI}?q=`+ city +"&units="+unit+"&appid="+process.env.WEATHER_API_KEY;
        
        https.get(url , (response)=>{
            
            response.on("data", async(data)=>{
            const weatherData = await JSON.parse(data);
            res.status(200).send(weatherData)
            });   

        });
        
    } catch (error) {

        res.status(500).send('server error')
        
    }
    
})

app.listen(8000,()=>{
    console.log(`server started at http://localhost:${8000}`);
})