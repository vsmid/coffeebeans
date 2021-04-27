import { ChildAppender } from "htmlhammer"

# Mixin defining Bean's lifecycle methods
# Used internally by the framework and not
# intended to be used by the developers
class Lifecycle
  # Define a set of action right after
  # Bean instance has been all setup
  postConstruct: ->
  # Define a set of actions to be excuted
  # right before html element is being
  # removed from the dom
  preDestroy: ->

# Core part used internally by the framework
# Not intended to be used by the developers
class Instance extends ChildAppender

  constructor: (props, @fn) ->
    super()
    # Reserved property which stores input properties
    # You can alway access(or store new properties)
    # input properties by using 
    # @.propertyName or @[propertyName] respectively
    # Properties are not dynamic, think of them as
    # init data
    # Props should always be given as a JSON object
    @props = {}
    @childBeans = []
    # Apply Lifecycle mixin
    Object.assign(@, Lifecycle)
    # Store input properties
    # If props is not an object, it is stored under
    # @props with name "value"
    if typeof props == "object"
    then Object.assign(@props, props) else @props["value"] = props
    # Create initial html element
    # _ is reserved property for direct access 
    # to the underlying html element
    # Shorthand for @element
    @_ = @fn(@props)
    @element = @_;
    # Handle element given as an array
    @_arrayToRoot()
    # If postConstruct is defined, call it after
    # everything on this Bean instance has been setup
    @postConstruct() if @postConstruct

  # Removes element from the dom
  # Bean elements should always be removed
  # using this method if there were any
  # kind of subscriptions or event listeners set
  remove: (preserveRoot = false) ->
    # If preDestroy is defined
    # call it before removing element
    # from the dom
    if @_
      @preDestroy() if @preDestroy
      @childBeans?.forEach((bean) ->
        if !Array.isArray(bean)
        then bean.remove() else b.remove() for b in bean
      )
      if !preserveRoot
        @_?.remove()
        Object.keys(@).forEach((key) =>
          delete @[key]
        )

  # Use to update this bean's html element
  # from the outside
  # For update to happen, bean needs to provide
  # onUpdate method
  update: (...props) -> @onUpdate(...props) if @onUpdate and @_

  # Convenient shorthand method
  # for querying this element's dom
  query: (selector, all = false) ->
    if all then @_.querySelectorAll(selector) else @_.querySelector(selector)

  # Used by htmlhammer internally
  # Do not use it unless you know what you
  # are doing
  append: (parent) ->
    parent.append(@_)

  # For templates returning an array only one child
  # is allowed per array
  # Used internally by the framework
  # Do not use it unless you know what you
  # are doing
  _arrayToRoot: () ->
    if Array.isArray(@_)
      if @_.length > 1
        console.error "Array can contain only one child element for now"
      else
        @_ = @_[0]

# Curry function used for defining beans
Bean = (fn) -> (props, parentBean) ->
  I = new Instance(props, fn)
  parentBean?.childBeans?.push I
  I

# Special Bean which helps when dealing with lists
# Parameters: {data, parent, child}
# For List to work properly, child element passed to function
# needs to have onUpdate method defined which means you should create
# Bean for it or you can override List's onUpdate method in postConstruct
# method of the Bean where List will be used.
List = Bean () ->
  @onUpdate = (newData, index, createOnIndexOutOfBound = false) ->
    if index?
      # Updates single item
      if index < @childBeans.length
      then @childBeans[index].update(newData) else
        if createOnIndexOutOfBound
          Parent.append @props.child(newData, @)._
        else
          console.error "No such element, index out of bound: #{index}"
    else
      # Recreates list from scratch
      child.remove() for child in @childBeans
      @childBeans.length = 0
      @props.child(o, @) for o in newData
      Parent.append(child._) for child in @childBeans

  [
    Parent = @props.parent(
      @props.data.map((o) =>
        @props.child(o, @)
      )
    )
  ]

export {
  Bean, List
}

# Provide htmlhammer library
export * from "htmlhammer";
