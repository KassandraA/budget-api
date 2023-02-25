import { Response } from 'express';
import { ParamsDictionary, Send } from 'express-serve-static-core';

export interface TypedRequestBody<TBody> extends Express.Request {
  body: TBody;
}

export interface TypedRequestParams<TParam extends ParamsDictionary> extends Express.Request {
  params: TParam;
}

export interface TypedRequestQuery<TQuery> extends Express.Request {
  query: TQuery;
}

export interface TypedRequest<TParam extends ParamsDictionary, TBody> extends Express.Request {
  params: TParam;
  body: TBody;
}

export interface TypedResponse<TBody> extends Response {
  json: Send<{ data?: TBody; error?: string; message?: string; }, this>;
}