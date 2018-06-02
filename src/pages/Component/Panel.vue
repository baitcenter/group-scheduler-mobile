<template>
    <f7-page>
        <f7-navbar>
            <f7-button big href="/profile/" icon-material="account_circle" icon-size="40px" view="#main-view" panel-close> Example</f7-button>
        </f7-navbar>
        <f7-list>
            <f7-list-item v-for="item in panelItems" :key="item.title"
                          :link="item.path"
                          view="#main-view"
                          panel-close>
                <div>
                    <f7-icon :material="item.icon"></f7-icon>
                    {{item.title}}
                </div>
            </f7-list-item>
        </f7-list>
        <f7-button icon-material="exit_to_app" @click="userSigout" panel-close>Sign out</f7-button>
    </f7-page>
</template>

<script>
    export default {
        computed: {
            panelItems() {
                return [
                    {title: "My schedule", path:"/my-schedule/", icon: "today"},
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