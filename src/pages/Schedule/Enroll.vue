<template>
    <f7-page>
        <f7-navbar color="red" back-link="Back">
            <f7-navbar-title>Enroll</f7-navbar-title>
            <f7-nav-right><f7-link icon-if-md="material:info" class="popover-open" href="#" data-popover=".popover-info"></f7-link>
            <f7-link href="/my-schedule/" icon-if-md="material:home"></f7-link></f7-nav-right>
        </f7-navbar>
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
        <!-- Popovers -->
        <f7-popover class="popover-info">
            <f7-block>
                <p>Enroll Page</p>
                <p>This is the page for enroll into group by using enroll code. Enroll code can be obtained by asking a group member of that specific group.</p>
            </f7-block>
        </f7-popover>
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
        // goHome(){
        //     this.$f7router.navigate('/home/')
        // },
        // openInfoModal(){
        //     const app = this.$f7
        //     app.dialog.alert()
        // },
        userEnroll(){
            this.$store.dispatch('userEnrollGroup',{enroll_group_key : this.enrollCode})
        }
    }
}
</script>