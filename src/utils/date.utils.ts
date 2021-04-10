export class DateUtils {
  public static toSQLiteString(d: Date): string {
    return (
      [
        d.getUTCFullYear(),
        this.getNumLeadingZero(d.getUTCMonth() + 1),
        this.getNumLeadingZero(d.getUTCDate()),
      ].join('-') +
      ' ' +
      [
        this.getNumLeadingZero(d.getUTCHours()),
        this.getNumLeadingZero(d.getUTCMinutes()),
        this.getNumLeadingZero(d.getUTCSeconds()),
      ].join(':') +
      '.' +
      this.getNumLeadingZero(d.getUTCMilliseconds(), '000')
    );
  }

  private static getNumLeadingZero(num: number, zeros: string = '00'): string {
    const sliced = Math.abs(zeros.length) * -1;
    return (zeros + num).slice(sliced);
  }
}
