import * as yup from 'yup'

export function validateField(value, schema) {
  try {
    schema.validateSync(value)
    return true
  } catch (error) {
    return error.message
  }
}

/** checks that >0, has less then 2 decimals and is not null */
export const validateMonetary = yup
  .number()
  .moreThan(0, 'Значение должно быть больше 0')
  .test('two-decimals', 'Значение должно иметь не более двух десятичных знаков', (value) =>
    /^\d+(\.\d{1,2})?$/.test(value)
  )
  .typeError('Значение не указано')
