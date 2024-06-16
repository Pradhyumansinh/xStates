import { useState, useEffect } from 'react';
import styles from './States.module.css';
import axios from 'axios';

const States = () => {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    // Fetch all countries on component mount
    useEffect(() => {
        fetchCountries();
    }, []);

    // Function to fetch all countries from API
    const fetchCountries = async () => {
        try {
            const response = await axios.get('https://crio-location-selector.onrender.com/countries');
            const countriesList = Array.from(new Map(response.data.map(item => [item, item])).values());
            setCountries(countriesList);
        } catch (error) {
            console.error('Error fetching countries:', error);
        }
    };

    // Function to fetch states of a specific country
    const fetchStates = async (countryName) => {
        try {
            const response = await axios.get(`https://crio-location-selector.onrender.com/country=${countryName}/states`);
            const stateList = Array.from(new Map(response.data.map(item => [item, item])).values());
            setStates(stateList);
            setSelectedCountry(countryName); // Set selected country after fetching states
            setSelectedState(''); // Reset selected state and city when country changes
            setSelectedCity('');
        } catch (error) {
            console.error(`Error fetching states of ${countryName}:`, error);
        }
    };

    // Function to fetch cities of a specific state in a country
    const fetchCities = async (countryName, stateName) => {
        try {
            const response = await axios.get(`https://crio-location-selector.onrender.com/country=${countryName}/state=${stateName}/cities`);
            const cityList = Array.from(new Map(response.data.map(item => [item, item])).values());
            setCities(cityList);
            setSelectedState(stateName); // Set selected state after fetching cities
            setSelectedCity(''); // Reset selected city when state changes
        } catch (error) {
            console.error(`Error fetching cities of ${stateName} in ${countryName}:`, error);
        }
    };

    // Event handler for country selection change
    const handleCountryChange = (e) => {
        const selectedCountry = e.target.value;
        fetchStates(selectedCountry);
    };

    // Event handler for state selection change
    const handleStateChange = (e) => {
        const selectedState = e.target.value;
        fetchCities(selectedCountry, selectedState);
    };

    // Event handler for city selection change
    const handleCityChange = (e) => {
        const selectedCity = e.target.value;
        setSelectedCity(selectedCity);
    };

    return (
        <div>
            <h1>Select Location</h1>
            <select id="country" className={styles.dropdown} onChange={handleCountryChange} value={selectedCountry}>
                <option value="" disabled>Select Country</option>
                {countries.map((item) => <option key={item}>{item}</option>)}
            </select>

            <select id="state" className={styles.dropdown} disabled={!selectedCountry} onChange={handleStateChange} value={selectedState}>
                <option value="" disabled>Select State</option>
                {states.map((state) => <option key={state}>{state}</option>)}
            </select>

            <select id="city" className={styles.dropdown} disabled={!selectedState} onChange={handleCityChange} value={selectedCity}>
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