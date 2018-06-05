<template>
    <f7-page>
        <f7-page-content>
            <f7-navbar color="red" title="EventName" back-link="Back"></f7-navbar>
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
        <f7-toolbar color="green" bottom-md>
            <f7-link icon-material="group_add" @click="openConfirmJoin"> Join</f7-link>
            <f7-link disabled icon-material="exit_to_app" @click="openConfirmLeave"> Leave</f7-link>
            <f7-link  icon-material="delete" @click="openConfirmDel"> Delete</f7-link>
         
        </f7-toolbar>
        
    </f7-page>
</template>
<script>

export default {
    data(){
        return{
            members : ['Tui','Bright','Win'],
            
        }
    },
    methods:{
        openConfirmDel(eventName){                  
            const app = this.$f7;
            app.dialog.title
            app.dialog.confirm('Do you want to delete this event?',"EventName", () => 
            {
                app.dialog.alert('Great!',"EventName");
                // Delete function and redirect
            });
        
        },
        openConfirmJoin(eventName){
            const app = this.$f7;
            app.dialog.title
            app.dialog.confirm('Do you want to Join this event?',"EventName", () => 
            {
                app.dialog.alert('Great!',"EventName");
                // Delete function and redirect
            });
        },
        openConfirmLeave(eventName){
            const app = this.$f7;
            app.dialog.title
            app.dialog.confirm('Do you want to Leave this event?',"EventName", () => 
            {
                app.dialog.alert('Great!',"EventName");
                // Delete function and redirect
            });
        },
    }
}
</script>
