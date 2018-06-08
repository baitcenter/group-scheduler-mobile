<template>

<f7-page>
        <f7-navbar color="red" title="Group Schedule" back-link="Back">
            <f7-nav-right><f7-link href="/home/" icon-if-md="material:home"></f7-link></f7-nav-right>
        </f7-navbar>
        <!-- FAB must be direct child of a page -->
        <f7-fab v-if="isGroupLeader" color="green" position="right-bottom" @click="redirectToCreateEvent" >
            <f7-icon f7="add"></f7-icon>
        </f7-fab>

        <f7-segmented >
            <f7-button color="orange" tab-link="#tab-Monday" tab-link-active>Mon</f7-button>
            <f7-button color="orange" tab-link="#tab-Tuesday">Tue</f7-button>
            <f7-button color="orange" tab-link="#tab-Wednesday">Wed</f7-button>
            <f7-button color="orange" tab-link="#tab-Thursday">Thu</f7-button>
            <f7-button color="orange" tab-link="#tab-Friday">Fri</f7-button>
        </f7-segmented>

        <f7-tabs swipeable>
            <f7-tab id="tab-Monday"
                tab-active>
                <f7-block-title class="padding-bottom">Monday</f7-block-title>
                <f7-block inset v-if="isEventLengthZero('Monday')">There is no event in this day.</f7-block>
                <f7-card v-else media-list v-for="(eData, eKey) in this.groupEvents.Monday" :key="eKey">
                    <f7-block class="margin-vertical padding-vertical">
                        <!-- <f7-icon color="red" material="event" slot="left"></f7-icon> -->
                        <f7-list>
                            <f7-list-item
                                @click="redirectToEvent(groupId,eKey)"
                                :title="eData.eventName"
                                :footer="'Time: '+eData.startTime + ' - '+eData.endTime"
                                after=" "
                            >                            
                            <f7-icon size="30" color="red" slot="media" material="event"></f7-icon>
                            </f7-list-item>
                        </f7-list>
                    </f7-block>
                </f7-card>
            </f7-tab>

            <f7-tab id="tab-Tuesday">
                <!-- {{this.groupEvents.Tuesday}} -->
                <f7-block-title center>Tuesday</f7-block-title>
                <f7-block inset v-if="isEventLengthZero('Tuesday') ">There is no event in this day.</f7-block>
                <f7-card v-else media-list v-for="(eData, eKey) in this.groupEvents.Tuesday" :key="eKey">
                    <f7-block class="margin-vertical padding-vertical">
                        <!-- <f7-icon color="red" material="event" slot="left"></f7-icon> -->
                        <f7-list>
                            <f7-list-item
                                @click="redirectToEvent(groupId,eKey)"
                                :title="eData.eventName"
                                :footer="'Time: '+eData.startTime + ' - '+eData.endTime"
                                after=" "
                            >                            
                            <f7-icon size="30" color="red" slot="media" material="event"></f7-icon>
                            </f7-list-item>
                        </f7-list>
                    </f7-block>
                </f7-card>
            </f7-tab>

            <f7-tab id="tab-Wednesday">
                <!-- {{this.groupEvents.Wednesday}} -->
                <f7-block-title center>Wednesday</f7-block-title>
                <f7-block inset v-if="isEventLengthZero('Wednesday')">There is no event in this day.</f7-block>
                <f7-card v-else media-list v-for="(eData, eKey) in this.groupEvents.Wednesday" :key="eKey">
                    <f7-block class="margin-vertical padding-vertical">
                        <!-- <f7-icon color="red" material="event" slot="left"></f7-icon> -->
                        <f7-list>
                            <f7-list-item
                                @click="redirectToEvent(groupId,eKey)"
                                :title="eData.eventName"
                                :footer="'Time: '+eData.startTime + ' - '+eData.endTime"
                                after=" "
                            >                            
                            <f7-icon size="30" color="red" slot="media" material="event"></f7-icon>
                            </f7-list-item>
                        </f7-list>
                    </f7-block>
                </f7-card>
            </f7-tab>

            <f7-tab id="tab-Thursday"
                >
                <f7-block-title center>Thursday</f7-block-title>
                <f7-block inset v-if="isEventLengthZero('Thursday')">There is no event in this day.</f7-block>
                <f7-card v-else media-list v-for="(eData, eKey) in this.groupEvents.Thursday" :key="eKey">
                    <f7-block class="margin-vertical padding-vertical">
                        <!-- <f7-icon color="red" material="event" slot="left"></f7-icon> -->
                        <f7-list>
                            <f7-list-item
                                @click="redirectToEvent(groupId,eKey)"
                                :title="eData.eventName"
                                :footer="'Time: '+eData.startTime + ' - '+eData.endTime"
                                after=" "
                            >                            
                            <f7-icon size="30" color="red" slot="media" material="event"></f7-icon>
                            </f7-list-item>
                        </f7-list>
                    </f7-block>
                </f7-card>
            </f7-tab>

            <f7-tab id="tab-Friday">
                <f7-block-title center>Friday</f7-block-title>
                <f7-block inset v-if="isEventLengthZero('Friday')">There is no event in this day.</f7-block>
                <f7-card v-else media-list v-for="(eData, eKey) in this.groupEvents.Friday" :key="eKey">
                    <f7-block class="margin-vertical padding-vertical">
                        <!-- <f7-icon color="red" material="event" slot="left"></f7-icon> -->
                        <f7-list>
                            <f7-list-item
                                @click="redirectToEvent(groupId,eKey)"
                                :title="eData.eventName"
                                :footer="'Time: '+eData.startTime + ' - '+eData.endTime"
                                after=" "
                            >                            
                            <f7-icon size="30" color="red" slot="media" material="event"></f7-icon>
                            </f7-list-item>
                        </f7-list>
                    </f7-block>
                </f7-card>
            </f7-tab>
        </f7-tabs>

        <!-- </f7-page> -->
</f7-page>

</template>

<script>
import { auth, db} from '@/firebase'
export default {
    data(){
        return{
            groupEvents : {},
            groupId :'',
            groupName : '',
            allEvents:{},
            doneLoading:false,
            isGroupLeader: false
        }
    },
    methods:{
        isEventLengthZero(day){
            let length= 0
            for (var k in this.groupEvents[day]){
                length++;
            }
            return length===0
        },
        redirectToEvent(gid,eid){
          this.$f7router.navigate('/group/'+gid+'/schedule/event/'+eid+'/')
        },
        redirectToCreateEvent(){
            const groupId = this.$f7route.params.groupId
            this.$f7router.navigate("/group/"+groupId+"/schedule/create-event/")
        },
    },
    mounted() {
        const app =this.$f7
        app.dialog.preloader('Loading')
        const groupId = this.$f7route.params.groupId
        this.groupId = groupId

        let tempEventKey = {
            Monday : 0,
            Tuesday : 0,
            Wednesday :0,
            Thursday :0,
            Friday :0,
        }

        const uid = auth.currentUser.uid
        db.ref("groups/"+groupId).once("value", snapshot => {
            if (snapshot.val().groupLeader === uid) {
                this.isGroupLeader = true
            }
        })

        db.ref('groups/'+ groupId+'/groupSchedule/').once('value',snapshot=>{
            snapshot.forEach(child=>{
                tempEventKey[child.key] = child.val()
            })
        }).then(()=>{
            db.ref('events/').once('value',snapshot=>{
                this.allEvents = snapshot.val()
            }).then(()=>{
                let tempEventData = {}
                for (var x in tempEventKey){
                    let eventData={}
                    for (var y in tempEventKey[x]){
                        eventData[y]=this.allEvents[y]
                    }
                    tempEventData[x]=eventData
                }
                this.groupEvents=tempEventData
                app.dialog.close()

            })
            app.dialog.close()
        })

    }
}
</script>
