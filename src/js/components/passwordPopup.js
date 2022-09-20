Vue.component('password-popup', {
    template: `
    <div
        class="password-popup"
        @keyup.esc="close()"
        @keyup.enter="confirm()"
    >
        <popup
            v-if="visible"
            @close="close()"
            @mounted="mounted()"
            @beforeDestroy="beforeDestroy()"
            title="Change Password"
        >
            <section class="password-popup__form">
                <app-input
                    v-model="form.currentPassword"
                    ref="currentPassword"
                    label="Current password"
                    icon="lock"
                    type="password"
                    :error="errors.current"
                />
                <app-input
                    v-model="form.newPassword.password"
                    label="New password"
                    icon="key"
                    type="password"
                />
                <app-input
                    v-model="form.newPassword.confirm"
                    label="Confirm new password"
                    icon="check"
                    type="password"
                    :error="errors.confirm"
                />
            </section>
            <section class="password-popup__bottom">
                <app-button
                    text="Close"
                    size="large"
                    @click="close()"
                />
                <app-button
                    :type="filled ? 'primary' : ''"
                    :disabled="!filled"
                    text="Change password"
                    size="large"
                    @click="confirm()"
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
            form: {
                currentPassword: "",
                newPassword: {
                    password: "",
                    confirm: ""
                }
            },
            errors: {
                current: null,
                confirm: null
            }
        }
    },
    props: {
        visible: { type: Boolean, default: false }
    },
    computed: {
        filled () {
            return this.form.currentPassword && this.form.newPassword.password && this.form.newPassword.confirm
        }
    },
    methods: {
        mounted () {
            this.$refs.currentPassword.$el.getElementsByTagName("input")[0].focus()
        },
        beforeDestroy() {
            this.reset()
        },
        confirm () {
            if (this.filled) {
                this.errors = {
                    current: null,
                    confirm: null
                }
                if (this.form.currentPassword !== this.$root.password) {
                    this.$nextTick(() => this.errors.current = "Password does not match your current password")
                    return
                }
                if (this.form.newPassword.password !== this.form.newPassword.confirm) {
                    this.$nextTick(() => this.errors.confirm = "Password must match your new password")
                    return
                }
                
                this.$root.changePassword(this.form.newPassword.password)
                this.close()
            }
        },
        reset () {
            this.form = {
                currentPassword: "",
                newPassword: {
                    password: "",
                    confirm: ""
                }
            }
        },
        close () {
            this.$emit("change", false)
        }
    }
})