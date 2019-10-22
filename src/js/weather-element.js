// Import the LitElement base class and html helper function
import { LitElement, html } from 'lit-element';

let openWeatherCurrentWeatherDataApi = 'https://api.openweathermap.org/data/2.5/weather?zip=94040,us&appid=329714452ee02a31ba2d8d672478fded';
const apiKey = 'ENTER API KEY HERE';
let openWeather5Day3HourApi = '';

// Extend the LitElement base class
class WeatherElement extends LitElement {
    static get properties() {
        return {
            city: { type: String },
            description: { type: String },
            list: { type: Array },
            main: { type: String },
            sunrise: { type: String },
            sunset: { type: String },
            temperature: { type: Number },
            temperatureMax: { type: Number },
            temperatureMin: { type: Number },
            zip: { type: String }
        };
    }

    constructor() {
        // Always call super() first
        super();
        this.city = '';
        this.description = '';
        this.list = [];
        this.main = ';'
        this.sunrise = ';'
        this.sunset = ';'
        this.temperature = 0;
        this.temperatureMax = 0;
        this.temperatureMin = 0;
        this.zip = '';
    }
    /**
         * Implement `render` to define a template for your element.
         *
         * You must provide an implementation of `render` for any element
         * that uses LitElement as a base class.
         */
    render() {
        /**
         * `render` must return a lit-html `TemplateResult`.
         *
         * To create a `TemplateResult`, tag a JavaScript template literal
         * with the `html` helper function:
         */
        return html`
            <!-- template content -->
            <div class="weather">
                ${this.renderCurrentWeatherData()}
                ${this.render5Day3HourData()}
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <label for="name">Enter ZIP code and click go</label>
                <input type="search" id="input-field" name="name" minlength="5" maxlength="5" size="10" placeholder="5 digits">
                <button class="search-btn" type="button" @click="${this.handleClick}">Go</button>
            </div>
            ${this.renderBackground()}
        `;
    }

    fetchDataFromOpenopenWeather5Day3HourApi() {
        fetch(openWeather5Day3HourApi)
            .then(response => {
                return response.json();
            })
            .then(jsonResponse => {
                this.list = jsonResponse.list;
            });
    };

    fetchDataFromopenWeatherCurrentWeatherDataApi() {
        fetch(openWeatherCurrentWeatherDataApi)
            .then(response => {
                return response.json();
            })
            .then(jsonResponse => {
                this.city = jsonResponse.name;
                this.description = jsonResponse.weather[0].description;
                this.main = jsonResponse.weather[0].main;
                this.sunrise = this.getTime(jsonResponse.sys.sunrise);
                this.sunset = this.getTime(jsonResponse.sys.sunset);
                this.temperature = jsonResponse.main.temp;
                this.temperatureMax = jsonResponse.main.temp_max;
                this.temperatureMin = jsonResponse.main.temp_min;
            });
    };

    handleClick() {
        this.zip = document.querySelector('#input-field').value;
        openWeatherCurrentWeatherDataApi = `https://api.openweathermap.org/data/2.5/weather?zip=${this.zip},us&appid=${apiKey}&units=imperial`;
        openWeather5Day3HourApi = `https://api.openweathermap.org/data/2.5/forecast?zip=${this.zip},us&appid=${apiKey}&units=imperial`;
        return this.fetchDataFromopenWeatherCurrentWeatherDataApi(), this.fetchDataFromOpenopenWeather5Day3HourApi();
    };

    getDay(dateFromApi, displayTime) {
        const date = new Date(dateFromApi);
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        let result = "";
        if (displayTime) {
            let hours = date.getHours();
            if (hours === 12) {
                hours = `12 AM`;
            } else if (hours === 0) {
                hours = `12 PM`;
            }
            else if (hours <= 11) {
                hours = `${hours} AM`;
            } else {
                hours = `${24 - hours} PM`;
            }

            if (hours.length === 4) {
                hours = `0${hours}`;
            }

            result = `${days[date.getDay()]} ${hours}`;
        } else {
            result = days[date.getDay()];
        }
        return result;
    }

    getTime(unixTime) {
        const date = new Date(unixTime * 1000);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const time = `${hours}: ${minutes}`;
        return time;
    }

    render5Day3HourData() {
        if (this.list.length !== 0) {
            return html`
                <div class="five-day">5 Day 3 Hour:</div>
                ${this.list.map(eachItem => html`
                <div class="each-item">
                    <div class="time">${this.getDay(eachItem.dt_txt, true)}</div> 
                    <div class="temp">${Math.round(eachItem.main.temp)}</div> 
                    <div class="description">${eachItem.weather[0].description}</div> 
                </div> `)}
            `;
        } else {
            return html``;
        }
    }

    renderBackground() {
        document.body.className = this.description.split(" ").join("-");
    }

    renderCurrentWeatherData() {
        if (this.temperature) {
            return html`
                <div class="current-weather">
                    <span class="city">${this.city}</span>
                    <span class="main">${this.main}</span>
                    <span class="temperature">${Math.round(this.temperature)}&deg;F</span>
                    <span class="sunrise-sunset">
                        <span>Sunrise ${this.sunrise}</span>
                        <span>Sunset ${this.sunset}</span>
                    </span>
                    <span class="today-min-max">
                        <span>${this.getDay(Date.now())}</span>
                        <span>${Math.round(this.temperatureMax)} ${Math.round(this.temperatureMin)}</span>
                    </span>
                </div>
                `;
        } else {
            return html``;
        }
    }

    createRenderRoot() {
        /**
         * Render template in light DOM. Note that shadow DOM features like
         * encapsulated CSS are unavailable.
         */
        return this;
    }
}

// Register the new element with the browser.
customElements.define('weather-element', WeatherElement);
