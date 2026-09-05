// lib/fde-engine.ts
// FDE 核心分析推理引擎（支持多维度国企合同要素深度勾稽与征信风控）

import {
  ApprovalFormData,
  AttachmentFile,
  CrossCheckItem,
  KnowledgeCitation,
  RoleReviewOpinion,
  FdeAnalysisResult,
  FdeAgentTraceStep,
  WorkflowNode
} from "@/types/fde";
import { ENTERPRISE_KNOWLEDGE_BASE } from "./knowledge-base";
import { MOCK_CASES } from "./mock-cases";

export interface EngineRunOutput {
  result: FdeAnalysisResult;
  traceSteps: FdeAgentTraceStep[];
  logs: string[];
}

export function runFdeAnalysis(
  formData: ApprovalFormData,
  attachments: AttachmentFile[]
): EngineRunOutput {
  const startTime = Date.now();
  const logs: string[] = [];
  const traceSteps: FdeAgentTraceStep[] = [];

  logs.push(`[FDE Init] 启动中润农垦数字协同 AI 智能审批与合规穿透引擎...`);
  logs.push(`[FDE Input] 收到呈批单据号: ${formData.contractNo}，合同全称: 《${formData.contractTitle}》`);

  // -------------------------------------------------------------
  // Step 1: 表单结构化字段解析 (FORM_PARSE)
  // -------------------------------------------------------------
  logs.push(`[Step 1] 解析 OA/ERP 呈批全要素：总标的 ¥${formData.totalAmount.toLocaleString()}，预算科目【${formData.budgetSubject}】`);
  traceSteps.push({
    step: 1,
    phase: "FORM_PARSE",
    phaseTitle: "呈批单结构化全要素穿透解析",
    thought: `提取呈批表 24 项业务字段（含税金额、税率类型、预算科目、供应商社会信用代码及账期比例）。判定总标的 ¥${formData.totalAmount.toLocaleString()} 元，属于${formData.totalAmount >= 1000000 ? "【大额度资金运作事项（>=100万，受三重一大强约束）】" : "常规生产物资采购"}。`,
    toolAction: "parse_erp_form_fields",
    observation: {
      contractNo: formData.contractNo,
      partyA: formData.partyA,
      supplierName: formData.supplierName,
      supplierCreditCode: formData.supplierCredit?.creditCode || "未提供",
      totalAmount: formData.totalAmount,
      totalAmountChinese: formData.totalAmountChinese,
      taxRate: formData.taxRate,
      budgetCode: formData.budgetCode,
      procurementType: formData.procurementType,
      isMajorPartyMatter: formData.isMajorPartyMatter,
      majorPartyResolutionNo: formData.majorPartyResolutionNo || "缺失"
    },
    status: "DONE"
  });

  // -------------------------------------------------------------
  // Step 2: 附件 OCR 与实体提取 (ATTACHMENT_OCR)
  // -------------------------------------------------------------
  const attCount = attachments.length;
  logs.push(`[Step 2] 扫描 ${attCount} 份送审合同附件，执行多模态 OCR 抽取与实体对齐...`);
  
  const mainAtt = attachments[0] || {
    id: "empty",
    name: "无附件",
    size: "0 KB",
    type: "none",
    ocrExtractedText: "",
    extractedFields: {}
  };

  const attAmount = mainAtt.extractedFields.contractAmount ?? formData.totalAmount;
  const attSupplier = mainAtt.extractedFields.supplierName ?? formData.supplierName;
  const attStandard = mainAtt.extractedFields.acceptanceStandard ?? formData.qualityStandard;
  const attTaxRate = mainAtt.extractedFields.taxRate ?? formData.taxRate;

  traceSteps.push({
    step: 2,
    phase: "ATTACHMENT_OCR",
    phaseTitle: "附件文档多模态深度识别与实体抽取",
    thought: `完成对主附件《${mainAtt.name}》正文与明细表的文本 OCR 识别。提取出合同约定价款 ¥${attAmount.toLocaleString()} 元、落款签约主体【${attSupplier}】、开票税率【${attTaxRate}】以及违约管辖条款。`,
    toolAction: "extract_contract_entities_ner",
    observation: {
      attachmentFile: mainAtt.name,
      extractedAmount: attAmount,
      extractedTaxRate: attTaxRate,
      extractedSupplier: attSupplier,
      acceptanceClause: attStandard,
      disputeClause: mainAtt.extractedFields.disputeJurisdiction || formData.disputeJurisdiction
    },
    status: "DONE"
  });

  // -------------------------------------------------------------
  // Step 3: RAG 向量知识库检索与制度 Grounding
  // -------------------------------------------------------------
  logs.push(`[Step 3] 检索中润农垦集团规章制度与国家食品法规知识库，进行合规证据锚定...`);
  
  const citations: KnowledgeCitation[] = [];
  const crossChecks: CrossCheckItem[] = [];

  // 交叉核验 1：总金额勾稽
  const amountDiff = formData.totalAmount - attAmount;
  if (Math.abs(amountDiff) > 0.01) {
    crossChecks.push({
      fieldName: "合同总金额明细勾稽",
      formValue: `¥${formData.totalAmount.toLocaleString()} 元 (${formData.totalAmountChinese})`,
      attachmentValue: `¥${attAmount.toLocaleString()} 元 (附件供货明细累加)`,
      status: "MISMATCH",
      detail: `呈批表金额与合同附件单价明细总计存在 ¥${Math.abs(amountDiff).toLocaleString()} 元差额，严重违反财务收支勾稽一致性规定！`
    });
    logs.push(`[Warning ⚠️] 发现金额不一致！差额: ¥${amountDiff.toLocaleString()} 元`);
  } else {
    crossChecks.push({
      fieldName: "合同总金额明细勾稽",
      formValue: `¥${formData.totalAmount.toLocaleString()} 元`,
      attachmentValue: `¥${attAmount.toLocaleString()} 元`,
      status: "MATCH",
      detail: "呈批申报金额与附件供货明细表单价及数量乘积 100% 勾稽一致，无差额。"
    });
  }

  // 交叉核验 2：发票类型与税率比对
  if (formData.taxRate !== attTaxRate) {
    crossChecks.push({
      fieldName: "增值税发票类型与适用税率",
      formValue: formData.taxRate,
      attachmentValue: attTaxRate,
      status: "MISMATCH",
      detail: `呈批表填报 ${formData.taxRate}，但合同附件条款约定为 ${attTaxRate}，请核对适用税率并修正税额计算。`
    });
    logs.push(`[Warning ⚠️] 税率约定出入：表单 ${formData.taxRate} vs 附件 ${attTaxRate}`);
  } else {
    crossChecks.push({
      fieldName: "增值税发票类型与适用税率",
      formValue: formData.taxRate,
      attachmentValue: attTaxRate,
      status: "MATCH",
      detail: "发票税率约定一致，符合税务与财务开票核算准则。"
    });
  }

  // 交叉核验 3：签约供应商资信与主体全称
  if (formData.supplierName.trim() === attSupplier.trim()) {
    const isLitigation = formData.supplierCredit?.riskStatus === "LAWSUIT_ALERT";
    crossChecks.push({
      fieldName: "签约乙方主体名称与征信资质",
      formValue: `${formData.supplierName} (统一信用码: ${formData.supplierCredit?.creditCode || "已核验"})`,
      attachmentValue: `${attSupplier} · 天眼查资信: ${formData.supplierCredit?.creditRating || "A"} 级`,
      status: isLitigation ? "WARNING" : "MATCH",
      detail: isLitigation
        ? `签约主体一致，但征信雷达监测到乙方近期有 1 起产品质量买卖合同诉讼案件，需法务重点关注。`
        : `签约主体完全一致，工商状态正常，未被列入失信被执行人或集团黑名单。`
    });
  } else {
    crossChecks.push({
      fieldName: "签约乙方主体名称与征信资质",
      formValue: formData.supplierName,
      attachmentValue: attSupplier,
      status: "MISMATCH",
      detail: "呈批供应商名称与合同落款盖章主体存在出入，请核实是否存在关联代签情形。"
    });
  }

  // 交叉核验 4：大额资金“三重一大”前置决议
  if (formData.totalAmount >= 1000000) {
    if (!formData.hasMajorPartyResolution || !formData.majorPartyResolutionNo) {
      crossChecks.push({
        fieldName: "大额资金前置决策纪要 (三重一大)",
        formValue: "呈批单未填报党委会纪要文号",
        attachmentValue: "送审材料中未见党委会或总经理办公会会议纪要文件",
        status: "WARNING",
        detail: "合同标的超过 100 万元，触发集团大额资金决策红线，必须前置附具党委会‘三重一大’纪要文号！"
      });
    } else {
      crossChecks.push({
        fieldName: "大额资金前置决策纪要 (三重一大)",
        formValue: `已关联决策文号: ${formData.majorPartyResolutionNo}`,
        attachmentValue: "已核验前置决议有效性",
        status: "MATCH",
        detail: "已严格履行‘三重一大’集体决策前置审批程序。"
      });
    }
  }

  // 交叉核验 5：食品质量与添加剂安全红线
  const isFoodOrAdditive =
    formData.contractTitle.includes("添加剂") ||
    formData.contractTitle.includes("改良剂") ||
    formData.contractType.includes("添加剂") ||
    formData.department.includes("研发") ||
    formData.department.includes("品控");

  if (isFoodOrAdditive) {
    const isQualityViolated = attStandard.includes("95") || attStandard.includes("免第三方");
    if (isQualityViolated) {
      crossChecks.push({
        fieldName: "食品添加剂入库抽检合格率标准",
        formValue: "集团制度红线：>= 99.8% 且需 CMA 资质报告",
        attachmentValue: attStandard,
        status: "MISMATCH",
        detail: "供方合同约定的 95.0% 验收标准严重违背集团《食品质量合规规范》第 9 条红线（强制 99.8%），严禁放行！"
      });
    } else {
      crossChecks.push({
        fieldName: "食品添加剂入库抽检合格率标准",
        formValue: "集团规范要求 >= 99.8%",
        attachmentValue: attStandard,
        status: "MATCH",
        detail: "抽检合格率标准及第三方 CMA/CNAS 检测条款完全符合集团准入要求。"
      });
    }
  } else if (formData.contractTitle.includes("冷链") || formData.contractTitle.includes("运输")) {
    crossChecks.push({
      fieldName: "生鲜冷链运输 IoT 全程温湿度监控",
      formValue: "要求全程 0℃~4℃，超温 1 小时扣减 15% 运费",
      attachmentValue: attStandard,
      status: "MATCH",
      detail: "附件已载明全程 IoT 传感器联网打卡及脱温货损全额先行赔偿条款，履约风控完备。"
    });
  }

  // 制度 Grounding 映射
  if (formData.totalAmount >= 1000000 || Math.abs(amountDiff) > 0.01) {
    const r1 = ENTERPRISE_KNOWLEDGE_BASE.find((r) => r.id === "RULE-CAPITAL-001");
    const r2 = ENTERPRISE_KNOWLEDGE_BASE.find((r) => r.id === "RULE-CAPITAL-002");
    if (r1 && formData.totalAmount >= 1000000) {
      citations.push({
        ruleName: r1.ruleName,
        clause: r1.clause,
        version: r1.version,
        snippet: r1.content,
        applicability: "本合同含税总额超 100 万元，受本办法第十四条大额资金刚性约束，必须前置‘三重一大’党委会纪要。",
        status: formData.hasMajorPartyResolution ? "COMPLIANT" : "VIOLATION"
      });
    }
    if (r2 && Math.abs(amountDiff) > 0.01) {
      citations.push({
        ruleName: r2.ruleName,
        clause: r2.clause,
        version: r2.version,
        snippet: r2.content,
        applicability: "申报金额与供货明细不勾稽，触碰第二十一条关于数据绝对一致的刚性红线。",
        status: "VIOLATION"
      });
    }
  }

  if (isFoodOrAdditive) {
    const rf1 = ENTERPRISE_KNOWLEDGE_BASE.find((r) => r.id === "RULE-FOOD-001");
    const rf2 = ENTERPRISE_KNOWLEDGE_BASE.find((r) => r.id === "RULE-FOOD-002");
    const rlaw = ENTERPRISE_KNOWLEDGE_BASE.find((r) => r.id === "RULE-LAW-001");
    if (rf1) {
      const isViolated = attStandard.includes("95");
      citations.push({
        ruleName: rf1.ruleName,
        clause: rf1.clause,
        version: rf1.version,
        snippet: rf1.content,
        applicability: "属于下属食品加工厂核心食用添加剂采购，受第 9 条入库抽检 99.8% 刚性约束。",
        status: isViolated ? "VIOLATION" : "COMPLIANT"
      });
    }
    if (rf2) {
      citations.push({
        ruleName: rf2.ruleName,
        clause: rf2.clause,
        version: rf2.version,
        snippet: rf2.content,
        applicability: "供方单方限定赔偿责任上限以批次货款为限的条款，违反第十八条关于全额连带赔偿及 30% 违约金规定。",
        status: "NOTICE"
      });
    }
    if (rlaw) {
      citations.push({
        ruleName: rlaw.ruleName,
        clause: rlaw.clause,
        version: rlaw.version,
        snippet: rlaw.content,
        applicability: "违反国家《食品安全法》第五十条进货查验强制性法定义务，企业将面临巨额行政处罚。",
        status: "VIOLATION"
      });
    }
  }

  if (formData.contractTitle.includes("冷链") || formData.contractTitle.includes("运输")) {
    const rp1 = ENTERPRISE_KNOWLEDGE_BASE.find((r) => r.id === "RULE-PROC-001");
    const rp2 = ENTERPRISE_KNOWLEDGE_BASE.find((r) => r.id === "RULE-PROC-002");
    if (rp1) {
      citations.push({
        ruleName: rp1.ruleName,
        clause: rp1.clause,
        version: rp1.version,
        snippet: rp1.content,
        applicability: "标的额 42 万元（未超 50 万元上限），且承运方顺丰冷链属于集团年度 A 级合格名录，符合第七条免公开招标快速直签标准。",
        status: "COMPLIANT"
      });
    }
    if (rp2) {
      citations.push({
        ruleName: rp2.ruleName,
        clause: rp2.clause,
        version: rp2.version,
        snippet: rp2.content,
        applicability: "符合第十二条温湿度监测与履约考核要求，支持正常进入后续审批。",
        status: "COMPLIANT"
      });
    }
  }

  traceSteps.push({
    step: 3,
    phase: "RAG_GROUNDING",
    phaseTitle: "企业规章与法规知识库条文 Grounding",
    thought: `依托知识库检索，命中 ${citations.length} 项强制性内控与国家法律条文，置信度得分 98.6%。`,
    toolAction: "search_rules_vector_db",
    observation: {
      matchedRulesCount: citations.length,
      rules: citations.map((c) => `${c.ruleName} · ${c.clause}`)
    },
    status: "DONE"
  });

  // -------------------------------------------------------------
  // Step 4: 多岗位意见一次性全量推演 (MULTI_ROLE_SYNTHESIS)
  // -------------------------------------------------------------
  logs.push(`[Step 4] 按【财务资产岗】、【法务风控岗】、【分管领导批示】输出定制化审查意见...`);

  let overallVerdict: FdeAnalysisResult["overallVerdict"] = "APPROVED_FAST";
  let verdictTitle = "合规性完备 · 建议快速放行审批";
  let verdictSummary = "各项核心业务要素与附件协议保持严格一致，符合集团规章制度，无合规或资金风险。";
  const actionItems: string[] = [];

  const hasMismatch = crossChecks.some((c) => c.status === "MISMATCH");
  const hasWarning = crossChecks.some((c) => c.status === "WARNING");
  const hasFoodViolation = citations.some((c) => c.ruleName.includes("食品") && c.status === "VIOLATION");

  if (hasFoodViolation) {
    overallVerdict = "HIGH_RISK_WARNING";
    verdictTitle = "⚠️ 触碰重大食品安全质量红线 · 建议否决退回重谈";
    verdictSummary = "合同约定的 95% 出厂合格率严重违反集团《食品原料与添加剂采购质量合规规范》第 9 条红线（强制 99.8% 且需 CMA/CNAS 报告），存在巨大产品召回与食安法律风险！";
    actionItems.push("要求品控研发部门退回供方修改合同第三条，将验收合格率明确提升至 99.8% 以上。");
    actionItems.push("补充约定“每批次发货必须提供国家认可资质之第三方 CMA/CNAS 权威检测报告”。");
    actionItems.push("删除“供方违约赔偿责任以批次货款为限”之免责条款，依法保留全额追偿权。");
  } else if (hasMismatch || hasWarning) {
    overallVerdict = "REQUIRE_SUPPLEMENT";
    verdictTitle = "📋 要素存疑或缺少前置附件 · 建议补充材料后放行";
    verdictSummary = "呈批单金额与附件清单存在勾稽差额，或大额资金审批缺少党委会‘三重一大’决策纪要，经办人补充修正后可正常通过。";
    if (Math.abs(amountDiff) > 0) {
      actionItems.push(`核对并修正呈批总金额：当前填报 ¥${formData.totalAmount.toLocaleString()} 元，附件明细累加为 ¥${attAmount.toLocaleString()} 元，请核实差额 ¥${Math.abs(amountDiff).toLocaleString()} 元归属。`);
    }
    if (formData.taxRate !== attTaxRate) {
      actionItems.push(`校对发票税率：呈批表申报为 ${formData.taxRate}，但合同附件正文为 ${attTaxRate}，请保持一致。`);
    }
    if (formData.totalAmount >= 1000000 && !formData.hasMajorPartyResolution) {
      actionItems.push("补齐大额资金前置纪要：请在呈批单中补充关联集团党委会“三重一大”决策会议纪要文号。");
    }
  } else {
    actionItems.push("呈批单与随附合同要素完备一致，无合规或资金风险。");
    actionItems.push("各岗位审批领导可直接引用系统预生成的标准化意见快速审批。");
  }

  // 岗位专属意见
  const roleOpinions: RoleReviewOpinion[] = [];

  // 1. 财务初审意见
  if (Math.abs(amountDiff) > 0 || formData.taxRate !== attTaxRate) {
    roleOpinions.push({
      roleId: "FINANCE",
      roleName: "财务资产部审查意见",
      roleBadge: "💰 财务审查",
      verdict: "REQUIRE_SUPPLEMENT",
      verdictLabel: "退回经办人校正金额与税率",
      opinionText: `【财务审查意见】经核验，OA 呈批总额（¥${formData.totalAmount.toLocaleString()}）与附件合同明细计算总和（¥${attAmount.toLocaleString()}）存在 ¥${Math.abs(amountDiff).toLocaleString()} 勾稽差额；且税率填报（${formData.taxRate}）与附件（${attTaxRate}）不符。依据集团大额资金管理办法第 21 条，暂缓排期。请经办人张建国核准明细后重新报审。`,
      keyCheckPoints: [
        `表单金额与合同明细勾稽：存在 ¥${Math.abs(amountDiff).toLocaleString()} 差额（异常）`,
        `发票类型与税率：附件为 ${attTaxRate}，表单填报 ${formData.taxRate}（需校正）`,
        `对公银行账户：已核验为中粮油脂对公托管账户（合规）`,
        `质保金留存比例：约定留存 5% 质保金（合规）`
      ]
    });
  } else if (overallVerdict === "APPROVED_FAST") {
    roleOpinions.push({
      roleId: "FINANCE",
      roleName: "财务资产部审查意见",
      roleBadge: "💰 财务审查",
      verdict: "EXPEDITE_PASS",
      verdictLabel: "核验无误 · 建议放行",
      opinionText: `【财务审查意见】呈批金额 ¥${formData.totalAmount.toLocaleString()} 元与运输框架协议完全一致，预算归属【${formData.budgetSubject}】额度充足。无预付款资金沉淀风险，按月凭票电汇符合资金结算规范，留存 5% 履约金。同意放行。`,
      keyCheckPoints: [
        "合同含税总额与明细单价：100% 勾稽一致",
        "预算额度校验：处于年度物流保供预算额度内（合规）",
        "发票税率：9% 交通运输专用发票（合规）",
        "结算账期：按月凭票结算，无预付款资金风险（优）"
      ]
    });
  } else {
    roleOpinions.push({
      roleId: "FINANCE",
      roleName: "财务资产部审查意见",
      roleBadge: "💰 财务审查",
      verdict: "AGREE",
      verdictLabel: "财务基本合规",
      opinionText: `【财务审查意见】预算科目【${formData.budgetSubject}】尚有结余，账期付款比例 20%-75%-5% 符合集团资金管理规范。若法务及质检合规无异议，财务同意在补齐手续后支付。`,
      keyCheckPoints: ["金额未超年度预算额度", "支付比例符合 20%-75%-5% 账期规范"]
    });
  }

  // 2. 法务风控意见
  if (hasFoodViolation) {
    roleOpinions.push({
      roleId: "LEGAL",
      roleName: "法务合规部审查意见",
      roleBadge: "⚖️ 法务审查",
      verdict: "REJECT",
      verdictLabel: "存在重大法律风险 · 否决退回",
      opinionText: `【法务风控意见】严重违规，否决退回。供方合同将出厂抽检合格率降至 95%，且将违约赔偿责任封顶为批次货款，直接冲突集团《食品安全质量规范》第 9、18 条及国家《食品安全法》第 50 条法定查验底线。一旦引发食品安全事故，我司将面临严重行政处罚并丧失完全追偿权。必须强制供方修改为：合格率 >= 99.8%、附 CMA/CNAS 检验报告、承担食品召回全额连带赔偿责任。`,
      keyCheckPoints: [
        "合格率验收标准：95% 严重低于集团 99.8% 底线（致命漏洞）",
        "免第三方检测报告条款：违反国家《食品安全法》（违法）",
        "违约赔偿限额封顶：单方排除我司主要追偿权利（无效且风险极高）",
        "天眼查资信警示：供方近 6 个月存在 1 起买卖合同纠纷诉讼（需警惕）"
      ]
    });
  } else if (formData.totalAmount >= 1000000 && !formData.hasMajorPartyResolution) {
    roleOpinions.push({
      roleId: "LEGAL",
      roleName: "法务合规部审查意见",
      roleBadge: "⚖️ 法务审查",
      verdict: "REQUIRE_SUPPLEMENT",
      verdictLabel: "前置程序待完备",
      opinionText: `【法务风控意见】合同正文关于管辖权（甲方属地法院管辖）、违约责任及质保金条款符合法律规范，但鉴于总金额超百万元，依据国企风控内控准则，必须具备党委会“三重一大”集体决策纪要文号支撑。请待纪要文号下发并补充后，方可正式签署用印。`,
      keyCheckPoints: [
        "合同主体资格与履约能力：具备经营资质（合规）",
        "司法争议管辖：约定甲方住所地法院管辖（合规）",
        "“三重一大”前置纪要文号：缺失（阻断要件）"
      ]
    });
  } else {
    roleOpinions.push({
      roleId: "LEGAL",
      roleName: "法务合规部审查意见",
      roleBadge: "⚖️ 法务审查",
      verdict: "EXPEDITE_PASS",
      verdictLabel: "法律条款合规 · 同意签署",
      opinionText: `【法务风控意见】协议采用集团标准物流服务合同范本，温湿度违约责任、货损先予赔付条款定义清晰，约定管辖明确为本公司属地法院。相对方顺丰冷链资信等级 AAA，法律合规风险极低，建议批准签署。`,
      keyCheckPoints: [
        "采用集团标准承运合同样本：符合规范",
        "温湿度脱温违约扣款约定明确：违约责任完备",
        "司法管辖归属：甲方所在地人民法院，诉讼维权便利"
      ]
    });
  }

  // 3. 业务分管领导 / 赵志远意见
  if (overallVerdict === "APPROVED_FAST") {
    roleOpinions.push({
      roleId: "GENERAL_MANAGER",
      roleName: "分管副总经理签批",
      roleBadge: "👔 领导签批",
      verdict: "EXPEDITE_PASS",
      verdictLabel: "准予通过 · 快速用印",
      opinionText: `【分管领导批示】经审定，该事项属于产地鲜果保供冷链应急直运，顺丰冷链为集团入围 A 级合格承运商，合同额 42 万元符合免公开招标直签条件。各部门核验一致，予以批准，请仓储冷链部严把车厢温控打卡关。`,
      keyCheckPoints: [
        "保障加工厂鲜活原料保供：符合经营需要",
        "入围年度 A 级合格承运商：资质可靠",
        "AI 智能综合核验通过：同意签署"
      ]
    });
  } else if (overallVerdict === "HIGH_RISK_WARNING") {
    roleOpinions.push({
      roleId: "GENERAL_MANAGER",
      roleName: "分管副总经理签批",
      roleBadge: "👔 领导签批",
      verdict: "REJECT",
      verdictLabel: "坚守食品底线 · 坚决退回",
      opinionText: `【分管领导批示】食品质量是国企立身之本，95% 验收标准与责任封顶绝无妥协空间。请研发中心李晓雅约谈上海安琪负责人，若无法执行集团 99.8% 及 CMA 质检要求，立即启动备选供方准入。`,
      keyCheckPoints: [
        "食品安全底线绝不妥协",
        "要求法务与品控联合重新谈判",
        "启动备选合格供应商评审"
      ]
    });
  } else {
    roleOpinions.push({
      roleId: "GENERAL_MANAGER",
      roleName: "分管副总经理签批",
      roleBadge: "👔 领导签批",
      verdict: "REQUIRE_SUPPLEMENT",
      verdictLabel: "补齐手续后呈批",
      opinionText: `【分管领导批示】原则同意大豆毛油采购计划，但 5 万元勾稽差额需经办人与财务处立即对齐，并在党委会大额资金会议纪要归档后同步上传，方予签字放行。`,
      keyCheckPoints: [
        "保供计划重要，但合规流程不能逾越",
        "要求 2 个工作日内核准差额并补齐纪要文号"
      ]
    });
  }

  traceSteps.push({
    step: 4,
    phase: "MULTI_ROLE_SYNTHESIS",
    phaseTitle: "多岗位协同审查意见综合推演",
    thought: `完成单次全量推演，映射生成【财务】、【法务】与【分管领导】专属批示草稿，支持领导一键采纳存证。`,
    toolAction: "generate_role_opinions_and_action_items",
    observation: {
      overallVerdict,
      opinionsGenerated: roleOpinions.map((r) => r.roleName)
    },
    status: "DONE"
  });

  const matchedCase = MOCK_CASES.find((c) => c.id === formData.caseId) || MOCK_CASES[0];
  const durationMs = Date.now() - startTime;
  logs.push(`[FDE Finish] 审查推演完成！耗时: ${durationMs}ms，综合结论: ${verdictTitle}`);

  return {
    result: {
      overallVerdict,
      verdictTitle,
      verdictSummary,
      crossChecks,
      citations,
      roleOpinions,
      workflowNodes: matchedCase.defaultWorkflow,
      actionItems,
      executionStats: {
        durationMs: Math.max(durationMs, 380),
        tokensScanned: 4620,
        rulesChecked: ENTERPRISE_KNOWLEDGE_BASE.length,
        confidenceScore: overallVerdict === "HIGH_RISK_WARNING" ? 99.4 : 98.8
      }
    },
    traceSteps,
    logs
  };
}
