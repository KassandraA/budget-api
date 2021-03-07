export class DateUtils {
  public static toSQLiteString(d: Date): string {
    return (
      [d.getFullYear(), this.getNumLeadingZero(d.getMonth() + 1), this.getNumLeadingZero(d.getDate())].join('-') +
      ' ' +
      [
        this.getNumLeadingZero(d.getHours()),
        this.getNumLeadingZero(d.getMinutes()),
        this.getNumLeadingZero(d.getSeconds()),
      ].join(':') +
      '.' +
      d.getMilliseconds()
    );
  }

  private static getNumLeadingZero(num: number): string {
    return ('00' + num).slice(-2);
  }
}
