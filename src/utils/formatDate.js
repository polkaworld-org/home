import dayjs from 'dayjs';

export default function formatDate(date, scheme = 'YYYY年MM月DD日 HH:mm') {
  return dayjs(date).format(scheme);
}
