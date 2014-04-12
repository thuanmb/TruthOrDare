/**
 * Represent the AddItemScreen
 *
 */

function AddItemScreen () {
}

AddItemScreen.inheritsFrom(View);
AddItemScreen.ID = 'add-item-screen';
AddItemScreen.ADD_ITEM_CONTAINER_ID = 'add-item-container';
AddItemScreen.CURRENT_ITEM_CONTIANER_ID = 'current-item-list-container';
AddItemScreen.HTML = 	'<div  id="{0}" class="{1} full-screen element-screen">' +
							'<div class="{2}"></div>' +
							'<div class="{3}"></div>' +
						'</div>';


AddItemScreen.prototype.init = function (id) {
	id = AddItemScreen.ID + "-"  + id;
	AddItemScreen.prototype.super.init.call(this, id);
	var html = AddItemScreen.HTML.format(id, AddItemScreen.ID, 
		AddItemScreen.ADD_ITEM_CONTAINER_ID,
		AddItemScreen.CURRENT_ITEM_CONTIANER_ID);
	var jquery = $(html);
	this.setView(jquery);

	delete jquery;
	return this;
};

AddItemScreen.prototype.screenWillShow = function (view) {
	var editBoxContainer = view.find("." + AddItemScreen.ADD_ITEM_CONTAINER_ID);
	var itemListContainer = view.find("." + AddItemScreen.CURRENT_ITEM_CONTIANER_ID);

	editBoxContainer.empty();
	itemListContainer.empty();
};

AddItemScreen.prototype.onShow = function () {
	var editBoxContainer = this.getView().find("." + AddItemScreen.ADD_ITEM_CONTAINER_ID);
	var itemListContainer = this.getView().find("." + AddItemScreen.CURRENT_ITEM_CONTIANER_ID);

	editBoxContainer.empty();
	itemListContainer.empty();

	this._editBox = new EditBox().init(AddItemScreen.ID);
	editBoxContainer.append(this._editBox.getView());

	this._itemList = new ScrollableItemList().init(AddItemScreen.ID, this.onItemClick.bind(this), this.onDeleteItem.bind(this));
	itemListContainer.append(this._itemList.getView());

	this._itemId = 0;
};

AddItemScreen.prototype.showWithContent = function (options) {
	if (this._editBox == null || this._itemList == null) return;
	
	options = Util.getDefaultValue(options, {});
	var screenName = Util.getDefaultValue(options.screenName, "");
	var currentItems = Util.getDefaultValue(options.currentItems, []);
	var placeHolderTextField = Util.getDefaultValue(options.placeHolderTextField, "Input text here");

	this._editBox.showWithContent(placeHolderTextField, this.onAddItemCallback.bind(this),
		this.onSaveItemCallback.bind(this));

	this._itemList.setClass(screenName);

	$.each(currentItems, function(index, currentItem) {
		this.onAddItemCallback(currentItem);
	}.bind(this));
};

AddItemScreen.prototype.onAddItemCallback = function (content) {
	this._itemList.addItem(this._itemId++, content);
	this._itemList.makeScrollList();

	MainScreen.getInstance().storePlayers();
};

AddItemScreen.prototype.onItemClick = function (itemId) {
	// Show item in edit box
	this._editBox.showSaveButton();
	this._currentEditedItem = this._itemList.getItem(itemId);

	this._editBox.setText(this._currentEditedItem.value);
	this._editBox._isEditMode = true;
};

AddItemScreen.prototype.onSaveItemCallback = function (content) {
	if (this._currentEditedItem == null)  return;

	this._currentEditedItem.value = content;
	this._currentEditedItem.view.setContent(content);
	this._currentEditedItem = null;

	this._editBox.showAddButton();
	this._editBox._isEditMode = false;

	MainScreen.getInstance().storePlayers();
};

AddItemScreen.prototype.onDeleteItem = function () {
	MainScreen.getInstance().storePlayers();
};

AddItemScreen.prototype.getListItemValue = function () {
	return this._itemList.getListItemValue();
};


/**
 * Represent the EditBox
 *
 */
function EditBox () {
}

EditBox.inheritsFrom(View);
EditBox.PREFIX_ID = 'edit-box';
EditBox.TEXT_AREA_ID = 'edit-box-input';
EditBox.SET_BTN_ID = 'edit-box-set-btn';
EditBox.ADD_BTN_CLASS = 'add';
EditBox.SAVE_BTN_CLASS = 'save';
EditBox.HTML = 	'<div  id="{0}" class="full-screen fixed-screen">' +
					'<textarea class="{1} shadow" placeholder="" style="resize: none;"></textarea>' +
					'<div class="{2} shadow"></div>' +
				'</div>';


EditBox.prototype.init = function (postFixId) {
	var id = EditBox.PREFIX_ID + "-" + postFixId;
	EditBox.prototype.super.init.call(this, id);
	var html = EditBox.HTML.format(id, EditBox.TEXT_AREA_ID,
		EditBox.SET_BTN_ID);
	var jquery = $(html);
	this.setView(jquery);

	this._textArea = jquery.find("." + EditBox.TEXT_AREA_ID);
	this._setBtn = jquery.find("." + EditBox.SET_BTN_ID);
	Util.click(this._setBtn, this.onSetBtnClick.bind(this));

	this._isEditMode = false;
	this.showAddButton();
	
	delete jquery;
	return this;
};

EditBox.prototype.onSetBtnClick = function () {
	if (this._textArea.val() == "") return;

	if (!this._isEditMode) {
		Util.exec(this._onAddItemCallback, this._textArea.val());
	} else {
		Util.exec(this._onSaveItemCallback, this._textArea.val());	
	}

	this.setText("");
	this._textArea.focus();
};

EditBox.prototype.showWithContent = function (placeHolderTextField, onAddItemCallback, onSaveItemCallback) {
	this._onAddItemCallback = onAddItemCallback;
	this._onSaveItemCallback = onSaveItemCallback;
	this._textArea.attr("placeholder", placeHolderTextField);
	this._textArea.focus();
};

EditBox.prototype.showAddButton = function () {
	this._setBtn.removeClass(EditBox.SAVE_BTN_CLASS);
	this._setBtn.addClass(EditBox.ADD_BTN_CLASS);
};

EditBox.prototype.showSaveButton = function () {
	this._setBtn.removeClass(EditBox.ADD_BTN_CLASS);
	this._setBtn.addClass(EditBox.SAVE_BTN_CLASS);
};

EditBox.prototype.setText = function (text) {
	this._textArea.val(text);
	this._textArea.focus();
};


/**
 * Represent the ScrollableItemList
 *
 */
function ScrollableItemList () {
}

ScrollableItemList.inheritsFrom(View);
ScrollableItemList.PREFIX_ID = 'scrollable-item-list';
ScrollableItemList.ITEM_CONTAINER_ID = 'item-container';
ScrollableItemList.HTML = 	'<div  id="{0}">' +
								'<div  class="scroller">' +
									'<ul class="{1}"></ul>' +
								'</div>';
							'</div>';


ScrollableItemList.prototype.init = function (postFixId, itemClickCallback, deleteItemCallback) {
	var id = ScrollableItemList.PREFIX_ID + "-" + postFixId;
	ScrollableItemList.prototype.super.init.call(this, id);
	var html = ScrollableItemList.HTML.format(id, ScrollableItemList.ITEM_CONTAINER_ID);
	var jquery = $(html);
	this.setView(jquery);

	this._itemContainer = jquery.find("." + ScrollableItemList.ITEM_CONTAINER_ID);
	this._itemClickCallback = itemClickCallback;
	this._deleteItemCallback = deleteItemCallback;

	// Prevent touch move
	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

	// Clear the list
	this.clearList();

	delete jquery;
	return this;
};

ScrollableItemList.prototype.clearList = function () {
	this._itemList = [];

	this._itemContainer.empty();
};


ScrollableItemList.prototype.addItem = function (itemId, content, options) {
	// Add item
	options = Util.getDefaultValue(options, {});
	var item = new ScrollableItem().init(itemId, content, this._itemClickCallback, this, options);
	this._itemContainer.prepend(item.getView());

	// Animate to show item
	item.hide();
	item.getView().fadeIn(1000);

	// Add item to list
	this._itemList.unshift({id:itemId, value: content, view: item});

	return item;
};

ScrollableItemList.prototype.removeItem = function (itemId) {
	var item = null;
	for (var i = 0; i < this._itemList.length; i++) {
		item = this._itemList[i];
		if (item.id == itemId) {
			this._itemList.splice(i, 1);
			break;
		}
	}

	Util.exec(this._deleteItemCallback, itemId);
};

ScrollableItemList.prototype.getItem = function (itemId) {
	var item = null;
	for (var i = 0; i < this._itemList.length; i++) {
		item = this._itemList[i];
		if (item.id == itemId) {
			return item;
		}
	}
};

ScrollableItemList.prototype.getListItemValue = function () {
	var result = [];
	var item = null;
	for (var i = 0; i < this._itemList.length; i++) {
		item = this._itemList[i];
		result.push(item.value);
	}

	return result;
};

ScrollableItemList.prototype.makeScrollList = function () {
	this._scrollList = new IScroll(this.getView()[0], {
		scrollbars: false,
		mouseWheel: true,
		interactiveScrollbars: true,
		shrinkScrollbars: 'scale',
		fadeScrollbars: true
	});
};

ScrollableItemList.prototype.setClass = function (className) {
	this.getView().removeClass();
	this.getView().addClass(className);
};

/**
 * Represent the ScrollableItemList
 *
 */
function ScrollableItem () {
}

ScrollableItem.inheritsFrom(View);
ScrollableItem.PREFIX_ID = 'scrollable-item';
ScrollableItem.ITEM_MARK_ID = 'item-mark';
ScrollableItem.CONTENT_CONTAINER_ID = 'content-container';
ScrollableItem.HTML = 	'<li class="{0} shadow">' +
							'<div class="{1} shadow"></div>' +
							'<div class="{2}"></div>' +
							'<div class="overlap-container"></div>' +
						'</li>';


ScrollableItem.prototype.init = function (postFixId, content, itemClickCallback, parentList, options) {
	var id = ScrollableItem.PREFIX_ID + "-" + postFixId;
	ScrollableItem.prototype.super.init.call(this, id);
	this._itemId = postFixId;

	var customClassName = Util.getDefaultValue(options.customClassName, "");
	id = id + " " + customClassName;
	var html = ScrollableItem.HTML.format(id, ScrollableItem.ITEM_MARK_ID,
		ScrollableItem.CONTENT_CONTAINER_ID);
	var jquery = $(html);
	this.setView(jquery);

	var deleteBtn = jquery.find("." + ScrollableItem.ITEM_MARK_ID);
	this._contentContainer = jquery.find("." + ScrollableItem.CONTENT_CONTAINER_ID);
	
	Util.click(deleteBtn, function (e) {
		this.getView().fadeOut(500, function () {
			this.getView().remove();
			parentList.removeItem(this._itemId);
		}.bind(this));

		e.stopPropagation();
	}.bind(this));

	Util.click(jquery, function () {
		Util.exec(itemClickCallback, this._itemId);
	}.bind(this));

	this.setContent(content);

	delete jquery;
	return this;
};

ScrollableItem.prototype.setContent = function (content) {
	this._contentContainer.html(content);
};