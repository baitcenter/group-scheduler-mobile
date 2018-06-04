<template>
    <f7-page>
        <f7-navbar title="GroupName" back-link="Back"></f7-navbar>
        <f7-list>
            <f7-list-item>Group Name: {{groupName}}</f7-list-item>
            <f7-list-item accordion-item title="Group members">
                <f7-accordion-content>
                    <f7-list-item v-for="(member, index) in groupMembers" :key="index">
                        {{member.name}}
                    </f7-list-item>
                </f7-accordion-content>
            </f7-list-item>
            <f7-list-item>Invite code: {{inviteCode}}</f7-list-item>
        </f7-list>
        <f7-block>
            <f7-button class="col-80" fill @click="redirectTo">Schedule</f7-button>
        </f7-block>
        <!-- {{this.$f7router.params.groupId}} -->
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
            redirectTo() {
                const groupId = this.$f7route.params.groupId
                this.$f7router.navigate("/group/"+groupId+"/schedule/")
            }
        }
    }
</script>

<style scoped>

</style>