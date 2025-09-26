import moment from "moment";

export const getColorByDateDifference = (date: string, currentDate: string): any => {
  const target = moment(date);
  const current = moment(currentDate);

  const diff = target.diff(current, 'days');
  let data = {
   color: '',
   fontColor: ''
  }

  if (diff > 6) {
   data.color = 'green'
   data.fontColor = '#fff'
  } else if (diff >= 2 && diff <= 4) {
   data.color = 'yellow'
   data.fontColor = '#000'
  } else if (diff >= 0 && diff < 2) {
   data.color = 'red'
   data.fontColor = '#fff'
  } else {
   data.color = 'gray'
   data.fontColor = '#000'
  }

  return data;
};