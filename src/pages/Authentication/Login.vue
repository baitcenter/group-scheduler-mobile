<template>
    <f7-page login-screen>
        <f7-login-screen-title>Login</f7-login-screen-title>
        <f7-list form>
            <f7-list-item>
                <f7-label>Email</f7-label>
                <f7-input placeholder="Email" type="email"
                          @input="email = $event.target.value"
                          required validate clear-button>
                </f7-input>
            </f7-list-item>
            <f7-list-item>
                <f7-label>Password</f7-label>
                <f7-input type="Password" placeholder="Password"
                          @input="password  = $event.target.value"
                          required validate clear-button>
                </f7-input>
            </f7-list-item>
        </f7-list>
        <f7-list>
            <f7-list-button title="Sign In" @click="userSignIn"></f7-list-button>
            <f7-list-button title="Back" @click="goBack"></f7-list-button>
        </f7-list>
    </f7-page>
</template>

<script>
    export default {
        data() {
            return {
                email: '',
                password: '',
            }
        },
        methods: {
            userSignIn() {
                this.$store.dispatch('userSignIn', {email: this.email, password: this.password})
            },
            goBack(){
                this.$f7router.navigate("/")
            }
        }
    }
</script>

<style scoped>

</style>