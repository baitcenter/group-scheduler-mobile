<template>
    <f7-page>
        <f7-navbar color="red" title="Create Group" back-link="Back"></f7-navbar>
        <f7-block-title>Create Group</f7-block-title>
        <f7-list form>
            <f7-list-item>
                <f7-icon material="group" slot="media"></f7-icon>
                <f7-label>Group Name</f7-label>
                <f7-input
                    type="text"
                    placeholder="Group name"
                    v-bind:value="groupName"
                    @input="groupName = $event.target.value"></f7-input>
            </f7-list-item>
            <f7-list-item>
                <f7-icon material="description" slot="media"></f7-icon>
                <f7-label>Group Description</f7-label>
                <f7-input
                    type="textarea"
                    placeholder="Description"
                    v-bind:value="groupDescription"
                    @input="groupDescription = $event.target.value"></f7-input>
            </f7-list-item>
        </f7-list>
        <f7-block>
            <f7-row>
                <f7-button class="col" color="red" width= raised fill @click.prevent="createNewGroup">Submit</f7-button>
            </f7-row>
        </f7-block>
    </f7-page>
</template>

<script>
import  {auth,db} from '@/firebase'
export default {
    data(){
        return{
            groupName:'',
            groupDescription:''
        }
    },
    methods : {
        //lazy, no loop
        createNewGroup(){
            // const uid=auth.currentUser.uid;
            let groupInfo={
                groupName:this.groupName,
                groupDescription:this.groupDescription,
            }
            db.ref('groups').push(groupInfo)
            .then((snapshot)=>{
                db.ref('groups/'+snapshot.key).child('groupMembers').push({user:'user@user.com', name:'name'})
                let groupRef = db.ref('groups/'+snapshot.key+'/groupSchedule')
                groupRef.child('Monday').set(0)
                groupRef.child('Tuesday').set(1)
                groupRef.child('Wednesday').set(2)
                groupRef.child('Thursday').set(3)
                groupRef.child('Friday').set(4)
                db.ref('users/uid/userGroups').child(snapshot.key).set(1)

                this.groupName=''
                this.groupDescription=''
                this.$f7router.navigate("/group/"+snapshot.key+"/")

            })

        }
    }

}
</script>
