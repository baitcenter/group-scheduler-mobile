<template>
    <f7-page>
        <f7-page-content>
            <f7-navbar color="red" :title='eventInfo.eventName' back-link="Back"></f7-navbar>
                <f7-block>
                    <f7-block-title><b>Event Name : {{this.eventInfo['eventName']}}</b></f7-block-title>
                    <f7-block-title><b>Time: </b> {{this.eventInfo['startTime']}} - {{this.eventInfo['endTime']}}</f7-block-title>

                <f7-block-title><b>Description:</b></f7-block-title>
                <!-- Inset -->
                <f7-block strong inset>
                      <p>{{this.eventInfo['eventDescription']}}</p>
                </f7-block>

                <f7-block-title><b>Joined Members: </b></f7-block-title>
                <!-- <f7-card> -->
                    <f7-list simple-list inset>
                        <f7-list-item v-for="(name, index) in this.eventInfo['joinedMembers']" v-bind:key="index">
                            {{name, index}}
                        </f7-list-item>
                    </f7-list>
                <!-- </f7-card> -->
                </f7-block>


        </f7-page-content>
        <f7-toolbar color="orange" bottom-md>
            <f7-link icon-material="group_add" @click="openConfirmJoin"> Join</f7-link>
            <f7-link disabled icon-material="exit_to_app" @click="openConfirmLeave"> Leave</f7-link>
            <f7-link  icon-material="delete" @click="openConfirmDel"> Delete</f7-link>

        </f7-toolbar>

    </f7-page>
</template>
<script>

import {auth,db} from '@/firebase'
export default {
    data(){
        return{
            eventInfo:{}
        }
    },
    mounted(){
        console.log(this.$f7route.params)
        const eventId = this.$f7route.params.eventId
        let tempEventInfo={}
        db.ref('events/'+eventId).once('value',snapshot=>{
            if(snapshot.val()){
                snapshot.forEach(child=>{
                    tempEventInfo[child.key]=child.val()
                })
            }
        }).then(()=>{
            this.eventInfo=tempEventInfo
        })
    },
    methods:{
        isJoinedMember(){

        },
        isLeader(){},
        joinEvent(){
            const uid = auth.currentUser.uid
            const eventId = this.$route.params.eventId
            // const groupId = this.$route.params.groupId

            db.ref('users/'+uid+'/userEvents/'+this.eventInfo['day']).child(eventId).set(0)
            db.ref('event/'+eventId +'/joinedMembers').push(uid)//may change to something else
        },
        leaveEvent(){
            const uid = auth.currentUser.uid
            const eventId = this.$route.params.eventId

            // const groupId = this.$route.params.groupId
            db.ref('users/'+uid+'/userEvents/'+this.eventInfo['day']).child(eventId).remove()
            db.ref('event/'+eventId +'/joinedMembers').child(uid).remove()//may change to something else
        },
        deleteEvent(){
            const uid = auth.currentUser.uid
            const eventId = this.$route.params.eventId

            const groupId = this.$route.params.groupId
            //not sure
            for(var key in this.eventInfo['joinedMembers']){
                const uid = this.eventInfo['joinedMembers'][key]

                db.ref('users/'+uid+'/userEvents/'+this.eventInfo['day']).child(eventId).remove();

            }
            db.ref('groups/'+groupId+'/groupSchedule/'+this.eventInfo['day']).child(eventId).remove()
            db.ref('events/').child(eventId).remove()
        },
        openConfirmDel(){
            const app = this.$f7;
            const eventName = this.eventInfo['eventName']
            app.dialog.title
            app.dialog.confirm('Do you want to delete this event?',eventName, () =>
            {
                app.dialog.alert('Great!',eventName);
                this.deleteEvent()
            });

        },
        openConfirmJoin(){
            const app = this.$f7;
            const eventName = this.eventInfo['eventName']
            app.dialog.title
            app.dialog.confirm('Do you want to Join this event?',eventName, () =>
            {
                app.dialog.alert('Great!',eventName);
                this.joinEvent()
            });
        },
        openConfirmLeave(){
            const app = this.$f7;

            const eventName = this.eventInfo['eventName']
            app.dialog.title
            app.dialog.confirm('Do you want to Leave this event?',eventName, () =>
            {
                app.dialog.alert('Great!',eventName);
                this.leaveEvent()
            });
        },
    }
}
</script>
