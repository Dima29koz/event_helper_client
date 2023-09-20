const axios = require('axios').default;


export async function login(username, pwd) {
    try {
        const response = await axios.post('/user_account/login',
            {
                "username": username,
                "pwd": pwd

            },
        )
        return response.data;
    }
    catch (e) {
        console.log(e);
    }
}

export async function profileSettings() {
    try {
        const response = await axios.get('/user_account/profile_settings');
        return response.data;
    } catch (e) {
        console.log(e);
    }
}

export async function logout() {
    try {
        const response = await axios.get('/user_account/logout');
        return response.data;
    }
    catch (e) {
        console.log(e);
    }
}

export async function registration(userName, fullName, email, password, phone, contacts) {
    try {
        const response = await axios.post('/user_account/registration',
            {
                "username": userName,
                "full_name": fullName,
                "email": email,
                "phone": phone,
                "contacts": contacts,
                "pwd": password
            }
        );
        return response.data;
    }
    catch (e) {
        console.log(e);
    }
}