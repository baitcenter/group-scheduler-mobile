<template>

<f7-page>
    <f7-page-content>

        <f7-navbar color="red">
            <f7-nav-left>
            <f7-link icon-if-ios="f7:menu" icon-if-md="material:menu" panel-open="left"></f7-link>
            </f7-nav-left>
            <f7-nav-title>My Schedule</f7-nav-title>
        </f7-navbar>
        <!-- Switch Between Tabs -->
        
        <f7-segmented>
            <f7-button color="orange" tab-link="#tab-Monday" tab-link-active>Mon</f7-button>
            <f7-button color="orange" tab-link="#tab-Tuesday">Tue</f7-button>
            <f7-button color="orange" tab-link="#tab-Wednesday">Wed</f7-button>
            <f7-button color="orange" tab-link="#tab-Thursday">Thu</f7-button>
            <f7-button color="orange" tab-link="#tab-Friday">Fri</f7-button>
        </f7-segmented>

        <f7-tabs swipeable>
            <f7-tab id="tab-Monday"
                tab-active>
                <f7-block-title>Monday</f7-block-title>
                <f7-block inset v-if="isEventLengthZero('Monday')">There is no event in this day.</f7-block>
                <f7-card v-else>
                    <f7-card-content>
                        <f7-list media-list v-for="(eData, eKey) in this.userEvents.Monday" :key="eKey">
                            <f7-list-item    
                                @click="redirectToEvent(eData.groupId,eKey)"
                                :title="eData.eventName"
                                :footer="'Time: '+eData.startTime + ' - '+eData.endTime"
                                after=" "
                            >
                            </f7-list-item>
                        </f7-list>
                    </f7-card-content>
                </f7-card>
            </f7-tab>

            <f7-tab id="tab-Tuesday">
                <f7-block-title center>Tuesday</f7-block-title>
                <f7-block inset v-if="isEventLengthZero('Tuesday') ">There is no event in this day.</f7-block>
                <f7-card v-else>
                    <f7-card-content>
                        <f7-list media-list v-for="(eData, eKey) in this.userEvents.Tuesday" :key="eKey">
                            <f7-list-item
                                @click="redirectToEvent(eData.groupId,eKey)"
                                :title="eData.eventName"
                                :footer="'Time: '+eData.startTime + ' - '+eData.endTime"
                                after=" "
                            >
                            </f7-list-item>
                        </f7-list>
                    </f7-card-content>
                </f7-card>
            </f7-tab>

            <f7-tab id="tab-Wednesday">
                <f7-block-title center>Wednesday</f7-block-title>
                <f7-block inset v-if="isEventLengthZero('Wednesday')">There is no event in this day.</f7-block>
                <f7-card v-else>
                    <f7-card-content>
                        <f7-list media-list v-for="(eData, eKey) in this.userEvents.Wednesday" :key="eKey">
                            <f7-list-item                            
                                @click="redirectToEvent(eData.groupId,eKey)"
                                :title="eData.eventName"
                                :footer="'Time: '+eData.startTime + ' - '+eData.endTime"
                                after=" "
                            >
                            </f7-list-item>
                        </f7-list>
                    </f7-card-content>
                </f7-card>
            </f7-tab>

            <f7-tab id="tab-Thursday"
                >
                <f7-block-title center>Thursday</f7-block-title>
                <f7-block inset v-if="isEventLengthZero('Thursday')">There is no event in this day.</f7-block>
                <f7-card v-else>
                    <f7-card-content>
                        <f7-list media-list v-for="(eData, eKey) in this.userEvents.Thursday" :key="eKey">
                            <f7-list-item
                                @click="redirectToEvent(eData.groupId,eKey)"
                                :title="eData.eventName"
                                :footer="'Time: '+eData.startTime + ' - '+eData.endTime"
                                after=" "
                            >
                            </f7-list-item>
                        </f7-list>
                    </f7-card-content>
                </f7-card>
            </f7-tab>

            <f7-tab id="tab-Friday">
                <f7-block-title center>Friday</f7-block-title>
                <f7-block inset v-if="isEventLengthZero('Friday')">There is no event in this day.</f7-block>
                <f7-card v-else>
                    <f7-card-content>
                        <f7-list media-list v-for="(eData, eKey) in this.userEvents.Friday" :key="eKey">
                            <f7-list-item
                                @click="redirectToEvent(eData.groupId,eKey)"
                                :title="eData.eventName"
                                :footer="'Time: '+eData.startTime + ' - '+eData.endTime"
                                after=" "
                            >
                            </f7-list-item>
                        </f7-list>
                    </f7-card-content>
                </f7-card>
            </f7-tab>
        </f7-tabs>

    </f7-page-content>
    

</f7-page>

</template>

<script>
import { auth, db} from '@/firebase'
export default {
    data(){
        return{
            userEvents : {},
            allEvents:{}
        }
    },
    methods :{
        redirectToEvent(gid,eid){
          this.$f7router.navigate('/group/'+gid+'/schedule/event/'+eid+'/')
        },
        isEventLengthZero(day){
            let length= 0
            for (var k in this.userEvents[day]){
                length++;
            }
            return length===0
        },
    },
    mounted(){
        const app = this.$f7
        app.dialog.preloader('Loading')
        const uid = auth.currentUser.uid
        let tempEventKey = {
            Monday : 0,
            Tuesday : 0,
            Wednesday :0,
            Thursday :0,
            Friday :0,
        }
        
        db.ref('users/'+ uid +'/userEvents/').once('value',snapshot=>{
            snapshot.forEach(child=>{
                tempEventKey[child.key] = child.val()
            })
        }).then(()=>{
            db.ref('events/').once('value',snapsot=>{
                this.allEvents = snapsot.val()
            }).then(()=>{
                let tempEventData={}
                for (var x in tempEventKey){
                    let eventData={}
                    for (var y in tempEventKey[x]){
                        eventData[y]=this.allEvents[y]
                    }
                    tempEventData[x]=eventData
                }
                this.userEvents=tempEventData
                app.dialog.close()
            })
        
        })
    }
}
</script>
