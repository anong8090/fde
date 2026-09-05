// app/api/analyze/route.ts
// FDE 审批分析 API 路由

import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({
    service: "FDE 合同合规审查引擎",
    version: "2.4.0",
    status: "UP"
  });
}

