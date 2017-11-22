## attribute-indentation

This rule requires the positional params, attributes and block params of the helper/component to be indented by moving them to multiple lines when the open invocation has more than 80 characters (configurable).

Forbidden:

Non-Block form
``` hbs

  {{employee-details firstName=firstName lastName=lastName age=age avatarUrl=avatarUrl}}
```

Block form
``` hbs

  {{#employee-details firstName=firstName lastName=lastName age=age avatarUrl=avatarUrl as |employee|}}
    {{employee.fullName}}
  {{/employee-details}}
```

Allowed:

Non-Block form
``` hbs

  {{employee-details
    firstName=firstName
    lastName=lastName
    age=age
    avatarUrl=avatarUrl
  }}
```

Non-Block Form (open invocation < 80 characters)
``` hbs

  {{employee-details firstName=firstName lastName=lastName}}
```

Block form
``` hbs

  {{#employee-details
    firstName=firstName
    lastName=lastName
    age=age
    avatarUrl=avatarUrl
  as |employee|}}
    {{employee.fullName}}
  {{/employee-details}}
```

Block Form (open invocation < 80 characters)
``` hbs

  {{#employee-details firstName=firstName lastName=lastName as |employee|}}
    {{employee.fullName}}
  {{/employee-details}}
```

The following values are valid configuration:

  * boolean - `true` - Enables the rule to be enforced when the opening invocation has more than 80 characters or when it spans multiple lines.
  * object - { 'open-invocation-max-len': n characters } - Maximum length of the opening invocation.
