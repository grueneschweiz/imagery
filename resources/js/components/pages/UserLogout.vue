<template>
    <div>
        <MHeader>{{title}}</MHeader>
        <ALoader/>
    </div>
</template>

<script>
    import MHeader from "../molecules/MHeader";
    import Api from "../../service/Api";
    import SnackbarMixin from "../../mixins/SnackbarMixin";
    import ALoader from "../atoms/ALoader";
    import UnauthorizedHandlerMixin from "../../mixins/UnauthorizedHandlerMixin";

    export default {
        name: "UserLogout",
        components: {ALoader, MHeader},
        mixins: [SnackbarMixin, UnauthorizedHandlerMixin],

        data() {
            return {
                title: this.$t('users.logout.loggingOut'),
            }
        },

        mounted() {
            this.logout();
        },

        methods: {
            logout() {
                Api().post('users/logout')
                    .then(resp => this.redirect(resp.data.redirect))
                    .catch(error => this.handleUnauthorized(error))
                    .catch(error =>
                        this.snackErrorRetry(error, this.$t('logoutError'))
                            .then(this.logout)
                    );
            },

            redirect(href) {
                this.title = this.$t('users.logout.redirecting');
                window.location.href = href;
            }
        }
    }
</script>

<style scoped>

</style>
