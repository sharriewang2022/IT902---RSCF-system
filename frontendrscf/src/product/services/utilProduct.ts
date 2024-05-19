export const getCurrentEpoch = () => {
  const secondsSinceEpoch = Math.round(Date.now() / 1000);
  return secondsSinceEpoch;
};

export const getCustomDateEpoch = (date: string) => {
  var customDate = new Date(date);
  return customDate.getTime();
};

// var dDate = new Date(1647860874*1000);
// console.log(dDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric',month:"long",day:"numeric", hour12: true }))
export const epochToDate = (epoc: number) => {
  var dDate = new Date(Math.round(Number(epoc * 1000)));
  const formatDateStyle =
    dDate.getUTCDate() +
    "-" +
    (dDate.getUTCMonth() + 1) +
    "-" +
    dDate.getUTCFullYear();
  return formatDateStyle.replaceAll("-", "/");
};

