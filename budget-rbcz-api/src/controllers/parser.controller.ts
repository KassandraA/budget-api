import { ParserService } from "../services/parser.service";
import { ParsedBankDataDto } from "../dto/parsed-bank-data.dto";
import { Request, Response } from "express";

export class ParserController {
  static async parse(req: Request, res: Response): Promise<Response<ParsedBankDataDto>> {
    try {
      const parsed = await ParserService.parse({
        base64BankData: req.body.base64BankData,
        format: req.body.format
      });
      return res.json(parsed);
    } catch (e) {
      const errorCode = e.statusCode ? e.statusCode : 500;
      return res.status(errorCode).json({ message: e.message });
    }
  }
}