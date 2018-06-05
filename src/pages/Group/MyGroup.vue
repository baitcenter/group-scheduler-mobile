<template>
    <f7-page>
        <f7-navbar color="red" title="My Group" back-link="Back"></f7-navbar>
        <f7-list>
            <f7-card v-for="group in myGroup" :key="group.id"
                     :title="group.name">
                <f7-card-footer>
                    <span></span>
                    <f7-link @click="redirectTo(group.id)">See more</f7-link>
                </f7-card-footer>
            </f7-card>
        </f7-list>
    </f7-page>
</template>

<script>
    export default {
        methods: {
            redirectTo(groupId) {
                this.$f7router.navigate('/group/'+groupId+'/')
            }
        },
        computed: {
            myGroup() {
                return [
                    {name: "Group 1", id: "jnvlnv"},
                    {name: "Group 2", id: "fkv"}
                ]
            }
        }
    }
</script>

<style scoped>

</style>