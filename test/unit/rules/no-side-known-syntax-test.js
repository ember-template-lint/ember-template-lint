import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-side-known-syntax',

  config: true,

  good: [
    '<a href="about:blank">hello</a>',
    '<MyComponent @age="42" />',
    `<MyComponent @age='42' />`,
    `<MyComponent @isEnabled="true" />`,
    `<MyComponent @isEnabled="false" />`,
  ],

  bad: [
    {
      template: '<h1>Hello, {name}</h1>',
      fixedTemplate: '<h1>Hello, {{name}}</h1>',
    },
    {
      template: '<h1>{name}, Hello!</h1>',
      fixedTemplate: '<h1>{{name}}, Hello!</h1>',
    },
    {
      template: '<h1>Hey, {name}, Hello!</h1>',
      fixedTemplate: '<h1>Hey, {{name}}, Hello!</h1>',
    },
    {
      template: '<h1>{capitalize(name)}</h1>',
      fixedTemplate: '<h1>{{capitalize name}}</h1>',
    },
    {
      template: '<h1>{capitalize(name, age)}</h1>',
      fixedTemplate: '<h1>{{capitalize name age}}</h1>',
    },
    {
      template: '<h1>a{capitalize(name,age)}</h1>',
      fixedTemplate: '<h1>a{{capitalize name age}}</h1>',
    },
    {
      template: '<h1>Hello, {formatName(user,name)}!</h1>',
      fixedTemplate: '<h1>Hello, {{formatName user name}}!</h1>',
    },
    {
      template: '<img src={user.avatarUrl} />',
      fixedTemplate: '<img src={{user.avatarUrl}} />',
    },
    {
      template:
        '<div v-for="feature in features" class="relative pl-9">woo {feature.name} sdf</div>',
      fixedTemplate:
        '{{#each this.features as |feature|}}\n<div class="relative pl-9">woo {{feature.name}} sdf</div>\n{{/each}}',
    },
    {
      template:
        '<li *[ngFor]="let user of users; index as i; first as isFirst">  {{i}}/{{users.length}}. {{user}}</li>',
      fixedTemplate:
        '{{#each this.users as |user|}}\n<li>  {{i}}/{{users.length}}. {{user}}</li>\n{{/each}}',
    },
    {
      template: '<h1 v-if="awesome" class="a">Vue is awesome!</h1>',
      fixedTemplate: '{{#if this.awesome}}\n<h1 class="a">Vue is awesome!</h1>\n{{/if}}',
    },
    {
      template: '<div *[ngIf]="condition">Content to render when condition is true.</div>',
      fixedTemplate:
        '{{#if this.condition}}\n<div>Content to render when condition is true.</div>\n{{/if}}',
    },
    {
      // eslint-disable-next-line no-template-curly-in-string
      template: '<h1>Hello ${this.name}!</h1>',
      fixedTemplate: '<h1>Hello {{this.name}}!</h1>',
    },
    {
      template:
        '<ng-template [ngIf]="condition"><div>Content to render when condition is true.</div></ng-template>',
      fixedTemplate:
        '{{#if this.condition}}\n<div>Content to render when condition is true.</div>\n{{/if}}',
    },
    {
      template: '<template v-if="ok"><h1>Title</h1></template>',
      fixedTemplate: '{{#if this.ok}}\n<h1>Title</h1>\n{{/if}}',
    },
    {
      template: '<BaseLayout><template v-slot:header>hello</template></BaseLayout>',
      fixedTemplate: '<BaseLayout><:header>hello</:header></BaseLayout>',
    },
    {
      template: '<BaseLayout><template #header>hello</template></BaseLayout>',
      fixedTemplate: '<BaseLayout><:header>hello</:header></BaseLayout>',
    },
    {
      template: '<div v-if="$slots.header" class="card-header"><slot name="header" /></div>',
      fixedTemplate:
        '{{#if (has-block "header")}}\n<div class="card-header">{{yield to="header"}}</div>\n{{/if}}',
    },
    {
      template: '<slot name="foo"></slot>',
      fixedTemplate: '{{yield to="foo"}}',
    },
    {
      template: '<slot :text="greetingMessage" :count="1"></slot>',
      fixedTemplate: '{{yield (hash text="greetingMessage" count="1")}}',
    },
    {
      template:
        '<MyComponent v-slot="slotProps">{{ slotProps.text }} {{ slotProps.count }}</MyComponent>',
      fixedTemplate:
        '<MyComponent as |slotProps|>{{ slotProps.text }} {{ slotProps.count }}</MyComponent>',
    },
    {
      template: '<BaseLayout><template #header="props">hello</template></BaseLayout>',
      fixedTemplate: '<BaseLayout><:header as |props|>hello</:header></BaseLayout>',
    },
    {
      template:
        '<a v-for="item in navigation" :key="item.name" :href="item.href" class="text-sm/6 font-semibold text-gray-900">{{ item.name }}</a>',
      fixedTemplate:
        '{{#each this.navigation as |item|}}\n<a href={{item.href}} class="text-sm/6 font-semibold text-gray-900">{{ item.name }}</a>\n{{/each}}',
    },
    {
      template: '<span x-show="open">Content...</span>',
      fixedTemplate: '{{#if this.open}}\n<span>Content...</span>\n{{/if}}',
    },
    {
      template: '<span x-if="open">Content...</span>',
      fixedTemplate: '{{#if this.open}}\n<span>Content...</span>\n{{/if}}',
    },
    {
      template: '<h2 x-text="post.title"></h2>',
      fixedTemplate: '<h2>{{post.title}}</h2>',
    },
    {
      template: '<template x-for="post in posts"><h2 x-text="post.title"></h2></template>',
      fixedTemplate: '{{#each this.posts as |post|}}\n<h2>{{post.title}}</h2>\n{{/each}}',
    },
    {
      template: '<MyComponent @isEnabled=true />',
      fixedTemplate: '<MyComponent @isEnabled={{true}} />',
    },
    {
      template: '<MyComponent @isEnabled=false />',
      fixedTemplate: '<MyComponent @isEnabled={{false}} />',
    },
    {
      template: '<MyComponent @age=42 />',
      fixedTemplate: '<MyComponent @age={{42}} />',
    },
    {
      template: '<UserAvatar [photo]="user.photo" />',
      fixedTemplate: '<UserAvatar @photo={{user.photo}} />',
    },
    {
      template: '<AppCounter [(count)]="initialCount"></AppCounter>',
      fixedTemplate: '<AppCounter @count={{initialCount}}></AppCounter>',
    },
    {
      template: '{this.formatName(this.name)}',
      fixedTemplate: '{{this.formatName this.name}}',
    },
    {
      template: '{this.formatName(this.name, "12", 42)}',
      fixedTemplate: '{{this.formatName this.name "12" 42}}',
    },
  ],
});
