import axios from 'axios'

import { authHeaders, requestHandler } from './api_user_account'

export const get_events = requestHandler(async function () {
  const response = await axios.get('/api/event_management/events')
  return response.data
})

export const create_event = requestHandler(async function (event) {
  const response = await axios.post(
    '/api/event_management/create_event',
    {
      title: event.title,
      description: event.description,
      date_start: event.date_start.toISOString(),
      date_end: event.date_end.toISOString(),
      timezone: event.timezone,
      cost_reduction_factor: event.cost_reduction_factor,
      location: event.location
    },
    authHeaders()
  )
  return response.data.key
})

export const get_member_info = requestHandler(async function (event_key) {
  const response = await axios.get('/api/event_management/member_info/' + event_key)
  return response.data
})

export const get_base_products = requestHandler(async function () {
  const response = await axios.get('/api/event_management/product/base')
  return response.data
})

export const add_base_product = requestHandler(async function (product_data) {
  const response = await axios.post(
    '/api/event_management/product/base',
    {
      name: product_data.name,
      category_id: product_data.category.id,
      type_id: product_data.type.id,
      unit_id: product_data.unit.id,
      price_supposed: product_data.price_supposed
    },
    authHeaders()
  )
  return response.data
})

export const get_product_categories = requestHandler(async function () {
  const response = await axios.get('/api/event_management/product/category')
  return response.data
})

export const add_product_category = requestHandler(async function (value) {
  const response = await axios.post(
    '/api/event_management/product/category',
    {
      name: value
    },
    authHeaders()
  )
  return response.data
})

export const get_product_types = requestHandler(async function () {
  const response = await axios.get('/api/event_management/product/type')
  return response.data
})

export const add_product_type = requestHandler(async function (name, category_id) {
  const response = await axios.post(
    '/api/event_management/product/type',
    {
      name: name,
      category_id: category_id
    },
    authHeaders()
  )
  return response.data
})

export const get_product_units = requestHandler(async function () {
  const response = await axios.get('/api/event_management/product/unit')
  return response.data
})

export const add_product_unit = requestHandler(async function (value) {
  const response = await axios.post(
    '/api/event_management/product/unit',
    { name: value },
    authHeaders()
  )
  return response.data
})
