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
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tooltip from 'primevue/tooltip'
import Fieldset from 'primevue/fieldset'
import Dialog from 'primevue/dialog'
import Spinner from '@primeicons/vue/spinner'
import File from '@primeicons/vue/file'
import FilePlus from '@primeicons/vue/file-plus'
import FileEdit from '@primeicons/vue/file-edit'
import FileCheck from '@primeicons/vue/file-check'
import FileImport from '@primeicons/vue/file-import'
import Folder from '@primeicons/vue/folder'
import FolderOpen from '@primeicons/vue/folder-open'
import Database from '@primeicons/vue/database'
import Calendar from '@primeicons/vue/calendar'
import CalendarPlus from '@primeicons/vue/calendar-plus'
import EyeDropper from '@primeicons/vue/eye-dropper'
import Popover from 'primevue/popover'
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
import { Form } from '@primevue/forms'

import ProgressBar from 'primevue/progressbar'

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
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Dialog', Dialog)
app.component('Spinner', Spinner)
app.component('File', File)
app.component('FilePlus', FilePlus)
app.component('FileEdit', FileEdit)
app.component('FileCheck', FileCheck)
app.component('FileImport', FileImport)
app.component('Folder', Folder)
app.component('FolderOpen', FolderOpen)
app.component('Database', Database)
app.component('Calendar', Calendar)
app.component('CalendarPlus', CalendarPlus)
app.component('EyeDropper', EyeDropper)
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
app.component('Popover', Popover)
app.component('ProgressBar', ProgressBar)

app.mount('#app')