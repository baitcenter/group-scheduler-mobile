<template>
    <f7-page>
        <f7-navbar title="Enroll" color="red" back-link="Back"></f7-navbar>
        <f7-block-title>Enroll</f7-block-title>
        <f7-list form>
            <f7-list-item>
                <f7-icon material="vpn_key" slot="media"></f7-icon>
                <f7-label>Invite code</f7-label>
                <f7-input type="text" required v-bind:value="enrollCode" placeholder="Invite code" @input="enrollCode = $event.target.value"></f7-input>
            </f7-list-item>
        </f7-list>
        <f7-block>
            <f7-row>
                <f7-button class="col" color="red" @click="userEnroll" raised fill>Submit</f7-button>
            </f7-row>
        </f7-block>
    </f7-page>
</template>

<script>
export default {
    data(){
        return{
            enrollCode : '',
        }
    },
    methods: {
        userEnroll(){
            this.$store.dispatch('userEnrollGroup',{enroll_group_key : this.enrollCode})
        }
    }
}
</script>