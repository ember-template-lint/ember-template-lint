## no-childless-elements

Childless elements

Unexpected childless elements pollute DOM and may lead to rendering bug. This rule forbids childless elements. They have to contain at least one child. Children can be either element nodes or text.

This rule **forbids** the following:

```hbs
<h1></h1>
<h2></h2>
<h3></h3>
<h4></h4>
<h5></h5>
<h6></h6>
<p></p>
<span></span>
<a></a>
<ul></ul>
<ol></ol>
<li></li>
<div></div>
```

This rule **allows** the following:

```hbs
<h1>something</h1>
<h2>something</h2>
<h3>something</h3>
<h4>something</h4>
<h5>something</h5>
<h6>something</h6>
<p>something</p>
<span>something</span>
<a>something</a>
<ul>something</ul>
<ol>something</ol>
<li>something</li>
<div>something</div>
```

### Configuration

Boolean - `true` to enable / `false` to disable
