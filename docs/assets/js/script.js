$(function () {
  // Define variables, allow for changing of work hours
  // Possible feature to add allow user input on page for work hours.
  var now = dayjs();
  var startHour = 9;
  var endHour = 17;

  // Set header date to current date.
  var headerDate = document.getElementById("currentDay")
  headerDate.textContent = now.format("MMMM D YYYY")

  // Define main container that all elements will be created in.
  var fluidContainer = document.querySelector(".container-fluid");

  // Create Hourly Elements from startHour to endHour
  for (let hourIndex = startHour; hourIndex <= endHour; hourIndex++) {
    var amPM = hourIndex >= 12 ? 'PM' : 'AM';
    var hourFormatted = (hourIndex % 12) || 12;

    // Main Hour DIV container
    var hourDiv = document.createElement("div");
    hourDiv.setAttribute("id", "hour-" + hourIndex );
    hourDiv.setAttribute("class", "row time-block " + getPastPresentFuture(hourIndex));
    fluidContainer.appendChild(hourDiv);

    // Child DIV that has time/hour inside
    var timeDiv = document.createElement("div");
    timeDiv.setAttribute("class", "col-2 col-md-1 hour text-center py-3");
    timeDiv.textContent = hourFormatted+amPM;
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

  // Is the hour past, present or future.
  function getPastPresentFuture(currentIndex){
    let currentHour = now.format("H");
    if(currentIndex === currentHour){
      return "present";
    } else if (currentIndex < currentHour){
      return "past";
    } else {
      return "future";
    }
  }
});
