import { roles } from "../../DB/Models/user.models.js";


export const endPoints = {
    getProfile:[roles.admin,roles.user],
    updateProfile:[roles.admin,roles.user],
    freezeAccount:[roles.admin,roles.user],
    restoreAccountAdmin:[roles.admin],
    restoreAccountUser:[roles.user],
    hardDelete:[roles.admin],
    updatePassword:[roles.admin,roles.user],
}