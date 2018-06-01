<template>
    <f7-page>
        <f7-navbar title="Sign Up" color="red" back-link="Back"></f7-navbar>
        <f7-list form>
            <f7-list-item>
                <f7-icon material="person" slot="media"></f7-icon>
                <f7-label>Displayname</f7-label>
                <f7-input type="text" placeholder="Displayname"></f7-input>
            </f7-list-item>
            <f7-list-item>
                <f7-icon material="email" slot="media"></f7-icon>
                <f7-lable>E-mail</f7-lable>
                <f7-input type="email" placeholder="E-mail"></f7-input>
            </f7-list-item>
            <f7-list-item>
                <f7-icon material="lock" slot="media"></f7-icon>
                <f7-label>Password</f7-label>
                <f7-input type="password" placeholder="Password"></f7-input>
            </f7-list-item>
            <f7-list-item>
                <f7-icon material="check_box" slot="media"></f7-icon>
                <f7-label>Confirm Password</f7-label>
                <f7-input type="password" placeholder="Confirm Password"></f7-input>
            </f7-list-item>    
        </f7-list>
        <f7-block>
            <f7-row>
                <f7-button class="col" color="red" raised fill>Sign Up</f7-button>
            </f7-row>
        </f7-block>
    </f7-page>
</template>

<script>
export default {
    
}
</script>
