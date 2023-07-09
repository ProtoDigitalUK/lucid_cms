"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = __importDefault(require("../models/Config"));
const Collection_1 = __importDefault(require("../models/Collection"));
const Environment_1 = __importDefault(require("../models/Environment"));
const error_handler_1 = require("../../utils/error-handler");
class BrickConfig {
}
_a = BrickConfig;
BrickConfig.getSingle = async (data) => {
    const allBricks = await BrickConfig.getAll({
        include: ["fields"],
    }, {
        collection_key: data.collection_key,
        environment_key: data.environment_key,
    });
    const brick = allBricks.find((b) => b.key === data.brick_key);
    if (!brick) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Brick not found",
            message: "We could not find the brick you are looking for.",
            status: 404,
        });
    }
    return brick;
};
BrickConfig.getAll = async (query, data) => {
    const environment = await Environment_1.default.getSingle(data.environment_key);
    const collection = await Collection_1.default.getSingle({
        collection_key: data.collection_key,
        environment_key: data.environment_key,
        environment: environment,
    });
    const allowedBricks = BrickConfig.getAllAllowedBricks({
        collection: collection,
        environment: environment,
    });
    if (!query.include?.includes("fields")) {
        allowedBricks.bricks.forEach((brick) => {
            delete brick.fields;
        });
    }
    return allowedBricks.bricks;
};
BrickConfig.isBrickAllowed = (data) => {
    let allowed = false;
    const builderInstances = BrickConfig.getBrickConfig();
    const instance = builderInstances.find((b) => b.key === data.key);
    const envAssigned = (data.environment.assigned_bricks || [])?.includes(data.key);
    let builderBrick;
    let fixedBrick;
    if (!data.type) {
        builderBrick = data.collection.bricks?.find((b) => b.key === data.key && b.type === "builder");
        fixedBrick = data.collection.bricks?.find((b) => b.key === data.key && b.type === "fixed");
    }
    else {
        const brickF = data.collection.bricks?.find((b) => b.key === data.key && b.type === data.type);
        if (data.type === "builder")
            builderBrick = brickF;
        if (data.type === "fixed")
            fixedBrick = brickF;
    }
    if (instance && envAssigned && (builderBrick || fixedBrick))
        allowed = true;
    let brick;
    if (instance) {
        brick = BrickConfig.getBrickData(instance, {
            include: ["fields"],
        });
    }
    return {
        allowed: allowed,
        brick: brick,
        collectionBrick: {
            builder: builderBrick,
            fixed: fixedBrick,
        },
    };
};
BrickConfig.getAllAllowedBricks = (data) => {
    const allowedBricks = [];
    const allowedCollectionBricks = [];
    const brickConfigData = BrickConfig.getBrickConfig();
    for (const brick of brickConfigData) {
        const brickAllowed = BrickConfig.isBrickAllowed({
            key: brick.key,
            collection: data.collection,
            environment: data.environment,
        });
        if (brickAllowed.allowed && brickAllowed.brick) {
            allowedBricks.push(brickAllowed.brick);
        }
        if (brickAllowed.allowed && brickAllowed.collectionBrick) {
            if (brickAllowed.collectionBrick.builder)
                allowedCollectionBricks.push(brickAllowed.collectionBrick.builder);
            if (brickAllowed.collectionBrick.fixed)
                allowedCollectionBricks.push(brickAllowed.collectionBrick.fixed);
        }
    }
    return {
        bricks: allowedBricks,
        collectionBricks: allowedCollectionBricks,
    };
};
BrickConfig.getBrickConfig = () => {
    const brickInstances = Config_1.default.bricks;
    if (!brickInstances) {
        return [];
    }
    else {
        return brickInstances;
    }
};
BrickConfig.getBrickData = (instance, query) => {
    const data = {
        key: instance.key,
        title: instance.title,
        preview: instance.config?.preview,
    };
    if (!query)
        return data;
    if (query.include?.includes("fields"))
        data.fields = instance.fieldTree;
    return data;
};
exports.default = BrickConfig;
//# sourceMappingURL=BrickConfig.js.map