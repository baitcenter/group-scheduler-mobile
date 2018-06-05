<template>

<f7-page>
    <f7-navbar color="red">
        <f7-nav-left>
            <f7-link icon-if-ios="f7:menu" icon-if-md="material:menu" panel-open="left"></f7-link>
        </f7-nav-left>
        <f7-nav-title>My Schedule</f7-nav-title>
    </f7-navbar>
    <!-- FAB must be direct child of a page -->
    <f7-fab color="green" position="center-bottom" href="/create-event/" >
        <f7-icon f7="add"></f7-icon>
    </f7-fab>
    <!-- Switch Between Tabs -->
    <f7-segmented>
        <f7-button color="orange" tab-link="#tab-1" tab-link-active>Mon</f7-button>
        <f7-button color="orange" tab-link="#tab-2">Tue</f7-button>
        <f7-button color="orange" tab-link="#tab-2">Wed</f7-button>
        <f7-button color="orange" tab-link="#tab-2">Thu</f7-button>
        <f7-button color="orange" tab-link="#tab-2">Fri</f7-button>
    </f7-segmented>
    <!--{{userEvents}}-->
</f7-page>

</template>

<script>
    import {auth,db} from "@/firebase"
    export default {
        data() {
            return {
                userEvents: null
            }
        },
        firebase() {
            return {
                // dbMySchedule: db.ref("users/"+auth.currentUser.uid+"/userEvents")
            }
        },
        methods: {
            populateUserEvents() {
                // this.$firebaseRefs.dbMySchedule.once("value", snapshot => {
                //     console.log(snapshot.val())
                //     this.userEvents = snapshot.val()
                // })
            }
        },
        mounted() {
            console.log(auth.currentUser.uid)
        }
    }
</script>
