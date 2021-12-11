export class StringUtils {
  public static decodeBase64ToString(str: string): string {
    let buff = Buffer.from(str, 'base64');
    let res_utf8 = buff.toString('utf8');

    console.log('resutf8', res_utf8);

    return res_utf8;
  }
}