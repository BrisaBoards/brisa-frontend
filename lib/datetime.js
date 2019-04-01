export default {
  parser_regex: /^(\d+[^ ]*),?(( *)(\d+[^ ]*)(( *)(am|pm))?)?$/i,
  parse: function(date_str) {
    let parsed = this.parser_regex.exec(date_str);
    if (parsed === null) return null;
    let date = this.ParseDate(parsed[1], new Date());
    let result = this.ParseTime(parsed[4], parsed[7], date);
    return result;
  },

  ParseTime: function(time_str, ampm, date) {
    if (date == null) return null;
    if ((time_str || '').toLowerCase().endsWith('pm')) ampm = 'pm';
    var times = (time_str || '').split(':').map((val) => {return Number.parseInt(val)});
    var h = times[0] || 0;
    var m = times[1] || 0;
    var s = times[2] || 0;
    if (ampm == 'PM' || ampm == 'pm') h += 12;
    date.setHours(h);
    date.setMinutes(m);
    date.setSeconds(s);
    return date;
  },

  ParseDate: function(date_str, date) {
    var dates = (date_str || '').split(/-|\//).map((val) => {return Number.parseInt(val)});
    if (dates.length == 1) {
      date.setDate(dates[0]);
    } else if (dates.length == 2) {
      date.setDate(dates[1]);
      date.setMonth(dates[0] - 1);
    } else if (dates.length == 3 && dates[2] > 31) {
      date.setYear(dates[2]);
      date.setDate(dates[1]);
      date.setMonth(dates[0] - 1);
    } else if (dates.length == 3) {
      date.setDate(dates[2]);
      date.setYear(dates[0]);
      date.setMonth(dates[1] -1);
    } else {
      return null;
    }
    return date;
  },
};
