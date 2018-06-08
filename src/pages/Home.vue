<template>
    <f7-page>
        <f7-block>
            <f7-row class="text-align-center justify-content-center align-content-center">
                <img class="center" src="static/logo.png">
            </f7-row>
            <f7-row class="justify-content-center text-align-center">
                <h1 class="text-align-center">Grouppie</h1>
            </f7-row>
        </f7-block>
        <f7-block-title class="text-align-center">Already have an account?</f7-block-title>
        <f7-block>
            <f7-button href="/login/" raised fill color="green"><f7-icon material="person"></f7-icon> Login</f7-button>
        </f7-block>
        <f7-block-title class="text-align-center">or</f7-block-title>
        <f7-block>
            <f7-button href="/signup/" color="red" raised fill><f7-icon material="create"></f7-icon> Sign Up</f7-button>
        </f7-block>
    </f7-page>
</template>

<script>
export default {

}
</script>
