{Bean, div, button, ul, li, h3, List} = coffeebeans

# Header component
Header = Bean ({title}) ->
  @preDestroy = -> console.log "Destroying Header"
  @postConstruct = -> console.log "Constructed Header"
  @onUpdate = (props) -> changeTitle(props)
  changeTitle = (title) => @_.textContent = title

  div
    class: "header"
    style:
        backgroundColor: "lightcoral"
    onclick: => changeTitle(Math.random() + "A"),
    title
  
# Content component
Content = Bean ({content}) ->
  @preDestroy = -> console.log "Destroying Content"
  
  div(
    content
  )

# App component
App = Bean () ->
  @preDestroy = -> console.log "Destroying App"
  changeContent = =>
    Content._.firstChild.remove() while Content._.firstChild
    Content._.append(
      div("Content updated! #{Math.random()}")
    )
    Header.update("New title is set from the outside")
  
  @postConstruct = -> @childBeans.push(Header, LiList, Content)
    
  div(
    Header = Header({ title: @props.title}),
    Content = Content({ content: @props.content}),
    button
      onclick: changeContent, 
      "Change content",
    h3 "List example",
    LiList = List({data:[1,2,4], parent: ul, child: Li}),
    button
      onclick: => LiList.remove()
      "Remove list",
    button
      onclick: => LiList.update([3,3,3,3,3,4,4,4,4,4])
      "Replace list",
    button
      onclick: => LiList.update(9, 2)
      "Update 3rd"
  )

Li = Bean () ->
  @preDestroy = -> console.log "Destroying Li(#{@props.value})"
  @onUpdate = (val) -> @_.textContent = val

  [li @props.value]
  
export {App}

