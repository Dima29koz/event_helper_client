<template>
    <div>
        <LoginForm @login='loginUser'></LoginForm>
    </div>
</template>
  
<script>
import LoginForm from "@/components/Forms/LoginForm";
import { login, profileSettings} from "@/utils/api_user_account"

export default {
    components: {
        LoginForm,
    },
    methods: {
        async loginUser(user) {
            await login(user.username, user.password);
            this.$store.commit('current_user/authenticate');
            this.getUserData();
        },
        async getUserData() {
            let user_data = await profileSettings();
            this.$store.commit('current_user/setData', user_data);
        },

    },
}
</script>
  
<style scoped>

</style>