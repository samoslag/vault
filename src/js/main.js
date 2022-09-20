const modules = [
    "vue",
    "crypto",
    "components/item",
    "components/input",
    "components/search",
    "components/button",
    "components/overlay",
    "components/popup",
    "components/itemPopup",
    "components/dropdown",
    "components/header",
    "components/notification",
    "components/notify",
    "components/icons",
    "components/passwordPopup",
    "components/errorPopup",
    "components/resetPopup",
    "views/vault",
    "views/login",
    "app",
]

for (const module of modules) {
    let script = document.createElement("script")
    script.src = "src/js/" + module + ".js"
    script.async = false
    document.body.append(script)
}