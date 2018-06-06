<template>
    <f7-page>
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
                <f7-chip :text="groupData.groupLeader" media-bg-color="orange">
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
        </f7-block>
        <f7-popover class="popover-info">
            <f7-block>
                <p>Group Page</p>
                <p>This is the group page. You can invite people into the group using by giving them the group's "Invite code" which they can in turn use it in the Enroll page's form.</p>
            </f7-block>
        </f7-popover>
        <f7-input type="hidden" id="testing-code" v-bind:value="groupId"></f7-input>
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
                this.$firebaseRefs.group.on("value", snapshot => {
                    this.groupData = snapshot.val()
                    console.log(this.groupData.groupLeader)
                    this.setGroupLeader(this.groupData.groupLeader)
                    this.setGroupMembers(snapshot.val().groupMembers)
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
                    this.groupData.groupLeader = snapshot.val().name
                })
            },
            setGroupMembers(groupMembers) {
                let members = []
                for (let uid in groupMembers) {
                db.ref("users/" + uid + "/profile").on("value", snapshot => {
                        members.push(snapshot.val())
                    })
                }
                this.groupData.groupMembers = members
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
