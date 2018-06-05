<template>
    <f7-page>
        <f7-navbar color="red" :title="groupData.groupName" back-link="Back">
            <f7-nav-right><f7-link icon-if-md="material:info" class="popover-open" href="#" data-popover=".popover-info"></f7-link></f7-nav-right>
        </f7-navbar>
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
            <f7-button color="red" class="col-80" fill @click="redirectTo">Schedule</f7-button>
        </f7-block>
        <!-- {{this.$f7router.params.groupId}} -->
        <f7-popover class="popover-info">
            <f7-block>
                <p>Group Page</p>
                <p>This is the group page. You can invite people into the group using by giving them the group's "Invite code" which they can in turn use it in the Enroll page's form.</p>
            </f7-block>
        </f7-popover>
    </f7-page>
</template>

<script>
    import {db} from '@/firebase'
    export default {
        data() {
            return {
                groupId: this.$f7route.params.groupId,
                groupData: {}
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
