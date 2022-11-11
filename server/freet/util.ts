import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Freet, PopulatedFreet} from '../freet/model';
import type {Version} from '../version/model';
import type { User } from '../user/model';

// Update this if you add a property to the Freet type!
type FreetResponse = {
  _id: string;
  author: {
    username: String,
    _id: String,
  };
  dateCreated: string;
  dateModified: string;
  content: string;
  previousVersions: string[];
  visible: boolean;
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
 * @param {HydratedDocument<Freet>} freet - A freet
 * @returns {FreetResponse} - The freet object formatted for the frontend
 */
const constructFreetResponse = (freet: HydratedDocument<Freet>): FreetResponse => {
  const freetCopy: PopulatedFreet = {
    ...freet.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  return {
    ...freetCopy,
    _id: freetCopy._id.toString(),
    dateCreated: freet.dateCreated.toString(),
    dateModified: freet.dateModified.toString(),
    content: freetCopy.currentVersion.content,
    author: {
      username: freetCopy.author.username,
      _id: freetCopy.author._id.toString(),
    },
    previousVersions: freetCopy.previousVersions.map(v => v.toString())
  };
};

export {
  constructFreetResponse
};
