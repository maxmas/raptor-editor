var clickButtonToEditButton = null,
    clickButtonToEditInstance = null,
    clickButtonToEditHover = false;

function ClickButtonToEditPlugin(name, overrides) {
    RaptorPlugin.call(this, name || 'clickButtonToEdit', overrides);
}

ClickButtonToEditPlugin.prototype = Object.create(RaptorPlugin.prototype);

ClickButtonToEditPlugin.prototype.init = function(raptor) {
    this.raptor = raptor;
    this.raptor.getElement()
        .mouseenter(this.show.bind(this))
        .mouseleave(this.hide.bind(this));
};

ClickButtonToEditPlugin.prototype.show = function() {
    if (this.raptor.isEditing()) {
        return;
    }
    this.raptor.getElement()
        .addClass(this.options.baseClass + '-hover');

    var button = this.getButton(this),
        visibleRect = elementVisibleRect(this.raptor.getElement());
    button.show().css({
        position: 'absolute',
        // Calculate offset center for the button
        top:  visibleRect.top  + ((visibleRect.height / 2) - (button.outerHeight() / 2)),
        left: visibleRect.left + ((visibleRect.width / 2)  - (button.outerWidth()  / 2))
    });
};

ClickButtonToEditPlugin.prototype.hide = function(event) {
    var button = this.getButton(this);
    if (!button.is(':hover')) {
        button.hide();
    }
};

ClickButtonToEditPlugin.prototype.edit = function() {
    this.raptor.enableEditing();
    this.raptor.showLayout();
    this.getButton(this).hide();
};

/**
 * Selects or creates the button and returns it.
 *
 * @return {jQuery} The "click to edit" button.
 */
ClickButtonToEditPlugin.prototype.getButton = function(instance) {
    clickButtonToEditInstance = instance;
    if (!clickButtonToEditButton) {
        clickButtonToEditButton = $(this.editor.getTemplate('click-button-to-edit.button', this.options))
            .click(function() {
                clickButtonToEditInstance.edit();
            })
            .appendTo('body');
        aButton(clickButtonToEditButton, {
            icons: {
                primary: 'ui-icon-pencil'
            }
        });
    }
    return clickButtonToEditButton;

};

Raptor.registerPlugin(new ClickButtonToEditPlugin());
