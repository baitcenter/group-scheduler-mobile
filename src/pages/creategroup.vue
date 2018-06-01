<template>
    <f7-page>
        <f7-navbar color="red" title="Create Group" back-link="Back"></f7-navbar>
        <f7-block-title>Create Group</f7-block-title>
        <f7-list form>
            <f7-list-item>
                <f7-icon material="group" slot="media"></f7-icon>
                <f7-label>Group Name</f7-label>
                <f7-input type="text" placeholder="Group name"></f7-input>
            </f7-list-item>
            <f7-list-item>
                <f7-icon material="description" slot="media"></f7-icon>
                <f7-label>Group Description</f7-label>
                <f7-input type="textarea" placeholder="Description"></f7-input>
            </f7-list-item>
        </f7-list>
        <f7-block>
            <f7-row>
                <f7-button class="col" color="red" width= raised fill>Submit</f7-button>
            </f7-row>
        </f7-block>
    </f7-page>
</template>

<script>
export default {
    
}
</script>
