'use strict';

import template from './<<kebabCase name>>.html';

function <<capCase name>>Controller() {
    'ngInject';

    this.$onInit = () => {
    };
}

const <<camelCase name>>Component = {
    bindings: {
    },
    controller: <<capCase name>>Controller,
    template
};

angular.module('scifinder.<<camelCase name>>')
    .component('sf<<capCase name>>', <<camelCase name>>Component);

