const axios = require('axios').default;

export async function get_events() {
    try {
        const response = await axios.get('/event_management/events');
        return response.data;
    }
    catch (e) {
        console.log(e);
    }
}