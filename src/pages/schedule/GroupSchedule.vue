<template>

<f7-page>
    <f7-navbar title="My Schedule" back-link="Back"></f7-navbar>
    <!-- FAB must be direct child of a page -->
    <f7-fab color="green" position="center-bottom" @click="redirectTo" >
        <f7-icon f7="add"></f7-icon>
    </f7-fab>
    <!-- Switch Between Tabs -->
    <f7-segmented>
        <f7-button tab-link="#tab-1" tab-link-active>Mon</f7-button>
        <f7-button tab-link="#tab-2">Tue</f7-button>
        <f7-button tab-link="#tab-2">Wed</f7-button>
        <f7-button tab-link="#tab-2">Thu</f7-button>
        <f7-button tab-link="#tab-2">Fri</f7-button>
    </f7-segmented>       
    <f7-tabs swipeable>
        <!-- loop days -->
        <f7-tab id="tab-1" tab-active>
            <h3 center>Monday</h3>
            <!-- loop events -->
            <f7-card>
                <f7-card-content>
                    <f7-list media-list>
                        <f7-list-item 
                            link="/group/-LEAWB5A7DfR2Fboz6fE/schedule/event/-LEAWDldU7aUe8RHTdPY/" 
                            title="Event Title" 
                            footer="Time: xx:xx - yy:yy"
                            after=" "
                        ></f7-list-item>
                        <f7-list-item 
                            link="/about/" 
                            title="Event Title" 
                            footer="Time: xx:xx - yy:yy"
                            after=" "
                        ></f7-list-item>
                        <f7-list-item 
                            link="/about/" 
                            title="Event Title" 
                            footer="Time: xx:xx - yy:yy"
                            after=" "
                        ></f7-list-item>
                        </f7-list>
                </f7-card-content>
                
            </f7-card>

            
        </f7-tab>
        <f7-tab id="tab-2">Tab 2</f7-tab>
    </f7-tabs>

</f7-page>

</template>

<script>
export default {
    methods:{
        redirectTo(){
            const groupId = this.$f7route.params.groupId
            console.log(groupId)
            this.$f7router.navigate("/group/"+groupId+"/schedule/create-event/")
        },
    }
}
</script>
