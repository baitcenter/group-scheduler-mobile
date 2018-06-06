<template>
    <f7-page>
        <f7-page-content>
            <f7-navbar color="red" title="EventName" back-link="Back">
                <f7-nav-right><f7-link href="/home/" icon-if-md="material:home"></f7-link></f7-nav-right>
            </f7-navbar>
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
            eventInfo:{},
            userEvents:{},
            groupInfo:{}
        }
    },
    mounted(){
        const app =this.$f7
        // app.dialog.preloader('Loading')
        
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

        const uid = auth.currentUser.uid
        let tempUserEvents={}
        db.ref('users/'+uid+'/userEvents').once('value', snapshot=>{
            snapshot.forEach(child=>{
                tempUserEvents[child.key]=child.val()
            })
        })
        .then(()=>{
            this.userEvents = tempUserEvents
        })

        const groupId = this.$f7route.params.groupId
        let tempGroupData={}
        db.ref('groups/'+groupId).once('value',snapshot=>{
            snapshot.forEach(child=>{
                tempGroupData[child.key] = child.val()
            })
        }).then(()=>{
            this.groupInfo = tempGroupData
        })

        // app.dialog.close()
    },
    methods:{
        joinEvent(){
            const uid = auth.currentUser.uid
            const eventId = this.$f7route.params.eventId
            const groupId = this.$f7route.params.groupId
            // let userInfo ={
            //     name : auth.currentUser.displayName,
            //     email : auth.currentUser.email
            // }
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
                    db.ref('events/'+eventId+'/joinedMembers').child(uid).set(0)
                    db.ref('users/'+uid+'/userEvents/'+this.eventInfo.day).child(eventId).set(0)
                    // this.$f7router.navigate('/group/'+groupId)
                }
            })

        },
        leaveEvent(){
            const uid = auth.currentUser.uid
            const eventId = this.$f7route.params.eventId
            const groupId = this.$f7route.params.groupId
            // eventStatus=0
            // userStatus=0

            if(Object.keys(this.eventInfo.joinedMembers).length===1){ 
                db.ref('events/'+eventId +'/joinedMembers').set(0)
                // eventStatus=1
            }
            else{
                db.ref('events/'+eventId +'/joinedMembers').child(uid).remove()//may change to something else
                // eventStatus=1
            }

            if(Object.keys(this.userEvents[this.eventInfo.day]).length===1){
                console.log(Object.keys(this.userEvents[this.eventInfo.day]).length===1)
                db.ref('users/'+uid+'/userEvents/').child(this.eventInfo.day).set(0)
                // .then(()=>{this.$f7router.navigate('group/'+groupId+'/')})
                // userStatus=1

            }
            else{

                db.ref('users/'+uid+'/userEvents/'+this.eventInfo.day).child(eventId).remove()
                // .then(()=>{
                    
                //     this.$f7router.navigate('group/'+groupId+'/')
                // })
                // userStatus=1
            }
            
        },
        deleteEvent(){
            const uid = auth.currentUser.uid
            const eventId = this.$f7route.params.eventId
            const groupId = this.$f7route.params.groupId
            
            //for joinedEvent Members
            for(var key in this.eventInfo.joinedMembers){
                let tempUserEvents={}
                db.ref('users/'+key+'/userEvents').once('value', snapshot=>{
                    snapshot.forEach(child=>{
                        tempUserEvents[child.key]=child.val()
                    })
                })
                .then(()=>{
                    if(tempUserEvents[this.eventInfo.day]){
                        if(Object.keys(tempUserEvents[this.eventInfo.day]).length===1){
                            db.ref('users/'+key+'/userEvents/').child(this.eventInfo.day).set(0)
                        }else{
                            db.ref('users/'+key+'/userEvents/'+this.eventInfo.day).child(eventId).remove()
                        }
                    }
                })
               
            }
            //remove event from group leader
            for (var x in this.groupInfo.groupLeader){
                //x =key
                let tempUserEvents={}
                db.ref('users/'+x+'/userEvents').once('value', snapshot=>{
                    snapshot.forEach(child=>{
                        tempUserEvents[child.key]=child.val()
                    })
                })
                .then(()=>{
                    if(Object.keys(tempUserEvents[this.eventInfo.day]).length===1){
                        db.ref('users/'+x+'/userEvents/').child(this.eventInfo.day).set(0)
                    }else{
                        db.ref('users/'+x+'/userEvents/'+this.eventInfo.day).child(eventId).remove()
                    }
                })
            }

            //delete from groupSchedule
            if(Object.keys(this.groupInfo.groupSchedule[this.eventInfo.day]).length===1){
                db.ref('groups/'+groupId+'/groupSchedule/').child(this.eventInfo.day).set(0)
            }else{
                db.ref('groups/'+groupId+'/groupSchedule/'+this.eventInfo.day).child(eventId).remove()
            }

            //remove event
            db.ref('events/').child(eventId).remove()
            // .then(()=>{this.$f7router.navigate('group/'+groupId+'/')})
        },
        openConfirmDel(){
            const app = this.$f7;
            const groupId = this.$f7route.params.groupId
            const eventName = this.eventInfo['eventName']
            app.dialog.confirm('Do you want to delete this event?',eventName, () => {
                this.deleteEvent()
                app.dialog.alert('You deleted the event!')
                this.$f7router.navigate('/group/'+groupId+'/')
            });

        },
        openConfirmJoin(){
            const app = this.$f7;
            const groupId = this.$f7route.params.groupId
            const eventName = this.eventInfo['eventName']
            const eventId = this.$f7route.params.eventId

            app.dialog.confirm('Do you want to joined    this event?',eventName, () => {
                this.joinEvent()
                app.dialog.alert('You joined the event!')
                console.log(groupId,eventId)
                this.$f7router.navigate('/group/'+groupId+'/')
            });
        },
        openConfirmLeave(){
            const app = this.$f7;
            const groupId = this.$f7route.params.groupId
            const eventName = this.eventInfo['eventName']
            app.dialog.confirm('Do you want to leave this event?',eventName, () => {
                this.leaveEvent()
                app.dialog.alert('You leaved the event!')
                this.$f7router.navigate('/group/'+groupId+'/')
            });
        },
    }
}
</script>
