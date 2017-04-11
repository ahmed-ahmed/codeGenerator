# Code Generator

### create template as follow 

```js
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
```

### create generator file as follow 
```js
exports.generator = {
    description: 'This is a component generator',
    prompts: [
        {
            name: 'name'
        }
    ],
    actions: [
        {
            type: 'add',
            path: '<<kebabCase name>>.txt',
            template: 'templates/component.js'
        }
    ]
}
```


run 
```sh
node index.js
```
