<template>
    <f7-page>
        <f7-navbar>
            <f7-button big href="/profile" icon-material="account_circle" icon-size="40px" view="#main-view" panel-close> Example</f7-button>
        </f7-navbar>
        <f7-list>
            <f7-list-item v-for="item in panelItems" :key="item.title">
                <f7-button :href="item.path" :icon-material="item.icon" view="#main-view" panel-close> {{item.title}}</f7-button>
            </f7-list-item>
        </f7-list>
        <f7-button icon-material="exit_to_app">Sign out</f7-button>
    </f7-page>
</template>

<script>
    export default {
        computed: {
            panelItems() {
                return [
                    {title: "My schedule", path:"/my-schedule", icon: "today"},
                    {title: "My group", path:"/my-group", icon: "people"},
                    {title: "Create group", path:"/create-group", icon: "add_circle"},
                    {title: "Enroll in a group", path:"/enroll-group", icon: "group_add"},
                ]
            }
        }
    }
</script>

<style scoped>

</style>