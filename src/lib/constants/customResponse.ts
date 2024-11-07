import apiResponse from "@/lib/types/apiResponse";
import { NextResponse } from "next/server";

const customResponse = (response: apiResponse, option?: ResponseInit) => {
  return NextResponse.json(response, option);
};

export default customResponse;
