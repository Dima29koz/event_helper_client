import axios from 'axios'
import $cookies from 'vue-cookies'

const authHeaders = { headers: { 'X-CSRF-TOKEN': $cookies.get('csrf_access_token') } }

export async function login(username, pwd) {
  try {
    const response = await axios.post('/api/user_account/login', {
      username: username,
      pwd: pwd
    })
    return response.data
  } catch (e) {
    try {
      return e.response.data
    } catch (ex) {
      console.log(ex)
    }
  }
}

export async function refresh() {
  try {
    const response = await axios.post(
      '/api/user_account/refresh',
      {},
      { headers: { 'X-CSRF-TOKEN': $cookies.get('csrf_refresh_token') } }
    )
    return response.data
  } catch (e) {
    console.log(e)
  }
}

export async function profileSettings() {
  try {
    const response = await axios.get('/api/user_account/profile_settings')
    return response.data
  } catch (e) {
    if (
      e.response.status == 401 &&
      'msg' in e.response.data &&
      e.response.data.msg == 'Token has expired'
    ) {
      await refresh()
    } else {
      console.log(e)
    }
  }
}

export async function logout() {
  try {
    const response = await axios.get('/api/user_account/logout')
    return response.data
  } catch (e) {
    console.log(e)
  }
}

export async function registration(userName, fullName, email, password, phone, contacts) {
  try {
    const response = await axios.post('/api/user_account/registration', {
      username: userName,
      full_name: fullName,
      email: email,
      phone: phone,
      contacts: contacts,
      pwd: password
    })
    return response.data
  } catch (e) {
    try {
      return e.response.data
    } catch (ex) {
      console.log(ex)
    }
  }
}

export async function get_locations() {
  try {
    const response = await axios.get('/api/user_account/locations')
    return response.data
  } catch (e) {
    console.log(e)
  }
}

export async function get_location(location_id) {
  try {
    const response = await axios.get('/api/user_account/location/' + location_id)
    return response.data
  } catch (e) {
    console.log(e)
  }
}

export async function edit_location(location_id, location_data) {
  try {
    const response = await axios.post(
      '/api/user_account/location/' + location_id,
      location_data,
      authHeaders
    )
    return response.data
  } catch (e) {
    console.log(e)
  }
}

export async function delete_location(location_id) {
  try {
    const response = await axios.delete('/api/user_account/location/' + location_id, authHeaders)
    return response.data
  } catch (e) {
    console.log(e)
  }
}

export async function create_location(location_data) {
  try {
    const response = await axios.post(
      '/api/user_account/create_location',
      {
        name: location_data.name,
        address: location_data.address,
        geo: location_data.geo,
        maps_link: location_data.maps_link,
        description: location_data.description
      },
      authHeaders
    )
    return response.data.data
  } catch (e) {
    console.log(e)
  }
}
