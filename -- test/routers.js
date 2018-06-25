import Vue from 'vue';
import Router from 'vue-router';
// import AuthClient from '@/core/auth-client';

// import UIButtons from '@/modules/ui-buttons/viewModel'
const home = () => import('./modules/home/homeViewModel');
// const ModuleVButton = () => import('./modules/module-v-button/viewModel');
// const ModuleVMenu = () => import('./modules/module-v-menu/viewModel');
// const ModuleVDialog = () => import('./modules/module-v-dialog/viewModel');
// const ModuleMessageBox = () => import('./modules/module-message-box/viewModel');
// const ModuleCombobox = () => import('@/modules/module-combobox/viewModel')
// const UserQuery = () => import('@/modules/user-query/appViewModel')

Vue.use(Router);

const router = new Router({
    routes: [
        {path: '/', name: 'home', component: home} // meta:{requiresAuth:true}},
        // {path: '/user-query', name: 'UserQuery', component: UserQuery, meta:{requiresAuth:true}},
        // {path: '/v-button', name: 'ModuleVButton', component: ModuleVButton}, //, meta:{requiresAuth:true}}
        // {path: '/v-menu', name: 'ModuleVMenu', component: ModuleVMenu},
        // {path: '/v-dialog', name: 'ModuleVDialog', component: ModuleVDialog},
        // {path: '/message-box', name: 'ModuleMessageBox', component: ModuleMessageBox}
        // {path: '/module-combobox', name: 'ModuleCombobox', component: ModuleCombobox, meta:{requiresAuth:true}}
    ]
});

// AuthClient.router(router);

export default router;
