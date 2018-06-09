<template>
    <f7-page>
        <f7-navbar color="red">
            <f7-link big href="/profile/" icon-material="account_circle" icon-size="40px"
                       view="#main-view" text="Profile" panel-close>
            </f7-link>
        </f7-navbar>
        <f7-list>
            <f7-list-item v-for="item in panelItems" :key="item.title"
                          :link="item.path"
                          view="#main-view"
                          :title="item.title"
                          panel-close>
                <div slot="media">
                    <f7-icon :material="item.icon"></f7-icon>
                </div>
            </f7-list-item>
        </f7-list>
        <f7-block>
            <f7-button icon-material="exit_to_app" @click="userSigout" panel-close>Sign out</f7-button>
        </f7-block>
    </f7-page>
</template>

<script>
    export default {
        computed: {
            panelItems() {
                return [
                    {title: "My schedule", path:"/home/", icon: "today"},
                    {title: "My group", path:"/my-group/", icon: "people"},
                    {title: "Create group", path:"/create-group/", icon: "add_circle"},
                    {title: "Enroll in a group", path:"/enroll-group/", icon: "group_add"},
                    {title: "About", path:"/about/", icon:"info"},
                ]
            }
        },
        methods: {
            userSigout() {
                this.$store.dispatch("userSignOut")
            }
        }
    }
</script>

<style scoped>

</style>
