import './assets/css/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import ToastService from 'primevue/toastservice'
import Toast from 'primevue/toast'
import Button from 'primevue/button'
import Select from 'primevue/select'
import Message from 'primevue/message'
import Card from 'primevue/card'
import ProgressSpinner from 'primevue/progressspinner'
import Panel from 'primevue/panel';
import ToggleSwitch from 'primevue/toggleswitch'
import Tag from 'primevue/tag'
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import Slider from 'primevue/slider'
import InputNumber from 'primevue/inputnumber'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import SelectButton from 'primevue/selectbutton'
import ColorPicker from 'primevue/colorpicker'
import Tooltip from 'primevue/tooltip'
import Fieldset from 'primevue/fieldset'
import { Form } from '@primevue/forms'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
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
app.component('Button', Button)
app.component('Select', Select)
app.component('Message', Message)
app.component('Form', Form)
app.component('Fieldset', Fieldset)
app.component('Card', Card)
app.component('Toast', Toast)
app.component('ProgressSpinner', ProgressSpinner)
app.component('Panel', Panel)
app.component('ToggleSwitch', ToggleSwitch)
app.component('Tag', Tag)
app.component('Splitter', Splitter)
app.component('SplitterPanel', SplitterPanel)
app.component('Tabs', Tabs)
app.component('TabList', TabList)
app.component('Tab', Tab)
app.component('TabPanels', TabPanels)
app.component('TabPanel', TabPanel)
app.component('Slider', Slider)
app.component('InputNumber', InputNumber)
app.component('Accordion', Accordion)
app.component('AccordionPanel', AccordionPanel)
app.component('AccordionHeader', AccordionHeader)
app.component('AccordionContent', AccordionContent)
app.component('SelectButton', SelectButton)
app.component('ColorPicker', ColorPicker)

app.mount('#app')