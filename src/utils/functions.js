const formatDate = () => {
  const date = new Date();

  return {
    month: date.getMonth(),
    day: date.getDay(),
    date: date.getDate(),
    year: date.getFullYear(),
  };
};

const displayMonth = () => {
  let month = "";
  let date = formatDate();
  switch (date.month) {
    case 0:
      month = "Jan";
      break;
    case 1:
      month = "Feb";
      break;
    case 2:
      month = "Mar";
      break;
    case 3:
      month = "Apr";
      break;
    case 4:
      month = "May";
      break;
    case 5:
      month = "Jun";
      break;
    case 6:
      month = "Jul";
      break;
    case 7:
      month = "Aug";
      break;
    case 8:
      month = "Sep";
      break;
    case 9:
      month = "Oct";
      break;
    case 10:
      month = "Nov";
      break;
    case 11:
      month = "Dec";
      break;
    default:
      month = "nil";
      break;
  }

  return month;
};

const displayDay = () => {
  let day = formatDate();
  let dayOfTheWeek = "";
  switch (day.month) {
    case 0:
      dayOfTheWeek = "Sun";
      break;
    case 1:
      dayOfTheWeek = "Mon";
      break;
    case 2:
      dayOfTheWeek = "Tue";
      break;
    case 3:
      dayOfTheWeek = "Wed";
      break;
    case 4:
      dayOfTheWeek = "Thu";
      break;
    case 5:
      dayOfTheWeek = "Fri";
      break;
    case 6:
      dayOfTheWeek = "Sat";
      break;

    default:
      dayOfTheWeek = "nil";
      break;
  }

  return dayOfTheWeek;
};

export const displayDate = () => {
  let month = displayMonth();
  let dayOfTheWeek = displayDay();
  let day = formatDate().date;
  let year = formatDate().year;

  return `${dayOfTheWeek} ${month} ${day}, ${year}`;
};

export const selectInputMonths = [
  { month: "January", value: 0 },
  { month: "February", value: 1 },
  { month: "March", value: 2 },
  { month: "April", value: 3 },
  { month: "May", value: 4 },
  { month: "June", value: 5 },
  { month: "July", value: 6 },
  { month: "August", value: 7 },
  { month: "September", value: 8 },
  { month: "October", value: 9 },
  { month: "November", value: 10 },
  { month: "December", value: 11 },
];
