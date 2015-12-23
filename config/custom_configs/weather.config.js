/**
 * For weather data. Yahoo uses zipcode, weather underground uses city/state
 *
 * I use weather underground just to get outside conditions since I
 * change my backgrounds according to precipitation. Yahoo is really
 * slow  (like raining for hours before it says it is raining)
 * where as weather underground will get it in 30 min (max 1 query every 10 min anyway).
 *
 * You can get your key by signing up. It is free. The app shouldn't
 * use more than your daily allotment of 500.
 *
 * @type {{zipcode: string, city: string, state: string, weather_underground_key: string}}
 */
module.exports = {
    zipcode: 'zip',
    city: 'city',
    state: 'state',
    weather_underground_key:'key'
}