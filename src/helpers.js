export default class {
    // https://phasergames.com/phaser-3-container-size-get-height-and-width/
    static getSize(con) {
        //set the top position to the bottom of the game
        var top = game.config.height;
        var bottom = 0;
        //set the left to the right of the game
        var left = game.config.width;
        var right = 0;
        //
        //
        //loop through the children
        //
        con.iterate(function(child) {
            //get the positions of the child
            var childX = child.x;
            var childY = child.y;
            //
            //
            //
            var childW = child.displayWidth;
            var childH = child.displayHeight;
            //
            //
            //calcuate the child position
            //based on the origin
            //
            //
            var childTop = childY - (childH * child.originY);
            var childBottom = childY + (childH * (1 - child.originY));
            var childLeft = childX - (childW * child.originX);
            var childRight = childX + (childW * (1 - child.originY));
            //test the positions against
            //top, bottom, left and right
            //
            if (childBottom > bottom) {
                bottom = childBottom;
            }
            if (childTop < top) {
                top = childTop;
            }
            if (childLeft < left) {
                left = childLeft;
            }
            if (childRight > right) {
                right = childRight;
            }
        }.bind(this));
        //
        //calculate the square
        var h = Math.abs(top - bottom);
        var w = Math.abs(right - left);
        //set the container size
        con.setSize(w, h);
    }
}