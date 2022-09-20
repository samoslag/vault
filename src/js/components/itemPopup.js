Vue.component('item-popup', {
    template: `
    <div
        class="item-popup"
        @keyup.enter="handleEnter()"
    >
        <popup
            v-if="visible"
            @created="created()"
            @mounted="mounted()"
            @beforeDestroy="beforeDestroy()"
            @close="close()"
            :title="data ? data.title : 'New Item'"
        >
            <section class="item-popup__form">
                <app-input
                    v-model="form.title"
                    ref="title"
                    label="Title"
                />
                <app-input
                    v-model="form.password"
                    label="Password"
                    type="password"
                />
                <div class="item-popup__container">
                    <app-input
                        v-model="form.username"
                        label="Username"
                        icon="user"
                    />
                    <app-input
                        v-model="form.email"
                        label="E-mail"
                        icon="email"
                    />
                </div>
                <div class="item-popup__container">
                    <app-input
                        v-model="form.key"
                        label="Key"
                        icon="key"
                    />
                    <app-input
                        v-model="form.hint"
                        label="Hint"
                        icon="bulb"
                    />
                </div>
                <app-input
                    ref="note"
                    v-model="form.note"
                    label="Note"
                    component="textarea"
                    rows="4"
                />
            </section>
            <section class="item-popup__bottom">
                <app-button
                    text="Close"
                    size="large"
                    @click="close()"
                />
                <app-button
                    :type="form.title !== '' ? 'primary' : ''"
                    :disabled="form.title === ''"
                    :text="data ? 'Save' : 'Add Item'"
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
            form: {}
        }
    },
    props: {
        visible: { type: Boolean, default: false },
        data: { type: Object, default: () => {} }
    },
    methods: {
        created () {
            this.populateForm()
        },
        mounted () {
            if (!this.data) this.$refs.title.$el.getElementsByTagName("input")[0].focus()
        },
        beforeDestroy() {
            this.form = {}
        },
        close () {
            this.$emit("change", false)
            this.$emit("close")
        },
        confirm () {
            if (this.form.title) this.$emit('confirm', this.form)
        },
        populateForm () {
            this.form = {
                id: this.data ? this.data.id : null,
                title: this.data ? this.data.title : "",
                username: this.data ? this.data.username : "",
                email: this.data ? this.data.email : "",
                key: this.data ? this.data.key : "",
                hint: this.data ? this.data.hint : "",
                note: this.data ? this.data.note : "",
                password: this.data ? this.data.password : ""
            }
        },
        handleEnter () {
            if (document.activeElement !== this.$refs.note.$el.getElementsByTagName("textarea")[0]) {
                this.confirm()
            }
        }
    }
})