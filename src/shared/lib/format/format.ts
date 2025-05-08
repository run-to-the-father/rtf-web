/**
 * Unix timestamp를 'yyyy.MM.dd' 형식으로 변환합니다.
 * @param unixTimestamp - Unix timestamp (밀리초 단위)
 * @returns 'yyyy.MM.dd' 형식의 문자열
 */
export function formatUnixTimestamp(unixTimestamp: number): string {
  const date = new Date(unixTimestamp); // milliseconds로 변환

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}.${month}.${day}`;
}

/**
 * Unix timestamp를 '25.01.15 | PM 15:32' 형식으로 변환합니다.
 * @param unixTimestamp - Unix timestamp (ms 단위)
 * @returns '25.01.15 | PM 15:32' 형식의 문자열
 */
export function formatDetailedTimestamp(unixTimestamp: number): string {
  // 초 단위를 밀리초 단위로 변환
  const date = new Date(unixTimestamp);

  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12;

  return `${year}.${month}.${day} | ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
}

/**
 * Unix timestamp를 날짜('yyyy.MM.dd')와 시간(AM/PM) 형식으로 변환합니다.
 * @param unixTimestamp - Unix timestamp (밀리초 단위)
 * @returns {{ date: string, time: string }} 날짜와 시간이 포함된 객체
 *          - date: 'yyyy.MM.dd' 형식의 문자열
 *          - time: 'HH:MM AM/PM' 형식의 문자열
 */
export function formatUnixTimestampWithTime(unixTimestamp: number) {
  const date = new Date(unixTimestamp);
  const time = date.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const formattedDate = formatUnixTimestamp(unixTimestamp);

  return { date: formattedDate, time };
}

export function formatDateTimeWithAmPm(unixTimestamp: number) {
  const { date, time } = formatUnixTimestampWithTime(unixTimestamp);
  const splitTime = time.split(' ');
  const formattedDate = `${date} | ${splitTime[0]} ${splitTime[1]}`;

  return formattedDate;
}
