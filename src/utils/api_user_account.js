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

export async function refresh() {
    try {
        const response = await axios.post('/user_account/refresh', {},
            { headers: { 'X-CSRF-TOKEN': $cookies.get('csrf_refresh_token') } }
        );
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
        if (e.response.status == 401 && "msg" in e.response.data && e.response.data.msg == "Token has expired") {
            refresh();
        }
        else {
            console.log(e);
        }
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
        try {
            return e.response.data;
        }
        catch (ex) {
            console.log(ex);
        }

    }
}

export async function get_locations() {
    try {
        const response = await axios.get('/user_account/locations')
        return response.data;
    }
    catch (e) {
        console.log(e);
    }
}

export async function get_location(location_id) {
    try {
        const response = await axios.get('/user_account/location/' + location_id)
        return response.data;
    }
    catch (e) {
        console.log(e);
    }
}

export async function edit_location(location_id, location_data) {
    try {
        const response = await axios.post('/user_account/location/' + location_id,
            location_data,
            { headers: { 'X-CSRF-TOKEN': $cookies.get('csrf_access_token') } });
        return response.data;
    }
    catch (e) {
        console.log(e);
    }
}

export async function delete_location(location_id) {
    try {
        const response = await axios.delete('/user_account/location/' + location_id, { headers: { 'X-CSRF-TOKEN': $cookies.get('csrf_access_token') } })
        return response.data;
    }
    catch (e) {
        console.log(e);
    }
}

export async function create_location(location_data) {
    try {
        const response = await axios.post('/user_account/create_location',
            {
                "name": location_data.name,
                "address": location_data.address,
                "geo": location_data.geo,
                "maps_link": location_data.maps_link,
                "description": location_data.description,
            },
            { headers: { 'X-CSRF-TOKEN': $cookies.get('csrf_access_token') } });
        return response.data.data;
    }
    catch (e) {
        console.log(e);
    }
}