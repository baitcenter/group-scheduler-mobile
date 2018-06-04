<template>
    <f7-page>
        <f7-navbar title="GroupName" back-link="Back"></f7-navbar>
        <f7-list>
            <f7-list-item>Group Name: {{groupData.groupName}}</f7-list-item>
            <f7-list-item accordion-item title="Group members">
                <f7-accordion-content>
                    <f7-list-item v-for="(member, index) in groupData.groupMembers" :key="index">
                        {{member}}
                    </f7-list-item>
                </f7-accordion-content>
            </f7-list-item>
            <f7-list-item>Invite code: {{groupId}}</f7-list-item>
        </f7-list>
        <f7-block>
            <f7-button class="col-80" fill @click="redirectTo">Schedule</f7-button>
        </f7-block>
    </f7-page>
</template>

<script>
    import {db} from '@/firebase'
    export default {
        data() {
            return {
                // groupName: "Hello",
                // groupMembers: [
                //     {name: "1"},
                //     {name: "2"}
                // ],
                // inviteCode: "toc",
                groupId: this.$f7route.params.groupId,
                groupData: null
            }
        },
        firebase() {
            return {
                group: db.ref("groups").child(this.groupId)
            }
        },
        // user $f7route.params to get the params from url
        methods: {
            redirectTo() {
                const groupId = this.$f7route.params.groupId
                this.$f7router.navigate("/group/"+groupId+"/schedule/")
            },
            populateGroupData() {
                this.$firebaseRefs.group.once("value", snapshot => {
                    this.groupData = snapshot.val()
                    console.log()
                })
            }
        },
        created() {
            this.populateGroupData()
        }
    }
</script>

<style scoped>

</style>