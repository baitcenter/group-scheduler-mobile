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
                          v-bind:value="password"
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
                alert: false,
                email: '',
                password: '',
            }
        },
        methods: {
            cleanPassword(){
                this.password = ''
                this.$store.commit('setError',null)
                this.alert=false
            },
            userSignIn() {
                this.$store.dispatch('userSignIn', {email: this.email, password: this.password})
            },
            goBack(){
                this.cleanPassword
                this.$f7router.navigate("/")
            },
            showErrorToast(){
                const self = this;
                const error = this.$store.getters.getError
                if(!self.toastBottom) {
                    self.toastBottom = self.$f7.toast.create({
                        text : error,
                        closeTimeout : 3000,
                        closeButton : true,
                    });
                }
                self.toastBottom.open();
            }
        },
        computed:{
            error() {
                return this.$store.state.error
            },
            loading() {
                return this.$store.state.loading
            }
        },
        watch: {
            error(value) {
                if (value){
                    console.log("in page : " + value)
                    this.showErrorToast()
                    this.cleanPassword()
                }
            },
            alert(value) {
                if (!value) {
                    this.$store.commit('setError',null)
                }
            }
        },
    }
</script>

<style scoped>

</style>