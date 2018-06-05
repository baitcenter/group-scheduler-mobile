<template>
    <f7-page>
        <f7-navbar title="Sign Up" color="red" back-link="Back"></f7-navbar>
        <f7-list form>
            <f7-list-item>
                <f7-icon material="person" slot="media"></f7-icon>
                <f7-label>Displayname</f7-label>
                <f7-input type="text" required v-bind:value="displayName" placeholder="Displayname" @input="displayName = $event.target.value"></f7-input>
            </f7-list-item>
            <f7-list-item>
                <f7-icon material="email" slot="media"></f7-icon>
                <f7-label>E-mail</f7-label>
                <f7-input type="email" required v-bind:value="email" placeholder="E-mail" @input="email = $event.target.value"></f7-input>
            </f7-list-item>
            <f7-list-item>
                <f7-icon material="lock" slot="media"></f7-icon>
                <f7-label>Password</f7-label>
                <f7-input type="password" required v-bind:value="password" placeholder="Password" @input="password = $event.target.value"></f7-input>
            </f7-list-item>
            <f7-list-item>
                <f7-icon material="check_box" slot="media"></f7-icon>
                <f7-label>Confirm Password</f7-label>
                <f7-input type="password" v-bind:value="confirmpassword" placeholder="Confirm Password" @input="confirmpassword = $event.target.value"></f7-input>
            </f7-list-item>    
        </f7-list>
        <f7-block>
            <f7-row>
                <f7-button class="col" color="red" @click.prevent="createUser" raised fill>Sign Up</f7-button>
            </f7-row>
        </f7-block >
    </f7-page>
</template>

<script>
export default {
    data(){
        return{
            displayName : '',
            email : '',
            password : '',
            confirmpassword : '',
        }
    },
    methods: {
        createUser(){
            if(this.confirmpassword === this.password){
                console.log("Sign up page" + this.displayName)
                this.$store.dispatch('userSignUp',{displayname : this.displayName, email : this.email, password : this.password})
            }else{
                const app = this.$f7
                app.dialog.alert("The password and confirm is not the same")
            }
        }
    }
}
</script>
