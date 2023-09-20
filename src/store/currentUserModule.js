import axios from "axios";

export const currentUserModule = {
    state: () => ({
        isAuth: false,
        id: null,
        username: "",
        full_name: "",
        contacts: null,
        email: "",
        phone: null,
        is_email_verified: false,
    }),
    getters: {
        currentUser(state) {
            return state;
        },
    },
    mutations: {
        authenticate(state) {
            state.isAuth = true;
        },
        setData(state, data) {
            console.log(data);
            state.isAuth = true;
            state.id = data.id;
            state.username = data.username;
            state.full_name = data.full_name;
            state.contacts = data.contacts;
            state.email = data.email;
            state.phone = data.phone;
            state.is_email_verified = data.is_email_verified;
        },
        logout(state) {
            state.isAuth = false;
            state.id = null;
            state.username = "";
            state.full_name = "";
            state.contacts = null;
            state.email = "";
            state.phone = null;
            state.is_email_verified = false;
        },
    },
    actions: {

    },
    namespaced: true
}