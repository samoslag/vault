Vue.component('error-popup', {
    template: `
    <div
        class="error-popup"
        @keyup.esc="close()"
    >
        <popup
            v-if="visible"
            @close="close()"
            title="Error"
        >
            <section class="error-popup__content">
                <p>
                    There seems to be corrupted data stored in your Vault.<br/>
                    Don't worry, these things happen.
                </p>
                <p>
                    If you are sure you have the correct password, contact the developer to safely retrieve your data.
                </p>
                <p>
                    You can always reset Vault with the button at the bottom of the Home screen. Note that resetting will permanantly remove all your existing data.
                </p>
            </section>
        </popup>
        <overlay :visible="visible" @click="close()" opacity="50"/>
    </div>`,
    model: {
        prop: "visible",
        event: "change"
    },
    props: {
        visible: { type: Boolean, default: false }
    },
    methods: {
        close () {
            this.$emit("change", false)
        }
    }
})