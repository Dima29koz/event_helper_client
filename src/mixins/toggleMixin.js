export default {
    props: {
        modalVisible: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        hideDialog() {
            this.$emit('update:modalVisible', false)
        }
    },
}