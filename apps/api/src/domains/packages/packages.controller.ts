import { Request, Response, NextFunction } from 'express';
import { PackagesService } from './packages.service';
import { success } from '../../shared/utils/response';

export class PackagesController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try { res.json(await PackagesService.list(req.user!, req)); }
    catch (err) { next(err); }
  }

  static async getByWaybill(req: Request, res: Response, next: NextFunction) {
    try { res.json(success(await PackagesService.getByWaybill(req.params.waybill, req.user!))); }
    catch (err) { next(err); }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try { res.status(201).json(success(await PackagesService.create(req.body, req.user!))); }
    catch (err) { next(err); }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try { res.json(success(await PackagesService.updateStatus(req.params.waybill, req.body, req.user!))); }
    catch (err) { next(err); }
  }

  static async assign(req: Request, res: Response, next: NextFunction) {
    try { res.json(success(await PackagesService.assign(req.params.waybill, req.body.courierId, req.user!))); }
    catch (err) { next(err); }
  }

  static async scan(req: Request, res: Response, next: NextFunction) {
    try { res.json(success(await PackagesService.scan(req.body, req.user!))); }
    catch (err) { next(err); }
  }

  static async track(req: Request, res: Response, next: NextFunction) {
    try { res.json(success(await PackagesService.track(req.params.waybill, req.query.phone as string))); }
    catch (err) { next(err); }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await PackagesService.delete(req.params.waybill);
      res.json(success({ message: 'Package deleted' }));
    } catch (err) { next(err); }
  }
}
