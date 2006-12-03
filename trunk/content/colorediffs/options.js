function checkOptions()
{
  savePrefs();

  observerService.notifyObservers(null, "colored-diff-update", null);

  return true;
}


function updatePreview()
{
  for ( var i = 0; i < coloredElems.length; i++ ) {
    var element = coloredElems[i];
	var elem = document.getElementById(element);
	elem.style.color = getColor(element + "_fg");
	elem.style.backgroundColor = getColor(element + "_bg");
  }
}

function OnColorChange(element)
{
  var istext = (element.id.lastIndexOf("_fg")!=0);

  var colorObj = { NoDefault:false, Type:istext?"Text":"Page", TextColor:0, PageColor:0, Cancel:false };

  window.openDialog("chrome://editor/content/EdColorPicker.xul", "_blank", "chrome,close,titlebar,modal", "", colorObj);

  if (colorObj.Cancel) {
    return;
  }

  var color = (istext)?colorObj.TextColor:colorObj.BackgroundColor;

  setColor(element.id, color);

  updatePreview();
}


function setColor(elementId, color)
{
  var element = document.getElementById(elementId);
  var colorElement = element.getElementsByTagName("spacer")[0];
  if (colorElement && color)
  {
     colorElement.style.backgroundColor = color;
  }
}

function getColor(elementId)
{
  var element = document.getElementById(elementId);
  var colorElement = element.getElementsByTagName("spacer")[0];
  if (colorElement)
  {
     return colorElement.style.backgroundColor;
  }
}
