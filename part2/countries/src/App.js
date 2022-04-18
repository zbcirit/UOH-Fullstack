import { useState, useEffect } from "react";
import axios from "axios";

const Weather = ({ country }) => {
  const [weather, setWeather] = useState(
    {
      weather:[
        {
          description:"no description",
          icon: "50d"
        }
        ],
      main: {
        temp: -999
      },
      wind: {
        speed: -999
      }
    })
  console.log("Weather rendered");

  useEffect(() => {
    let callURL = ("https://api.openweathermap.org/data/2.5/weather?" +
      "q=" + country.capital + "," + country.alpha2Code +
      "&appid=" + process.env.REACT_APP_API_KEY +
      "&units=metric");
    console.log("weather component called with url: ", callURL);

    axios
      .get(callURL)
      .then(response => {
        console.log("weather data", response.data)
        setWeather(response.data)
      })
  }, [country])

  return (
    <>
      <h2>Weather in {country.capital}</h2>
      <p>temperature {weather.main.temp} Celsius</p>
      <div>
        <img
          src={"http://openweathermap.org/img/wn/" + weather.weather[0].icon + "@2x.png"}
          alt={weather.weather[0].description + "icon"} />
      </div>
      <p>wind {weather.wind.speed} m/s</p>
    </>
  )
}

const Country = ({ country }) => {
  //console.log("Country rendered");
  return (
    <>
      <h1>{country.name}</h1>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>
      <p><b>languages:</b></p>
      <ul>{
        country.languages.map((language, i) =>
          <li key={i}>{language.name}</li>)
      }</ul>
      <div>
        <img
          src={country.flag}
          alt={country.name + " flag"}
          width="300px" />
      </div>
      <Weather country={country} />
    </>
  )
}

const Display = ({ countries, searchTerm, setSearchTerm }) => {
   //console.log("Display rendered");

  //if show button clicked set search term to full country name
  //this way searchedCountry array will be filtered to a single country in most cases
  const handleShow = (countryName) => {
    setSearchTerm(countryName.toLowerCase())
  }

  let searchedCountry = []
  if (searchTerm !== "") {
    searchedCountry = countries.filter(country =>
      country.name.toLowerCase().indexOf(searchTerm) !== -1
    )
  }
  if (searchedCountry.length > 10) {
    return <p>Too many matches, specify another filter</p>
  } else if (searchedCountry.length === 1) {
    return <Country country={searchedCountry[0]} />
  } else {
    return (
      searchedCountry.map((country, i) => {
        return (
          <div key={country.numericCode}>
            <p>
              {country.name}
              <button onClick={() => handleShow(country.name)}>show</button>
            </p>
          </div>
        )
      })
    )
  }
}
//====== Display2 inserts and collapses country view below suggested country lists
//====== multiple country views can be displayed by pressing their buttons

// const Display2 = ({ countries, searchTerm }) => {
//   let searchedCountry = []
//   const [buttons, setButtons] = useState(Array(10).fill(false))

//   const handleShow = (i) => {
//     let newButtons = [...buttons]
//     newButtons[i] = !newButtons[i]
//     setButtons(newButtons)
//   }
//   if (searchTerm !== "") {
//     searchedCountry = countries.filter(country =>
//       country.name.toLowerCase().indexOf(searchTerm) !== -1
//     )
//   }

//   if (searchedCountry.length > 10) {
//     return <p>Too many matches, specify another filter</p>
//   } else if (searchedCountry.length === 1) {
//     return <Country country={searchedCountry[0]} />
//   } else {
//     return (
//       searchedCountry.map((country, i) => {
//         return (
//           <div key={country.numericCode}>
//             <p>
//               {country.name}
//               <button onClick={() => handleShow(i)}>{buttons[i] ? "collapse" : "show"}</button>
//             </p>
//             {buttons[i] ? <Country country={country} /> : <></>}
//           </div>
//         )
//       })
//     )
//   }
// }

const Search = ({ onChange, value }) => {
  return (
    <p>
      find countries{ }
      <input onChange={onChange} value={value} />
    </p>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  console.log("App rendered")
  useEffect(() => {
    axios
      .get("https://restcountries.com/v2/all")
      .then(response => {
        //console.log(response.data[0])
        setCountries(response.data)
      })
  }, [])

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase())
  }

  return (
    <div>
      <Search onChange={handleSearch} value={searchTerm} />
      <Display countries={countries} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    </div>
  );
}

export default App;
