<template>
  <div>
    <navbar></navbar>
    <router-view></router-view>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from "@/components/Navbar";
import { profileSettings} from "@/utils/api_user_account"

export default {
  components: {
    Navbar
  },
  created() {
    if (this.$cookies.keys().includes("csrf_access_token")) {
      console.log('true');
      this.getUserData();
    }
    
  },
  methods: {
    async getUserData() {
            let user_data = await profileSettings();
            this.$store.commit('current_user/setData', user_data);
        },
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
