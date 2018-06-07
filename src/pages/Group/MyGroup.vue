<template>
    <f7-page>
        <f7-page-content v-if="loaded">
            <f7-navbar color="red" title="My Group" back-link="Back">
                <f7-nav-right><f7-link href="/home/" icon-if-md="material:home"></f7-link></f7-nav-right>
            </f7-navbar>
            <f7-list v-if="myGroups.length !== 0">
                <f7-card v-for="group in myGroups" :key="group.groupId"
                         :title="group.groupName">
                    <f7-card-footer>
                        <span></span>
                        <f7-link @click="redirectTo(group.groupId)">See more</f7-link>
                    </f7-card-footer>
                </f7-card>
            </f7-list>
            <f7-block v-else strong>
                <p>You haven't enrolled in any group yet.</p>
            </f7-block>
        </f7-page-content>
    </f7-page>
</template>

<script>
    import {db, auth} from '@/firebase'
    export default {
        data() {
            return {
                myGroups: [],
                loaded: false
            }
        },
        methods: {
            redirectTo(groupId) {
                this.$f7router.navigate('/group/'+groupId+'/')
            },
            populateMyGroups() {
                this.$f7.dialog.preloader('Loading');
                let groups = []
                this.$firebaseRefs.groups.once('value', snapshot => {
                    for (let groupId in snapshot.val()) {
                        if (this.myGroupsIDs.includes(groupId)) {
                            let group = {...snapshot.val()[groupId]}
                            group["groupId"] = groupId
                            groups.push(group)
                        }
                    }
                }).then(() => {
                    this.myGroups = groups
                    this.loaded = true
                    this.$f7.dialog.close()
                })
            }

        },
        firebase() {
            return {
                userGroups: db.ref("users/" + auth.currentUser.uid + "/userGroups"),
                groups: db.ref("groups")
            }
        },
        computed: {
            myGroupsIDs() {
                let keys = []
                this.$firebaseRefs.userGroups.once('value', snapshot => {
                    snapshot.forEach(group => {
                        keys.push(group.key)
                    })
                })
                return keys
            },
        },
        created() {
            this.populateMyGroups()
        }
    }
</script>

<style scoped>

</style>
