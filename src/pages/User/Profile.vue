<template>
    <f7-page>
        <f7-navbar color="red" title="Profile" back-link="Back">
            <f7-nav-right><f7-link href="/my-schedule/" icon-if-md="material:home"></f7-link></f7-nav-right>
        </f7-navbar>
        <div v-if="!editing">
            <f7-block-title>Profile</f7-block-title>
            <f7-list>
                <f7-list-item>Name: {{username}}</f7-list-item>
                <f7-list-item>Email: {{useremail}}</f7-list-item>
            </f7-list>
            <f7-row>
                <f7-col width="5"></f7-col>
                <f7-button v-if="!verified" class="col-65" fill color="green" @click="resendVerificationEmail">Re-send email verified</f7-button>
                <f7-button class="col-30" fill color="gray" @click="toggleEdit">Edit</f7-button>
                <f7-col width="5"></f7-col>
            </f7-row>
        </div>
        <div v-else>
            <f7-block-title>Editing</f7-block-title>
            <f7-list>
                <f7-list-item>
                    <f7-label>Name</f7-label>
                    <f7-input type="text" @input="name=$event.target.value"
                              required validate v-bind:value="name"
                              placeholder="Display name" clear-button>
                    </f7-input>
                </f7-list-item>
                <f7-list-item>
                    <f7-label>Email</f7-label>
                    <f7-input type="email" @input="email=$event.target.value"
                              required validate v-bind:value="email"
                              placeholder="Email" clear-button>
                    </f7-input>
                </f7-list-item>
            </f7-list>
            <f7-list>
                <f7-list-item>
                    <f7-label>New Password</f7-label>
                    <f7-input type="password" @input="new_password=$event.target.value"
                              required validate
                              placeholder="Password" clear-button>
                    </f7-input>
                </f7-list-item>
                <f7-list-item>
                    <f7-label>Old Password</f7-label>
                    <f7-input type="password" @input="old_password=$event.target.value"
                              required validate
                              placeholder="Password" clear-button>
                    </f7-input>
                </f7-list-item>
                
            </f7-list>
            <f7-row>
                <f7-col width="5"></f7-col>
                <f7-button class="col-45" fill @click="cancelEdit">Cancel</f7-button>
                <f7-button class="col-45" fill color="red" @click="submitEdit">Save changes</f7-button>
                <f7-col width="5"></f7-col>
            </f7-row>
        </div>
    </f7-page>
</template>

<script>
    import {auth} from '@/firebase'
    export default {
        data() {
            return {
                verified : false,
                editing: false,
                username : "",
                useremail : "",
                name: "",
                email: "",
                old_password : "",
                new_password: "",
            }
        },
        methods: {
            initializedField(){
                var curUser = auth.currentUser
                this.name = curUser.displayName
                this.email = curUser.email
            },
             toggleEdit() {
                this.editing = !this.editing
            },
            submitEdit() {
                if((this.name !== "") && (this.email !== "") && (this.new_password !== "") && (this.old_password !== "")){
                    this.$store.dispatch('updateProfile',{displayName : this.name, email : this.email, new_password : this.new_password,old_password : this.old_password})
                    this.toggleEdit()
                }else{
                    const app = this.$f7;
                    app.dialog.alert("error updating profile")
                }
            },
            cancelEdit() {
                this.initializedField()
                this.toggleEdit()
            },
            // saveChanges() {
            //     this.toggleEdit()
            // },
            resendVerificationEmail(){
                this.$store.dispatch('resendVerificationEmail',null)
            },
        },
        created(){
            var curUser = auth.currentUser
            this.username = curUser.displayName
            this.useremail = curUser.email
            this.verified = curUser.emailVerified
            this.initializedField()
            console.log(curUser.emailVerified)
            console.log(this.verified)
        }
    }
</script>

<style scoped>

</style>