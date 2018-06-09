<template>
    <f7-page>
        <f7-page v-if="loaded">
            <f7-navbar color="red" title="My Group" back-link="Back">
                <f7-nav-right><f7-link href="/home/" icon-if-ios="f7:home" icon-if-md="material:home"></f7-link></f7-nav-right>
            </f7-navbar>
            <f7-block v-if="myGroups.length === 0" strong>
                <b>You haven't enrolled in any group yet.</b>
            </f7-block>
            <f7-card class="margin-vertical" v-for="group in myGroups" :key="group.groupId">
                <f7-card-content>
                    <f7-block>
                        <f7-list>
                            <f7-list-item :title="group.groupName">
                                <div slot="media">
                                    <f7-icon size="30" material="group"></f7-icon>
                                </div>
                            </f7-list-item>
                        </f7-list>
                    </f7-block>
                </f7-card-content>
                <f7-card-footer>
                    <span></span>
                    <f7-link @click="redirectTo(group.groupId)">See more</f7-link>
                </f7-card-footer>
            </f7-card>
        </f7-page>
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
                db.ref().once("value", snapshot => {
                    if (!snapshot.hasChild("groups")) {
                        return groups
                    }
                })
                db.ref("groups").once('value', snapshot => {
                    let myGroupsIDs = this.getMyGroupsIDs()
                    for (let groupId in snapshot.val()) {
                        if (myGroupsIDs.includes(groupId)) {
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
                this.$f7.dialog.close()
            },
            getMyGroupsIDs() {
                let keys = []
                db.ref("users/"+auth.currentUser.uid).once("value", snapshot => {
                    if (!snapshot.hasChild("userGroups")) {
                        return keys
                    }
                })
                db.ref("users/" + auth.currentUser.uid + "/userGroups").once('value', snapshot => {
                    snapshot.forEach(group => {
                        keys.push(group.key)
                    })
                })
                return keys
            },

        },
        created() {
            this.populateMyGroups()
            db.ref("groups").on("child_removed", snapshot => {
                this.populateMyGroups()
            })
        }
    }
</script>

<style scoped>

</style>
