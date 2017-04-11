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
            path: '<<name>>.txt',
            template: 'templates/component.js'
        }
    ]
}
