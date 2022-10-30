// @ts-nocheck
import type {HydratedDocument, Types} from 'mongoose';
import moment from 'moment';
import type {Comment, PopulatedComment} from '../comment/model';
import type {Freet} from '../freet/model';
import type {Version} from '../version/model';

// Update this if you add a property to the Freet type!
type CommentResponse = {
  _id: string;
  author: string;
  dateCreated: string;
  dateModified: string;
  parent: string;
  currentVersion: Version;
  previousVersions: string[];
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Freet object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Comment>} comment - A freet
 * @returns {CommentResponse} - The freet object formatted for the frontend
 */
const constructCommentResponse = (comment: HydratedDocument<Comment>): CommentResponse => {
  const commentCopy: PopulatedComment = {
    ...comment.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  return {
    ...commentCopy,
    _id: commentCopy._id.toString(),
    author: commentCopy.author.toString(),
    dateCreated: formatDate(comment.dateCreated),
    dateModified: formatDate(comment.dateModified),
    parent: commentCopy.parent.toString(),
  };
};

export {
  constructCommentResponse
};
