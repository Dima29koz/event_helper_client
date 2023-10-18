import axios from 'axios'
import $cookies from 'vue-cookies'
import router from '@/router'

export const authHeaders = () => {
  return { headers: { 'X-CSRF-TOKEN': $cookies.get('csrf_access_token') } }
}

export function requestHandler(fn) {
  return async function (...args) {
    try {
      return await fn(...args)
    } catch (e) {
      if (
        e.response.status == 422 &&
        'msg' in e.response.data &&
        e.response.data.msg == 'Signature verification failed'
      ) {
        $cookies.remove('csrf_access_token')
        router.push({ path: '/login' })
      } else if (
        e.response.status == 401 &&
        'msg' in e.response.data &&
        e.response.data.msg == 'Token has expired'
      ) {
        await refresh()
        return await requestHandler(fn)(...args)
      } else {
        console.log(e)
        throw e
      }
    }
  }
}

export const login = requestHandler(async function (username, pwd) {
  try {
    const response = await axios.post('/api/user_account/login', {
      username: username,
      pwd: pwd
    })
    return response.data
  } catch (e) {
    if (
      e.response.status == 401 &&
      'msg' in e.response.data &&
      e.response.data.msg == 'Wrong username or password'
    ) {
      return e.response.data
    }
    throw e
  }
})

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

export const profileSettings = requestHandler(async function () {
  const response = await axios.get('/api/user_account/profile_settings')
  return response.data
})

export const logout = requestHandler(async function () {
  const response = await axios.get('/api/user_account/logout')
  return response.data
})

export const registration = requestHandler(
  async function (userName, fullName, email, password, phone, contacts) {
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
      if (
        e.response.status == 400 &&
        'msg' in e.response.data &&
        e.response.data.msg == 'username is not allowed'
      ) {
        return e.response.data
      }
      throw e
    }
  }
)

export const get_locations = requestHandler(async function () {
  const response = await axios.get('/api/user_account/locations')
  return response.data
})

export const get_location = requestHandler(async function (location_id) {
  const response = await axios.get('/api/user_account/location/' + location_id)
  return response.data
})

export const edit_location = requestHandler(async function (location_id, location_data) {
  const response = await axios.post(
    '/api/user_account/location/' + location_id,
    location_data,
    authHeaders()
  )
  return response.data
})

export const delete_location = requestHandler(async function (location_id) {
  const response = await axios.delete('/api/user_account/location/' + location_id, authHeaders())
  return response.data
})

export const create_location = requestHandler(async function (location_data) {
  const response = await axios.post(
    '/api/user_account/create_location',
    {
      name: location_data.name,
      address: location_data.address,
      geo: location_data.geo,
      maps_link: location_data.maps_link,
      description: location_data.description
    },
    authHeaders()
  )
  return response.data.data
})

export const confirm_email = requestHandler(async function (token) {
  const response = await axios.get('/api/user_account/confirm_email/' + token)
  return response.data.msg
})
