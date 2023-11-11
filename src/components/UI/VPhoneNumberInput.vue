<template>
  <v-row no-gutters>
    <v-col cols="5">
      <v-autocomplete
        v-if="!noCountrySelector"
        :model-value="countryCode"
        :items="countryOptions"
        item-value="iso2"
        item-title="dialCode"
        auto-select-first
        :disabled="disabled"
        :error="error || (!noValidationError ? !!inputValue && !countryCode : false)"
        :error-messages="!!inputValue && !countryCode ? 'Укажите страну' : undefined"
        label="Код страны"
        @update:modelValue="onCountryChanged($event)"
        @focus="inputFocused = false"
      >
        <template v-slot:prepend-inner
          >{{ countryCodeToUnicodeFlag(internalCountryCode) }}
        </template>
        <template v-slot:item="{ props, item }">
          <v-list-item v-bind="props">
            <template v-slot:prepend v-if="!noFlags && typeof item.raw.iso2 === 'string'">
              <span class="pe-2">{{ countryCodeToUnicodeFlag(item.raw.iso2) }}</span>
            </template>
            <template v-slot:title>
              {{ item.raw.name }}
            </template>
            <template v-slot:subtitle v-if="showCodeOnList">
              {{ item.raw.dialCode }}
            </template>
          </v-list-item>
        </template>
      </v-autocomplete>
    </v-col>
    <v-col>
      <v-text-field
        ref="PhoneNumberInput"
        :model-value="inputValue"
        :rules="rules"
        name="tel"
        label="Номер телефона"
        :placeholder="inputPlaceholder"
        :disabled="disabled"
        :error="error || (!noValidationError ? !!inputValue && !results?.isValid : false)"
        :error-messages="
          (!noValidationError ? !!inputValue && !results?.isValid : false)
            ? 'некорректный номер'
            : undefined
        "
        type="tel"
        clearable
        @focus="inputFocused = true"
        @blur="inputFocused = false"
        @update:modelValue="onInputValueChanged($event)"
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed, onMounted, ref, watch, nextTick, reactive, defineOptions } from 'vue'

import { useLibphonenumber, isCountryAvailable } from '../../utils/useLibphonenumber'

const {
  fetchCountryCode,
  browserLocale,
  getResultsFromPhoneNumber,
  getAsYouTypeFormat,
  getCountriesList,
  getPhoneNumberExample,
  sanitizePhoneNumber,
  loadPhoneNumberExamplesFile
} = useLibphonenumber()

const emits = defineEmits([
  /** emitted when country or phone number changes */
  'update',
  /** emitted when country or phone number changes */
  'data',
  /** emitted when selected country changes */
  'country-code',
  /** emitted when country or phone number changes */
  'update:model-value',
  /** emitted when country changes */
  'update:country-code'
])

defineOptions({
  name: 'v-phone-number-input',
  inheritAttrs: false
})

const props = defineProps({
  /** Country calling code + telephone number in international format */
  modelValue: {
    type: String,
    validator: (prop) => {
      return typeof prop === 'string' || prop === undefined
    },
    default: undefined
  },
  rules: { type: Array, default: () => [] },
  /** Country code selected - Ex: "FR" */
  defaultCountryCode: {
    type: String,
    default: undefined,
    validator: (code) => isCountryAvailable(code)
  },
  /** List of country codes to place first in the select list - Ex: ['FR', 'BE', 'GE'] */
  preferredCountries: { type: Array, default: undefined },
  /** List of country codes to be removed from the select list - Ex: ['FR', 'BE', 'GE'] */
  ignoredCountries: { type: Array, default: undefined },
  /** List of country codes to only have the countries selected in the select list - Ex: ['FR', 'BE', 'GE'] */
  onlyCountries: { type: Array, default: undefined },
  /** Remove flags in country list */
  noFlags: { type: Boolean, default: false },
  /** Disable input */
  disabled: { type: Boolean, default: false },
  /** The component will make a request to get the location of the user and use it to set the default country code */
  fetchCountry: { type: Boolean, default: false },
  /** No show the country selector */
  noCountrySelector: { type: Boolean, default: false },
  /** Show country calling code in the country list */
  showCodeOnList: { type: Boolean, default: false },
  /** Replace country names */
  customCountriesList: {
    type: Object,
    default: undefined
  },
  /** Disabled auto-format as you type */
  noFormattingAsYouType: { type: Boolean, default: false },
  /**
   * locale of country list - Ex: "fr-FR"
   * @default {string} browser locale
   */
  countryLocale: { type: String, default: undefined },
  /** Disable validation error UI */
  noValidationError: { type: Boolean, default: false },
  /** Add error UI */
  error: { type: Boolean, default: false }
})

function countryCodeToUnicodeFlag(locale) {
  locale = locale ?? ''
  const characters = [...locale]
  return characters
    .map((letter) => (letter.charCodeAt(0) % 32) + 0x1f1e5)
    .map((n) => String.fromCodePoint(n))
    .join('')
}

const PhoneNumberInput = ref()
const selectionRange = reactive({
  start: 0,
  end: 0,
  cursorAtEnd: true
})

const examplesFileLoaded = ref(false)
const inputFocused = ref(false)

const countries = computed(() => getCountriesList(props.countryLocale, props.customCountriesList))

const countriesList = computed(() => {
  return countries.value?.filter((item) => !props.ignoredCountries?.includes(item.iso2))
})

const countriesFiltered = computed(() => {
  const countries = props.onlyCountries || props.preferredCountries
  return countries?.map((country) =>
    countriesList.value?.find((item) => item.iso2.includes(country))
  )
})

const otherCountries = computed(() => {
  return countriesList.value?.filter((item) => !props.preferredCountries?.includes(item.iso2))
})

const countriesSorted = computed(() => {
  return props.preferredCountries
    ? [...(countriesFiltered.value ?? []), ...(otherCountries.value ?? [])]
    : props.onlyCountries
    ? countriesFiltered.value
    : countriesList.value
})

const countryOptions = computed(() => {
  return countriesSorted.value
    ?.map((country) => {
      return country
        ? {
            ...country,
            dialCode: `+${country.dialCode}`
          }
        : undefined
    })
    .filter((value) => !!value)
})

const inputPlaceholder = computed(() => {
  if (!examplesFileLoaded.value) {
    return null
  } else {
    const example = getPhoneNumberExample(countryCode.value)
    return results.value.isValid || !example ? null : example
  }
})

const model = computed({
  get: () => props.modelValue,
  set: (value) => {
    emits('update:model-value', value)
  }
})

const internalCountryCode = ref()

const countryCode = computed({
  get: () => props.defaultCountryCode || internalCountryCode.value,
  set: (value) => {
    emits('country-code', value)
    emits('update:country-code', value)
    internalCountryCode.value = value
  }
})

const internalValue = ref(model.value)

const results = ref(getResultsFromPhoneNumber(model.value, countryCode.value))

const asYouTypeFormatted = ref()

const inputValue = computed(() => {
  if (props.noFormattingAsYouType) {
    return internalValue.value ?? ''
  }

  return asYouTypeFormatted.value ?? internalValue.value ?? ''
})

async function setCountryFromIpWho() {
  const fetchedLocale = await fetchCountryCode()
  if (fetchedLocale) setCountryCode(fetchedLocale)
}

async function loadExamples() {
  try {
    if (!examplesFileLoaded.value) {
      await loadPhoneNumberExamplesFile()
      examplesFileLoaded.value = true
    }
  } catch {
    console.error('[maz-ui](MazPhoneNumberInput) while loading phone number examples file')
  }
}

onMounted(async () => {
  await parseModel(model.value)

  await nextTick()

  if (props.fetchCountry && !countryCode.value) {
    await setCountryFromIpWho()
  }

  if (!countryCode.value) {
    setCountryCodeFromBrowserLocale()
  }

  await loadExamples()
})

watch(
  () => results.value,
  (newResults) => {
    emits('update', newResults)
    emits('data', newResults)
  },
  { immediate: true, deep: true }
)

watch(
  () => countryCode.value,
  (newCountryCode, oldCountryCode) => {
    if (newCountryCode && newCountryCode !== oldCountryCode) {
      setCountryCode(newCountryCode)
      onInputValueChanged(inputValue.value)
    }
  }
)

watch(
  () => model.value,
  async (newModel, oldModel) => {
    if (newModel !== oldModel) {
      parseModel(newModel)
    }
  }
)

watch(
  () => inputValue.value,
  async (newModel, oldModel) => {
    if (!props.noFormattingAsYouType && newModel && newModel !== oldModel) {
      const input = getPhoneNumberInput()
      if (
        input &&
        !results.value.isValid &&
        typeof selectionRange.start === 'number' &&
        !selectionRange.cursorAtEnd
      ) {
        const start = selectionRange.start
        const end = selectionRange.end
        setTimeout(() => {
          input.setSelectionRange(start, end ?? start)
        }, 0)
      }
    }
  }
)

function setCountryCodeFromBrowserLocale() {
  const { locale } = browserLocale()
  if (locale) {
    setCountryCode(locale)
  }
}

function updateResults(phoneNumber, countryCode) {
  results.value = getResultsFromPhoneNumber(phoneNumber, countryCode)
}

async function onInputValueChanged(phoneNumber) {
  const input = getPhoneNumberInput()
  selectionRange.start = input?.selectionStart
  selectionRange.end = input?.selectionEnd
  selectionRange.cursorAtEnd = selectionRange.start
    ? selectionRange.start >= phoneNumber?.length ?? 0
    : true

  const sanitizedPhoneNumber = sanitizePhoneNumber(phoneNumber)

  internalValue.value = sanitizedPhoneNumber

  const newResults = getResultsFromPhoneNumber(sanitizedPhoneNumber, countryCode.value)

  model.value = newResults.e164

  if (model.value) {
    PhoneNumberInput.value.validate()
  }
}

function onCountryChanged(codeCountry) {
  updateResults(inputValue.value, codeCountry)

  setCountryCode(codeCountry, true)
}

function setCountryCode(selectedCountryCode, autoFocusInput = false) {
  try {
    const countryAvailable = isCountryAvailable(selectedCountryCode)

    if (countryAvailable) {
      countryCode.value = selectedCountryCode

      if (autoFocusInput) {
        focusPhoneNumberInput()
      }
    }
  } catch (error) {
    console.error(`[maz-ui](MazPhoneNumberInput) ${error}`)
  }
}

async function parseModel(newModel) {
  updateResults(newModel, countryCode.value)

  await nextTick()

  if (props.noFormattingAsYouType) {
    internalValue.value = inputValue.value
  } else {
    asYouTypeFormatted.value =
      selectionRange.cursorAtEnd || results.value.isValid
        ? (internalValue.value = getAsYouTypeFormat(
            results.value.countryCode ?? countryCode.value,
            results.value.formatNational ?? internalValue.value
          ))
        : internalValue.value
  }

  await nextTick()

  autoUpdateCountryCodeWithResults(results.value)
}

function autoUpdateCountryCodeWithResults(newResults) {
  if (newResults.countryCode && countryCode.value !== newResults.countryCode) {
    setCountryCode(newResults.countryCode)
  }
}

function getPhoneNumberInput() {
  return PhoneNumberInput.value?.$el.querySelector('input')
}

async function focusPhoneNumberInput() {
  await nextTick()
  getPhoneNumberInput()?.focus()
}
</script>
