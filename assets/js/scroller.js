/**
 * scroller - handles the details
 * of figuring out which section
 * the user is currently scrolled
 * to.
 *
 */
function scroller() {
  var windowHeight;
  var container = d3.select('body');
  // event dispatcher
  console.log(container);
  var dispatch = d3.dispatch("active", "progress");

  // d3 selection of all the
  // text sections that will
  // be scrolled through
  var sections = null;

  // array that will hold the
  // y coordinate of each section
  // that is scrolled through
  var sectionPositions = [];
  var currentIndex = -1;
  // y coordinate of
  var containerStart = 0;
  var containerStartB = 0;
  var yyy;
  var conheight;
  /**
   * scroll - constructor function.
   * Sets up scroller to monitor
   * scrolling of els selection.
   *
   * @param els - d3 selection of
   *  elements that will be scrolled
   *  through by user.
   */
  function scroll(els) {
    sections = els;

    // when window is scrolled call
    // position. When it is resized
    // call resize.
    d3.select(window)
      .on("scroll.scroller", position)
      .on("resize.scroller", resize);

    // manually call resize
    // initially to setup
    // scroller.
    resize();

    // hack to get position
    // to be called once for
    // the scroll position on
    // load.
    d3.timer(function() {
      position();
   ///  timer.stop();
       return true;

    });
  }

  /**
   * resize - called initially and
   * also when page is resized.
   * Resets the sectionPositions
   *
   */
  function resize() {
    // sectionPositions will be each sections
    // starting position relative to the top
    // of the first section.
    sectionPositions = [];
    var startPos;
    sections.each(function(d,i) {
      var top = this.getBoundingClientRect().top;
      var conheight = this.getBoundingClientRect().height;
      
 
  console.log(top);
  console.log(conheight);

 

      if(i === 0) {
        startPos = top;
      }
      sectionPositions.push((top+conheight) - startPos);
    });
   containerStart = (container.node().getBoundingClientRect().top + container.node().getBoundingClientRect().height) + window.pageYOffset;  
    containerStartB = container.node().getBoundingClientRect().top + container.node().getBoundingClientRect().height;
 


  }

  /**
   * position - get current users position.
   * if user has scrolled to new section,
   * dispatch active event with new section
   * index.
   *
   */
  function position() {
  
 

    var pos = window.pageYOffset + 36 - containerStart;



    var sectionIndex = d3.bisect(sectionPositions, pos);
    sectionIndex = Math.min(sections.size() - 1, sectionIndex);

    if (currentIndex !== sectionIndex) {
      dispatch.active(sectionIndex);
      currentIndex = sectionIndex;
        console.log(pos);

    }

    var prevIndex = Math.max(sectionIndex - 1, 0);
    var prevTop = sectionPositions[prevIndex];
    var progress = (pos - prevTop) / (sectionPositions[sectionIndex] - prevTop);
    dispatch.progress(currentIndex, progress);

  }

  /**
   * container - get/set the parent element
   * of the sections. Useful for if the
   * scrolling doesn't start at the very top
   * of the page.
   *
   * @param value - the new container value
   */
  scroll.container = function(value) {
    if (arguments.length === 0) {
      return container;
              console.log(value);

    }
    container = value;
    return scroll;
                console.log(value);
};

  // allows us to bind to scroller events
  // which will interally be handled by
  // the dispatcher.
  d3.rebind(scroll, dispatch, "on");

  return scroll;
}
