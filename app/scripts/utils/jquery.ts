interface JQuery {
    tagName(): String;
    cloneCanvas(): HTMLCanvasElement;
}

jQuery.fn.tagName = function() {
    return this.prop("tagName");
}

jQuery.fn.cloneCanvas = function() {
    var oldCanvas = this[0];

    //create a new canvas
    var newCanvas = document.createElement('canvas');
    var context = newCanvas.getContext('2d');
    var imageData = context.getImageData(0, 0, oldCanvas.width, oldCanvas.height);

    //set dimensions
    newCanvas.width = oldCanvas.width;
    newCanvas.height = oldCanvas.height;
    
    newCanvas.id = oldCanvas.id;
    newCanvas.className = oldCanvas.className;

    context.clearRect(0, 0, oldCanvas.width, oldCanvas.height);
    context.putImageData(imageData, 0, 0);

    //apply the old canvas to the new one
    context.drawImage(oldCanvas, 0, 0, oldCanvas.width, oldCanvas.height);

    console.log(newCanvas, oldCanvas);
    //return the new canvas
    return newCanvas;
}