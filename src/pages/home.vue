<template>
    <f7-page>
        <f7-page-content>
            <f7-block>
                <f7-row class="text-align-center justify-content-center align-content-center">
                    <img class="center" src="/static/logo.png">
                    <h1 class="text-align-center">Grouppie</h1>
                </f7-row>
            </f7-block>
            <f7-block-title class="text-align-center">The traditional way</f7-block-title>
            <f7-block>
                <f7-button href="/signup/" color="red" raised fill><f7-icon material="create"></f7-icon> Sign Up</f7-button>
            </f7-block>
            <f7-block>
                <f7-button href="/login/" raised fill color="green"><f7-icon material="person"></f7-icon> Login</f7-button>
            </f7-block>
            <f7-block-title class="text-align-center">or</f7-block-title>
            <f7-block>
                <f7-button @click="signInWithGoogle" color="red"> <f7-icon material="email"></f7-icon> Login with Google</f7-button>
            </f7-block>
        </f7-page-content>
    </f7-page>
</template>

<script>
export default {
    methods:{
        signInWithGoogle(){
            this.$store.dispatch('signinWithGoogle',null)
        }
    }
}
</script>
