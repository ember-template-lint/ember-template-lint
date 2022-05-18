export const SomeComponent = <template>
  {{debugger}}
</template>

export const AnotherComponent = <template>
  {{debugger}}
</template>

<template>
  <SomeComponent>
    {{debugger}}
  </SomeComponent>
</template>

export default class Foo extends Service {
  indentedThing = hbs`
  Hahaha, this is just a plain string. Definitely not a template.
`;
