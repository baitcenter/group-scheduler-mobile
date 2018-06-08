<template>
    <f7-page>
        <f7-navbar color="red" title="Profile" back-link="Back">
            <f7-nav-right><f7-link href="/home/" icon-if-ios="f7:home" icon-if-md="material:home"></f7-link></f7-nav-right>
        </f7-navbar>
        <div v-if="!editing && !editingPassword">
            <f7-block-title>Profile</f7-block-title>
            <f7-list>
                <f7-list-item>
                    <f7-icon material="person" slot="media"></f7-icon>Name: {{name}}
                </f7-list-item>
                <f7-list-item>
                    <f7-icon material="email" slot="media"></f7-icon>Email: {{email}}
                </f7-list-item>
                <f7-list-item v-if="!verified">
                    <f7-icon material="verified_user" slot="media"></f7-icon>your email is not verified
                </f7-list-item>
                <f7-list-item v-if="!verified">
                    <f7-link class="align-content-center justify-content-center" @click="resendVerificationEmail">Resend verification email </f7-link>
                </f7-list-item>
            </f7-list>
            <f7-row>
                <f7-col width="5"></f7-col>
                <f7-button class="col-30" fill color="gray" @click="toggleEdit">Edit</f7-button>
                <f7-button class="col-55" fill color="orange" @click="toggleEditPassword">Change Password</f7-button>
                <f7-col width="5"></f7-col>
            </f7-row>
        </div>
        <div v-else-if="editing && !editingPassword">
            <f7-block-title>Edit Profile</f7-block-title>
            <f7-list>
                <f7-list-item>
                    <f7-icon material="person" slot="media"></f7-icon>
                    <f7-label>Name</f7-label>
                    <f7-input type="text" @input="name=$event.target.value"
                              required validate :value="name"
                              placeholder="Display name" clear-button>
                    </f7-input>
                </f7-list-item>
                <f7-list-item>
                    <f7-icon material="email" slot="media"></f7-icon>
                    <f7-label>Email</f7-label>
                    <f7-input type="email" @input="email=$event.target.value"
                              required validate :value="email"
                              placeholder="Email" clear-button>
                    </f7-input>
                </f7-list-item>
            </f7-list>
            <f7-list>
                <f7-list-item>
                    <f7-icon material="check_circle" slot="media"></f7-icon>
                    <f7-label>Password</f7-label>
                    <f7-input type="password" @input="password=$event.target.value"
                              required validate
                              placeholder="Password" clear-button>
                    </f7-input>
                </f7-list-item>

            </f7-list>
            <f7-row>
                <f7-col width="5"></f7-col>
                <f7-button class="col-45" fill color="orange" @click="cancelEdit">Cancel</f7-button>
                <f7-button class="col-45" fill color="green" @click="submitEdit">Save changes</f7-button>
                <f7-col width="5"></f7-col>
            </f7-row>
        </div>
        <div v-else-if="editingPassword && !editing">
            <f7-block-title>Change Password</f7-block-title>
            <f7-list>
                <f7-list-item>
                    <f7-icon material="check_circle" slot="media"></f7-icon>
                    <f7-label>Current Password</f7-label>
                    <f7-input type="password" @input="password=$event.target.value"
                              info=""
                              required validate :value="password"
                              placeholder="Password" clear-button>
                    </f7-input>
                </f7-list-item>
                <f7-list-item>
                    <f7-icon material="lock" slot="media"></f7-icon>
                    <f7-label>New Password</f7-label>
                    <f7-input type="password" @input="new_password=$event.target.value"
                              info=""
                              required validate :value="new_password"
                              placeholder="Password" clear-button>
                    </f7-input>
                </f7-list-item>
            </f7-list>
            <f7-row>
                <f7-col width="5"></f7-col>
                <f7-button class="col-30" color="orange" fill @click="cancelPasswordEdit">Cancel</f7-button>
                <f7-button class="col-65" fill color="green" @click="submitPasswordEdit">Save changes</f7-button>
                <f7-col width="5"></f7-col>
            </f7-row>
        </div>
    </f7-page>
</template>

<script>
    import firebase from '@/firebase'
    import {auth,db} from '@/firebase'
    export default {
        data() {
            return {
                alert : false,
                editingPassword : false,
                verified : false,
                editing: false,
                name: "",
                email: "",
                password : "",
                new_password: "",
            }
        },
        computed:{
            error() {
                return this.$store.state.error
            },
            loading() {
                return this.$store.state.loading
            },
            user(){
                console.log("current state user : " + this.$store.getters.getUser)
                return this.$store.getters.getUser
            }
        },
        methods: {
            initializedField(){
                var curUser = auth.currentUser
                this.name = curUser.displayName
                this.email = curUser.email
                this.password = ""
            },
            toggleEditPassword(){
                this.editingPassword = !this.editingPassword
            },
            toggleEdit() {
                this.editing = !this.editing
            },
            submitEdit() {
                if((this.name !== "") && (this.email !== "") && (this.password !== "")){
                this.$store.commit('setLoading', true)
                const credential = firebase.auth.EmailAuthProvider.credential(auth.currentUser.email, this.password)
                firebase.auth().currentUser.reauthenticateAndRetrieveDataWithCredential(credential)
                    .then(() => {
                        this.$store.commit('setLoading', false)
                        this.$store.commit('setError', null)
                        this.updateProfileV2()
                        this.password = ""
                    })
                    .catch(error => {
                        this.alert = true
                        this.$store.commit('setError', error.message)
                        this.$store.commit('setLoading', false)
                        this.initializedField()
                    })
                }else{
                    const self = this;
                    if(!self.toastBottom) {
                        self.toastBottom = self.$f7.toast.create({
                            text : "please fill in the edit form",
                            closeTimeout : 3000,
                            closeButton : true
                        });
                    }else{
                        self.toastBottom = self.$f7.toast.create({
                            text : "please fill in the edit form",
                            closeTimeout : 3000,
                            closeButton : true
                        });
                    }
                    self.toastBottom.open();
                }
            },
            updateProfileV2(){
                this.$store.commit('setLoading',true)
                firebase.auth().currentUser.updateEmail(this.email).then(() =>{
                    firebase.auth().currentUser.updateProfile({
                        displayName : this.name
                    })
                    const profile = db.ref("users/" + auth.currentUser.uid)
                    profile.child("profile").set({
                        name : this.name,
                        email : this.email
                    })
                    this.$store.commit('setError',null)
                    this.$store.commit('setLoading',false)
                    this.toggleEdit()
                }).catch(error =>{
                    this.initializedField()
                    this.alert = true
                    this.$store.commit('setError',error.message)
                    this.$store.commit('setLoading',false)
                })
            },
            changePassword(){
                this.$store.commit('setLoading',true)
                firebase.auth().currentUser.updatePassword(this.new_password).then(f=>{
                    this.$store.commit('setError',null)
                    this.$store.commit('setLoading',false)
                }).catch(error=>{
                    this.$store.commit('setError',error.message)
                    this.$store.commit('setLoading',false)
                })
            },
            cancelEdit() {
                this.initializedField()
                this.toggleEdit()
            },
            cancelPasswordEdit(){
                this.toggleEditPassword()
            },
            submitPasswordEdit(){
                if((this.new_password !== "") && (this.password !== "")){
                    this.$store.commit('setLoading',true)
                    const credential = firebase.auth.EmailAuthProvider.credential(auth.currentUser.email, this.password)
                    firebase.auth().currentUser.reauthenticateAndRetrieveDataWithCredential(credential)
                    .then(() => {
                        this.$store.commit('setLoading', false)
                        this.$store.commit('setError', null)
                        this.changePassword()
                        this.password = ""
                        this.toggleEditPassword()
                    }).catch(error => {
                        this.alert = true
                        this.$store.commit('setError', error.message)
                        this.$store.commit('setLoading', false)
                    })
                }else{
                    const self = this;
                    if(!self.toastBottom) {
                        self.toastBottom = self.$f7.toast.create({
                            text : "please fill in the edit form",
                            closeTimeout : 3000,
                            closeButton : true
                        });
                    }else{
                        self.toastBottom = self.$f7.toast.create({
                            text : "please fill in the edit form",
                            closeTimeout : 3000,
                            closeButton : true
                        });
                    }
                    self.toastBottom.open();
                }
            },
            resendVerificationEmail(){
                this.$store.dispatch('resendVerificationEmail',null)
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
                }else{
                   self.toastBottom = self.$f7.toast.create({
                        text : error,
                        closeTimeout : 3000,
                        closeButton : true,
                    });
                }
                self.toastBottom.open();
            }
        },
        watch: {
            error(value) {
                if (value){
                    console.log("in page : " + value)
                    this.showErrorToast()
                    this.alert = true
                }
            },
            alert(value) {
                if (!value) {
                    this.$store.commit('setError',null)
                }
            }
        },
        created(){
            var curUser = auth.currentUser
            this.verified = curUser.emailVerified
            this.alert = false
            this.initializedField()
        }
    }
</script>

<style scoped>

</style>
