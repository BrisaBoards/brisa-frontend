import Vue from 'vue';
import BrisaMain from './brisa-main.js';
import BrisaCard from './components/card.vue';
import BrisaEntryCard from './components/entry-card.vue';
import BrisaEntryCardHoriz from './components/entry-card-horiz.vue';
import BrisaBadgeList from './components/badge-list.vue';
import BrisaEntryPop from './components/entry-pop.vue';
import BrisaInlineEditor from './components/inline-editor.vue';
import BrisaModels from './components/models.vue';
import BrisaPopup from './components/popup.vue';
import BrisaSettings from './components/settings.vue';
import BrisaHeader from './components/header.vue';
import BrisaSheet from './components/sheet.vue';
import BrisaDashboard from './components/dashboard.vue';
import BrisaKanban from './components/kanban.vue';
import BrisaWhiteboard from './components/whiteboard.vue';
import Draggable from 'vuedraggable';

Vue.component('draggable', Draggable);
Vue.component('brisa-card', BrisaCard);
Vue.component('brisa-entry-card', BrisaEntryCard);
Vue.component('brisa-entry-card-horiz', BrisaEntryCardHoriz);
Vue.component('brisa-badge-list', BrisaBadgeList);
Vue.component('brisa-entry-pop', BrisaEntryPop);
Vue.component('brisa-inline-editor', BrisaInlineEditor);
Vue.component('brisa-models', BrisaModels);
Vue.component('brisa-popup', BrisaPopup);
Vue.component('brisa-settings', BrisaSettings);
Vue.component('brisa-header', BrisaHeader);
Vue.component('brisa-sheet', BrisaSheet);
Vue.component('brisa-dashboard', BrisaDashboard);
Vue.component('brisa-whiteboard', BrisaWhiteboard);
Vue.component('brisa-kanban', BrisaKanban);

BrisaAPI.api = process.env.USE_API;
console.log("Init - API", process.env.USE_API, BrisaAPI.api);
var Brisa = BrisaMain();
window.Brisa = Brisa;

