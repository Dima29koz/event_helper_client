import axios from 'axios'

export async function get_events() {
  try {
    const response = await axios.get('/api/event_management/events')
    return response.data
  } catch (e) {
    console.log(e)
  }
}

export async function create_event(event) {
  try {
    const response = await axios.post(
      '/api/event_management/create_event',
      {
        title: event.title,
        description: event.description,
        date_start: event.date_start.toISOString(),
        date_end: event.date_end.toISOString(),
        timezone: event.timezone,
        cost_reduction_factor: event.cost_reduction_factor,
        location_id: event.location_id
      },
      { headers: { 'X-CSRF-TOKEN': $cookies.get('csrf_access_token') } }
    )
    return response.data.key
  } catch (e) {
    console.log(e)
  }
}
