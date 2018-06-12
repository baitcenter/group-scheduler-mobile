<template>
    <f7-page>
        <f7-page v-if="loading">
            <f7-navbar color="red" :title="groupData.groupName" back-link="Back">
                <f7-nav-right>
                    <f7-link icon-if-ios="f7:info" icon-if-md="material:info" class="popover-open" href="#" data-popover=".popover-info">
                    </f7-link><f7-link href="/home/" icon-if-ios="f7:home" icon-if-md="material:home"></f7-link>
                </f7-nav-right>
            </f7-navbar>
            <f7-list>
                <f7-list-item>
                    <div slot="inner">
                        <b>Group Name: </b>{{groupData.groupName}}
                    </div>
                </f7-list-item>
                <f7-list-item>
                    <div slot="inner">
                        <b>Description: </b> {{groupData.groupDescription}}
                    </div>
                </f7-list-item>
                <f7-list-item media-item><b>Leader:</b>
                    <f7-chip :text="groupData.groupLeader.name" media-bg-color="orange">
                        <f7-icon slot="media" material="person"></f7-icon>
                    </f7-chip>
                </f7-list-item>
                <f7-list-item accordion-item>
                    <div slot="inner"><b>Members</b></div>
                    <f7-accordion-content>
                        <f7-block strong>
                            <f7-chip v-for="(member, index) in groupData.groupMembers" :key="index"
                                     :text="member.name" media-bg-color="orange">
                                <f7-icon slot="media" material="person"></f7-icon>
                            </f7-chip>
                        </f7-block>
                    </f7-accordion-content>
                </f7-list-item>
                <f7-list-item media-item>
                    <div slot="inner"><b>Invite code:</b></div>
                    <f7-list-item-row>
                        <f7-chip :text="groupId" media-bg-color="gray"></f7-chip>
                        <f7-button outline round @click="copyToClipboard" icon-material="content_copy"></f7-button>
                    </f7-list-item-row>
                </f7-list-item>
            </f7-list>
            <f7-block>
                <f7-button color="orange" class="col-80" fill @click="redirectTo">Schedule</f7-button>
                <f7-button icon-material="delete_forever" v-if="isLeader" color="red" class="col-80 margin-top" fill @click="openConfirmDelete">Delete Group</f7-button>
                <f7-button icon-material="directions_run" v-else color="red" class="col-80 margin-top" fill @click="openConfirmLeave(uid)">Leave Group</f7-button>
            </f7-block>
            <f7-popover class="popover-info">
                <f7-block>
                    <p>Group Page</p>
                    <p>This is the group page. You can invite people into the group using by giving them the group's "Invite code" which they can in turn use it in the Enroll page's form.</p>
                </f7-block>
            </f7-popover>
            <f7-input type="hidden" id="testing-code" v-bind:value="groupId"></f7-input>
        </f7-page>
    </f7-page>
</template>

<script>
    import {auth, db} from '@/firebase'
    export default {
        data() {
            return {
                uid : auth.currentUser.uid,
                groupId: this.$f7route.params.groupId,
                groupData: {},
                loading:false,
                isLeader : false,
            }
        },
        firebase() {
            return {
                group: db.ref("groups").child(this.groupId),
                users: db.ref("users")
            }
        },
        // user $f7route.params to get the params from url
        methods: {
            copyToClipboard(){
                const app = this.$f7
                var copyText = this.groupId
                let testingCopy = document.querySelector('#testing-code')
                testingCopy.setAttribute('type','text')
                testingCopy.select()
                try{
                    var success = document.execCommand("copy")
                    var msg = success ? 'successful' : "failed"
                }catch(error){
                    app.dialog.alert("failed copying the text")
                }
                testingCopy.setAttribute('type','hidden')
                window.getSelection().removeAllRanges()
                this.showToastBottom()
            },
            redirectTo() {
                const groupId = this.$f7route.params.groupId
                this.$f7router.navigate("/group/"+groupId+"/schedule/")
            },
            populateGroupData() {
                this.$f7.dialog.preloader('Loading');
                db.ref("groups").child(this.groupId).once("value", snapshot => {
                    this.groupData = snapshot.val()
                    this.setGroupLeader(this.groupData.groupLeader)
                    this.setGroupMembers(snapshot.val().groupMembers)
                }).then(()=>{
                    this.loading=true;
                    this.$f7.dialog.close()
                })
                this.$f7.dialog.close()
            },
            showToastBottom() {
                const self = this;
                if (!self.toastBottom) {
                    self.toastBottom = self.$f7.toast.create({
                        text: 'copied to clipboard',
                        closeTimeout: 2000,
                    });
                }
                self.toastBottom.open();
            },
            setGroupLeader(uid) {
                db.ref("users/" + uid + "/profile").on("value", snapshot => {
                    this.groupData.groupLeader = {uid: uid, ...snapshot.val()}
                    if(auth.currentUser.uid === uid){
                        this.isLeader = true
                    }
                })
            },
            setGroupMembers(groupMembers) {
                let members = []
                for (let uid in groupMembers) {
                db.ref("users/" + uid + "/profile").on("value", snapshot => {
                        members.push({uid:uid,...snapshot.val()})
                    })
                }
                this.groupData.groupMembers = members
            },
            openConfirmLeave(uid){
                const app = this.$f7;
                app.dialog.confirm('Do you want to leave this event?','Leave Group', () => {
                    this.leaveGroup(uid)
                    app.dialog.alert('You leaved the group!')
                    this.$f7router.back({ignoreCache: true, force:true, reloadCurrent:true})
                });
            },

            openConfirmDelete(){
                const app = this.$f7;
                app.dialog.confirm('Do you want to delete this group?','Delete Group', () => {
                    this.deleteGroup()
                    app.dialog.alert('You delete the group!')
                    this.$f7router.back('/my-group/',{ignoreCache: true, force:true, reloadPrevious: true})
                });
            },
            deleteGroup(){
                db.ref('events').once('value',snapshot=>{
                    snapshot.forEach(eventSnapshot=>{
                        let event = {}
                        eventSnapshot.forEach(eventData=>{
                            event[eventData.key] = eventData.val()
                        })
                        if(event.groupId===this.groupId){
                            for(let key in event.joinedMembers){
                                db.ref('users/'+key+'/userEvents/'+event.day)
                                .child(eventSnapshot.key).remove()
                                db.ref('users/'+key+'/userEvents').once('value',check=>{
                                    if(!check.hasChild('Monday')){
                                        db.ref('users/'+key+'/userEvents').child('Monday').set(0)
                                    }
                                    if(!check.hasChild('Tuesday')){
                                        db.ref('users/'+key+'/userEvents').child('Tuesday').set(0)
                                    }
                                    if(!check.hasChild('Wednesday')){
                                        db.ref('users/'+key+'/userEvents').child('Wednesday').set(0)
                                    }
                                    if(!check.hasChild('Thursday')){
                                        db.ref('users/'+key+'/userEvents').child('Thursday').set(0)
                                    }
                                    if(!check.hasChild('Friday')){
                                        db.ref('users/'+key+'/userEvents').child('Friday').set(0)
                                    }
                                })
                                db.ref('users/'+key+'/userGroups').child(this.groupId).remove()
                            }
                        }
                        db.ref('events').child(eventSnapshot.key).remove()

                    })
                }).then(()=>{
                    db.ref("groups/" + this.groupId + "/groupMembers").once("value", UIDs => {
                        UIDs.forEach(uid => {
                            db.ref("users/" + uid.key + "/userGroups").once("value", groupIDs => {
                                groupIDs.forEach(groupID => {
                                    if (this.groupId === groupID.key) {
                                        db.ref("users/" + uid.key + "/userGroups").child(groupID.key).remove()
                                    }
                                })
                            })
                        })
                    }).then(() => {
                        db.ref('users/'+this.uid+'/userGroups').child(this.groupId).remove()

                        db.ref('groups').child(this.groupId).remove()
                        db.ref().once("value", snapshot => {
                            if (!snapshot.hasChild("groups")) {
                                db.ref().child("groups").set(0)
                            }
                        })
                    })
                })
            },
            leaveGroup(uid){
                //leave group
                db.ref('groups/'+this.groupId+'/groupSchedule').once('value',snapshot=>{
                    //snapshot.val() = 5days
                    snapshot.forEach(daySnapshot=>{
                        if(daySnapshot.val()!==0){
                            daySnapshot.forEach(eventKeySnapshot=>{
                                db.ref('events/'+eventKeySnapshot.key+'/joinedMembers')
                                .child(uid).remove()

                                db.ref('events/'+eventKeySnapshot.key).once('value',check=>{
                                    if(!check.hasChild('joinedMembers')){
                                        db.ref('events/'+eventKeySnapshot.key).child('joinedMembers').set(0)
                                    }
                                })

                                db.ref('users/'+uid+'/userEvents/'+daySnapshot.key).child(eventKeySnapshot.key).remove()
                                db.ref('users/'+uid+'/userEvents').once('value',check=>{
                                    if(!check.hasChild(daySnapshot.key)){
                                        db.ref('users/'+uid+'/userEvents').child(daySnapshot.key).set(0)
                                    }
                                })
                            })
                        }

                    })

                }).then(()=>{
                    db.ref('groups/'+this.groupId+'/groupMembers').child(uid).remove()
                    db.ref('groups/'+this.groupId).once('value',check=>{
                        if(!check.hasChild('groupMembers')){
                            db.ref('groups/'+this.groupId).child('groupMembers').set(0)
                        }
                    })
                    db.ref('users/'+uid+'/userGroups').child(this.groupId).remove()
                })

            }

        },
        created() {
            this.populateGroupData()
            db.ref("groups/" + this.groupId).on("child_changed", snapshot => {
                this.populateGroupData()
            })
            db.ref("groups/" + this.groupId).on("child_removed", snapshot => {
                this.populateGroupData()
            })
        }
    }
</script>

<style scoped>

</style>
