<template>

<f7-page>
    <f7-navbar color="red" title="My Schedule" back-link="Back">
        <f7-nav-right><f7-link href="/home/" icon-if-md="material:home"></f7-link></f7-nav-right>
    </f7-navbar>
    <!-- FAB must be direct child of a page -->
    <f7-fab color="green" position="center-bottom" @click="redirectTo" >
        <f7-icon f7="add"></f7-icon>
    </f7-fab>
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
            <f7-block inset v-if="!this.groupEvents['Monday']">There is no event in this day.</f7-block>
            <f7-card v-else>
                <f7-card-content>
                    <f7-list media-list v-for="(eData, eKey) in this.groupEvents['Monday']" :key="eKey">

                        <f7-list-item
                            :link="'/group/'+groupId+'/schedule/event/'+eKey+'/'"
                            :title="eData['eventName']"
                            :footer="'Time: '+eData['startTime'] + ' - '+eData['endTime']"
                            after=" "
                        >
                         </f7-list-item>


                    </f7-list>
                </f7-card-content>

            </f7-card>

        </f7-tab>


         <f7-tab id="tab-Tuesday"
           >
            <f7-block-title center>Tuesday</f7-block-title>
            <f7-block inset v-if="!this.groupEvents['Tuesday']">There is no event in this day.</f7-block>
            <f7-card v-else>
                <f7-card-content>
                    <f7-list media-list v-for="(eData, eKey) in this.groupEvents['Tuesday']" :key="eKey">

                        <f7-list-item
                            :link="'/group/'+groupId+'/schedule/event/'+eKey+'/'"
                            :title="eData['eventName']"
                            :footer="'Time: '+eData['startTime'] + ' - '+eData['endTime']"
                            after=" "
                        >
                         </f7-list-item>


                    </f7-list>
                </f7-card-content>

            </f7-card>

        </f7-tab>

         <f7-tab id="tab-Wednesday"
            >
            <f7-block-title center>Wednesday</f7-block-title>
            <f7-block inset v-if="!this.groupEvents['Wednesday']">There is no event in this day.</f7-block>
            <f7-card v-else>
                <f7-card-content>
                    <f7-list media-list v-for="(eData, eKey) in this.groupEvents['Wednesday']" :key="eKey">

                        <f7-list-item
                            :link="'/group/'+groupId+'/schedule/event/'+eKey+'/'"
                            :title="eData['eventName']"
                            :footer="'Time: '+eData['startTime'] + ' - '+eData['endTime']"
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
            <f7-block inset v-if="!this.groupEvents['Thursday']">There is no event in this day.</f7-block>
            <f7-card v-else>
                <f7-card-content>
                    <f7-list media-list v-for="(eData, eKey) in this.groupEvents['Thursday']" :key="eKey">

                        <f7-list-item
                            :link="'/group/'+groupId+'/schedule/event/'+eKey+'/'"
                            :title="eData['eventName']"
                            :footer="'Time: '+eData['startTime'] + ' - '+eData['endTime']"
                            after=" "
                        >
                         </f7-list-item>


                    </f7-list>
                </f7-card-content>

            </f7-card>

        </f7-tab>

         <f7-tab id="tab-Friday"
           >
            <f7-block-title center>Friday</f7-block-title>
            <f7-block inset v-if="!this.groupEvents['Friday']">There is no event in this day.</f7-block>
            <f7-card v-else>
                <f7-card-content>
                    <f7-list media-list v-for="(eData, eKey) in this.groupEvents['Friday']" :key="eKey">

                        <f7-list-item
                            @click="redirectToEvent(groupId,eKey)"
                            :title="eData['eventName']"
                            :footer="'Time: '+eData['startTime'] + ' - '+eData['endTime']"
                            after=" "
                        >
                         </f7-list-item>


                    </f7-list>
                </f7-card-content>

            </f7-card>

        </f7-tab>
    </f7-tabs>

</f7-page>

</template>

<script>
import { auth, db} from '@/firebase'
export default {
    data(){
        return{
            groupEvents : {},
            groupId :'',
            groupName : ''
        }
    },
    methods:{
        redirectToEvent(gid,eid){
          console.log("gid " + gid + ", eid " + eid)
          this.$f7router.navigate('/group/'+gid+'/schedule/event/'+eid+'/')
        },
        redirectTo(){
            const groupId = this.$f7route.params.groupId
            console.log(groupId)
            this.$f7router.navigate("/group/"+groupId+"/schedule/create-event/")
        },
    },
    mounted(){
        const groupId = this.$f7route.params.groupId
        this.groupId = groupId

        console.log(groupId)
        let tempEvents = {
            Monday : 0,
            Tuesday : 0,
            Wednesday :0,
            Thursday :0,
            Friday :0,
        }
        db.ref('groups/'+ groupId+'/groupSchedule/').once('value',snapshot=>{
            snapshot.forEach(child=>{
                if(child.val()===0){
                    tempEvents[child.key] = child.val()
                }
                else{
                    let eventData={}
                    child.forEach(e=>{
                        db.ref('events/'+e.key).once('value', eventVal=>{
                            eventData[eventVal.key] = eventVal.val()
                        }).then(()=>{
                            tempEvents[child.key] = eventData
                        })
                    })
                }
            })
        }).then(()=>{
            this.groupEvents=tempEvents
        })
    }
}
</script>
