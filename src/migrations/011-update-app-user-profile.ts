import { IMigration } from "@aaa-backend-stack/storage";

// tslint:disable-next-line:no-object-literal-type-assertion
module.exports = <IMigration>{
    up: async function (queryInterface, SEQUELIZE) {
        await queryInterface.addColumn("AppUserProfiles", "data", {
            type: SEQUELIZE.JSONB,
            allowNull: true
        });
    },

    down: async function (queryInterface, SEQUELIZE) {
        await queryInterface.dropTable("AppUserProfiles");
    }
};
