import './assets/css/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import ToastService from 'primevue/toastservice'

// Primevue Icons
import { 
    FileImport,
    File,
    Plus,
    Search,
    Folder,
    FolderOpen,
    Database,
    FilePlus,
    FileEdit,
    FileCheck,
    Spinner,
    SignIn,
    UserPlus,
    EyeDropper,
    Cog,
    Inbox,
    SignOut,
    Bars,
    User
} from '@primeicons/vue'

import InputColor from 'primevue/inputcolor'
import InputColorArea from 'primevue/inputcolorarea'
import InputColorAreaBackground from 'primevue/inputcolorareabackground'
import InputColorAreaHandle from 'primevue/inputcolorareahandle'
import InputColorSlider from 'primevue/inputcolorslider'
import InputColorSliderTrack from 'primevue/inputcolorslidertrack'
import InputColorSliderHandle from 'primevue/inputcolorsliderhandle'
import InputColorTransparencyGrid from 'primevue/inputcolortransparencygrid'
import InputColorSwatch from 'primevue/inputcolorswatch'
import InputColorSwatchBackground from 'primevue/inputcolorswatchbackground'
import InputColorEyeDropper from 'primevue/inputcoloreyedropper'
import InputColorInput from 'primevue/inputcolorinput'
import Label from 'primevue/label'
import Tooltip from 'primevue/tooltip'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)
app.use(pinia)

// Register PrimeVue and theme
app.use(PrimeVue, { 
    theme: { 
        preset: Aura,
        options: {
            darkModeSelector: '.p-dark',
        }
    },
})

app.use(ToastService)
app.use(router)

app.directive('tooltip', Tooltip)
app.component('InputColor', InputColor)
app.component('InputColorArea', InputColorArea)
app.component('InputColorAreaBackground', InputColorAreaBackground)
app.component('InputColorAreaHandle', InputColorAreaHandle)
app.component('InputColorSlider', InputColorSlider)
app.component('InputColorSliderTrack', InputColorSliderTrack)
app.component('InputColorSliderHandle', InputColorSliderHandle)
app.component('InputColorTransparencyGrid', InputColorTransparencyGrid)
app.component('InputColorSwatch', InputColorSwatch)
app.component('InputColorSwatchBackground', InputColorSwatchBackground)
app.component('InputColorEyeDropper', InputColorEyeDropper)
app.component('InputColorInput', InputColorInput)
app.component('Label', Label)

// Primevue Icons
app.component('FileImport', FileImport)
app.component('File', File)
app.component('Plus', Plus)
app.component('Search', Search)
app.component('Folder', Folder)
app.component('FolderOpen', FolderOpen)
app.component('Database', Database)
app.component('Spinner', Spinner)
app.component('FilePlus', FilePlus)
app.component('FileEdit', FileEdit)
app.component('FileCheck', FileCheck)
app.component('SignIn', SignIn)
app.component('UserPlus', UserPlus)
app.component('EyeDropper', EyeDropper)
app.component('Cog', Cog)
app.component('Inbox', Inbox)
app.component('SignOut', SignOut)
app.component('Bars', Bars),
app.component('User', User)




app.mount('#app')