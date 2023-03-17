import React, { useState, useEffect } from 'react'

import axios from 'axios';
import empty_heart from'../static/empty_heart.png';
import selected_heart from '../static/selected_heart.png'
import 'bootstrap/dist/css/bootstrap.min.css';
import './MainDisplay.css';
import '../App.css'
import { fontSize } from '@mui/system';

import { initializeApp } from "firebase/app";
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

function MainDisplay({currentUser}){
  const [city, setCity] = useState('');
  const [myData, setData] = useState([]);
  const [loading,setLoading] = useState(true);
  const [searchVal, setSearchVal] = useState ('');
  const [faveCities, setFaveCities] = useState(null); //user's list of favorite cities:string (saved in cloud db)
  const [faveChange, setFaveChange] = useState(''); //name of city to be changed in favorites


  useEffect(() => {
    console.log(city)

    getCityAxios();
    //get table datacode
    getFaves();
    //
    
  }, [city]);

  function handleSearch() {
    setCity(searchVal);
  }
  
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

  const databaseURL = "https://hci-p4-67fc2-default-rtdb.firebaseio.com/";

  //get user's list of favorite cities
  const getFaves = () => {
    console.log('current user:')
    console.log(currentUser)
    let strlen = currentUser.length;
    let userURL = currentUser.slice(0, strlen-10);
    fetch(`${databaseURL + "/" + userURL + '/faves'}/.json`)
      .then((res) => {
        
        if (res.status !== 200) {
          // setDataRetrieveResult("There was an error: " + res.statusText);
          // throw new Error(res.statusText);
          console.log('error in fetch')
        } else {
          // setDataRetrieveResult("Successfully retrieved the data");
          console.log('fetch successful')
          // console.log()
          return res.json();
        }
      })
      .then((res) => {
        if (res) {
          console.log('res:')
          console.log(res);
          setFaveCities(res.split(','));
        }
      });
  };

  //on click, add city to list of favorite cities
  const sendData = () => {
    // setFirstInputValue("");
    
    const sampleDict = {
      date: new Date(),
      text: faveChange
    };
    setFaveChange(null);
    return fetch(`${databaseURL + "/" + currentUser}/.json`, {
      method: "POST",
      body: JSON.stringify(sampleDict)
    }).then((res) => {
      if (res.status !== 200) {
        // setDataPostResult("There was an error: " + res.statusText);
        console.log('error in post')
        // throw new Error(res.statusText);
      } else {
        // setDataPostResult("Successfully sent. Check Firebase console.");
        console.log('posted, check firebase')
        return;
      }
    });
  };


  const removeData = () => {

    const sampleDict = {
      date: new Date(),
      text: faveChange
    };
    setFaveChange(null);
    return fetch(`${databaseURL + "/testData"}/.json`, {
      method: "POST",
      body: JSON.stringify(sampleDict)
    }).then((res) => {
      if (res.status !== 200) {
        // setDataPostResult("There was an error: " + res.statusText);
        console.log('error in post')
        // throw new Error(res.statusText);
      } else {
        // setDataPostResult("Successfully sent. Check Firebase console.");
        console.log('posted, check firebase')
        return;
      }
    });
  };




  function addToFavorite(name) {
    console.log(name)
    console.log('adding!')
    //if not in favorites, add to user favorite list
    //if in favorites, remove from user list
    setFaveChange(name)
    sendData()
  }

  function removeFromFavorites(name) {
    console.log(name)
    console.log('removing!')
    //if not in favorites, add to user favorite list
    //if in favorites, remove from user list
    setFaveChange(name)
    removeData()
  }

  // temp fave list
  // const faveList = ['Boston','Chicago','Dallas','Houston']
  const faveBtn = (cityName) =>
    <li className='faveBtn' onClick={() => setCity(cityName)}>
      {cityName} 
    </li>


  const renderFaveList = () => {
    console.log(faveCities);
    // if (faveCities){
      {console.log('HERE!!!!!!!');}
    
      <div className='fave-cities'>
        HELLO HI
        {/* { faveCities.map(faveBtn)} */}
      </div>
    
    

    // }else {
    //   <div>No favorites yet</div>
    // }
  }




  return(
    <div className='col'>
      
      <div className='row'>
        <form action="/" method="get">
            <input style={{margin:'9px'}}
                type="text"
                id="cities-search"
                placeholder="Enter city name"
                name='city'
                onChange={(e) => setSearchVal(e.target.value)} //?????? what
            />
            <span type='text' onClick={handleSearch}>search</span>
            {/* add functionality: use enter as search?*/}
        </form>
      </div>
      <button id='boston-but' onClick={() => setCity('Boston')}>Boston</button>
      <button id='dallas-but' onClick={() => setCity('Dallas')}>Dallas</button>
      
      <div className = 'row' id='main'>
        {(!loading)? 
          <div className='col'>
            <div className='content-text'>
              <div> city: {myData.results[0].city }</div>
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
              <div className='row' style={{margin:'10px'}}>
                <div className='col-9'></div>
                <div className='col-1'> 
                  if (faveCities.have(myData.results[0].city){
                    <img id='heart' src={selected_heart} onClick={() => removeFromFavorites(myData.results[0].city)}></img>
                  }else{
                    <img id='heart' src={empty_heart} onClick={() => addToFavorite(myData.results[0].city)}></img>
                  })
                  <img id='heart' src={empty_heart} onClick={() => addToFavorite(myData.results[0].city)} />
                </div>
              </div>
            </div>
            
          </div> : 
          <div id='error-msg'>
            we do not have data for this city :0
          </div>}
      </div> 
      <p></p>
      <div className='row'>
        <div id='favoritesMenu'>
        {/* populate menu from user favorites */}
        <div className='subtitle'  style={{textAlign:'start'}}> Favorite cities:</div>
        <div>{renderFaveList}</div>
        </div>
      </div>
    </div>
  )
}
export default MainDisplay

