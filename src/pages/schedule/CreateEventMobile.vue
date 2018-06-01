<template>
    <f7-page>
        <f7-page-content>
            <f7-navbar title="CreateEvent" back-link="Back"></f7-navbar>
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
                    <f7-input type="text" placeholder="Start Time" readonly="readonly" id="demo-picker-starttime" v-bind:value="startTime" @input="startTime=$event.target.value"/>
                </f7-list-item>
                <f7-list-item>
                    <f7-label><f7-icon material="timer"></f7-icon> To</f7-label>
                    <f7-input type="text" placeholder="End Time" readonly="readonly" id="demo-picker-endtime"/>
                </f7-list-item>
                <f7-row>
                    <f7-col width="5"></f7-col>        
                    <f7-button class="col-90" fill-md icon-material="create" @click="createNewEvent" >Create</f7-button>
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
            this.eventName =''
            this.eventDescription=''
        }
    },
    on: {
      pageInit(e) {
        const app = this.$f7;
        
        // Time picker for start time
        var TimePicker = app.picker.create({
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
        var TimePicker = app.picker.create({
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
