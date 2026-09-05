// app/api/analyze/route.ts
// FDE 审批分析 API 路由

import { NextRequest, NextResponse } from "next/server";
import { runFdeAnalysis } from "@/lib/fde-engine";
import { ApprovalFormData, AttachmentFile } from "@/types/fde";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let formData: ApprovalFormData;
    let attachments: AttachmentFile[] = [];

    if (contentType.includes("application/json")) {
      const body = await req.json();
      formData = body.formData;
      attachments = body.attachments || [];
    } else {
      return NextResponse.json(
        { error: "请提供 application/json 格式的审批表单数据" },
        { status: 400 }
      );
    }

    if (!formData || !formData.contractTitle) {
      return NextResponse.json(
        { error: "审批单信息不完整，缺少合同标题或关键字段" },
        { status: 400 }
      );
    }

    // 执行 FDE 核心分析
    const output = runFdeAnalysis(formData, attachments);

    return NextResponse.json({
      success: true,
      data: output.result,
      traceSteps: output.traceSteps,
      logs: output.logs
    });
  } catch (error: any) {
    console.error("[API Error]", error);
    return NextResponse.json(
      { error: error.message || "分析执行异常" },
      { status: 500 }
    );
  }
}
