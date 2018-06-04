<template>
    <f7-page>
        <f7-navbar title="My Group" back-link="Back"></f7-navbar>
        <f7-list>
            <f7-card v-for="group in myGroups" :key="group.groupId"
                     :title="group.groupName">
                <f7-card-footer>
                    <span></span>
                    <f7-link @click="redirectTo(group.groupId)">See more</f7-link>
                </f7-card-footer>
            </f7-card>
        </f7-list>
        <!--{{myGroups}}-->
        <!--{{groups}}-->
    </f7-page>
</template>

<script>
    import {db, auth} from '@/firebase'
    export default {
        data() {
            return {
                myGroups: null
            }
        },
        methods: {
            redirectTo(groupId) {
                this.$f7router.navigate('/group/'+groupId+'/')
            },
            populateMyGroup() {
                let groups = []
                this.$firebaseRefs.groups.once('value', snapshot => {
                    for (let groupKey in snapshot.val()) {
                        if (this.myGroupsKey.includes(groupKey)) {
                            // console.log(groupKey)
                            let group = {...snapshot.val()[groupKey]}
                            group["groupId"] = groupKey
                            groups.push(group)
                        }
                    }
                })
                this.myGroups = groups
            }

        },
        firebase() {
            return {
                userGroups: db.ref("users/" + auth.currentUser.uid + "/userGroups"),
                groups: db.ref("groups")
            }
        },
        computed: {
            myGroupsKey() {
                let keys = []
                this.$firebaseRefs.userGroups.once('value', snapshot => {
                    snapshot.forEach(group => {
                        keys.push(group.key)
                    })
                })
                return keys
            },
        },
        mounted() {
            this.populateMyGroup()
        }
    }
</script>

<style scoped>

</style>