import axios from 'axios'
import $cookies from 'vue-cookies'

const authHeaders = { headers: { 'X-CSRF-TOKEN': $cookies.get('csrf_access_token') } }

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
      authHeaders
    )
    return response.data.key
  } catch (e) {
    console.log(e)
  }
}

export async function get_member_info(event_key) {
  try {
    const response = await axios.get('/api/event_management/member_info/' + event_key)
    return response.data
  } catch (e) {
    if (e.response.status == 401) {
      return { roles: ['guest'] }
    } else {
      console.log(e)
    }
  }
}

export async function get_base_products() {
  try {
    const response = await axios.get('/api/event_management/product/base')
    return response.data
  } catch (e) {
    console.log(e)
  }
}

export async function add_base_product(product_data) {
  try {
    const response = await axios.post(
      '/api/event_management/product/base',
      {
        name: product_data.name,
        category_id: product_data.category.id,
        type_id: product_data.type.id,
        unit_id: product_data.unit.id,
        price_supposed: product_data.price_supposed
      },
      authHeaders
    )
    return response.data
  } catch (e) {
    console.log(e)
  }
}

export async function get_product_categories() {
  try {
    const response = await axios.get('/api/event_management/product/category')
    return response.data
  } catch (e) {
    console.log(e)
  }
}

export async function add_product_category(value) {
  try {
    const response = await axios.post(
      '/api/event_management/product/category',
      {
        name: value
      },
      authHeaders
    )
    return response.data
  } catch (e) {
    console.log(e)
  }
}

export async function get_product_types() {
  try {
    const response = await axios.get('/api/event_management/product/type')
    return response.data
  } catch (e) {
    console.log(e)
  }
}

export async function add_product_type(value) {
  try {
    const response = await axios.post(
      '/api/event_management/product/type',
      {
        name: value
      },
      authHeaders
    )
    return response.data
  } catch (e) {
    console.log(e)
  }
}

export async function get_product_units() {
  try {
    const response = await axios.get('/api/event_management/product/unit')
    return response.data
  } catch (e) {
    console.log(e)
  }
}

export async function add_product_unit(value) {
  try {
    const response = await axios.post(
      '/api/event_management/product/unit',
      { name: value },
      authHeaders
    )
    return response.data
  } catch (e) {
    console.log(e)
  }
}
