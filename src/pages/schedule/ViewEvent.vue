<template>
    <f7-page>
        <f7-page-content>
            <f7-navbar title="EventName" back-link="Back"></f7-navbar>
                <f7-block>
                    
                    <f7-block-title><b>Time: </b> xx:xx - yy:yy</f7-block-title>
                

         
                <f7-block-title><b>Description:</b></f7-block-title>
                <!-- Inset -->
                <f7-block strong inset>
                      <p>Mauris posuere sit amet metus id venenatis. Ut ante dolor, tempor nec commodo rutrum, varius at sem. Nullam ac nisi non neque ornare pretium. Nulla mauris mauris, consequat et elementum sit amet, egestas sed orci. In hac habitasse platea dictumst.</p>
                </f7-block>

                <f7-block-title><b>Joined Members: </b></f7-block-title>
                <!-- <f7-card> -->
                        
                    <f7-list simple-list inset>
                        <f7-list-item v-for="(name, index) in members" v-bind:key="index">
                            {{name, index}}
                        </f7-list-item>
                    </f7-list>
                <!-- </f7-card> -->
                </f7-block>


        </f7-page-content>
        <f7-toolbar bottom-md>
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
        const eventId = this.$route.params.eventId
        db.ref('event/'+eventId).once('value',snapshot=>{
            this.eventInfo[snapshot.key]=snapshot.val()
        })
    },
    methods:{
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
            db.ref('users/'+uid+'/userEvents/'+this.eventInfo['day']).remove(eventId)
            db.ref('event/'+eventId +'/joinedMembers').remove(uid)//may change to something else
        },
        deleteEvent(){
            const uid = auth.currentUser.uid
            const eventId = this.$route.params.eventId
            const groupId = this.$route.params.groupId
            //not sure
            db.ref('event/'+eventId+'/joinedMembers').once('value',snapshot=>{
                db.ref('users/'+snapshot.val()+'/userEvents/'+this.eventInfo['day']).remove(eventId);
            })
            db.ref('groups/'+groupId+'/groupSchedule/'+this.eventInfo['day']).remove(eventId)
            db.ref('event').remove(eventId)
        },
        openConfirmDel(eventName){                  
            const app = this.$f7;
            app.dialog.title
            app.dialog.confirm('Do you want to delete this event?',eventName, () => 
            {
                app.dialog.alert('Great!',eventName);
                this.deleteEvent()
            });
        
        },
        openConfirmJoin(eventName){
            const app = this.$f7;
            app.dialog.title
            app.dialog.confirm('Do you want to Join this event?',eventName, () => 
            {
                app.dialog.alert('Great!',eventName);
                this.joinEvent()
            });
        },
        openConfirmLeave(eventName){
            const app = this.$f7;
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
