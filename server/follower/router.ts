// @ts-nocheck
import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FollowerCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as followerValidator from './middleware';
import * as util from './util';
import UserCollection from '../user/collection';

const router = express.Router();

/**
 * Get stats for a particular user
 *
 * @name GET /api/followers/stats?username=
 *
 * @return {FollowerResponse[]} - A list of all the followers for a given users
 */

 router.get(
  '/stats',
  async (req: Request, res: Response) => {
    const {username} = req.query;
    const followers = await FollowerCollection.getFollowStats(username as string);
    res.status(200).json(followers);
  }
);

/**
 * Checks if current user follows another
 *
 * @name GET /api/followers/doesFollow?followee=&follower
 *
 * @return {FollowerResponse[]} - A list of all the followers for a given users
 */

 router.get(
  '/doesFollow',
  async (req: Request, res: Response) => {
    const {followee, follower} = req.query;
    const follower_id = (await UserCollection.findOneByUsername(follower as string))._id
    const followee_id = (await UserCollection.findOneByUsername(followee as string))._id
    const follow = await FollowerCollection.doesFollow(follower_id, followee_id);
    res.status(200).json({doesFollow: follow});
  }
);

/**
 * Get all of the followers of a given user
 *
 * @name GET /api/followers/:userId
 *
 * @return {FollowerResponse[]} - A list of all the followers for a given users
 */

router.get(
  '/:userId',
  async (req: Request, res: Response) => {
    const {userId} = req.params;
    const followers = await FollowerCollection.getAllFollowers(userId);
    const response = followers.map(item => item.follower);
    res.status(200).json(response);
  }
);

/**
 * Follow a new user.
 *
 * @name POST /api/followers/:followerId/:followeeId
 * @return {FollowerResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {404} - If one of the two users could not be found
 * @throws {409} - If user is already following the followee
 */
router.post(
  '/:followeeId',
  [
    userValidator.isUserLoggedIn,
    userValidator.isCurrentSessionUserExists,
    userValidator.doUsersExist(['followeeId'], 'params'),
    followerValidator.doesFollowAlreadyExist
  ],
  async (req: Request, res: Response) => {
    let {followeeId} = req.params;
    const {userId: followerId} = req.session;
    followeeId = req.params.mapping[followeeId as string]
    const followerObj = await FollowerCollection.addOne(followerId, followeeId);

    res.status(201).json({
      message: 'Your follow request was successfull.',
      follower: followerObj
    });
  }
);

/**
 * Unfollow a user
 *
 * @name DELETE /api/follower/:followeeId
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the one of the users does not exist
 */
router.delete(
  '/:followeeId',
  [
    userValidator.isUserLoggedIn,
    userValidator.isCurrentSessionUserExists,
    userValidator.doUsersExist(['followeeId'], 'params')
  ],
  async (req: Request, res: Response) => {
    let {followeeId} = req.params;
    const {userId: followerId} = req.session;
    followeeId = req.params.mapping[followeeId as string]
    await FollowerCollection.unfollow(followerId, followeeId);
    res.status(200).json({
      message: 'Your unfollow request was successfull.'
    });
  }
);

export {router as followerRouter};
