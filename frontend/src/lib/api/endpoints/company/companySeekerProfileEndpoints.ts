import { ApiResponse } from "@/types/apiResponse";
import { api } from "../../axios";
import { SeekerProfileData } from "../seeker/seekerProfileEndpoints";

export const companySeekerProfileAPI = {
getCompanySeekerById: (userId: string) =>
    api.get<ApiResponse<SeekerProfileData>>(`/seeker/profiles/company/application/${userId}`),
}