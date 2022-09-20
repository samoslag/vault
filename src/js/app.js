new Vue({
    el: '#app',
    template: `
    <main>
        <transition name="login">
            <login
                v-if="!auth"
                v-model="password"
                :error="errors.login"
                :initial="initial"
                :loading="loading"
            />
        </transition>
        <transition name="vault">
            <vault
                v-if="auth"
                :data="data"
                :changed="changed"
                @logout="
                    auth = false
                    password = ''
                "
            />
        </transition>
        <password-popup v-model="passwordPopup"/>
        <error-popup v-model="errors.data"/>
        <notify :data="notifications"/>
    </main>`,
    data () {
        return {
            encrypted,
            initData: "",
            data: null,
            auth: false,
            password: "",
            passwordPopup: false,
            passwordChanged: false,
            errors: {
                login: null,
                data: false
            },
            notifications: [],
            loading: false
        }
    },
    computed: {
        changed () {
            if (this.passwordChanged) return true

            let initial
            let current
            try {
                initial = this.removeIds(JSON.parse(this.initData))
            } catch {
                initial = ""
            }
            try {
                current = this.removeIds([ ...this.data ])
            } catch {
                current = ""
            }
            return JSON.stringify(initial) !== JSON.stringify(current)
        },
        initial () {
            return !this.encrypted && !this.data
        }
    },
    created () {
        window.addEventListener("beforeunload", this.beforeUnload)
    },
    beforeDestroy() {
        window.removeEventListener("beforeunload", this.beforeUnload)
    },
    methods: {
        attemptLogin () {
            this.loading = true
            if (this.initial) {
                this.data = []
                this.encrypted = this.encryptData("[]")
            } else {
                this.errors.login = null
                let decrypted = null
                let data = null
                try {
                    decrypted = CryptoJS.AES.decrypt(this.encrypted, this.password)
                    data = decrypted.toString(CryptoJS.enc.Utf8)
                } catch {
                    this.$nextTick(() => this.errors.login = "Incorrect password" )
                    this.loading = false
                    return
                }
                if (!data) {
                    this.$nextTick(() => this.errors.login = "Incorrect password" )
                    this.loading = false
                    return
                }
                if (!this.data) {
                    this.initData = data
                    try {
                        this.data = JSON.parse(data)
                    } catch {
                        this.errors.data = true
                        this.loading = false
                        return
                    }
                }
            }
            this.$nextTick(() => {
                this.loading = false
                this.auth = true
            })
        },
        removeIds (list) {
            let items = JSON.parse(JSON.stringify(list))
            for (let i = 0; i < items.length; i++) delete items[i].id
            return items
        },
        assignIds (list) {
            let items = JSON.parse(JSON.stringify(list))
            for (let i = 0; i < items.length; i++) items[i].id = i + 1
            return items
        },
        save () {
            this.passwordChanged = false
            let data
            let encryptData = null
            if (this.data) {
                data = JSON.stringify(this.assignIds(this.data))
                encryptData = "\"" + this.encryptData(data) + "\""
                this.initData = data
            } else {
                this.initData = ""
            }
            let html = this.$options.appHtml.replace("\"_encryptData\"", encryptData)
            let blob = new Blob([html], {type:'text/plain'})
            let filename = "Vault.html"
            let link = document.createElement("a")
            link.download = filename
            window.URL = window.URL || window.webkitURL
            link.href = window.URL.createObjectURL(blob)
            link.onclick = () => {
                link.remove()
            }
            link.style.display = "none"
            document.body.appendChild(link)
            link.click()
        },
        encryptData (data) {
            let encrypt = CryptoJS.AES.encrypt(data, this.password)
            let el = document.createElement("p")
            document.body.appendChild(el)
            el.innerHTML = encrypt
            encrypt = el.innerHTML
            el.remove()
            encrypt = encrypt.replace(/"/g, "\"")
            encrypt = encrypt.replace(/'/g, "\'")
            return encrypt
        },
        resetVault () {
            this.encrypted = null
            this.data = null
            this.notify({
                icon: 'undo',
                text: 'Reset Vault'
            })
            this.$nextTick(() => this.save())
        },
        changePassword (password) {
            this.password = password
            this.passwordChanged = true
            this.$nextTick(() => this.encrypted = this.encryptData(JSON.stringify(this.data)))
            this.notify({
                icon: 'lock',
                text: 'Changed password'
            })
        },
        notify (notification) {
            this.notifications.push(notification)
        },
        beforeUnload (event) {
            if (this.changed) event.returnValue = ""
        }
    },
    appHtml: `<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="keywords" content="vault">
        <meta name="description" content="Local password manager web app.">
        <meta name="author" content="Samo Šlag">
        <title>Vault</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <link rel="stylesheet" type="text/css" href="src/css/main.css">
        <link rel="icon" href="src/img/favicon.ico" type="image/x-icon">
    </head>
    <body>
        <noscript>Vault requires JavaScript to function</noscript>
        <main id="app"></main>
        <script src="src/js/main.js"></script>
        <script>
            var encrypted = "_encryptData";
        </script>
    </body>
</html>`
})