Vue.component('reset-popup', {
    template: `
    <div
        class="reset-popup"
        @keyup.esc="close()"
    >
        <popup
            v-if="visible"
            @mounted="mounted()"
            @beforeDestroy="beforeDestroy()"
            @close="close()"
            title="Reset"
        >
            <section class="reset-popup__content">
                <p>Vault will permanantly remove all your existing data.</p>
                <app-input
                    ref="input"
                    label="Type <b>reset</b> to continue"
                    v-model="confirm"
                    @update="checkConfirm()"
                />
            </section>
        </popup>
        <overlay :visible="visible" @click="close()" opacity="50"/>
    </div>`,
    model: {
        prop: "visible",
        event: "change"
    },
    data () {
        return {
            confirm: ""
        }
    },
    props: {
        visible: { type: Boolean, default: false }
    },
    methods: {
        mounted () {
            this.$refs.input.$el.getElementsByTagName("input")[0].focus()
        },
        beforeDestroy() {
            this.confirm = ""
        },
        checkConfirm () {
            if (this.confirm.toLowerCase() === "reset") {
                this.$emit("confirm")
                this.close()
            }
        },
        close () {
            this.$emit("change", false)
        }
    }
})