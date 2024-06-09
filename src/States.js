import { useState, useEffect } from 'react';
import styles from './States.module.css';

const States = () => {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("");

    useEffect(() => {
        fetch('https://crio-location-selector.onrender.com/countries')
            .then((response) => response.json())
            .then((data) => {
                setCountries(data);
            })
            .catch((error) => console.log("Erro fetching Countries", error));
    }, [])

    useEffect(() => {
        if (selectedCountry) {
            fetch(`https://crio-location-selector.onrender.com/country=${selectedCountry}/states`)
                .then((response) => response.json())
                .then((data) => {
                    setStates(data);
                    setSelectedState("");  // Reseting state selection
                    setCities([]);  // clear cities
                    setSelectedCity("");   // Reseting selected city
                })
                .catch((error) => console.leg("State data not fetched"));
        }
    }, [selectedCountry])

    useEffect(() => {
        if (selectedCountry && selectedState) {
            fetch(`https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${selectedState}/cities`)
                .then((response) => response.json())
                .then((data) => {
                    setCities(data);
                    setSelectedCity("");
                })
                .catch((error) => console.log("City data not fetched"));
        }
    }, [selectedCountry, selectedState])

    console.log("selectedCountries=" + selectedCountry);
    console.log("selectedStates=" + selectedState);
    console.log("selectedCities=" + selectedCity);

    return (
        <div>
            <h1>Select Location</h1>
            <select id="country" className={styles.dropdown} onChange={(e) => setSelectedCountry(e.target.value)} value={selectedCountry}>
                <option value="" disabled>Select Country</option>
                {countries.map((item) => <option key={item}>{item}</option>)}
            </select>

            <select id="state" className={styles.dropdown} disabled={!selectedCountry} onChange={(e) => setSelectedState(e.target.value)} value={selectedState}>
                <option value="" disabled>Select State</option>
                {states.map((state) => <option key={state}>{state}</option>)}
            </select>

            <select id="city" className={styles.dropdown} disabled={!selectedState} onChange={(e) => setSelectedCity(e.target.value)} value={selectedCity}>
                <option value="" disabled>Select City</option>
                {cities.map((city, i) => <option key={i}>{city}</option>)}
            </select>

            {selectedCity && (
                <h2 className={styles.result}>
                    You Selected <span className={styles.highlight}>{selectedCity}, </span>
                    <span className={styles.fade}>{selectedState}, {selectedCountry}</span>
                </h2>
            )
            }

        </div>
    )
}

export default States;