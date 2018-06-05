<template>
    <f7-page>
        <f7-page-content>
            <f7-navbar color="red" title="Create Event" back-link="Back"></f7-navbar>
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
               
            {{eventName}},
            {{eventDescription}},
            {{selectedDay}},
            {{startTime}},
            {{endTime}},
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
        }
    },
    methods : {
        createNewEvent(){
            const groupId = this.$f7route.params.groupId
            console.log(groupId)
            let eventInfo ={
                    eventName : this.eventName,
                    eventDescription : this.eventDescription,
                    startTime : this.startTime,
                    endTime : this.endTime
                }
            db.ref('events/').push(eventInfo)
            .then((snapshot)=>{
                db.ref('events/'+snapshot.key).child('joinedMembers').push("user@user.com")
                console.log(this.selectedDay)
                db.ref('groups/'+groupId+'/groupSchedule/').child(this.selectedDay).child(snapshot.key).set(0)
                db.ref('users/uid/userEvents').child(snapshot.key).set(0)

                          //end
                this.eventName =''
                this.eventDescription=''
                this.selectedDay=''
                this.startTime=''
                this.endTime=''
                console.log('ss55'+groupId)            
                this.$f7router.navigate("/group/"+groupId+"/schedule/")
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
