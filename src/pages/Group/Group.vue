<template>
    <f7-page>
        <f7-page-content v-if="loading">
            <f7-navbar color="red" :title="groupData.groupName" back-link="Back">
                <f7-nav-right>
                    <f7-link icon-if-md="material:info" class="popover-open" href="#" data-popover=".popover-info">
                    </f7-link><f7-link href="/home/" icon-if-md="material:home"></f7-link>
                </f7-nav-right>
            </f7-navbar>
            <f7-list>
                <f7-list-item>Group Name: {{groupData.groupName}}</f7-list-item>
                <f7-list-item>Description: {{groupData.groupDescription}}</f7-list-item>
                <f7-list-item media-item>Leader:
                    <f7-chip :text="groupData.groupLeader.name" media-bg-color="orange">
                        <f7-icon slot="media" material="person"></f7-icon>
                    </f7-chip>
                </f7-list-item>
                <f7-list-item accordion-item title="Members">
                    <f7-accordion-content>
                        <f7-list-item v-for="(member, index) in groupData.groupMembers" :key="index">
                            <f7-chip :text="member.name" media-bg-color="orange">
                                <f7-icon slot="media" material="person"></f7-icon>
                            </f7-chip>
                        </f7-list-item>
                    </f7-accordion-content>
                </f7-list-item>
                <f7-list-item title="Invite code:">
                    <f7-badge style="font-size: 14px">{{groupId}}</f7-badge>
                    <f7-button @click="copyToClipboard" icon-material="content_copy"></f7-button>
                </f7-list-item>
            </f7-list>
            <f7-block>
                <f7-button color="red" class="col-80" fill @click="redirectTo">Schedule</f7-button>
                <f7-button color="red" class="col-80" fill @click="openConfirmLeave(uid)">Leave Group</f7-button>
                <f7-button color="red" class="col-80" fill @click="openConfirmDelete">Delete Group</f7-button>
            </f7-block>
            <f7-popover class="popover-info">
                <f7-block>
                    <p>Group Page</p>
                    <p>This is the group page. You can invite people into the group using by giving them the group's "Invite code" which they can in turn use it in the Enroll page's form.</p>
                </f7-block>
            </f7-popover>
            <f7-input type="hidden" id="testing-code" v-bind:value="groupId"></f7-input>
        </f7-page-content>

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
                loading:false
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
                console.log(copyText)
                let testingCopy = document.querySelector('#testing-code')
                testingCopy.setAttribute('type','text')
                testingCopy.select()
                try{
                    var success = document.execCommand("copy")
                    var msg = success ? 'successful' : "failed"
                    // app.dialog.alert("copying " + msg)
                }catch(error){
                    app.dialog.alert("failed copying the text")
                }
                testingCopy.setAttribute('type','hidden')
                window.getSelection().removeAllRanges()
                console.log("copy process ended")
                // document.execCommand("copy")
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
                    console.log(this.groupData.groupLeader)
                    this.setGroupLeader(this.groupData.groupLeader)
                    this.setGroupMembers(snapshot.val().groupMembers)
                }).then(()=>{
                    this.loading=true;
                    this.$f7.dialog.close()
                })
            },
            showToastBottom() {
                const self = this;
                // Create toast
                if (!self.toastBottom) {
                    self.toastBottom = self.$f7.toast.create({
                        text: 'copied to clipboard',
                        closeTimeout: 2000,
                    });
                }
                // Open it
                self.toastBottom.open();
            },
            setGroupLeader(uid) {
                db.ref("users/" + uid + "/profile").on("value", snapshot => {
                    this.groupData.groupLeader = {uid: uid, ...snapshot.val()}
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
                    this.$f7router.back('/my-group/',{ignoreCache: true, force:true})
                });
            },
            deleteGroupEventPromise(){
                return new Promise((resolve,reject)=>{
                    for(let x in this.groupData.groupSchedule){
                        for(let y in this.groupData.groupSchedule[x]){
                            db.ref('events').child(y).remove()
                        }
                    }
                    resolve()
                })
            },
            deleteGroup(){
                //need to use groupLeader uid
                this.leaveGroup(this.groupData.groupLeader.uid).then(()=>{
                    console.log('done')
                    if(this.groupData.groupMembers){
                        let s = Object.keys(this.groupData.groupMembers).length-1
                        while (s>=0){
                            console.log(s)
                            this.leaveGroup(this.groupData.groupMembers[s]).then(()=>{
                                s++;
                            })
                        }
                    }
                    this.deleteGroupEventPromise().then(()=>{
                        db.ref('groups').child(this.groupId).remove()
                    })


                })

            },
            leaveGroup(uid){
                return new Promise((resolve,reject)=>{
                    
                    //delete user from groupMembers
                    // console.log(uid)
                    if(this.groupData.groupMembers){
                        if(Object.keys(this.groupData.groupMembers).length>1){
                            db.ref('groups/'+this.groupId+'/groupMembers').child(uid).remove()
                        }
                        else{
                            db.ref('groups/'+this.groupId).child('groupMembers').set(0)
                        }
                    }

                    //delete group from userGroups
                    db.ref('users/'+uid+'/userGroups').child(this.groupId).remove()

                    //getUserEvents
                    let userEvents={}
                    db.ref('users/'+uid+'/userEvents').once('value',snapshot=>{
                        userEvents = snapshot.val()
                    })
                    .then(()=>{
                        // console.log('userEvents',userEvents)
                        //delete user from joinedEvents and event from userEvents
                        for(let x in this.groupData.groupSchedule){
                            //x === day
                            for(let y in this.groupData.groupSchedule[x]){
                                //y === eventId
                                db.ref('events/'+y+'/joinedMembers').once('value',snapshot=>{
                                    //snapshot.key suppose to joinedMembers
                                    //snapshot.val() suppose to be list
                                    if(snapshot.val()!==0){
                                        let s = 0
                                        snapshot.forEach(child=>{
                                            s++;
                                            //child.key suppose to be uid
                                            //child.val() === 0
                                            if(child.key===uid){
                                                //remove eventId from userEvents

                                                if(userEvents[x] && Object.keys(userEvents[x]).length>1){
                                                    delete [userEvents][x][y]
                                                    db.ref('users/'+uid+'/userEvents/'+x).child(y).remove()
                                                }
                                                else{
                                                    db.ref('users/'+uid+'/userEvents').child(x).set(0)
                                                }
                                                db.ref('events/'+y+'/joinedMembers').child(uid).remove()
                                            }
                                        })
                                        if(s===1){
                                            db.ref('events/'+y).child('joinedMembers').set(0)
                                        }
                                    }
                                })
                                .then(()=>{resolve()})
                            }
                        }
                    })
                })
                
            }
        
        },
        created() {
            // const app = this.$f7
            // app.dialog.preloader('Loading')
            this.populateGroupData()
            // app.dialog.close()
        }
    }
</script>

<style scoped>

</style>
