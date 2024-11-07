import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import customResponse from "../../constants/customResponse";

const checkToken = async (req: NextRequest) => {
  const token = await getToken({ req });

  if (token === null) {
    return customResponse(
      { success: false, message: "사용자 인증 실패" },
      { status: 401 }
    );
  }
};

export default checkToken;
