function fromDateString(dateString) {
  const date = new Date(dateString);
  console.log(date, date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
  const utcDate = new Date(0)
  console.log(utcDate)
  utcDate.setUTCFullYear(date.getFullYear(), date.getMonth(), date.getDate())
  // When the time zone offset is absent, date-only forms are interpreted as a UTC time and
  // date-time forms are interpreted as local time.
  if (dateString.includes("T")) {
    utcDate.setUTCHours(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds())
  }
  console.log(utcDate)
  return utcDate
}

export class UTCDateMini extends Date {
  constructor() {
    super();

    this.setTime(
      arguments.length === 0
        ? // Enables Sinon's fake timers that override the constructor
          Date.now()
        : arguments.length === 1
        ? typeof arguments[0] === "string"
          // ? +new Date(arguments[0])
          ? +fromDateString(arguments[0])
          : arguments[0]
        : Date.UTC(...arguments)
    );
  }

  getTimezoneOffset() {
    return 0;
  }
}

// Replace getter and setter functions with UTC counterparts
const re = /^(get|set)(?!UTC)/;
Object.getOwnPropertyNames(Date.prototype).forEach((method) => {
  if (re.test(method)) {
    const utcMethod = Date.prototype[method.replace(re, "$1UTC")];
    if (utcMethod) UTCDateMini.prototype[method] = utcMethod;
  }
});
