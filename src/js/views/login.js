Vue.component('login', {
    template: `
    <div class="login" @keydown.enter="enter()">
        <div class="login__main-content">
            <div class="login__logo"/>
            <app-input
                :key="loading ? 'input-loading' : ''"
                ref="input"
                class="login__password"
                label="Password"
                type="password"
                icon="lock"
                :value="value"
                :error="error"
                @update="$emit('update', $event)"
            />
            <app-button
                :disabled="value === ''"
                :text="initial ? 'Create Vault' : 'Enter'"
                :loading="loading"
                type="primary"
                class="login__cta-btn"
                size="large"
                @click="enter()"
            />
        </div>
        <button
            v-if="!initial"
            class="login__reset-btn"
            @click="resetPopup = true"
        >
            <icon icon="undo"/>
            <span>Reset Vault</span>
        </button>
        <span class="login__author">Created by Samo Šlag</span>
        <reset-popup
            v-model="resetPopup"
            @confirm="$root.resetVault()"
        />
    </div>`,
    model: {
        prop: "value",
        event: "update"
    },
    data () {
        return {
            resetPopup: false
        }
    },
    props: {
        value: { type: String, default: "" },
        error: { type: String, default: "" },
        initial: { type: Boolean, default: false },
        loading: { type: Boolean, default: false }
    },
    mounted () {
        this.$refs.input.$el.getElementsByTagName("input")[0].focus()
    },
    methods: {
        enter () {
            if (this.value && !this.loading) this.$root.attemptLogin()
        }
    }
})