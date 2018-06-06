<template>
    <f7-page>
        <f7-page-content>
            <f7-navbar color="red" title="Create Event" back-link="Back">
                <f7-nav-right><f7-link href="/home/" icon-if-md="material:home"></f7-link></f7-nav-right>
            </f7-navbar>
            <f7-list form>
                <f7-list-item>
                    <f7-label>Event Name</f7-label>
                    <f7-input type="text" placeholder="Event Name" v-bind:value="eventName" @input="eventName = $event.target.value"></f7-input>
                </f7-list-item>
                <f7-list-item>
                    <f7-label>Event Detail/Description</f7-label>
                    <f7-input type="textarea" placeholder="Event Description" v-bind:value="eventDescription" @input="eventDescription = $event.target.value" ></f7-input>
                </f7-list-item>

                 <f7-list-item smart-select :smart-select-params="{ closeOnSelect: true }" title="Day :">
                    <select name="days" v-model="selectedDay">
                    <option value="Monday" >Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    </select>
                </f7-list-item>
                <f7-list-item>
                    <f7-label><f7-icon material="timer"></f7-icon> From</f7-label>
                    <f7-input
                        type="text"
                        placeholder="Start Time"
                        readonly="readonly"
                        id="demo-picker-starttime"
                        v-bind:value="startTime"
                        v-on:change="onStartTimeChange" />
                </f7-list-item>
                <f7-list-item>
                    <f7-label><f7-icon material="timer"></f7-icon> To</f7-label>
                    <f7-input
                        type="text"
                        placeholder="End Time"
                        readonly="readonly"
                        id="demo-picker-endtime"
                        v-bind:value="endTime"
                        v-on:change="onEndTimeChange" />
                </f7-list-item>
                <f7-row>
                    <f7-col width="5"></f7-col>
                    <f7-button class="col-90" color="red" fill-md icon-material="create" @click="createNewEvent" >Create</f7-button>
                    <f7-col width="5"></f7-col>
                </f7-row>

            </f7-list>
        </f7-page-content>



    </f7-page>
</template>
<script>

import { auth, db } from '@/firebase'
export default {
    data(){
        return{
            eventName : '',
            eventDescription :'',
            selectedDay:'',
            startTime:'',
            endTime:'',
            allGroupEvents:{},
            allUserEvents:{},
            allEvents:{},
        }
    },
    mounted(){
        const uid = auth.currentUser.uid
        const groupId = this.$f7route.params.groupId
        console.log('groupID'+groupId)
        db.ref('groups/'+ groupId).child('groupSchedule').once('value',snapsot=>{
            // console.log(snapsot.key)
            snapsot .forEach(child=>{
                this.allGroupEvents[child.key] = child.val()
            })
        })
        db.ref('users/'+ uid).child('userEvents').once('value',snapsot=>{
            // console.log(snapsot.key)
            snapsot .forEach(child=>{
                this.allUserEvents[child.key]=child.val()
            })
        })
        db.ref('events/').once('value',snapsot=>{
            this.allEvents = snapsot.val()
        })

    },
    methods : {
        compareOverlap(existStartTime, existEndTime){
            const startTimeInt = parseInt(this.startTime.replace(/:/g,''));
            const endTimeInt = parseInt(this.endTime.replace(/:/g,''));
            const existStartTimeInt = parseInt(existStartTime.replace(/:/g,''));
            const existEndTimeInt = parseInt(existEndTime.replace(/:/g,''));

            // console.log(startTimeInt,endTimeInt,existStartTimeInt,existEndTimeInt)

            if((existStartTimeInt <= startTimeInt && startTimeInt <=existEndTimeInt) ||
                (existStartTimeInt <= endTimeInt && endTimeInt <=existEndTimeInt) ||
                (existStartTimeInt <= startTimeInt && startTimeInt <=existEndTimeInt) ||
            ((startTimeInt <= existStartTimeInt) && (endTimeInt>= existEndTimeInt))
            ){
                // console.log('overlap')
                return true
            }
            return false
        },
        isOverlap(){
            let userEvents = this.allUserEvents[this.selectedDay]
            let groupEvents = this.allGroupEvents[this.selectedDay]
            // console.log(userEvents)
            // console.log(groupEvents)

            if(userEvents===0 && groupEvents==0){
                return false
            }

            console.log(userEvents)
            for (var key1 in userEvents){
                // console.log(key1)
                let st1=this.allEvents[key1]['startTime']
                let et1=this.allEvents[key1]['endTime']
                // console.log(st1,et1)
                if(this.compareOverlap(st1,et1)){
                    // console.log('HELLYA')
                    return true
                }
            }
            for (var key2 in groupEvents){
                // console.log(key2)
                let st2=this.allEvents[key2]['startTime']
                let et2=this.allEvents[key2]['endTime']
                // console.log(st2,et2)
                if(this.compareOverlap(st2,et2)){
                    // console.log('HELLYA2')
                    return true
                }
            }

            return false
        },
        createNewEvent(){

            const app = this.$f7
            if(this.eventName ===''){
                app.dialog.alert('Please state your event name!')
            }
            else if(this.eventDescription ===''){
                app.dialog.alert('Please describe your event!')
            }
            else if(this.selectedDay===''){
                app.dialog.alert('Please select your event day!')
            }
            else if(this.startTime==='' || this.endTime===''){
                app.dialog.alert('Please select the time period for your events')
                return
            }

            if(this.isOverlap()){
                app.dialog.alert('The time is overlap with your current schedule.')
                return
            }

            const uid = auth.currentUser.uid
            const groupId = this.$f7route.params.groupId

            let userEventRef = db.ref('users/'+uid)

            userEventRef.once('value',(snapshot)=>{
                if(!snapshot.hasChild('userEvents')){
                    userEventRef.child('userEvents').child('Monday').set(0)
                    userEventRef.child('userEvents').child('Tuesday').set(0)
                    userEventRef.child('userEvents').child('Wednesday').set(0)
                    userEventRef.child('userEvents').child('Thursday').set(0)
                    userEventRef.child('userEvents').child('Friday').set(0)
                }
            })

            let eventInfo ={
                    eventName : this.eventName,
                    eventDescription : this.eventDescription,
                    day : this.selectedDay,
                    startTime : this.startTime,
                    endTime : this.endTime,
                    groupId : groupId
                }

            db.ref('events/').push(eventInfo)
            .then((snapshot)=>{

                db.ref('events/'+snapshot.key).child('joinedMembers').set(0)
                db.ref('groups/'+groupId+'/groupSchedule/').child(this.selectedDay).child(snapshot.key).set(0)
                db.ref('users/'+uid+'/userEvents/'+this.selectedDay).child(snapshot.key).set(0)

                //end
                this.eventName =''
                this.eventDescription=''
                this.selectedDay=''
                this.startTime=''
                this.endTime=''
                this.$f7router.navigate("/group/"+groupId+"/schedule/", {reloadCurrent: true})
            }).catch((error)=>{
                app.dialog.alert("Error Occured!")
                console.log(error)
            })
        },
        onStartTimeChange(e){
            this.startTime=e.target.value;
        },
        onEndTimeChange(e){
            this.endTime=e.target.value;
        }

    },
    on: {
      pageInit(e) {
        const app = this.$f7;

        // Time picker for start time
        var StartTimePicker = app.picker.create({
          inputEl: '#demo-picker-starttime',
          rotateEffect: true,
          formatValue(values, displayValues) {
            return `${values[0]}:${values[1]}`;
          },
          cols: [
            // Hours
            {
                values: (function createValues() {
                    const arr = [];
                    for (let i = 8; i <= 20; i += 1) { arr.push(i); }
                    return arr;
                }()),
            },
            // Divider
            {
              divider: true,
              content: ':',
            },
            // Minutes
            {
              values: (function createValues() {
                const arr = [];
                for (let i = 0; i <= 59; i += 1) { arr.push(i < 10 ? `0${i}` : i); }
                return arr;
              }()),
            },
          ],
        });

        //Time picker for endtime
        // Time picker
        var EndTimePicker = app.picker.create({
          inputEl: '#demo-picker-endtime',
          rotateEffect: true,
          formatValue(values, displayValues) {
            return `${values[0]}:${values[1]}`;
          },
          cols: [
            // Hours
            {
                values: (function createValues() {
                    const arr = [];
                    for (let i = 8; i <= 20; i += 1) { arr.push(i); }
                    return arr;
                }()),
            },
            // Divider
            {
              divider: true,
              content: ':',
            },
            // Minutes
            {
              values: (function createValues() {
                const arr = [];
                for (let i = 0; i <= 59; i += 1) { arr.push(i < 10 ? `0${i}` : i); }
                return arr;
              }()),
            },
          ],
        });


      },
    },
}
</script>
