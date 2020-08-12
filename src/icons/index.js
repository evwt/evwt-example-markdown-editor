import Vue from 'vue';
import EvIcon from 'evwt/plugins/EvIcon';

let context = require.context('.', true, /\.svg$/);
EvIcon.build(Vue, context);
