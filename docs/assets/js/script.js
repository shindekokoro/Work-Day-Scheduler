$(function () {
  // Define variables, allow for changing of work hours
  var now = dayjs();
  var defaultStart = 9;
  var defaultEnd = 17;
  var startHour = localStorage.startHour ? parseInt(localStorage.startHour) : defaultStart;
  var endHour = localStorage.endHour ? parseInt(localStorage.endHour) : defaultEnd;

  // Set placeholder text for hour inputs so user is aware.
  var startHourInput = document.getElementById("startHour");
  var endHourInput = document.getElementById("endHour");

  // Let user control more elements of calendar.
  var calendarDetails =  document.getElementById("calendarDetails");
  var submitStart = document.getElementById("submitStart");
  var submitEnd = document.getElementById("submitEnd");
  var clearButton = document.getElementById("clearButton");
  submitStart.addEventListener("click", submitInput);
  submitEnd.addEventListener("click", submitInput);


  function submitInput(event) {
    event.preventDefault();
    var userTime = parseInt($(this).prev().val());
    // Do nothing if no input received
    if(userTime === ""){
      return;
    }

    switch ($(this).prev().attr("id")) {
      case "startHour":
        startHour = userTime;
        localStorage.startHour = startHour;
        break;
      case "endHour":
        endHour = userTime;
        // Add 12 hours to end hour incase user put in 5AM instead of 5PM
        if(endHour < 12){ endHour = endHour + 12; }
        localStorage.endHour = endHour;
      break;
      default:
        console.error("Problem with submit input.");
        break;
    }
    $(this).prev().val("");
    renderCalendar();
  }

  clearButton.addEventListener("click", clearCalendarStorage);
  // Clear local storage, and re-render calendar for display.
  function clearCalendarStorage() {
    localStorage.clear();
    clearCalendar();

    // Reset Hours to default
    startHour = defaultStart;
    endHour = defaultEnd;

    renderCalendar();

  }

  function clearCalendar() {
    // Remove any current child nodes from calendar in event of re-render
    // Also guarantees a fresh load
    while(fluidContainer.hasChildNodes()){
      fluidContainer.removeChild(fluidContainer.firstChild);
    }
  }
  

  // Set header date to current date.
  var headerDate = document.getElementById("currentDay");
  headerDate.textContent = now.format("MMMM D YYYY");

  // Define main container that all elements will be created in.
  var fluidContainer = document.querySelector(".container-fluid");

  // Initial Call of renderCalendar function to display elements on page.
  renderCalendar();

  // Create Hourly Elements from startHour to endHour
  function renderCalendar() {
    clearCalendar();

    startHourInput.setAttribute("placeholder", formatHour(startHour));
    endHourInput.setAttribute("placeholder", formatHour(endHour));

    for (let hourIndex = startHour; hourIndex <= endHour; hourIndex++) {
      // Main Hour DIV container
      var hourDiv = document.createElement("div");
      hourDiv.setAttribute("id", "hour-" + hourIndex );
      hourDiv.setAttribute("class", "row time-block " + getPastPresentFuture(hourIndex));
      fluidContainer.appendChild(hourDiv);
  
      // Child DIV that has time/hour inside
      var timeDiv = document.createElement("div");
      timeDiv.setAttribute("class", "col-2 col-md-1 hour text-center py-3");
      timeDiv.textContent = formatHour(hourIndex);
      hourDiv.appendChild(timeDiv);
  
      // User-Editable text area
      var textArea = document.createElement("textarea");
      textArea.setAttribute("class", "col-8 col-md-10 description");
      textArea.setAttribute("rows", "3");
      textArea.textContent = localStorage.getItem("hour-"+hourIndex) ? localStorage.getItem("hour-"+hourIndex) : "";
      hourDiv.appendChild(textArea)
  
      // Button for saving info from text area above ^
      var saveButton = document.createElement("button");
      saveButton.setAttribute("class", "btn saveBtn col-2 col-md-1");
      saveButton.setAttribute("aria-label", "save");
      hourDiv.appendChild(saveButton);
  
      // Hidden Tag
      var iTag = document.createElement("i");
      iTag.setAttribute("class", "fas fa-save");
      iTag.setAttribute("aria-hidden", "true")
      saveButton.appendChild(iTag);
    }
  }

  // Look for all buttons on the page and create event listeners for them.
  let buttons = document.querySelectorAll("button");
  buttons.forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();
      var hourIndex = $(button).parent().attr("id");
      var hourInput = $(button).prev().val();
      localStorage.setItem(hourIndex, hourInput);
    })
  });

  function formatHour(hour) {
    var amPM = hour >= 12 && hour != 24 ? 'PM' : 'AM';
    var hourFormatted = (hour % 12) || 12;
    return hourFormatted+amPM;
  }

  // Is the hour past, present or future.
  function getPastPresentFuture(currentIndex){
    let currentHour = parseInt(now.format("H"));
    if(currentIndex === currentHour){
      return "present";
    } else if (currentIndex < currentHour){
      return "past";
    } else {
      return "future";
    }
  }
});
