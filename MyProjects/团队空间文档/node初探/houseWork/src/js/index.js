var vm = new Vue({
    el: '#app',
    data: {
        username: '',
        password: '',
        passwordCheck: ''
    },
    methods: {
        login() {
            $.ajax({
                type: 'GET',
                url: 'index/login',
                data: {
                    username: this.username,
                    password: this.password
                },
                success: res => {
                    if (res.success && res.data.login) {
                        window.location.href = '/user?id=' + res.data.userId;
                    }
                }
            });
        },
        register() {
            $.ajax({
                type: 'POST',
                url: 'index/register',
                data: {
                    username: this.username,
                    password: this.password,
                    passwordCheck: this.passwordCheck
                },
                success: res => {
                    if (res.success && res.data.login) {
                        window.location.href = '/user?id=' + res.data.userId;
                    }
                }
            });
        }
    }
});
