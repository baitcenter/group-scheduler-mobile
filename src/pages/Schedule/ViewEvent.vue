<template>
    <f7-page>
        <f7-navbar color="red" :title="this.eventInfo.eventName" back-link="Back">
            <f7-nav-right><f7-link href="/home/" icon-if-ios="f7:home" icon-if-md="material:home"></f7-link></f7-nav-right>
        </f7-navbar>
        <div v-if="loaded">
        <f7-list>
            <f7-list-item>
                <div slot="inner">
                    <b>Event Name : </b> {{this.eventInfo['eventName']}}
                </div>
            </f7-list-item>
            <f7-list-item>
                <div slot="inner">
                    <b>Time: </b> {{this.eventInfo['startTime']}} - {{this.eventInfo['endTime']}}
                </div>
            </f7-list-item>

            <f7-list-item>
                <div slot="inner">
                    <b>Description:</b>
                    <p>{{this.eventInfo['eventDescription']}}</p>
                </div>
            </f7-list-item>
            <f7-list-item accordion-item inset>
                <div slot="inner"><b>Joined Members</b></div>
                <f7-accordion-content>
                    <f7-block strong>
                        <f7-chip v-for="(member, index) in eventInfo['joinedMembers']" :key="index"
                                 :text="member.name" media-bg-color="orange">
                            <f7-icon slot="media" material="person"></f7-icon>
                        </f7-chip>
                    </f7-block>
                </f7-accordion-content>
            </f7-list-item>
        </f7-list>
        <f7-block>
            <f7-button v-if="!isCreator && !isJoinedMember" color="green" fill icon-material="group_add" @click="openConfirmJoin"> Join</f7-button>
            <f7-button v-else-if="isJoinedMember" fill color="orange" icon-material="exit_to_app" @click="openConfirmLeave"> Leave</f7-button>
            <f7-button v-else-if="isCreator" color="red" fill icon-material="delete" @click="openConfirmDel"> Delete</f7-button>
        </f7-block>
        </div>
    </f7-page>
</template>
<script>

import {auth,db} from '@/firebase'
export default {
    data(){
        return{
            eventInfo:{},
            userEvents:{},
            groupInfo:{},
            isCreator: false,
            isJoinedMember: false,
            eventID: this.$f7route.params.eventId,
            loaded: false
        }
    },
    mounted(){
        this.populateData()
        db.ref("events").child(this.eventID).on("child_changed", snapshot => {
            this.populateData()
        })
    },
    methods:{
        populateData() {
            const uid = auth.currentUser.uid
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
                this.setJoinedMembers(tempEventInfo.joinedMembers)
                if (uid === this.eventInfo.eventCreator) {
                    this.isCreator = true
                }
            })

            let tempUserEvents={}
            db.ref('users/'+uid+'/userEvents').once('value', snapshot=>{
                snapshot.forEach(child=>{
                    tempUserEvents[child.key]=child.val()
                })
            }).then(()=>{
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
                this.loaded = true
            })
        },
        setJoinedMembers(joinedMembers) {
            let members = []
            const uid = auth.currentUser.uid
            for (let memberUid in joinedMembers) {
                if (memberUid === uid) {
                    this.isJoinedMember = true
                }
                db.ref("users/" + memberUid + "/profile").on("value", snapshot => {
                    const member = {[memberUid] : 0, ...snapshot.val()}
                    members.push(member)
                })
            }
            this.eventInfo.joinedMembers = members
        },
        joinEvent(){
            const uid = auth.currentUser.uid
            const eventId = this.$f7route.params.eventId
            let userEventRef = db.ref('users/'+uid)
                userEventRef.once('value',(snapshot)=>{
                    if(!snapshot.hasChild('userEvents')){
                        userEventRef.child('userEvents').child('Monday').set(0)
                        userEventRef.child('userEvents').child('Tuesday').set(0)
                        userEventRef.child('userEvents').child('Wednesday').set(0)
                        userEventRef.child('userEvents').child('Thursday').set(0)
                        userEventRef.child('userEvents').child('Friday').set(0)
                    }
                }).then(()=>{
                    const app =this.$f7
                    db.ref('events/'+eventId+'/joinedMembers').once('value', snapshot=>{
                        if(snapshot.hasChild(uid)){
                            app.dialog.alert('User already joined this event','Error!')
                        }
                        else{
                            db.ref('events/'+eventId+'/joinedMembers').child(uid).set(0)
                            db.ref('users/'+uid+'/userEvents/'+this.eventInfo.day).child(eventId).set(0)
                            this.$f7router.refreshPage()
                        }
                    })
                })
            
        },
        leaveEvent(){
            const uid = auth.currentUser.uid
            const eventId = this.$f7route.params.eventId
            if(this.userEvents[this.eventInfo.day] && Object.keys(this.userEvents[this.eventInfo.day]).length===1){
                db.ref('users/'+uid+'/userEvents/').child(this.eventInfo.day).set(0).then(()=>{
                    
                    if(this.eventInfo.joinedMembers && Object.keys(this.eventInfo.joinedMembers).length===1){
                        db.ref('events/'+eventId +'/joinedMembers').set(0)
                    }
                    else{
                        db.ref('events/'+eventId +'/joinedMembers').child(uid).remove()
                    }
                })

            }
            else{
                db.ref('users/'+uid+'/userEvents/'+this.eventInfo.day).child(eventId).remove().then(()=>{        
                    if(this.eventInfo.joinedMembers && Object.keys(this.eventInfo.joinedMembers).length===1){
                        db.ref('events/'+eventId +'/joinedMembers').set(0)
                    }
                    else{
                        db.ref('events/'+eventId +'/joinedMembers').child(uid).remove()
                    }
                })
            }

            
            this.isJoinedMember = false
        },
        deleteEvent(){
            const eventId = this.$f7route.params.eventId
            const groupId = this.$f7route.params.groupId

            event={}
            db.ref('events/'+eventId).once('value',snapshot=>{
                
                snapshot.forEach(eventData=>{
                    event[eventData.key]=eventData.val()
                })
                for(var member in event.joinedMembers){
                    db.ref('users/'+member+'/userEvents/'+event.day).child(eventId).remove()
                    db.ref('users/'+member+'/userEvents').once('value',check=>{
                        if(!check.hasChild(event.day)){
                            db.ref('users/'+member+'/userEvents').child(event.day).set(0)
                        }
                    })
                }
            }).then(()=>{
                db.ref('groups/'+groupId+'/groupSchedule/'+event.day).child(eventId).remove()
                db.ref('groups/'+groupId+'/groupSchedule').once('value',check=>{
                    if(!check.hasChild(event.day)){
                        db.ref('groups/'+groupId+'/groupSchedule').child(event.day).set(0)
                    }
                })
                db.ref('events').child(eventId).remove()
            })
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
            const eventName = this.eventInfo['eventName']

            app.dialog.confirm('Do you want to joined    this event?',eventName, () => {
                this.joinEvent()
                app.dialog.alert('You joined the event!')
                this.$f7router.refreshPage()
            });
        },
        openConfirmLeave(){
            const app = this.$f7;
            const eventName = this.eventInfo['eventName']
            app.dialog.confirm('Do you want to leave this event?',eventName, () => {
                this.leaveEvent()
                app.dialog.alert('You leaved the event!')
                this.$f7router.back({ignoreCache: true, force:true})
            });
        },
    }
}
</script>
