# coffeebeans - micro javascript library based on htmlhammer

#### Showcase

```coffeescript
# Header.coffee
Header = Bean () ->

  @postConstruct = => console.log "Constructed Header"

  div
    class: "header"
    style:
        backgroundColor: "lightcoral",
    @props.title


export {Header}
```

```html
<!-- index.html -->
<script type="module">
  import { Header } from "./Header.js";

  document.body.append(
    div(Header({ title: "coffeebeans" }))
  );
</script>
```
