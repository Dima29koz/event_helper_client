<template>
  <v-container>
    <h1>Настройки профиля</h1>

    <v-expansion-panels v-model="panels">
      <!-- Username -->
      <v-expansion-panel>
        <v-expansion-panel-title hide-actions readonly>
          <v-row no-gutters class="align-center flex-column flex-sm-row me-5">
            <v-col class="text-subtitle-1"> Имя пользователя </v-col>
            <v-col class="text-medium-emphasis mt-sm-0 mt-2">
              <span> {{ currentUser.username }} </span>
            </v-col>
          </v-row>
        </v-expansion-panel-title>
      </v-expansion-panel>

      <!-- fullName -->
      <v-expansion-panel @group:selected="resetFullName($event)">
        <v-expansion-panel-title expand-icon="mdi-pencil">
          <template v-slot:default="{ expanded }">
            <v-row no-gutters class="align-center flex-column flex-sm-row">
              <v-col class="text-subtitle-1"> ФИО </v-col>
              <v-col class="text-medium-emphasis mt-sm-0 mt-2">
                <v-fade-transition leave-absolute>
                  <span v-if="expanded"> Укажите ФИО </span>
                  <span v-else>
                    {{ currentUser.full_name }}
                  </span>
                </v-fade-transition>
              </v-col>
            </v-row>
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-form ref="formFullName" @submit.prevent="setFullName">
            <v-text-field
              v-model="full_name"
              :rules="[(v) => validateField(v, schema.full_name)]"
              counter="50"
              name="name"
              label="ФИО"
            >
              <template v-slot:append>
                <v-btn type="submit" icon="mdi-check"> </v-btn>
              </template>
            </v-text-field>
          </v-form>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- contacts -->
      <v-expansion-panel @group:selected="resetContacts($event)">
        <v-expansion-panel-title expand-icon="mdi-pencil">
          <template v-slot:default="{ expanded }">
            <v-row no-gutters class="align-center flex-column flex-sm-row">
              <v-col class="text-subtitle-1"> Контакты </v-col>
              <v-col class="text-medium-emphasis mt-sm-0 mt-2">
                <v-fade-transition leave-absolute>
                  <span v-if="expanded"> Укажите контакты </span>
                  <span v-else>
                    {{ currentUser.contacts }}
                  </span>
                </v-fade-transition>
              </v-col>
            </v-row>
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-form ref="formContacts" @submit.prevent="setContacts">
            <v-text-field
              v-model.trim="contacts"
              :rules="[(v) => validateField(v, schema.contacts)]"
              counter="100"
              name="contacts"
              label="Контакты"
              placeholder="Другие способы связаться с вами (tg / vk и т.п.)"
            >
              <template v-slot:append>
                <v-btn type="submit" icon="mdi-check"> </v-btn>
              </template>
            </v-text-field>
          </v-form>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- phone -->
      <v-expansion-panel @group:selected="resetPhone($event)">
        <v-expansion-panel-title expand-icon="mdi-pencil">
          <template v-slot:default="{ expanded }">
            <v-row no-gutters class="align-center flex-column flex-sm-row">
              <v-col class="text-subtitle-1"> Телефон </v-col>
              <v-col class="text-medium-emphasis mt-sm-0 mt-2">
                <v-fade-transition leave-absolute>
                  <span v-if="expanded"> Укажите телефон </span>
                  <span v-else>
                    {{ formatPhoneNumber(currentUser.phone) }}
                  </span>
                </v-fade-transition>
              </v-col>
            </v-row>
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-form ref="formPhone" @submit.prevent="setPhone">
            <v-phone-number-input
              v-model="phone"
              :rules="[() => validateField(phone, schema.phone)]"
              show-code-on-list
              appended
            >
              <template v-slot:append>
                <v-btn type="submit" icon="mdi-check"> </v-btn>
              </template>
            </v-phone-number-input>
          </v-form>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- Email -->
      <v-expansion-panel @group:selected="resetEmail($event)">
        <v-expansion-panel-title expand-icon="mdi-pencil">
          <template v-slot:default="{ expanded }">
            <v-row no-gutters class="align-center flex-column flex-sm-row">
              <v-col class="text-subtitle-1 d-flex">
                Электронная почта
                <v-switchable-tooltip>
                  <template v-slot:activator>
                    <v-icon
                      :color="currentUser.is_email_verified ? 'success' : 'red'"
                      class="ms-2"
                      :icon="email_verified_icon"
                    >
                    </v-icon>
                  </template>
                  <p v-if="currentUser.is_email_verified">Почта подтверждена</p>
                  <p v-else>Почта не подтверждена</p>
                </v-switchable-tooltip>
              </v-col>
              <v-col class="text-medium-emphasis mt-sm-0 mt-2">
                <v-fade-transition leave-absolute>
                  <span v-if="expanded"> Укажите новую почту </span>
                  <span v-else>
                    {{ currentUser.email }}
                  </span>
                </v-fade-transition>
              </v-col>
            </v-row>
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-form ref="formEmail" @submit.prevent="setEmail">
            <v-text-field
              v-model="email"
              :rules="[(v) => validateField(v, schema.email)]"
              counter="50"
              name="email"
              label="Почта"
            >
              <template v-slot:append>
                <v-btn type="submit" icon="mdi-check"></v-btn>
              </template>
            </v-text-field>
          </v-form>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- password -->
      <v-expansion-panel @group:selected="resetPassword($event)">
        <v-expansion-panel-title expand-icon="mdi-pencil">
          <template v-slot:default="{ expanded }">
            <v-row no-gutters class="align-center flex-column flex-sm-row">
              <v-col class="text-subtitle-1"> Пароль </v-col>
              <v-col class="text-medium-emphasis mt-sm-0 mt-2">
                <v-fade-transition>
                  <span v-if="expanded"> Изменение пароля </span>
                </v-fade-transition>
              </v-col>
            </v-row>
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-form ref="formPassword" @submit.prevent="setPassword">
            <v-text-field
              v-model="password"
              :rules="[(v) => validateField(v, schema.password)]"
              :error-messages="passwordError"
              @update:modelValue="passwordError = ''"
              type="password"
              name="passwordCurrent"
              label="Текущий пароль"
            ></v-text-field>
            <v-text-field
              v-model="newPassword"
              :rules="[(v) => validateField(v, schema.password)]"
              type="password"
              name="password"
              label="Новый пароль"
              autocomplete="new-password"
            ></v-text-field>
            <v-text-field
              v-model="newPasswordRepeat"
              :rules="[(v) => validateField(v, schema.password_repeat(newPassword))]"
              type="password"
              name="passwordRepeat"
              label="Повторите пароль"
            >
              <template v-slot:append>
                <v-btn type="submit" icon="mdi-check"></v-btn>
              </template>
            </v-text-field>
          </v-form>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script>
import * as yup from 'yup'
import { validateField } from '@/utils/validators'
import { edit_profile, edit_email, edit_password } from '@/utils/api_user_account'

import { useCurrentUserStore } from '../stores/currentUserStore'
import { useNotificationsStore } from '@/stores/notificationsStore'
import { formatPhoneNumber } from '@/utils/formatters'

export default {
  setup() {
    const schema = {
      username: yup.string().max(50, 'Превышена максимальная длина').required('Поле не заполнено'),
      full_name: yup.string().max(50, 'Превышена максимальная длина').required('Поле не заполнено'),
      email: yup
        .string()
        .max(50, 'Превышена максимальная длина')
        .required('Поле не заполнено')
        .email('Некорректный ардес'),
      phone: yup.string().max(20, 'Превышена максимальная длина'),
      contacts: yup.string().max(100, 'Превышена максимальная длина'),
      password: yup.string().required('Поле не заполнено'),
      password_repeat: (password) => yup.string().oneOf([password, null], 'Пароли не совпадают')
    }
    const currentUserStore = useCurrentUserStore()
    const notificationsStore = useNotificationsStore()
    return { currentUserStore, notificationsStore, formatPhoneNumber, schema, validateField }
  },

  data() {
    return {
      full_name: '',
      contacts: '',
      phone: '',
      email: '',
      password: '',
      passwordError: '',
      newPassword: '',
      newPasswordRepeat: '',
      panels: []
    }
  },

  methods: {
    async editProfile(userData) {
      const res = await edit_profile(userData)
      this.currentUser.setData(res)
      this.panels = []
    },

    async setFullName() {
      if ((await this.$refs.formFullName.validate()).valid) {
        await this.editProfile({ full_name: this.full_name })
        this.notificationsStore.addNotification('ФИО изменено', 'success')
      }
    },
    async setContacts() {
      if ((await this.$refs.formContacts.validate()).valid) {
        await this.editProfile({ contacts: this.contacts })
        this.notificationsStore.addNotification('Контакты изменены', 'success')
      }
    },
    async setPhone() {
      if ((await this.$refs.formPhone.validate()).valid) {
        await this.editProfile({ phone: this.phone })
        this.notificationsStore.addNotification('Телефон изменен', 'success')
      }
    },
    async setEmail() {
      if ((await this.$refs.formEmail.validate()).valid) {
        const res = await edit_email(this.email)
        this.currentUser.setData(res)
        this.panels = []
        this.notificationsStore.addNotification(
          'Почта изменена. Проверьте вашу почту и следуйте инструкциям для её подтверждения.',
          'success'
        )
      }
    },
    async setPassword() {
      if ((await this.$refs.formPassword.validate()).valid) {
        const res = await edit_password(this.password, this.newPassword, this.newPasswordRepeat)
        if (res?.msg === 'Wrong username or password') {
          this.passwordError = 'Неверный пароль'
          return
        }
        this.currentUser.setData(res)
        this.panels = []
        this.notificationsStore.addNotification('Пароль изменен.', 'success')
      }
    },
    resetFullName(event) {
      if (event.value === true) {
        this.full_name = ''
      }
    },
    resetContacts(event) {
      if (event.value === true) {
        this.contacts = this.currentUser.contacts
      }
    },
    resetPhone(event) {
      if (event.value === true) {
        this.phone = ''
      }
    },
    resetEmail(event) {
      if (event.value === true) {
        this.email = ''
      }
    },
    resetPassword(event) {
      if (event.value === true) {
        this.password = ''
        this.passwordError = ''
        this.newPassword = ''
        this.newPasswordRepeat = ''
      }
    }
  },

  computed: {
    currentUser() {
      return this.currentUserStore
    },
    email_verified_icon() {
      return this.currentUserStore.is_email_verified ? 'mdi-email-check' : 'mdi-email-remove'
    }
  }
}
</script>
