const renderItemList = (itemList) => {
  const container = document.getElementsByClassName('container')[0];
  let zIndexCounter = 0;

  clearChildElements(container);
  itemList.forEach((item) => {
    createBox(item, container, zIndexCounter);
    zIndexCounter--;
  })
}

const clearChildElements = (domElement) => {
  while(domElement.firstChild) {
    domElement.removeChild(domElement.lastChild);
  }
}

const createBox = ({number, key, margin: {top, left}}, container, zIndex) => {
  const box = document.createElement('div');
  box.innerText = number;
  box.setAttribute('class', 'box');
  box.setAttribute('data-key', key);
  appendChildStyle(box, `
    .box[data-key="${key}"] { 
      margin-top: ${top}px; 
      margin-left: ${left}px;
      z-index: ${zIndex};
    }`);
  container.appendChild(box);
}

const appendChildStyle = (createdElement, styleText) => {
  let css = document.createElement("style"),
    style = styleText;

  css.type = "text/css";

  if (css.styleSheet) {
    css.styleSheet.cssText = style;
  } else {
    css.appendChild(document.createTextNode(style));
  }

  createdElement.appendChild(css);
}

const updateBoxList = () => {

}

const updateBox = ({number, key, margin: {top, left}}) => {

}

export {
  renderItemList
};