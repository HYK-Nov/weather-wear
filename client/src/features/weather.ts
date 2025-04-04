/*const getTw = (ta: number, rh: number) => {
  return (
    ta * Math.atan(0.151977 * Math.pow(rh + 8.313659, 0.5)) +
    Math.atan(ta + rh) -
    Math.atan(rh - 1.67633) +
    0.00391838 * Math.pow(rh, 1.5) * Math.atan(0.023101 * rh) -
    4.686035
  );
};*/

export const getAprTemp = (
  temp: number,
  windSpeed: number,
  humidity: number,
) => {
  let aprTemp = temp;
  // const tw = getTw(temp, humidity);

  if (windSpeed >= 1.3) {
    //   풍속 체감온도
    aprTemp = +(
      13.12 +
      0.6215 * temp -
      11.37 * Math.pow(windSpeed, 0.16) +
      0.3965 * temp * Math.pow(windSpeed, 0.16)
    ).toFixed(1);
  } else if (temp >= 27) {
    //   습도 체감온도
    aprTemp = +(
      -8.784 +
      1.611 * temp +
      2.338 * humidity -
      0.146 * temp * humidity -
      0.0123 * temp ** 2 -
      0.0164 * humidity ** 2 +
      0.0022 * temp ** 2 * humidity +
      0.0007 * temp * humidity ** 2 -
      0.0003 * temp ** 2 * humidity ** 2
    ).toFixed(1);
  }
  return aprTemp;
};
