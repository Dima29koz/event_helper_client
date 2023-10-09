export function validateField(value, schema) {
  try {
    schema.validateSync(value)
    return true
  } catch (error) {
    return error.message
  }
}
