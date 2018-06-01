<template>
    <f7-page>
        <f7-navbar title="Profile" back-link="Back"></f7-navbar>
        <div v-if="!editing">
            <f7-list>
                <f7-list-item>Name: {{name}}</f7-list-item>
                <f7-list-item>Email: {{email}}</f7-list-item>
            </f7-list>
            <f7-row>
                <f7-col width="5"></f7-col>
                <f7-button class="col-65" fill color="green" @click="">Re-send email verified</f7-button>
                <f7-button class="col-30" fill color="gray" @click="toggleEdit">Edit</f7-button>
                <f7-col width="5"></f7-col>
            </f7-row>
        </div>
        <div v-else>
            <f7-list>
                <f7-list-item>
                    <f7-label>Name</f7-label>
                    <f7-input type="text" :value="name"
                              required validate
                              placeholder="Name" clear-button>
                    </f7-input>
                </f7-list-item>
                <f7-list-item>
                    <f7-label>Email</f7-label>
                    <f7-input type="email" :value="name"
                              required validate
                              placeholder="Email" clear-button>
                    </f7-input>
                </f7-list-item>
            </f7-list>
            <f7-list>
                <f7-list-item>
                    <f7-label>Password</f7-label>
                    <f7-input type="password"
                              required validate
                              placeholder="Password" clear-button>
                    </f7-input>
                </f7-list-item>
            </f7-list>
            <f7-row>
                <f7-col width="5"></f7-col>
                <f7-button class="col-45" fill @click="cancelEdit">Cancel</f7-button>
                <f7-button class="col-45" fill color="red" @click="saveChanges">Save changes</f7-button>
                <f7-col width="5"></f7-col>
            </f7-row>
        </div>
    </f7-page>
</template>

<script>
    import F7ListItem from "framework7-vue/src/components/list-item";
    import F7Input from "framework7-vue/src/components/input";
    import F7Label from "framework7-vue/src/components/label";
    export default {
        components: {F7Label, F7Input, F7ListItem},
        data() {
            return {
                editing: false,
                name: "",
                email: "",
            }
        },
        methods: {
            toggleEdit() {
                this.editing = !this.editing
            },
            cancelEdit() {
                this.toggleEdit()
            },
            saveChanges() {
                this.toggleEdit()
            }
        }
    }
</script>

<style scoped>

</style>