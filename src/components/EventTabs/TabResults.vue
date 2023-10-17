<template>
  <v-container>
    <v-row>
      <v-col class="font-weight-bold">Суммы</v-col>
      <v-col>Ожидаемая</v-col>
      <v-col>Итоговая</v-col>
    </v-row>
    <v-row>
      <v-col>За алкоголь</v-col>
      <v-col class="text-end">{{ getNumberFormat(totalSum.sum_alco_supposed) }}</v-col>
      <v-col class="text-end">{{ getNumberFormat(totalSum.sum_alco_final) }}</v-col>
    </v-row>
    <v-row>
      <v-col>За остальное</v-col>
      <v-col class="text-end">{{ getNumberFormat(totalSum.sum_no_alco_supposed) }}</v-col>
      <v-col class="text-end">{{ getNumberFormat(totalSum.sum_no_alco_final) }}</v-col>
    </v-row>
    <v-row>
      <v-col>За всё</v-col>
      <v-col class="text-end">{{ getNumberFormat(totalSum.sum_supposed) }}</v-col>
      <v-col class="text-end">{{ getNumberFormat(totalSum.sum_final) }}</v-col>
    </v-row>

    <v-row>
      <v-col>Число дней</v-col>
      <v-col>Пьющий</v-col>
      <v-col>Непьющий</v-col>
    </v-row>
    <v-row v-for="[days, item] of Object.entries(membersInfo.by_days)" :key="days">
      <v-col>{{ days }}</v-col>
      <v-col>{{ item.drinkers }}</v-col>
      <v-col>{{ item.not_drinkers }}</v-col>
    </v-row>
    <v-row>
      <v-col cols="4" class="font-weight-bold">Общее количество людей</v-col>
      <v-col class="text-center">{{ membersAmount }}</v-col>
    </v-row>

    <v-row>
      <v-col>Число дней</v-col>
      <v-col>Пьющий</v-col>
      <v-col>Непьющий</v-col>
    </v-row>
    <v-row v-for="[days, item] of Object.entries(this.costInfo)" :key="days">
      <v-col>{{ days }}</v-col>
      <v-col class="text-end">{{ getNumberFormat(item.drinker) }}</v-col>
      <v-col class="text-end">{{ getNumberFormat(item.not_drinker) }}</v-col>
    </v-row>
    <v-row>
      <v-col class="font-weight-bold">хотим получить</v-col>
      <v-col class="text-end">{{ getNumberFormat(desiredSum) }}</v-col>
      <v-col class="font-weight-bold">получили</v-col>
      <v-col class="text-end">{{ getNumberFormat(actualSum) }}</v-col>
    </v-row>
    <v-row> </v-row>
  </v-container>
</template>

<script>
import { getNumberFormat } from '@/utils/formatters'
export default {
  name: 'tab-results',
  setup() {
    return { getNumberFormat }
  },
  data() {
    return {}
  },
  props: {
    data: {
      type: Object,
      default: function () {
        return { event_data: {}, event_products: [], event_members: [] }
      }
    }
  },
  methods: {},
  computed: {
    // todo remove copypaste from eventMemberForm.vue
    eventDaysAmount() {
      return Math.ceil(
        (this.data.event_data.date_end.getTime() - this.data.event_data.date_start.getTime()) /
          (1000 * 3600 * 24)
      )
    },
    membersAmount() {
      return this.data.event_members.length
    },
    baseCoef() {
      return 1 - this.data.event_data.cost_reduction_factor / 100
    },
    totalSum() {
      const total = {
        sum_no_alco_final: 0,
        sum_no_alco_supposed: 0,
        sum_alco_final: 0,
        sum_alco_supposed: 0,
        sum_final: 0,
        sum_supposed: 0
      }

      this.data.event_products.forEach((product) => {
        const category = product.base_product.category
        let sum_final = product.price_final * product.amount
        let sum_supposed = product.base_product.price_supposed * product.amount

        if (category === 'Алкогольные напитки') {
          total.sum_alco_final += sum_final
          total.sum_alco_supposed += sum_supposed
        } else {
          total.sum_no_alco_final += sum_final
          total.sum_no_alco_supposed += sum_supposed
        }
      })

      total.sum_final = total.sum_no_alco_final + total.sum_alco_final
      total.sum_supposed = total.sum_no_alco_supposed + total.sum_alco_supposed

      return total
    },
    membersInfo() {
      const members_info = {
        by_days: {},
        members_coefficient: 0,
        members_alco_coefficient: 0
      }

      this.data.event_members.forEach((member) => {
        if (!members_info.by_days[member.days_amount]) {
          members_info.by_days[member.days_amount] = { drinkers: 0, not_drinkers: 0 }
        }
        members_info.by_days[member.days_amount][
          member.is_drinker ? 'drinkers' : 'not_drinkers'
        ] += 1

        const coef = this.baseCoef ** (this.eventDaysAmount - member.days_amount)
        members_info.members_coefficient += coef

        if (member.is_drinker) {
          members_info.members_alco_coefficient += coef
        }
      })
      return members_info
    },
    costInfo() {
      const cost_info = {}
      for (const days of Object.keys(this.membersInfo.by_days)) {
        if (!cost_info[days]) {
          cost_info[days] = { drinker: 0, not_drinker: 0 }
        }
        const coef = this.baseCoef ** (this.eventDaysAmount - days)
        cost_info[days].not_drinker =
          (this.totalSum.sum_no_alco_supposed / this.membersInfo.members_coefficient) * coef

        cost_info[days].drinker =
          (this.totalSum.sum_alco_supposed / this.membersInfo.members_alco_coefficient) * coef +
          cost_info[days].not_drinker
      }
      return cost_info
    },
    desiredSum() {
      let sum = 0
      for (const [days, item] of Object.entries(this.membersInfo.by_days)) {
        sum +=
          this.costInfo[days].drinker * item.drinkers +
          this.costInfo[days].not_drinker * item.not_drinkers
      }
      return sum
    },
    actualSum() {
      let sum = 0
      this.data.event_members.forEach((member) => {
        sum += member.money_impact
      })

      return sum
    }
  },
  mounted() {
    this.$emit('getEventProducts')
    this.$emit('getMembers')
  }
}
</script>
