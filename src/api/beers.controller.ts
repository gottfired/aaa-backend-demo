import * as REST from "@aaa-backend-stack/rest";
import storage from "@aaa-backend-stack/storage";
import * as _ from "lodash";
import { IData } from "../models/AppUserProfile";

@REST.controller("/app/v1")
class Beers extends REST.SERVER.MethodController {

    @REST.get("/beers-info")
    @REST.documentation({
        description: "Gets global saved beer information from all appUserProfiles",
        notes: `Returns { globalLikes: { [id: string]: number }, globalComments: { [id: string]: { user: string, comment: string }[] } }`
    })
    @REST.noAuth
    @REST.response({
        schema: REST.JOI.object().keys({
            globalLikes: REST.JOI.object().unknown().required(),
            globalComments: REST.JOI.object().unknown().required()
        }).required()
    })
    @REST.autoReply
    async handler(request: REST.HAPI.Request) {

        const appUserProfiles = await storage.models.AppUserProfile.findAll({
            where: {
                data: {
                    $ne: null
                }
            },
            include: [{
                model: storage.models.User,
                required: true,
                where: {
                    isActive: true
                }
            }]
        });

        // reduce the data.likedBeerIds <array: numbers>
        type GlobalLikes = { [id: string]: number };
        const globalLikes: GlobalLikes = _.reduce(appUserProfiles, (sum: GlobalLikes, appUserProfile) => {
            const data: IData = appUserProfile.data;

            if (_.isArray(data.likedBeerIds)
                && data.likedBeerIds.length > 0
            ) {
                _.each(data.likedBeerIds, (likedBeer) => {
                    sum[likedBeer] = sum[likedBeer] ? sum[likedBeer] + 1 : 1;
                });
            }

            return sum;
        }, {});

        // reduce the data.commentsMap<[name]: string>
        type GlobalComments = {
            [id: string]: {
                user: string;
                comment: string;
            }[];
        };

        const globalComments: GlobalComments = _.reduce(appUserProfiles, (sum: GlobalComments, appUserProfile) => {

            const data: IData = appUserProfile.data;

            if (_.isPlainObject(data.commentsMap)) {
                _.each(_.keys(data.commentsMap), (key) => {
                    if (sum[key]) {
                        sum[key].push({
                            user: appUserProfile.UserUid,
                            comment: data.commentsMap[key]
                        });
                    } else {
                        sum[key] = [{
                            user: appUserProfile.UserUid,
                            comment: data.commentsMap[key]
                        }];
                    }
                });
            }

            return sum;

        }, {});

        return {
            globalLikes,
            globalComments
        };
    }

}

export default new Beers();
