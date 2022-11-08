import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import ReportCollection from '../report/collection';
import * as freetValidator from '../freet/middleware';
import * as commentValidator from '../comment/middleware';
/**
 * Checks if user has reported the same parent already within 24 hours
 */
const didReportPreviously = async (req: Request, res: Response, next: NextFunction) => {
  const {parent} = req.body;
  const {userId: reporteeId} = req.session;

  const state = await ReportCollection.hasAlreadyReported(parent, reporteeId);
  if (state) {
    res.status(404).json({
      error: {
        message: 'You have already reported the same parent within 24 hours'
      }
    });
    return;
  }

  next();
};

const doesParentExist = async (req: Request, res: Response, next: NextFunction) => {
  const {parent, parentType} = req.body;
  
  if (parentType === 'Comment') {
    req.body.commentId = parent as string;
    return commentValidator.doesCommentExist(req, res, next);
  }

  if (parentType === 'Freet') {
    req.params.freetId = parent as string;
    return freetValidator.isFreetExists(req, res, next);
  }
};

export {
  didReportPreviously,
  doesParentExist
};
