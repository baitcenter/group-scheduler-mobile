<template>
    <f7-page>
        <f7-navbar title="My Group" back-link="Back"></f7-navbar>
        <f7-list>
            <f7-card v-for="group in myGroups" :key="group.id"
                     :title="group.groupName">
                <f7-card-footer>
                    <span></span>
                    <f7-link @click="redirectTo(group.id)">See more</f7-link>
                </f7-card-footer>
            </f7-card>
        </f7-list>
        {{myGroups}}
        <!--{{groups}}-->
    </f7-page>
</template>

<script>
    import {db, auth} from '@/firebase'
    export default {
        data() {
            return {
            }
        },
        methods: {
            redirectTo(groupId) {
                this.$f7router.navigate('/group/'+groupId+'/')
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
                        // console.log(group.key)
                    })
                })

                return keys

                // return [
                //     {name: "Group 1", id: "jnvlnv"},
                //     {name: "Group 2", id: "fkv"}
                // ]
            },
            myGroups() {
                let groups = []
                this.$firebaseRefs.groups.once('value', snapshot => {
                    snapshot.forEach(group => {
                        groups.push(group.val())
                        console.log(group.val())
                    })
                })
                return groups
            }
        },
    }
</script>

<style scoped>

</style>