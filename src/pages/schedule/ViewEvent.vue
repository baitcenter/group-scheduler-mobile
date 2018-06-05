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
        // console.log(this.$f7route.params)
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
        joinEvent(){
            const uid = auth.currentUser.uid
            const eventId = this.$f7route.params.eventId
            const groupId = this.$f7route.params.groupId
            let userInfo ={
                name : auth.currentUser.displayName,
                email : auth.currentUser.email
            }
            let userEventRef = db.ref('users/'+uid)
                userEventRef.once('value',(snapshot)=>{
                    console.log(snapshot)
                    if(!snapshot.hasChild('userEvents')){
                        console.log('fuckthisshit')
                        userEventRef.child('userEvents').child('Monday').set(0)
                        userEventRef.child('userEvents').child('Tuesday').set(0)
                        userEventRef.child('userEvents').child('Wednesday').set(0)
                        userEventRef.child('userEvents').child('Thursday').set(0)
                        userEventRef.child('userEvents').child('Friday').set(0)
                    }
                })
            const app =this.$f7
            db.ref('events/'+eventId+'/joinedMembers').once('value', snapshot=>{
                if(snapshot.hasChild(uid)){
                    app.dialog.alert('User already joined this event','Error!')
                }
                else{     
                    db.ref('events/'+eventId+'/joinedMembers').child(uid).set(userInfo)
                    db.ref('users/'+uid+'/userEvents/'+this.eventInfo.day).child(eventId).set(0)
                }
            })

            // db.ref('users/'+uid+'/userEvents/'+this.eventInfo['day']).child(eventId).set(0)
            // db.ref('event/'+eventId +'/joinedMembers').push(uid)//may change to something else

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

                // db.ref('users/'+uid+'/userEvents/'+this.eventInfo['day']).child(eventId).remove();

            }
            // db.ref('groups/'+groupId+'/groupSchedule/'+this.eventInfo['day']).child(eventId).remove()
            // db.ref('events/').child(eventId).remove()
            this.$f7router.navigate('group/'+groupId+'/schedule/')
        },
        openConfirmDel(){
            const app = this.$f7;
            const eventName = this.eventInfo['eventName']
            // app.dialog.title
            app.dialog.confirm('Do you want to delete this event?',eventName,this.deleteEvent());

        },
        openConfirmJoin(){
            const app = this.$f7;
            const eventName = this.eventInfo['eventName']
            // app.dialog.title
            app.dialog.confirm('Do you want to Join this event?',eventName, this.joinEvent());
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
