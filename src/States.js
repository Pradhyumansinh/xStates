import { useState, useEffect } from 'react';
import styles from './States.module.css';

const States = () => {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedState, setSelectedState] = useState("''");
    const [selectedCity, setSelectedCity] = useState("");

    useEffect(() => {
        fetch('https://crio-location-selector.onrender.com/countries')
            .then((response) => response.json())
            .then((data) => {
                setCountries(data);
                setSelectedCountry("");
                setStates([]);
                setSelectedState("");
                setCities([]);
                setSelectedCity("");
            })
            .catch((error) => console.error(error));
    }, [])

    useEffect(() => {
        if (selectedCountry) {
            fetch(`https://crio-location-selector.onrender.com/country=${selectedCountry}/states`)
                .then((response) => response.json())
                .then((data) => {
                    setSelectedState("");
                    setCities([]);
                    setSelectedCity("");
                    setStates(data);
                })
                .catch((error) => console.error(error));
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
                .catch((error) => console.error(error));
        }
    }, [selectedCountry, selectedState])

    return (
        <div>
            <h1>Select Location</h1>
            <select id="country" className={styles.dropdown} onChange={(e) => setSelectedCountry(e.target.value)}>
                <option>Select Country</option>
                {countries && countries.map((item) => <option key={item}>{item}</option>)}
            </select>

            <select id="state" className={styles.dropdown} disabled={!selectedCountry} onChange={(e) => setSelectedState(e.target.value)}>
                <option>Select State</option>
                {selectedCountry && states.map((state) => <option key={state}>{state}</option>)}
            </select>

            <select id="city" className={styles.dropdown} disabled={!selectedState} onChange={(e) => setSelectedCity(e.target.value)}>
                <option>Select City</option>
                {(selectedState && selectedCountry) && cities.map((city) => <option key={city}>{city}</option>)}
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