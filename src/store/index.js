import Vue from 'vue'
import Vuex from 'vuex'
import firebase from '@/firebase'
import {googleProvider} from '@/firebase'
import f7Vue from '../main'
import {db, auth} from '@/firebase'

// f7 router syntax in here, f7Vue.$f7.router.navigate(<url>)
Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        appTitle: 'Grouppie',
        user: null,
        error: null,
        userGroupKeys: null,
        loading: false,
        currentGroupKey : '',
        userGroupsInfo: []
    },
    mutations: {
        setUser(state, payload) {
            state.user = payload;
        }
        ,
        setError(state, payload) {
            state.error = payload
        },
        setLoading(state, payload) {
            state.loading = payload
        },
        setUserGroupsInfo(state, payload) {
            state.userGroupsInfo = payload.userGroupsInfo
        },
        setCurrentGroupKey(state, payload){
            state.currentGroupKey = payload
        }
    },
    actions: {
        sendResetEmail({commit},payload){
            commit('setLoading',true)
            firebase.auth().sendPasswordResetEmail(payload.email).then(result => {
                commit('setLoading',false)
                router.push('/signin')
            }).catch(error => {
                commit('setError', error.message)
                commit('setLoading',false)
            });
        },
        signinWithGoogle({commit},payload){
            commit('setLoading',true)
            firebase.auth().signInWithPopup(googleProvider).then(result => {
                commit('setUser', result.user)
                commit('setLoading',false)
                router.push('/')
                // // This gives you a Google Access Token. You can use it to access the Google API.
                // var token = result.credential.accessToken;
                // // The signed-in user info.
                // var user = result.user;
                // // ...
              }).catch(error => {
                commit('setError', error.message)
                commit('setLoading',false)
                // // Handle Errors here.
                // var errorCode = error.code;
                // var errorMessage = error.message;
                // // The email of the user's account used.
                // var email = error.email;
                // // The firebase.auth.AuthCredential type that was used.
                // var credential = error.credential;
                // // ...
              });
        },
        userSignUp({commit}, payload) {
            commit('setLoading', true)
            var name = payload.displayname
            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
                .then(firebaseUser => {
                    var user = firebase.auth().currentUser
                    console.log("before " + firebase.auth().currentUser.displayName)
                    console.log("The name" + name)
                    user.updateProfile({
                        displayName: name,
                    }).then(function(){
                        console.log("The name after" + user.displayName)

                        // TODO
                        // add profile to data base
                        const profile = db.ref("users/"+ firebaseUser.user.uid)
                        profile.child("profile").set({
                            name: firebaseUser.user.displayName,
                            email: firebaseUser.user.email
                        })
                    }).catch(function(error){
                        console.log(error)
                        commit('setError',error.message)
                    })
                    user.sendEmailVerification().then(function(){                        
                    }).catch(function(error){
                        commit('setError',error.message)
                    })
                    const newUser = {
                        id: firebaseUser.user.uid,
                        displayName: firebaseUser.user.displayName,
                        email: firebaseUser.user.email
                    }
                    commit('setUser', newUser)
                    commit('setLoading', false)
                    //
                    // const uid =firebaseUser.uid;
                    // firebase.database().ref('users/'+uid +'/groups').push();
                    //
                    f7Vue.$f7.router.navigate('/home/')
                })
                .catch(error => {
                    commit('setError', error.message)
                    commit('setLoading', false)
                })
        },
        userSignIn({commit}, payload) {
            commit('setLoading', true)
            firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
                .then(firebaseUser => {
                    const newUser = {
                        id: firebaseUser.user.uid,
                        displayName: firebaseUser.user.displayName,
                        email: firebaseUser.user.email
                    }
                    commit('setUser', newUser)
                    commit('setLoading', false)
                    commit('setError', null)
                    f7Vue.$f7.router.navigate('/home/')
                    // router.push('/')
                })
                .catch(error => {
                    commit('setError', error.message)
                    commit('setLoading', false)
                })
        },
        autoSignIn({commit}, payload) {
            const newUser = {
                id: payload.uid,
                displayName: payload.displayName,
                email: payload.email
            }
            commit('setUser', newUser)
        },
        userSignOut({commit}) {
            firebase.auth().signOut()
            commit('setUser', null)
            f7Vue.$f7.router.navigate('/')
        },
        updateDisplayName({commit}, payload) {
            commit('setLoading', true)
            firebase.auth().currentUser.updateProfile({displayName: payload.displayName})
                .then(() => {
                    commit('setLoading', false)
                })
            console.log("name updated")
        },
        updateEmail({commit}, payload) {
            commit('setLoading', true)
            firebase.auth().currentUser.updateEmail(payload.email)
                .then(f => {
                    commit('setLoading', false)
                })
            console.log("email updated")
        },
        updateProfile({commit}, payload) {
            commit('setLoading',true)
            const credential = firebase.auth.EmailAuthProvider.credential(payload.email,payload.password)
            firebase.auth().currentUser.reauthenticateAndRetrieveDataWithCredential(credential)
            .then(function(){
                console.log("reauthentication successful")
                firebase.auth().currentUser.updateProfile({
                    displayName : payload.displayName,
                    email : payload.email
                }).then(function(){
                    console.log("profile updated")
                    const profile = db.ref("user/" + auth.currentUser.uid)
                    profile.child("profile").set({
                        name : auth.currentUser.displayName,
                        email : auth.currentUser.email
                    })
                    commit('setLoading',false)
                }).catch(function(error){
                    console.log("update profile error")
                    console.log(error)
                    commit('setError',error.message)
                    commit('setLoading',false)

                })
            }).catch(function(error){
                console.log("reauthentication error")
                console.log(error)
                commit('setError',error.message)
                commit('setLoading',false)
            })
            // firebase.auth().currentUser.updateProfile({
            //     displayName : payload.displayName,
            //     email : payload.email
            // }).then(function(){
            //     const profile = db.ref("users/"+ auth.currentUser.uid)
            //     profile.child("profile").set({
            //         name: auth.currentUser.displayName,
            //         email: auth.currentUser.email
            //     })
            //     const credential = firebase.auth.EmailAuthProvider.credential(payload.email,payload.old_password)
            //     firebase.auth().currentUser.reauthenticateAndRetrieveDataWithCredential(credential)
            //     .then(function(){
            //         console.log("reauthed")
            //         firebase.auth().currentUser.updatePassword(payload.new_password).then(function(){
            //             console.log("password updated")
            //         }).catch(function(error){
            //             console.log(error)
            //         })
            //     }).catch(function(error){
            //         console.log(error)
            //     })

            //     commit('setLoading',false)
            // }).catch(function(error){
            //     console.log(error)
            //     commit('setLoading',false)
            // })
            console.log("update complete")       
        },
        reauthenticateUser({commit}, payload) {
            commit('setLoading', true)
            const credential = firebase.auth.EmailAuthProvider.credential(payload.email, payload.password)
            firebase.auth().currentUser.reauthenticateAndRetrieveDataWithCredential(credential)
                .then(f => {
                    commit('setLoading', false)
                    commit('setError', null)
                })
                .catch(error => {
                    console.log(error)
                    commit('setError', error.message)
                    commit('setLoading', false)
                })
        },
        changePassword({commit}, payload) {
            commit('setLoading', true)
            const credential = firebase.auth.EmailAuthProvider.credential(auth.currentUser.email, payload.old_password)
            firebase.auth().currentUser.reauthenticateAndRetrieveDataWithCredential(credential)
            .then(function(){
                console.log("reauthentication successful")
                firebase.auth().currentUser.updatePassword(payload.new_password).then(function(){
                    console.log("password updated")
                    commit('setLoading',false)
                }).catch(function(error){
                    console.log("error updating password")
                    console.log(error.message)
                    commit('setError',error.message)
                    commit('setLoading',false)
                })
            }).catch(function(error){
                console.log("reauthentication error")
                console.log(error.message)
                commit('setError',error.message)
                commit('setLoading',false)
            })
            // firebase.auth().currentUser.updatePassword(payload.new_password).then(function(){
            //     commit('setLoading',false)
            //     console.log("password updated")
            //     // f7Vue.$f7.router.navigate('/profile/')
            // }).catch(function(error){
            //     commit('setError', error.message)
            //     commit('setLoading', false)
            // })
        },
        resendVerificationEmail({commit},payload) {
            commit('setLoading', true)
            firebase.auth().currentUser.sendEmailVerification().then(function(){
                commit('setLoading',false)
            }).catch(function(error){
                commit('setLoading',false)
                commit('setError',error.message)
            })
        }
    },
    getters: {
        isAuthenticated(state) {
            return state.user !== null && state.user !== undefined
        },
        getUserGroupKey: state => {
            return state.userGroupKeys;
        },
        getUserGroupsInfo(state) {
            return state.userGroupsInfo
        },
        getUser(state) {
            return state.user
        },
        getError(state) {
            return state.error
        }
    }
})
