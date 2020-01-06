import Vue from 'vue'
import App from './App.vue'

// Bootstrap
//import BootstrapVue from 'bootstrap-vue'
//Vue.use(BootstrapVue)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import './assets/whhg-font/css/whhg.css'

import  {
    BCard, BCardText, BForm, BFormGroup,
    BFormFile, BFormInput, BButtonGroup,
    BButton, BFormCheckbox, BTable,
    BPagination, BSpinner, VBTooltip
  } from 'bootstrap-vue'
Vue.component('b-card', BCard)
Vue.component('b-card-text', BCardText)
Vue.component('b-form', BForm)
Vue.component('b-form-group', BFormGroup)
Vue.component('b-form-file', BFormFile)
Vue.component('b-form-input', BFormInput)
Vue.component('b-button-group', BButtonGroup)
Vue.component('b-button', BButton)
Vue.component('b-form-checkbox', BFormCheckbox)
Vue.component('b-table', BTable)
Vue.component('b-pagination', BPagination)
Vue.component('b-spinner', BSpinner)
Vue.directive('v-b-tooltip', VBTooltip)

Vue.config.productionTip = false

import store from './store'

new Vue({
    render: h => h(App),
    store
}).$mount('#app')
