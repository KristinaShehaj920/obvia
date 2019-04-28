var Parent = function(_props, overrided=false)
{
    Object.defineProperty(this, "children", 
    {
        get: function children() 
        {
            return _children;
        }
    });

    Object.defineProperty(this, "components", 
    {
        get: function components() 
        {
            return _components;
        }
    });

    this.removeChild = function(child)
    {
        if(child)
        {
            //TODO: kur fshijme child, beji resize siblings; kur fshijme row/col dhe jane 2 gjithsej hiq container prind 
            _components.splice(indexOfObject(_components, "props.id",  child.id), 1);
            delete _children[child.id];
            child.destruct();
        }
    }

    this.removeChildAtIndex = function(index)
    {
        if(index>0 && index < _components.length)
        {
            this.removeChild(_children[_components[index].props.id]);
        }
    }

    this.addComponent = function (component, cIndex)
    {
        _components.push(component);
        return this.addComponentInContainer(this.$container, component, cIndex);
    }

    this.addComponentInContainer = function (container, component, cIndex) 
    {
        if(container)
        {
            var cmp = Component.fromLiteral(component);
            cmp.on('creationComplete', function (e) {
                e.stopImmediatePropagation();
                e.stopPropagation();

                _ccComponents.push(component.props.id);
            
                if (_ccComponents.length == _self.components.length && !_creationFinished) {
                    _creationFinished = true;
                    _self.trigger('creationComplete');
                }

            }.bind(_self));
            var maxIndex = container.children().length;
            // _self.$container.children().eq(cIndex).after((cmp.render()));
            container.append(cmp.render());
            //expose component model
            component.props.id = cmp.id;
            _children[cmp.id] = cmp;

            cmp.parent = _self;
            cmp.parentType = _self.type;
            cmp.parentForm = _self;
            return cmp;
        }
    };

    this.afterAttach = function (e) 
    {
        if (e.target.id == this.domID) 
        {
            if (typeof _afterAttach == 'function')
                _afterAttach.apply(this, arguments);
            e.preventDefault();
        }
    };

    var _defaultParams = {
        components:[]
    };
    _props = extend(false, false, _defaultParams, _props);
    var _components = _props.components;
    var _ccComponents = [];
    this.$container = null;

    var _self = this;
    var _creationFinished = false;
    var _afterAttach = _props.afterAttach;
    _props.afterAttach = this.afterAttach;
    var _children = {};
   
    
    //override because creationComplete will be thrown when all children components are created
    // this.afterAttach = undefined;

    this.addComponents = function(components)
    {
        if(components && Array.isArray(components))
        {
            for(var i=0;i<components.length;i++)
            {
                this.addComponentInContainer(this.$container, components[i], i);
            }
        }
    }
    Component.call(this, _props);
    if(overrided)
    {
        this.keepBase();
    }
    
    var _enabled = _props.enabled;
    Object.defineProperty(this, "enabled", 
    {
        get: function enabled() 
        {
            return _enabled;
        },
        set: function enabled(v) 
        {
            if(_enabled != v)
            {
                _enabled = v;
                for(var childId in this.children)
                {
                    this.children[childId].enabled = v;
                }
            }
        },
        configurable: true
    });

    Object.defineProperty(this, "props", {
        get: function props() {
            var obj = {};
            for(var prop in _props)
            {
                if(typeof _props[prop] != 'function')
                {
                    switch(prop)
                    {
                        case "components":
                            var components = [];
                            for(var i=0;i<_components.length;i++)
                            {
                                var component = {};
                                component.constructor = _components[i].constructor;
                                component.props = _children[_components[i].props.id].props;
                                components.push(component);
                            }
                            obj[prop] = components;
                            break;
                        default:
                            if(this.hasOwnProperty(prop))
                                obj[prop] = this[prop];
                    }
                }
            }
            return obj;
        },
        configurable: true
    });  
}
Parent.prototype.type = 'Parent';