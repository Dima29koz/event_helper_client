<template>
    <div>
        <RegistrationForm @register='createUser'></RegistrationForm>
    </div>
</template>
  
<script>
import RegistrationForm from "@/components/RegistrationForm";
import { registration } from "@/utils/api_user_account"

export default {
    components: {
        RegistrationForm,
    },
    methods: {
        async createUser(new_user) {
            registration(
                new_user.username,
                new_user.full_name,
                new_user.email,
                new_user.password,
                new_user.phone,
                new_user.contacts
            );
        },
    },
}
</script>
  
<style scoped></style>