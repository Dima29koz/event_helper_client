import axios from 'axios'

export async function get_events() {
  try {
    const response = await axios.get('/api/event_management/events')
    return response.data
  } catch (e) {
    console.log(e)
  }
}
