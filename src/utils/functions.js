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
  switch (date.month) {
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
  return month;
};
