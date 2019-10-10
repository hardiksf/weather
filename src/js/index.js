import '../sass/styles.sass';
import { html, render } from 'lit-html';
import './weather-element';
const WeatherElement = html`<weather-element></weather-element>`
render(WeatherElement, document.body);
