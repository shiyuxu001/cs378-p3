import './App.css';
import React, { useState, useEffect } from 'react'
import axios from 'axios';


function App() {
  

  const [city, setCity] = useState('');
  const [myData, setData] = useState([]);
  const [loading,setLoading] = useState(true);
  const [searchVal, setSearchVal] = useState ('');
  

  const baseURL = "https://api.openaq.org/v2/locations?city=";

  const getCityAxios = async () => {
    setLoading(true);
    const curURL = baseURL + city.charAt(0).toUpperCase() + city.slice(1);
    console.log(curURL);
    try{
      axios.get(curURL)
      .then ((res) => {
        
        setData(res.data); 


        
        if(Object.keys(res.data.results).length === 0){

          setLoading(true);
        
        }else{
          setLoading(false);
        }

      });  //response is in json
      //check for output
      

      

    } catch(e){

      setLoading(true);
    }
    
  };
 
  useEffect(() => {

    getCityAxios();
    
  }, [city]);

    function handleSearch() {

      setCity(searchVal);
    }

    return (
        <>
        
            <div className="App" onLoad={() => setCity('Boston')}>
 
                
                <h1 className ='title'>Check Air Quality</h1>
                <div className ='subtitle'>check the air quality of cities all over the world</div>
                <div>
                <form action="/" method="get">
                    <input style={{margin:'9px'}}
                        type="text"
                        id="cities-search"
                        placeholder="Enter city name"
                        name='city'
                        onChange={(e) => setSearchVal(e.target.value)} //?????? what
                    />
                    <span type='text' onClick={handleSearch}>search</span>
                    
                    
                </form>
                

                </div>
                


                <button id='boston-but' onClick={() => setCity('Boston')}>Boston</button>
                <button id='dallas-but' onClick={() => setCity('Dallas')}>Dallas</button>
                
                <div id='main'>
                  
                  {(!loading)? 
                  
                    <div>
                      <div className='content-text'>
                        
                        <div> city: {myData.results[0].city}</div>
                        <p></p>
                        <div> country: {myData.results[0].country}</div>
                        <p></p>
                        <div> latest quality: {(myData.results[0].parameters[0].lastValue).toFixed(3)} ppm</div>
                        <p></p>
                        <div> average quality: {(myData.results[0].parameters[0].average).toFixed(3)} ppm</div>
                        <p></p>
                        <div> main pollutant: {myData.results[0].parameters[0].displayName}</div>
                        <p></p>
                        <div style={{fontSize:'14px'}}>(ppm: parts per million by volumn of a pollutant)</div>
                      </div>
                    </div> : 
                    <div id='error-msg'>
                      we do not have data for this city :(
                    </div>}

                </div>          
            </div>
        </>
    );
}
  
export default App;