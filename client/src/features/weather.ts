const getTw = (ta: number, rh: number) => {
  return (
    ta * Math.atan(0.151977 * Math.pow(rh + 8.313659, 0.5)) +
    Math.atan(ta + rh) -
    Math.atan(rh - 1.67633) +
    0.00391838 * Math.pow(rh, 1.5) * Math.atan(0.023101 * rh) -
    4.686035
  );
};

export const getAprTemp = (
  temp: number,
  windSpeed: number,
  humidity: number,
) => {
  let aprTemp = temp;
  const tw = getTw(temp, humidity);

  if (temp <= 10 && windSpeed >= 1.3) {
    //   풍속 체감온도 (겨울)
    aprTemp =
      13.12 +
      0.6215 * temp -
      11.37 * Math.pow(windSpeed, 0.16) +
      0.3965 * Math.pow(windSpeed, 0.16) * temp;
  } else if (temp >= 27) {
    //   습도 체감온도 (여름)
    aprTemp =
      -0.2442 +
      0.55399 * tw +
      0.45535 * temp -
      0.0022 * Math.pow(tw, 2.0) +
      0.00278 * tw * temp +
      3.0;
  }
  return Math.round(aprTemp * 10) / 10;
};
