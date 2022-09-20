Vue.component('app-header', {
    template: `
    <header class="header">
        <div class="header__container">
            <div class="header__logo"/>
            <div class="header__tools">
                <search
                    :value="value"
                    @update="$emit('update', $event)"
                />
                <app-button
                    class="header__add-btn"
                    icon="add"
                    text="Add Item"
                    @click="$emit('addItem')"
                />
                <app-button
                    icon="download"
                    text="Save"
                    :type="highlightSave ? 'primary' : ''"
                    @click="$root.save()"
                />
                <app-button
                    icon="lock"
                    text="Change Password"
                    @click="$root.passwordPopup = true"
                />
            </div>
        </div>
    </header>`,
    model: {
        prop: "value",
        event: "update",
    },
    props: {
        value: { type: String, default: "" },
        highlightSave: { type: Boolean, default: false }
    }
})