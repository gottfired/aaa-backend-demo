import * as serverdate from "@aaa-backend-stack/serverdate";
import { IMigration } from "@aaa-backend-stack/storage";

export const UIDS = {
    USER_ROOT: "9f8ad217-67f5-488b-a98b-747ce10a8f65", // CAB_USER_ROOT_UID
    PERMISSION_ROOT: "3f09660a-19c2-4903-9c43-f5331ba06b48", // CAB_PERMISSION_ROOT_UID
    PERMISSION_CMS: "f4748c81-108a-481f-b504-e0b3d57cfa3c" // CAB_PERMISSION_CMS_UID
};

// tslint:disable-next-line:no-object-literal-type-assertion
module.exports = <IMigration>{
    UIDS,
    up: async function (queryInterface, SEQUELIZE) {
        const now = serverdate.getMoment().toDate();

        await queryInterface.bulkInsert("Permissions", [{
            uid: UIDS.PERMISSION_CMS,
            scope: "cms", // this is the base required scope for being able to authenticate as administrator to the cms
            createdAt: now,
            updatedAt: now
        }, {
            uid: UIDS.PERMISSION_ROOT,
            scope: "root", // root = superuser scope (documentation / devtool, should be non removeable through devtools)
            createdAt: now,
            updatedAt: now
        }], {});

        await queryInterface.bulkInsert("Users", [{
            uid: UIDS.USER_ROOT,
            username: "admin",
            // CAB_ROOT_ADMIN_PASSWORD_PLAIN: VJ0r2ezBwf
            // tslint:disable-next-line:max-line-length
            password: "783fcb233a9f4119e6e1c99309f7705203376950c0827fe4a2fca9981407d48e8c0a92684fcd9572bfe6fa826915c717f701d817e0635c46aa43fe14748e7a588b6f2448fd8ca64a707757a7d2f19b9c75b2edbb82029a3036154965fbabecb35e1bd03b4c443a4254fb1de07e82b4c1078f1e597772a15e872236055bbf55c0d366a3616e1acdaa732dbffb87d8d977dd3f636cdb0ef8240663e8b1719f817ed0a2ed4a24fd7df55f1ac1a4bcadcb196d82c7d1be1af06b83346cc5a9b305617d44f02e7273ba9a96390ff5d4b790f8e14340122e7785413637458a7ffb19f32cc178e9cfc4ed2473f9077adfb1c266a4508c075ab1835c37bd514f62f235fa968ad25b6661c2c477161b9e918dc2715477b02ad746c0eff9199b3cf90d1602de66fb60281df65b306f457d6132c8bfbd60e3299ef440ec2efb40928bea3816cf9f817be2c25eaf2a0a64cd4d074776d6f2a4344288d4f527b591395ee4fa7fae5b0843e3ca377cc07b280929ae1c98274b81034c1218cfb3a69112cf10d13c1be8538f89bc31d7182b13c51472839e67e14fe87041db5b8e75534b2bb4e613c21d8ddbd6dea9de167f2b9d3d793e78e9dd39b4adaac86b49df43e2005e778c536551958a742220c5cbbaef780c0c691c4fa3465d97d4151acb4807aaf4e68403c1dfc2430811fbe6004ab50324361e157bd54eb748929bb5999114a7f08baa",
            salt: "96c2055ea85e83d4eb57ae7c3c8f827ac2e9e53eaadb7b5c887b27d8a5f9b1da476e0bbdbd9157e0bce861f98ecc6f43262a45b81c4ed05b1852f8821d6b46e9",
            createdAt: now,
            updatedAt: now
        }], {});

        await queryInterface.bulkInsert("UserPermissions", [{
            UserUid: UIDS.USER_ROOT, // link cms permission scope
            PermissionUid: UIDS.PERMISSION_CMS,
            createdAt: now,
            updatedAt: now
        }, {
            UserUid: UIDS.USER_ROOT, // link root permission scope
            PermissionUid: UIDS.PERMISSION_ROOT,
            createdAt: now,
            updatedAt: now
        }], {});

    },

    down: async function (queryInterface, SEQUELIZE) {
        // attention, you need to use singular form of the model!!!
        await queryInterface.sequelize.model("UserPermission").destroy({ where: {} });
        await queryInterface.sequelize.model("Permission").destroy({ where: {} });
        await queryInterface.sequelize.model("User").destroy({ where: {} });
    }
};
