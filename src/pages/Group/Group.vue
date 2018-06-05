<template>
    <f7-page>
        <f7-navbar color="red" title="GroupName" back-link="Back">
            <f7-nav-right><f7-link icon-if-md="material:info" class="popover-open" href="#" data-popover=".popover-info"></f7-link></f7-nav-right>
        </f7-navbar>
        <f7-list>
            <f7-list-item>Group Name: {{groupName}}</f7-list-item>
            <f7-list-item accordion-item title="Group members">
                <f7-accordion-content>
                    <f7-list-item v-for="(member, index) in groupMembers" :key="index">
                        {{member.name}}
                    </f7-list-item>
                </f7-accordion-content>
            </f7-list-item>
            <f7-list-item>Invite code: <div id="invite_code">{{inviteCode}}</div></f7-list-item>
            <f7-button @click="copyToClipboard">Copy to clipboard</f7-button>
        </f7-list>
        <f7-block>
            <f7-button color="red" class="col-80" fill @click="redirectTo">Schedule</f7-button>
        </f7-block>
        <!-- {{this.$f7router.params.groupId}} -->
        <f7-popover class="popover-info">
            <f7-block>
                <p>Group Page</p>
                <p>This is the group page. You can invite people into the group using by giving them the group's "Invite code" which they can in turn use it in the Enroll page's form.</p>
            </f7-block>
        </f7-popover>
        <f7-input type="hidden" id="testing-code" v-bind:value="inviteCode"></f7-input>
    </f7-page>
</template>

<script>
    import F7Block from "framework7-vue/src/components/block";
    export default {
        components: {F7Block},
        data() {
            return {
                groupName: "Hello",
                groupMembers: [
                    {name: "1"},
                    {name: "2"}
                ],
                inviteCode: "toc",
            }
        },
        // user $f7route.params to get the params from url
        methods: {
            copyToClipboard(){
                const app = this.$f7
                var copyText = this.inviteCode
                console.log(copyText)
                let testingCopy = document.querySelector('#testing-code')
                testingCopy.setAttribute('type','text')
                testingCopy.select()
                try{
                    var success = document.execCommand("copy")
                    var msg = success ? 'successful' : "failed"
                    app.dialog.alert("copying " + msg)
                }catch(error){
                    app.dialog.alert("failed copying the text")
                }
                testingCopy.setAttribute('type','hidden')
                window.getSelection().removeAllRanges()
                console.log("copy process ended")
                // document.execCommand("copy")
            },
            redirectTo() {
                const groupId = this.$f7route.params.groupId
                this.$f7router.navigate("/group/"+groupId+"/schedule/")
            }
        }
    }
</script>

<style scoped>

</style>